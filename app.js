const express = require('express');
const app = express();
const { getCategories, getReviews, getReviewsID, getComments } = require('./controllers/controller')
const {error500Statuses, error404Statuses, error400Status, handleCustomErrors} = require('./controllers/error-handling-controller')



app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewsID);
app.get('/api/reviews/:review_id/comments', getComments);

app.use((request, response, next) =>{
    response.status(404).send({msg: 'path not found'})
})
app.use(handleCustomErrors);
app.use(error400Status);
app.use(error404Statuses);
app.use(error500Statuses);

module.exports = app;