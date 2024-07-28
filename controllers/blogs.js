const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// blogsRouter.get("/", (request, response) => {
//   response.send("<h1>Welcome to phonebook-api</h1>");
// });

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  // Blog.findById(request.params.id)
  //   .then((note) => {
  //     if (note) {
  //       response.json(note);
  //     } else {
  //       response.status(404).end();
  //     }
  //   })
  //   .catch((error) => {
  //     (error) => next(error);
  //   });
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    (error) => next(error);
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

  // Blog.findByIdAndDelete(id)
  //   .then((Blog) => {
  //     if (Blog) {
  //       console.log(Blog); // Depuración: Imprimir el documento encontrado
  //       response.status(204).end();
  //     } else {
  //       response.status(404).json({ error: "Blog not found" });
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     // Diferenciar entre errores de formato de ID y otros errores del servidor
  //     if (error.kind === "ObjectId") {
  //       response.status(400).json({ error: "malformatted id" });
  //     } else {
  //       response.status(500).json({ error: "internal server error" });
  //     }
  //   });
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!blog.title || !blog.url) {
    response.status(400).json({ error: "title or url missing" });
  } else {
    result = blog.save();
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
