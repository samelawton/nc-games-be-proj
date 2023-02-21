const { fetchCategories, fetchReviews } = require('../models/models')


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