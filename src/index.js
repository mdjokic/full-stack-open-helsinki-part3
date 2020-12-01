const express = require('express');
const app = express();

const PORT_NUMBER = 3001;

const persons = [
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

app.get('/api/persons', (_, res) => {
  res.json(persons);
});

app.get('/', (_, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is up and listening on port: ${PORT_NUMBER}`);
});
