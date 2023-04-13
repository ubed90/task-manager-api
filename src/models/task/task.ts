import * as fromMongoose from 'mongoose';
import validator from "validator";


export interface ITask {
    description: string;
    completed: boolean;
    owner: fromMongoose.Schema.Types.ObjectId;
    _id?: string;
    __v?: string;
};

export const taskSchema = new fromMongoose.Schema<ITask>({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: fromMongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });


export const Task = fromMongoose.model<ITask>('Task', taskSchema);


// const myTask = new Task({
//     description: "Learn MongoDB",
//     completed: false
// })

// myTask.save().then(console.log).catch(console.error);