const reviews = require('../db/data/test-data/reviews');
const { fetchCategories, fetchReviews, fetchReviewsID } = require('../models/models')


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
        response.status(200).send({reviewsID});
    })
    .catch((error)=>{
        console.log(error)
        next(error);
    })
}