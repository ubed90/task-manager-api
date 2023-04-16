import superTest from "supertest";

// IMporting Our Models
import * as fromModels from "../../src/models";


// Importing Mongoose Types
import { Types as mongooseTypes } from "mongoose";

// Importing JSONWEBTOKEN
import JWT from "jsonwebtoken";

// Import Mock Test DB Setup
import mockDBSetup from "../fixtures/db";


import mainApp from "../../src/app";


describe('Testing User Routes -> ', () => {

    beforeEach(mockDBSetup.setupTestDatabase);


    // CREATE Tasks Routes

    it('should create a Task for User',async () => {
        const response = await superTest(mainApp)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send({
                    description: 'Fuck Roshani'
                }).expect(201);

        const task = await fromModels.Task.findById(response.body._id);

        expect(task).not.toBeNull();

        expect(task?.description).toBe(response.body.description);

        expect(task?.completed).toBeFalsy();
    })

    it('Should not create task with invalid description/completed', async () => {
        const response = await superTest(mainApp)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(400);
    })


    // GET Task Routes

    it('should return all tasks for an Authenticated User',async () => {
        const response = await superTest(mainApp)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        expect(response.body.length).toBe(2);
    })

    it('Should fetch user task by id',async () => {
        const response = await superTest(mainApp)
                .get(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        

        expect(response.body.description).toBe('Say no to HIVVVV!!!');
    })

    it('Should not fetch user task by id if unauthenticated',async () => {
        await superTest(mainApp)
                .get(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .send()
                .expect(401);
    })


    it('Should not fetch other users task by id',async () => {
        await superTest(mainApp)
                .get(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .set('Authorization', `Bearer ${mockDBSetup.userTwo.tokens[0].token}`)
                .send()
                .expect(404);
    })


    it('Should fetch only completed tasks',async () => {
        const response = await superTest(mainApp)
                .get(`/api/tasks?completed=true`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        expect(response.body.length).toBe(1);
    })

    it('Should fetch only incomplete tasks',async () => {
        const response = await superTest(mainApp)
                .get(`/api/tasks?completed=false`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        expect(response.body.length).toBe(1);
    })

    it('Should sort tasks by description/completed/createdAt/updatedAt',async () => {
        const response = await superTest(mainApp)
                .get(`/api/tasks?sortBy=desc`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        expect(response.body[1].description).toBe('Say no to HIVVVV!!!');
    })

    it('Should fetch page of tasks',async () => {
        const response = await superTest(mainApp)
                .get(`/api/tasks?limit=3&skip=1`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        expect(response.body[0].description).toBe('Forgive me Allah !!!');
    })




    // UPDATE Task Routes

    it('Should not update task with invalid description/completed',async () => {
        const response = await superTest(mainApp)
                .patch(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send({ description: null, completed: 'NOT COMPATIBLE' })
                .expect(400);
    })


    it('Should not update other users task',async () => {
        const response = await superTest(mainApp)
                .patch(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .set('Authorization', `Bearer ${mockDBSetup.userTwo.tokens[0].token}`)
                .send({ description: 'Kya Bolti hai Public' })
                .expect(404);
    })

    // DELETE Task Routes 

    it('Should delete user task',async () => {
        const response = await superTest(mainApp)
                                .delete(`/api/tasks/${mockDBSetup.tasks.taskTwo._id}`)
                                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                                .send()
                                .expect(200);

        const deletdTask = await fromModels.Task.findById(mockDBSetup.tasks.taskTwo._id);

        expect(deletdTask).toBeNull();
    })


    it('Should not delete task if unauthenticated',async () => {
        const response = await superTest(mainApp)
                                .delete(`/api/tasks/${mockDBSetup.tasks.taskTwo._id}`)
                                .send()
                                .expect(401);

        const deletdTask = await fromModels.Task.findById(mockDBSetup.tasks.taskTwo._id);

        expect(deletdTask).not.toBeNull();
    })

    it('should fail why user-2 is trying to delete task of user-1',async () => {
        const response = await superTest(mainApp)
                .delete(`/api/tasks/${mockDBSetup.tasks.taskOne._id}`)
                .set('Authorization', `Bearer ${mockDBSetup.userTwo.tokens[0].token}`)
                .send()
                .expect(404);

        const task = await fromModels.Task.findById(mockDBSetup.tasks.taskOne._id);

        expect(task?._id).toEqual(mockDBSetup.tasks.taskOne._id);
    })

})