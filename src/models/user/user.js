"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const fromMongoose = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT = __importStar(require("jsonwebtoken"));
const task_1 = require("../task/task");
const userSchema = new fromMongoose.Schema({
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
        validate: (value) => {
            if (!validator_1.default.isEmail(value)) {
                throw new fromMongoose.Error(value + " is not a valid Email!.");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: (value) => {
            if (value.includes("password")) {
                throw new fromMongoose.Error("Password is too weak!");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
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
        async findByCredentials(email, password) {
            const user = await this.findOne({ email });
            if (!user) {
                throw new Error('Email not found');
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid Login credentials.');
            }
            return user;
        }
    },
    timestamps: true
});
exports.userSchema = userSchema;
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
});
// Declaring method which will be accessible on a Instance but not on whole Model
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = JWT.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
userSchema.method('toJSON', function () {
    const user = this;
    const publicUserData = user.toObject();
    // My Method
    // const { _id, name, email, age, __v } = userData;
    // const publicUserData: PublicData = { name, email, age, _id, __v }
    delete publicUserData.password;
    delete publicUserData.tokens;
    delete publicUserData.avatar;
    return publicUserData;
});
// Hash the plain Text passwords
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt_1.default.hash(user.password, 8);
    }
    next();
});
// Delete User Tasks when user is removed
userSchema.pre('deleteOne', { document: true }, async function (next) {
    const user = this;
    await task_1.Task.deleteMany({ owner: user._id });
    next();
});
const User = fromMongoose.model("User", userSchema);
exports.User = User;
User.createIndexes();
// const data = new User({
//     name: 'Zaid',
//     email: 'zaid@gmail.com',
//     password: 'zaid@kela',
//     age: 25
// })
// data.save().then(console.log).catch(console.error);
