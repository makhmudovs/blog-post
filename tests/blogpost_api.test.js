const {
    test,
    after,
    beforeEach
} = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const assert = require('assert');
const Blogs = require('../models/blog');

const api = supertest(app);


beforeEach(async () => {
    await Blogs.deleteMany({});

    const blogObjects = helper.initialBlogs.map(blog => new Blogs(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());

    await Promise.all(promiseArray);
});

test('unique identifier property of the blog posts is named id', async () => {
    const resultBlogs = await helper.blogsInDb();

    assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], '_id'), false);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], 'id'), true);
});


test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length + 1);

    const authors = blogsAtTheEnd.map(n => n.author);
    assert(authors.includes('Test Author'));
});

test('a blog without likes is not added', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com'
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length);
});


test('a blog without title is not added', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'http://test.com',
        likes:1
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length);
});

test('a blog without url is not added', async () => {
    const newBlog = {
        author: 'Test Author',
        likes:1
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

    const blogsAtTheEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length);
});


after(async () => {
    await mongoose.connection.close();
});