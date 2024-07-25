const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// blogsRouter.get("/", (request, response) => {
//   response.send("<h1>Welcome to phonebook-api</h1>");
// });

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.get("/:id", (request, response) => {
  Blog.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      (error) => next(error);
    });
});

// blogsRouter.delete("/:id", (request, response) => {
//   const id = request.params.id;
//   console.log(`Deleting Blog with ID: ${id}`); // Depuración: Imprimir el ID

//   Blog.findByIdAndDelete(id)
//     .then((Blog) => {
//       if (Blog) {
//         console.log(Blog); // Depuración: Imprimir el documento encontrado
//         response.status(204).end();
//       } else {
//         response.status(404).json({ error: "Blog not found" });
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//       // Diferenciar entre errores de formato de ID y otros errores del servidor
//       if (error.kind === "ObjectId") {
//         response.status(400).json({ error: "malformatted id" });
//       } else {
//         response.status(500).json({ error: "internal server error" });
//       }
//     });
// });

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
