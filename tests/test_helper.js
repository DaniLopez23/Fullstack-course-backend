const Blog = require("../models/blog");

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

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

const blogById = async (id) => {
    const blog = await Blog.findById(id);
    return blog.toJSON();
}

module.exports = {
    initialBlogs,
    blogsInDb,
    blogById
};  