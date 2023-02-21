const request = require('supertest');
const app = require('../app');
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data/index')

beforeEach(() => {
    return seed({categoryData, commentData, reviewData, userData});
})

afterAll(() => {
    db.end();
})


describe('app',() => {
    describe('/api/categories', () => {
        test('200: GET responds with an array of category objects with slug and description properties', ()=>{
            return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({body})=>{
    
                const categoriesV1 = body.categories;
                expect(Array.isArray(categoriesV1))
                expect(categoriesV1).toHaveLength(4)
             
                categoriesV1.forEach((category)=>{
                    expect(category).toHaveProperty('slug', expect.any(String));
                    expect(category).toHaveProperty('description', expect.any(String));
                })
                
            })
        })
    })
    describe('/api/reviews', ()=>{
        test('200: responds with a joined array of review objects to comments table', ()=>{
                return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{

                    const reviewsV1 = body.reviews;

                    // console.log(reviewsV1)

                    expect(Array.isArray(reviewsV1));
                    expect(reviewsV1).toHaveLength(13);
                })

        })
        test('200: has correct field types and includes comment count field which joins from comments table. counting the amount of comments per review', ()=>{
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                const reviewsV1 = body.reviews;
                reviewsV1.forEach((category)=>{
                    expect(category).toHaveProperty('owner', expect.any(String));
                    expect(category).toHaveProperty('title', expect.any(String));
                    expect(category).toHaveProperty('review_id', expect.any(Number));
                    expect(category).toHaveProperty('category', expect.any(String));
                    expect(category).toHaveProperty('review_img_url', expect.any(String));
                    expect(category).toHaveProperty('created_at', expect.any(String));
                    expect(category).toHaveProperty('votes', expect.any(Number));
                    expect(category).toHaveProperty('designer', expect.any(String));
                    expect(category).toHaveProperty('comment_count', expect.any(String));
                })
            

            })
        })
        test('200: sorts by date in descending order', ()=>{
            return request(app)
                .get('/api/reviews?sort_by=created_date')
                .expect(200)
                .then(({body})=>{
                const reviewsV1 = body.reviews;
                
                expect(reviewsV1).toBeSortedBy('created_at', {descending: true})
                expect(reviewsV1).toHaveLength(13);
            })
        })
        test('404: responds with path not found if incorrect path ', ()=>{
            return request(app)
                .get('/api/daft_path')
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toEqual('path not found')

            })
        })
    })
    describe('/api/reviews/:review_id', ()=>{
        test('200: responds with a review object with the pathway of review ID', ()=>{
            return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({body})=>{
            const reviewsV1 = body.reviewsID;
            
            expect(typeof reviewsV1).toBe('object')
            reviewsV1.forEach((category)=>{
                expect(category).toHaveProperty('owner', expect.any(String));
                expect(category).toHaveProperty('title', expect.any(String));
                expect(category).toHaveProperty('review_id', expect.any(Number));
                expect(category).toHaveProperty('category', expect.any(String));
                expect(category).toHaveProperty('review_img_url', expect.any(String));
                expect(category).toHaveProperty('created_at', expect.any(String));
                expect(category).toHaveProperty('votes', expect.any(Number));
                expect(category).toHaveProperty('designer', expect.any(String));
                expect(category).toHaveProperty('review_body', expect.any(String));
            })
            }) 
        })
        test('400: responds to invalid review ID', ()=>{
            return request(app)
                .get('/api/reviews/cantbelieveitsnotanumber')
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        test('404: responds to valid but non existent review ID ', ()=>{
            return request(app)
                .get('/api/reviews/101')
                .expect(404)
                .then(({body})=>{
                    console.log(body)
                expect(body.msg).toBe('review_id not found')
            })
        })
    })
})