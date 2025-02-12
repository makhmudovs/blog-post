const {
    test,
    after,
    beforeEach,
    describe
} = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const assert = require('assert');
const Users = require('../models/user');

const api = supertest(app);


describe('when there are some users saved initially', () => {
    beforeEach(async () => {
        await Users.deleteMany({});
        await Users.insertMany(helper.initialUsers);
    });

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all users are returned', async () => {
        const response = await api.get('/api/users');

        assert.strictEqual(response.body.length, helper.initialUsers.length);
    });

    test('a specific user is in the returned fro users', async () => {
        const response = await api.get('/api/users');

        const usernames = response.body.map(r => r.username);
        assert(usernames.includes('jon'));
    });

    describe('addition of a user', () => {
        test('succeeds with a valid data', async () => {
            const newUser = {
                username:'test user',
                name:'test',
                password:'test1111'
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const usersAtTheEnd = await helper.usersInDb();
            assert.strictEqual(usersAtTheEnd.length, helper.initialUsers.length + 1);

            const usernames = usersAtTheEnd.map(n => n.username);
            assert(usernames.includes('test user'));
        });


        test('a username that is less than 3 characters is not added', async () => {
            const newUser = {
                username:'te',
                name:'test',
                password:'test1111'
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400);

            const usersAtTheEnd = await helper.usersInDb();
            assert.strictEqual(usersAtTheEnd.length, helper.initialUsers.length);
        });

        test('a password that is less than 3 characters is not added', async () => {
            const newUser = {
                username:'test user',
                name:'test',
                password:'11'
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400);

            const usersAtTheEnd = await helper.usersInDb();
            assert.strictEqual(usersAtTheEnd.length, helper.initialUsers.length);
        });

    });

    // describe('deletion of a blog', () => {
    //     test('succeeds with status code 204 if id is valid', async () => {
    //         const blogsAtStart = await helper.blogsInDb();
    //         const blogToDelete = blogsAtStart[0];

    //         await api
    //             .delete(`/api/blogs/${blogToDelete.id}`)
    //             .expect(204);

    //         const blogsAtEnd = await helper.blogsInDb();

    //         assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    //         const authors = blogsAtEnd.map(n => n.author);
    //         assert(!authors.includes(blogToDelete.author));
    //     });
    // });

    // describe('check the unique identifiers', () => {
    //     test('unique identifier property of the blog posts is named id', async () => {
    //         const resultBlogs = await helper.blogsInDb();

    //         assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], '_id'), false);
    //         assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], 'id'), true);
    //     });
    // });
});


after(async () => {
    await mongoose.connection.close();
});