const reviews = require('../db/data/test-data/reviews');
const { fetchCategories, fetchReviews, fetchReviewsID, fetchComments, insertComments } = require('../models/models')


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