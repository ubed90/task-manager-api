// Importing Mongoose Types
import { Types as mongooseTypes } from "mongoose";

// Importing JSONWEBTOKEN
import JWT from "jsonwebtoken";

// IMporting Our Models
import * as fromModels from "../../../src/models";


const userOneId = new mongooseTypes.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'Test Shaikh',
    email: 'test@test.com',
    password: 'Test@1234',
    age: 26,
    tokens: [
        {
            token: JWT.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY as string)
        }
    ]
}

const userTwoId = new mongooseTypes.ObjectId();

const userTwo = {
    _id: userTwoId,
    name: 'Second Test User',
    email: 'test_2@test.com',
    password: 'Test@1234',
    age: 26,
    tokens: [
        {
            token: JWT.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY as string)
        }
    ]
}

const taskOne = {
    _id: new mongooseTypes.ObjectId(),
    description: 'Say no to HIVVVV!!!',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongooseTypes.ObjectId(),
    description: 'Forgive me Allah !!!',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongooseTypes.ObjectId(),
    description: 'Get this relationship shit done !!!',
    completed: false,
    owner: userTwo._id
}

const setupTestDatabase =async () => {
    await fromModels.User.deleteMany();
    await fromModels.Task.deleteMany()

    // Create Users
    await new fromModels.User(userOne).save();
    await new fromModels.User(userTwo).save();

    // Create Tasks
    await new fromModels.Task(taskOne).save();
    await new fromModels.Task(taskTwo).save();
    await new fromModels.Task(taskThree).save();
}


export default { userOne, userTwo, tasks: { taskOne, taskTwo, taskThree } , setupTestDatabase };