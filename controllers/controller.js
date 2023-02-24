const { response } = require('../app');
const reviews = require('../db/data/test-data/reviews');
const { fetchCategories, fetchReviews, fetchReviewsID, fetchComments, insertComments, voteChange, fetchUsers } = require('../models/models')


exports.getCategories = (request, response, next)=>{
    fetchCategories()
    .then((categories)=>{
        response.status(200).send({categories});
    })
    .catch((error)=>{
        next(error);
    })
}

exports.getReviews = (request, response, next) => {
    fetchReviews()
    .then((reviews)=>{
        response.status(200).send({reviews});
    })
    .catch((error) =>{
        next(error);
    })
}

exports.getReviewsID = (request, response, next) => {
    const { review_id } = request.params;
    
    fetchReviewsID(review_id)
    .then((reviewsID)=>{
        response.status(200).send({review: reviewsID});
    })
    .catch((error)=>{
        next(error);
    })
}

exports.getComments = (request, response, next) => {
    const { review_id }  = request.params;
    
    fetchComments(review_id) 
    .then((reviewsID)=>{
        response.status(200).send({review: reviewsID});
    })
    .catch((error)=>{
        next(error);
    })
}

exports.postComments = (request, response, next) =>{
    const { review_id } = request.params;
    const comment = request.body;
    
    insertComments(review_id, comment)
    .then((commentInfo)=>{
        response.status(201).send({commentInfo})
    })
    .catch((error)=>{
        next(error);
    })
}

exports.updateVotes = (request, response, next) => {
    
    const { review_id } = request.params;
    const votesInfo = request.body.inc_votes;
    
    voteChange(review_id, votesInfo)
    .then((votesInfo)=>{
        response.status(201).send({votesInfo})
    })
    .catch((error)=>{
        next(error);
    })
}

exports.getUsers = (request, response, next) => {

    fetchUsers()
    .then((users)=>{
        response.status(200).send({users})
    })
    .catch((error)=>{
        next(error);
    })
}