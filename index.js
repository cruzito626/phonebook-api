const express = require("express");
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
  const { body } = request;
  const person = {
    ...body,
    id: generateId(),
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
