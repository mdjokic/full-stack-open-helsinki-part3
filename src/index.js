const express = require('express');
const morgan = require('morgan');
const app = express();

//--------------------------------------------
// Validation func
//--------------------------------------------

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];


//--------------------------------------------
// Validation func
//--------------------------------------------

const checkBodyContent = (person) => {
  let retMessage = null;
  if (!person.number && !person.name) {
    retMessage = {
      error: `Person's number and name are missing`,
    };
  } else if (!person.number) {
    retMessage = {
      error: `Person's number is missing`,
    };
  } else if (!person.name) {
    retMessage = {
      error: `Person's name is missing`,
    };
  }
  return retMessage;
};

const checkName = (newPerson) => {
  let retMessage = null;
  const person = persons.find((person) => person.name === newPerson.name);
  if (person) {
    retMessage = {
      error: `Person's name must be unique`,
    };
  }
  return retMessage;
};

//--------------------------------------------
// Utility func
//--------------------------------------------

const generateId = () => {
  return Math.round(Math.random() * 10000);
};

//--------------------------------------------
// Entry middlewares logging
//--------------------------------------------

app.use(express.json());

//--------------------------------------------
// Morgan logging
//--------------------------------------------

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
  morgan('tiny', {
    skip: (req, _) => req.method === 'POST',
  })
);
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, _) => req.method !== 'POST',
  })
);

//--------------------------------------------
// Endpoints
//--------------------------------------------

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const retPerson = persons.find((person) => person.id === id);
  if (retPerson) {
    res.json(retPerson);
  } else {
    res.status(404).end();
  }
});

app.get('/api/persons', (_, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;
  const bodyContentError = checkBodyContent(newPerson);
  if (bodyContentError) {
    return res.status(400).json(bodyContentError);
  }

  const nameError = checkName(newPerson);
  if (nameError) {
    return res.status(400).json(nameError);
  }

  newPerson.id = generateId();
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get('/', (_, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (_, res) => {
  const responseHtml = `<div>
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>
    </div>`;
  res.send(responseHtml);
});

const PORT_NUMBER = 3001;

app.listen(PORT_NUMBER, () => {
  console.log(`Server is up and listening on port: ${PORT_NUMBER}`);
});
