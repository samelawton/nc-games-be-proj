const express = require('express');
const app = express();
const { getCategories, getReviews, getReviewsID, getComments, postComments, updateVotes, getUsers } = require('./controllers/controller')
const {error500Statuses, error404Statuses, error400Status, handleCustomErrors} = require('./controllers/error-handling-controller')
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewsID);
app.get('/api/reviews/:review_id/comments', getComments);
app.get('/api/users', getUsers)
app.post('/api/reviews/:review_id/comments', postComments);
app.patch('/api/reviews/:review_id', updateVotes);

app.use((request, response, next) =>{
    response.status(404).send({msg: 'path not found'})
})
app.use(handleCustomErrors);
app.use(error400Status);
app.use(error404Statuses);
app.use(error500Statuses);

module.exports = app;