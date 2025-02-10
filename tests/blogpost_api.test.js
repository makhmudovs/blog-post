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
const Blogs = require('../models/blog');

const api = supertest(app);

describe('when there are some blogs saved initially', () => {
    beforeEach(async () => {
        await Blogs.deleteMany({});
        await Blogs.insertMany(helper.initialBlogs);
    });

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs');

        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs');

        const titles = response.body.map(r => r.title);
        assert(titles.includes('React patterns'));
    });

    describe('addition of a blog', () => {
        test('succeeds with a valid data', async () => {
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
                likes: 1
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
                likes: 1
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);

            const blogsAtTheEnd = await helper.blogsInDb();
            console.log('blogs at the end', blogsAtTheEnd);
            console.log('initial blogs', helper.initialBlogs);
            assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length);
        });
    });

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart[0];

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb();

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

            const authors = blogsAtEnd.map(n => n.author);
            assert(!authors.includes(blogToDelete.author));
        });
    });

    describe('check the unique identifiers', () => {
        test('unique identifier property of the blog posts is named id', async () => {
            const resultBlogs = await helper.blogsInDb();

            assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], '_id'), false);
            assert.strictEqual(Object.prototype.hasOwnProperty.call(resultBlogs[0], 'id'), true);
        });
    });

    
});


describe('update the likes of a blog', () => {
    test('a blog\'s likes are updated correctly', async () => {
      const newBlog = {
        title: 'New title',
        url: 'new.url.com',
        likes: 44, // New likes value
      };
  
      // Get the initial list of blogs
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0]; // Select the first blog to update
  
      // Update the blog's likes
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200); // Use 200 for successful updates
  
      // Get the updated list of blogs
      const blogsAtTheEnd = await helper.blogsInDb();
  
      // Find the updated blog
      const updatedBlog = blogsAtTheEnd.find((b) => b.id === blogToUpdate.id);
  
      // Verify that the likes were updated correctly
      assert.strictEqual(updatedBlog.likes, 44);
    });
  });














after(async () => {
    await mongoose.connection.close();
});