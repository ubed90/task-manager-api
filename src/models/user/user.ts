import * as fromMongoose from 'mongoose';
import validator from "validator";
import bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";
import { NextFunction } from 'express';
import { ITask, Task } from '../task/task';


interface User {
  name: string;
  email: string;
  password: string;
  age: number;
  avatar: Buffer;
  tokens: string[]
}


interface IUser extends User, fromMongoose.Document{
  tasks: fromMongoose.Types.Array<ITask>;
}


interface PublicData {
  name: string;
  email: string;
  age: number;
  _id?: fromMongoose.ObjectId,
  __v?: number;
}

// To implment custom Dynamic / Instance methods
interface IUserMethods {
  generateAuthToken(): Promise<string>;
  toJSON(): PublicData; 
}


// To implement custom Find Static / Model Methods
interface UserModel extends fromMongoose.Model<IUser, {}, IUserMethods> {
  findByCredentials(email: string, password: string): Promise<fromMongoose.HydratedDocument<IUser, IUserMethods>>;
}




const userSchema = new fromMongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new fromMongoose.Error(value + " is not a valid Email!.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate: (value: string) => {
      if (value.includes("password")) {
        throw new fromMongoose.Error("Password is too weak!");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new fromMongoose.Error("Age cannot be less than zero!");
      }
    },
  },
  avatar: {
    type: Buffer,
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  statics: {
    async findByCredentials(email: string, password: string) {
          const user = await this.findOne({ email });

          if(!user) {
            throw new Error('Email not found');
          }


          const isMatch = await bcrypt.compare(password, user.password);


          if(!isMatch) {
            throw new Error('Invalid Login credentials.')
          }

          return user;
    }
  },
  timestamps: true
});


// Middleware Hooks

// Compare passwords while signing up
// userSchema.statics.findByCredentials = async (email: string, password: string) => {
//   const user = await User.findOne<IUser>({ email });

//   if(!user) {
//     throw new fromMongoose.Error('Email not found');
//   }


//   const isMatch = await bcrypt.compare(password, user.password);


//   if(!isMatch) {
//     throw new fromMongoose.Error('Invalid Login credentials.')
//   }

//   return user;
// }


// Defining relationship between User ans Tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})



// Declaring method which will be accessible on a Instance but not on whole Model
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = JWT.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });


  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token
}

userSchema.method('toJSON', function (): PublicData {
  const user = this;

  const publicUserData = user.toObject();

  // My Method

  // const { _id, name, email, age, __v } = userData;

  // const publicUserData: PublicData = { name, email, age, _id, __v }

  delete publicUserData.password;
  delete publicUserData.tokens;
  delete publicUserData.avatar;

  return publicUserData;
})


// Hash the plain Text passwords
userSchema.pre('save', async function (next: NextFunction) {
  const user = this;

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }


  next();
})


// Delete User Tasks when user is removed
userSchema.pre('deleteOne', { document: true } , async function (next: NextFunction) {
  const user: any = this;
  await Task.deleteMany({ owner: user._id })

  next();
})



const User = fromMongoose.model<IUser, UserModel>("User", userSchema);

User.createIndexes();

export { IUser, IUserMethods, UserModel ,userSchema, User };

// const data = new User({
//     name: 'Zaid',
//     email: 'zaid@gmail.com',
//     password: 'zaid@kela',
//     age: 25
// })

// data.save().then(console.log).catch(console.error);
