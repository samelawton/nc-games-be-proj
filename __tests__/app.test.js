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
    
})