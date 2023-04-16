import superTest from "supertest";

// IMporting Our Models
import * as fromModels from "../../src/models";


import mainApp from "../../src/app";


// Import Mock Test DB Setup
import mockDBSetup from "../fixtures/db";


// Inject A User right at the start

describe('Testing User Routes -> ', () => { 

    beforeEach(mockDBSetup.setupTestDatabase);

    // SignUp Route

    it('should signup a new user', async () => { 
        const response = await superTest(mainApp).post('/api/users').send({
            name: 'Ubed Shaikh',
            email: 'shaikhobaid123@gmail.com',
            password: 'Test@1234',
            age: 23
        }).expect(201);


        const user: any = await fromModels.User.findById(response.body.user._id);
        expect(user).not.toBeNull();

        expect(response.body.user.name).toEqual('Ubed Shaikh');


        expect(response.body).toMatchObject({
            user: {
                name: 'Ubed Shaikh',
                email: 'shaikhobaid123@gmail.com'
            },
            token: user.tokens[0].token,
        })


        expect(user.password).not.toBe('Test@1234');
     });

     it('Should not signup user with invalid name/email/password',async () => {
        const response = await superTest(mainApp)
                .post('/api/users')
                .send({
                    name: 'Test User',
                    email: 'shaikhob gmail.com',
                    password: 'Test',
                    age: -1
                }).expect(400);
     })


     // Login Routes


     it('should login an existing user and also matches the new generated token', async () => {
        const response = await superTest(mainApp).post('/api/users/login').send({
            email: mockDBSetup.userOne.email,
            password: mockDBSetup.userOne.password
        }).expect(200);

        const user: any = await fromModels.User.findById(mockDBSetup.userOne._id);

        expect(response.body.token).toEqual(user.tokens[1].token);
     })

     it('should restrict for non-existing user', async () => {
        await superTest(mainApp).post('/api/users/login').send({
            email: mockDBSetup.userOne.email,
            password: 'notMyPassword'
        }).expect(400);
     })


     // Profile Routes


     it('should get profile for loggedIn user',async () => {
        await superTest(mainApp)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);
     })

     it('should not get profile for unauthenticated user',async () => {
        await superTest(mainApp)
                .get('/api/users/profile')
                .send()
                .expect(401);
     })


     // Delete Routes

     it('should be able to delete authenticated user and re-verify in the database',async () => {
        await superTest(mainApp)
                .delete('/api/users/profile')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send()
                .expect(200);

        const user = await fromModels.User.findById(mockDBSetup.userOne._id);

        expect(user).toBeNull();
     })

     it('should be throw server error while trying to delete unauthenticated user',async () => {
        await superTest(mainApp)
                .delete('/api/users/profile')
                .send()
                .expect(401);
     })


     // Profile Picture Routes

     it('should upload an image',async () => {
        await superTest(mainApp)
                .post('/api/users/profile/avatar')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .attach('upload', 'test/fixtures/image.png')
                .expect(200);

        const user = await fromModels.User.findById(mockDBSetup.userOne._id);

        expect(user?.avatar).toEqual(expect.any(Buffer));
     })

     // Update Routes
     it('should update user data successfully',async () => {
        await superTest(mainApp)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send({
                    name: 'Roshani Telgote',
                    age: 18
                }).expect(200);

        const user: any = await fromModels.User.findById(mockDBSetup.userOne._id);

        expect(user.name).toBe('Roshani Telgote');
        expect(user.age).toBe(18);
     })

     it('should not update invalid fields',async () => {
        await superTest(mainApp)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send({
                    location: 'Mumbra'
                }).expect(400);
     })

     it('Should not update user if unauthenticated',async () => {
        await superTest(mainApp)
                .patch('/api/users/profile')
                .send({
                    name: 'Ubed'
                }).expect(401);
     })

     it('Should not update user with invalid name/email/password',async () => {
        await superTest(mainApp)
                .patch('/api/users/profile')
                .set('Authorization', `Bearer ${mockDBSetup.userOne.tokens[0].token}`)
                .send({
                    name: 'Ubed',
                    email: 'jhbjhsb skjfnjkcn.com'
                }).expect(400);
     })
})