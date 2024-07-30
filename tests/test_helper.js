const Blog = require("../models/blog");
const User = require("../models/user");

const initialUsers = [
    {
        username: "daniel",
        name: "Daniel",
        password: "123456",
    },
    {
        username: "pedro",
        name: "Pedro",
        password: "abcdefg"
    }
]

const initialBlogs = [
    {
        title: "My First Travel",
        author: "Daniel",
        url: "https://www.daniel.com",
        likes: 16,
    },
    {
        title: "Life in the City",
        author: "Pedro",
        url: "https://www.pedro.com",
        likes: 8,
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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    blogById,
    usersInDb
};  