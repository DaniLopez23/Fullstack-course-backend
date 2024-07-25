require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(express.static("dist"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const Person = require("./models/person");

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Welcome to phonebook-api</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((note) => {
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  }).catch(error => {
    error => next(error);
  })
});

app.get("/api/info", (request, response) => {
  const date = new Date(); // Define la fecha actual aquí
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${persons
      .map((person) => `<p>${date} ${person.name} ${person.number}</p>`)
      .join("")}`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log(`Deleting person with ID: ${id}`); // Depuración: Imprimir el ID

  Person.findByIdAndDelete(id)
    .then(person => {
      if (person) {
        console.log(person); // Depuración: Imprimir el documento encontrado
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'person not found' });
      }
    })
    .catch(error => {
      console.error(error);
      // Diferenciar entre errores de formato de ID y otros errores del servidor
      if (error.kind === 'ObjectId') {
        response.status(400).json({ error: 'malformatted id' });
      } else {
        response.status(500).json({ error: 'internal server error' });
      }
    });
});



app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((result) => {
    console.log("person saved!");
  });
  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
