const express = require("express");
const morgan = require("morgan");

const app = express();

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ]
      .join(" ")
      .trim();
  })
);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const generateId = () => {
  const minId =
    persons.length > 0 ? Math.max(...persons.map((n) => n.id)) + 1 : 0;
  const maxId = minId + 3;
  return Math.floor(Math.random() * (maxId - minId) + minId);
};

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  if (
    persons.some(
      ({ name: namePerson }) => name.toLowerCase() === name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const personId = Number(request.params.id);
  const personFound = persons.find(({ id }) => id === personId);

  if (!personFound) return response.status(404).end();

  response.json(personFound);
});

app.delete("/api/persons/:id", (request, response) => {
  const personId = Number(request.params.id);
  persons = persons.filter(({ id }) => id !== personId);

  response.status(204).end();
});

app.get("/api/info", (request, response) => {
  response.end(
    `Phonebook has info for ${persons.length} people\n${new Date()}`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
