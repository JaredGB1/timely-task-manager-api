const request= require('supertest');
const express= require('express');
const {MongoClient} = require('mongodb');
const goalRoutes= require('../routes/goals');
const mongodb= require('../database/connect');

let app;
let connection;
let db;

beforeAll(async() => {
    connection= await MongoClient.connect(global.__MONGO_URI__);
    db = await connection.db();
    mongodb.getDB = () => ({db: () => db});
    app = express();
    app.use(express.json());
    app.use('/goals', goalRoutes);
});

afterAll(async () => {
    await connection.close();
});

describe('Goal Routes', () => {
    beforeEach(async () => {
        const user = { username: 'Test1', firstName: 'Test', lastName: 'One', email: 'test@example.com', birthday: '01/01/1990', timeZone: 'MST' };
        const { insertedId } = await db.collection('users').insertOne(user);
    });

    afterEach(async () => {
      await db.collection('goals').deleteMany({});
    });
  
    test('Get All Goals', async () => {
      await db.collection('goals').insertOne({
        username: "Test1",
        title: "Learning Express",
        description: "Learn express in 150 hours",
        targetHours: 150,
        currentProgress: "10%",
        deadline: "6/16/2025",
      });
  
      const res = await request(app).get('/goals');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('If the Goals Database is empty, Get All Goals should return an error message', async() => {
       const res = await request(app).get('/goals');
       expect(res.statusCode).toBe(404);
       expect(res.body).toEqual({ message: 'No goals found' });
    });

    test('Get Goals using a valid Username', async() => {
       await db.collection('goals').insertOne({
          username: "Test1",
          title: "Learning Express",
          description: "Learn express in 150 hours",
          targetHours: 150,
          currentProgress: "10%",
          deadline: "6/16/2025",
        });
    
       const res = await request(app).get('/goals/Test1');
       expect(res.statusCode).toBe(200);
       expect(res.body.length).toBeGreaterThan(0);  
    });
    
    test('Get Goals using an invalid username should return an error message', async() => {
       const res= await request(app).get('/goals/FakeUser');
       expect(res.statusCode).toBe(404);
       expect(res.body).toEqual({ message: 'No goals found' });
    });
  });