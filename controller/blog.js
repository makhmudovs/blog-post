const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../middleware/middleware');

// get blogposts
blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
        .populate('user', {
            username: 1,
            name: 1
        });
    res.json(blogs);
});


//new blog
blogRouter.post('/',middleware.userExtractor, async (req, res) => {
    const body = req.body;

    const token = req.token;

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized: Token is missing'
        });
    }

    const user = req.user;

    // Check if blog exists
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    const note = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    });

    const savedBlog = await note.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
});

//delete a specific blog when given the id
blogRouter.delete('/:id',middleware.userExtractor, async (req, res) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized: Token is missing'
        });
    }

    const user = req.user;
    const blog = await Blog.findById(req.params.id);

    // Check if blog exists
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    // Check if blog exists
    if (!blog) {
        return res.status(404).json({
            error: 'Blog not found'
        });
    }

    // Check if the user is the owner of the blog
    if (user._id.toString() !== blog.user.toString()) {
        return res.status(403).json({
            error: 'Forbidden: You are not allowed to delete this blog'
        });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(req.params.id);

    // Remove the blog from the user's blogs array
    user.blogs = user.blogs.filter(blog => blog._id.toString() !== req.params.id);
    await user.save();

    // Send success response
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
blogRouter.put('/:id',middleware.userExtractor, async (req, res) => {

    const token = req.token;

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized: Token is missing'
        });
    }

    const user = req.user;
    const blog = await Blog.findById(req.params.id);

    // Check if blog exists
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    // Check if blog exists
    if (!blog) {
        return res.status(404).json({
            error: 'Blog not found'
        });
    }

    // Check if the user is the owner of the blog
    if (user._id.toString() !== blog.user.toString()) {
        return res.status(403).json({
            error: 'Forbidden: You are not allowed to delete this blog'
        });
    }
    console.log('from update blog');
    console.log('user ', user);
    console.log('blog ', blog);

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.json(updatedBlog);
});


module.exports = blogRouter;