const db = require('../db/connection')

exports.fetchCategories = () =>{

    return db.query(`SELECT * FROM categories;`).then((result)=>{
        return result.rows
    })
    
}

exports.fetchReviews = (categoryField, sortByField) => {
    const queryParams = [];
    let queryStr = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT (body) AS comment_count 
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    `;
    if(categoryField !== undefined){
        console.log('hello')
        queryStr += `
        WHERE reviews.category = $1
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;
        `;
        queryParams.push(categoryField);
       
    } 
    else if(sortByField !== undefined){
        queryStr += `GROUP BY reviews.review_id
        ORDER BY reviews.${sortByField} DESC;`;
       
    } 
    else {
        queryStr += `GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;`
    }
    
    return db.query(queryStr, queryParams).then((result)=>{
        return result.rows;
    })
}

exports.fetchReviewsID = (review_id) => {
    
    let queryStr = `
    SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT (comments.body) AS comment_count 
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;

    `;
    return db.query(queryStr, [review_id]).then((result)=>{
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg:'review_id not found'});
        }
        return result.rows;
    })
}

exports.fetchComments = (review_id) =>{
    let queryStr = `
    SELECT comment_id, comments.votes, comments.created_at, author, body, comments.review_id
    FROM comments
    LEFT JOIN reviews
    ON comments.review_id = reviews.review_id 
    WHERE reviews.review_id = $1
    GROUP BY comments.comment_id
    ORDER BY comments.created_at DESC;
    `;
    return db.query(queryStr, [review_id]).then((result)=>{
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg:'review_id not found'});
        }
        return result.rows;
    })
}

exports.insertComments = (reviewID, comment) =>{
    let queryStr = `
    INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    return db.query(queryStr, [comment.username, comment.body, reviewID])
    .then((result)=>{
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg:'review_id not found'});
        }
    
        return result.rows;
    })
}

exports.voteChange = (reviewID, voteInfo) => {
    let queryStr = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `;
    return db.query(queryStr, [voteInfo, reviewID])
    .then((result)=>{
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg:'review_id not found'});
        }
        return result.rows;
    })
}

exports.fetchUsers = () =>{
    let queryStr = `
        SELECT * FROM users;
    `;
    return db.query(queryStr)
    .then((result)=>{
        return result.rows;
    })

}

