const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
    const {
        username,
        name,
        password
    } = req.body;

    //validate username and password here
    if(username === '' || username.length < 3){
        return res.status(400).json({ error: 'username must be at least be 3 characters long' });
    }
    const passRegex = /^.{3,}$/; // can modify the regex acc to needs - at least 3 characters long
    if(!passRegex.test(password)){
        return res.status(400).json({ error: 'password must be at least be 3 characters long' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});


usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {
        title: 1,
        url: 1,
        likes: 1
    });

    res.json(users);
});

module.exports = usersRouter;