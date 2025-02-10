const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// get blogposts
blogRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        next(error);
    }
});

//new blog
blogRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
});

//delete a specific blog when given the id
blogRouter.delete('/:id', async (req, res) => {
    await Blog.findOneAndDelete(req.params.id);
    res.status(204).end();
});

//get a specific blog when given the id
blogRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
        res.json(blog);
    } else {
        res.status(404).end();
    }
});

//update a blog post
blogRouter.put('/:id', async (req, res) => {
    const body = req.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        blogs: body.blogs,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    res.json(updatedBlog);
});


module.exports = blogRouter;