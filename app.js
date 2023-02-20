const express = require('express');
const app = express();
const { getCategories } = require('./controllers/controller')
const {error500Statuses} = require('./controllers/error-handling-controller')


app.get('/api/categories', getCategories);

app.use(error500Statuses);

module.exports = app;