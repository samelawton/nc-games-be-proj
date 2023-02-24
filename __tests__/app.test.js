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
    describe('GET- /api/categories', () => {
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
    describe('GET- /api/reviews', ()=>{
        test('200: responds with a joined array of review objects to comments table', ()=>{
                return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{

                    const reviewsV1 = body.reviews;

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
    describe('GET- /api/reviews/:review_id', ()=>{
        test('200: responds with a review object with the pathway of review ID', ()=>{
            return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({body})=>{
              
            const reviewsV1 = body.review[0];
           
            expect(typeof reviewsV1).toBe('object')
            expect(reviewsV1).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id : expect.any(Number),
                category : expect.any(String),
                review_img_url : expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                review_body: expect.any(String)
            });
            
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
                expect(body.msg).toBe('review_id not found')
            })
        })
    })
    describe('GET- /api/reviews/:review_id/comments', ()=>{
        test('200: Responds with an array of comments for the given review_id', ()=>{
            return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({body})=>{
                const reviewsV1  = body.review;
                expect(Array.isArray(reviewsV1));
                reviewsV1.forEach((category)=>{
                    expect(category).toHaveProperty('comment_id', expect.any(Number));
                    expect(category).toHaveProperty('votes', expect.any(Number));
                    expect(category).toHaveProperty('created_at', expect.any(String));
                    expect(category).toHaveProperty('author', expect.any(String));
                    expect(category).toHaveProperty('body', expect.any(String));
                    expect(category).toHaveProperty('review_id', expect.any(Number));
                })
            })
        })
        test('200: Array is ordered by most recent comment first', ()=>{
            return request(app)
            .get('/api/reviews/2/comments?sort_by=created_at')
            .expect(200)
            .then(({body})=>{
                const reviewsV1  = body.review;
                
                expect(reviewsV1).toBeSortedBy('created_at', {descending: true})
                expect(reviewsV1).toHaveLength(3);
            })
        })
        test('400: responds to invalid review ID', ()=>{
            return request(app)
                .get('/api/reviews/thisisntanumber/comments')
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        test('404: responds to valid but non existent review ID ', ()=>{
            return request(app)
                .get('/api/reviews/102/comments')
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toBe('review_id not found')
            })
        })
        
    })
    describe('POST- /api/reviews/:review_id/comments', ()=>{
        test('201: accepts an object with properties username and body, also responds with the posted comment', ()=>{
            const newComment = {
                username: 'dav3rid',
                body: 'this game made my feet hurt and caused a family argument'
            };
            return request(app)
            .post('/api/reviews/3/comments')
            .send(newComment)
            .expect(201)
            .then(({body})=>{
                const comment = body.commentInfo;
        
                expect(comment).toHaveLength(1);
                expect(comment[0]).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author : expect.any(String),
                    review_id : expect.any(Number),
                    created_at : expect.any(String)
                })
                expect(comment[0].body).toBe('this game made my feet hurt and caused a family argument');
                expect(comment[0].author).toBe('dav3rid');
            })
        })
        test('400: responds to invalid review ID', ()=>{
            const newComment = {
                username: 'dav3rid',
                body: 'this game made my feet hurt and caused a family argument'
            };
            return request(app)
                .post('/api/reviews/idontlikeantanddec/comments')
                .send(newComment)
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        test('404: responds to valid but non existent review ID ', ()=>{
            const newComment = {
                username: 'dav3rid',
                body: 'this game made my feet hurt and caused a family argument'
            };
            return request(app)
                .post('/api/reviews/103/comments')
                .send(newComment)
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
        test('404: responds to a non existent username ', ()=>{
            const newComment = {
                username: 'leroy_jenkins',
                body: 'LEROYYYYYYYYY JEEEEEEENKIIIIINS'
            };
            return request(app)
                .post('/api/reviews/3/comments')
                .send(newComment)
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toBe('not found')
            })
        })
        test('400: responds to a missing required field ', ()=>{
            const newComment = {
                username: 'no_comment'
            };
            return request(app)
                .post('/api/reviews/3/comments')
                .send(newComment)
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
    
    })

    describe('PATCH- /api/reviews/:review_id', ()=>{
        test('201: responds with updated number of votes', ()=>{
            const voteUpdate = {
                inc_votes: 7
            };
            return request(app)
                .patch('/api/reviews/1')
                .send(voteUpdate)
                .expect(201)
                .then(({body})=>{
                    const voteInfo = body.votesInfo[0]
                    const voteNum = body.votesInfo[0].votes;
                    expect(voteNum).toEqual(8);
                    expect(voteInfo).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer : expect.any(String),
                        owner : expect.any(String),
                        review_body : expect.any(String),
                        review_img_url : expect.any(String),
                        created_at : expect.any(String),
                        votes : expect.any(Number)
                })
                })
        })
        test('400: responds to invalid review ID', ()=>{
            const voteUpdate = {
                inc_votes: 7
            };
            return request(app)
                .patch('/api/reviews/qwerty')
                .send(voteUpdate)
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
        test('404: responds to valid but non existent review ID ', ()=>{
            const voteUpdate = {
                inc_votes: 7
            };
            return request(app)
                .patch('/api/reviews/105')
                .send(voteUpdate)
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toBe('review_id not found')
            })
        })
        test('400: responds to incorrect body type being requested', ()=>{
            const voteUpdate = {
                inc_votes: 'Not a num'
            };
            return request(app)
                .patch('/api/reviews/1')
                .send(voteUpdate)
                .expect(400)
                .then(({body})=>{
                expect(body.msg).toBe('bad request')
            })
        })
    })
    describe('GET: /api/users', ()=>{
        test('200: responds with an array of objects about the user', ()=>{
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({body})=>{
                 const users = body.users;
                 
                 expect(Array.isArray(users));
                 expect(users).toHaveLength(4)
                 users.forEach((category)=>{
                    expect(category).toHaveProperty('username', expect.any(String));
                    expect(category).toHaveProperty('name', expect.any(String));
                    expect(category).toHaveProperty('avatar_url', expect.any(String));
                })
                })
        })
        test('404: responds with path not found if incorrect path ', ()=>{
            return request(app)
                .get('/api/noooooooo_path')
                .expect(404)
                .then(({body})=>{
                expect(body.msg).toEqual('path not found')

            })
        })
    })
})