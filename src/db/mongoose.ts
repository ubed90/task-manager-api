import * as fromMongoose from 'mongoose';

// const connection = fromMongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
//     autoIndex: true,
// })

export async function establishConnection() {
    await fromMongoose.connect(process.env.MONGODB_URL as string, { autoIndex: true });
}