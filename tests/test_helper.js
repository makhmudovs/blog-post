const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [{
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    blogs: 1,
    __v: 0,
},
{
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
    blogs: 2,
    __v: 0,
}
];

const initialUsers = [{
    _id: '67ac68c253a8563e77422cbf',
    username: 'jon',
    name: 'Jon Travolta',
    passwordHash: '$2b$10$MHx0Nk9m1DWDGJo1IzR5Qu.2k1d1qSVd/EoBaJ4argp1Ug6xGGW3.',
    blogs: [],
    __v: '0'
}];


const nonExistingId = async () => {
    const blog = new Blog({
        content: 'willRemoveThisSoon'
    });
    await blog.save();
    await blog.deleteOne();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(blog => blog.toJSON());
};

module.exports = {
    initialBlogs,
    initialUsers,
    nonExistingId,
    blogsInDb,
    usersInDb
};