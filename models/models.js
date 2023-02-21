const db = require('../db/connection')

exports.fetchCategories = () =>{

    return db.query(`SELECT * FROM categories;`).then((result)=>{
        return result.rows
    })
    
}

exports.fetchReviews = () => {
    let queryStr = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT (body) AS comment_count 
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
    `;
    return db.query(queryStr).then((result)=>{
        
        return result.rows;
    })
}