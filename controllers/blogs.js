const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  console.log(`Deleting Blog with ID: ${id}`); // Depuración: Imprimir el ID
  blog = await Blog.findByIdAndDelete(id);

  if (blog) {
    console.log(Blog); // Depuración: Imprimir el documento encontrado
    response.status(204).end();
  } else {
    response.status(404).json({ error: "Blog not found" });
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body; 

  const user = await User.findById(body.userId);

  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    }
  );

  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!blog.title || !blog.url) {
    response.status(400).json({ error: "title or url missing" });
  } else {
    result = blog.save();
    user.blogs = user.blogs.concat(result.id);
    response.status(201).json(result);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = request.body;

  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: id,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
