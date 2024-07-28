const blog = require("../models/blog");

const initialBlogs = [
    {
        title: "My First Travel",
        author: "Daniel",
        url: "https://www.daniel.com",
        likes: 16
    },
    {
        title: "Life in the City",
        author: "Pedro",
        url: "https://www.pedro.com",
        likes: 8
    },
];    

module.exports = {
    initialBlogs
};