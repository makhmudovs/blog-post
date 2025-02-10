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


module.exports = blogRouter;