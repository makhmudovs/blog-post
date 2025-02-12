const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
blogRouter.post('/', async (req, res) => {
    const body = req.body;

    const token = req.token;

    if(!token){
        return res.status(401).json({ error: 'Unauthorized: Token is missing' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);

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
blogRouter.delete('/:id', async (req, res) => {
    const token = req.token;

    if(!token){
        return res.status(401).json({ error: 'Unauthorized: Token is missing' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' });
    }


    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(req.params.id);

    console.log('user ',user);
    console.log('blog ',blog);
    if(user._id.toString() === blog.user.toString()){
        await Blog.findOneAndDelete(req.params.id);
        user.blogs = user.blogs.filter(blog => blog._id !== req.params.id);
        await user.save();
        res.status(204).end();
    }else{
        return res.status(401).json({ error: 'not allowed to delete this blog' });
    }
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

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
        new: true
    });
    res.json(updatedBlog);
});


module.exports = blogRouter;