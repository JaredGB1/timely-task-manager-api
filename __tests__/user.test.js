const request= require('supertest');
const express= require('express');
const {MongoClient} = require('mongodb');
const userRoutes= require('../routes/users');
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
    app.use('/users', userRoutes);
});

afterAll(async () => {
    await connection.close();
});

describe('User Routes', () => {
    let userId;

    afterEach(async () => {
      await db.collection('users').deleteMany({});
    });
  
    test('Get All Users', async () => {
      await db.collection('users').insertOne({
        username: "Test1",
        firstName: "Test",
        lastName: "One",
        email: "test@email.com",
        birthday: "4/16/2025",
        creationDate: "4/16/2025 12:00:00",
        timeZone: "EST"
      });
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);

    });

    test('If the Users Database is empty, Get All Users should return an error message', async() => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'No users found' });
    });


    test('Get User by ID', async() => {
        
        const user = { username: 'Test', firstName: 'Test', lastName: '0', email: 'test@example.com', birthday: '01/01/1990', creationDate: "4/16/2025 12:00:00", timeZone: 'MST' };
        const { insertedId } = await db.collection('users').insertOne(user);
        userId = insertedId;
        const res = await request(app).get(`/users/${userId.toString()}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: userId.toString(),
              username: 'Test',
              firstName: 'Test',
              lastName: '0',
              email: 'test@example.com',
              birthday: '01/01/1990',
              creationDate: "4/16/2025 12:00:00",
              timeZone: 'MST'
            })
          ])
        );
    });

    test('Using a non-existing ID should return an error message', async()=> {
        const fakeId="67ff3d2220aba758bab0ec99";
        const res = await request(app).get(`/users/${fakeId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'No users found' });
    });

    test('Using an Invalid ID should return an error message', async() => {
        const invalidId = "123";
        const res = await request(app).get(`/users/${invalidId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: 'Must use a valid user id to get a user.' });
    });
  });