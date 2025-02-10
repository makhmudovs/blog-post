const _ = require('lodash');

const dummy = () => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : _.sumBy(blogs, 'likes');
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    return _.reduce(blogs, (a, b) => (a.likes > b.likes ? a : b));
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    return _.reduce(
        blogs,
        (a, b) =>
            a.blogs > b.blogs
                ? { author: a.author, blogs: a.blogs }
                : { author: b.author, blogs: b.blogs },
        {}
    );
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    return _.reduce(
        blogs,
        (a, b) =>
            a.likes > b.likes
                ? { author: a.author, likes: a.likes }
                : { author: b.author, likes: b.likes },
        {}
    );
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
