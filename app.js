const express = require('express');
const app = express();
const { getCategories, getReviews } = require('./controllers/controller')
const {error500Statuses, error404Statuses} = require('./controllers/error-handling-controller')



app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);

app.use((request, response, next) =>{
    response.status(404).send({msg: 'path not found'})
})
app.use(error404Statuses);
app.use(error500Statuses);

module.exports = app;