const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'User already exists!'
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: 'User successfully registered. Now you can login'
  });
});

public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book);
});

public_users.get('/author/:author', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() ===
        req.params.author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  return res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() ===
        req.params.title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  });

  return res.status(200).json(result);
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews);
});

// Task 11: Axios with async/await

async function getAllBooks() {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
}

async function getBookByISBN(isbn) {
  const response = await axios.get(
    `http://localhost:5000/isbn/${isbn}`
  );
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(
    `http://localhost:5000/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(
    `http://localhost:5000/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;