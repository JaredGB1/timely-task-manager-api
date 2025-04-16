const request= require('supertest');
const express= require('express');
const {MongoClient} = require('mongodb');
const taskRoutes= require('../routes/tasks');
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
    app.use('/tasks', taskRoutes);
});

afterAll(async () => {
    await connection.close();
    
});

describe('Task Routes', () => {
  
    beforeEach(async () => {
      const user = { username: 'Test1', firstName: 'Test', lastName: 'One', email: 'test@example.com', birthday: '01/01/1990', timeZone: 'MST' };
      const { insertedId } = await db.collection('users').insertOne(user);
    });
  
    afterEach(async () => {
      await db.collection('tasks').deleteMany({});
      await db.collection('users').deleteMany({});
    });

    test('Get All Tasks', async () => {
      await db.collection('tasks').insertOne({
        username: 'Test1',
        title: 'Test Task',
        description: 'Testing...',
        status: 'Active',
        priority: 'Low',
        dueDate: '2025-04-20',
        createdAt: '2025-04-15 12:00:00'
      });
  
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
    
    test('If the Tasks database is empty, Get All Tasks should return an error message', async() => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'No tasks found' });
    });

    

    test('Get Tasks using a valid Username', async() => {
      await db.collection('tasks').insertOne({
        username: 'Test1',
        title: 'Test Task',
        description: 'Testing...',
        status: 'Active',
        priority: 'Low',
        dueDate: '2025-04-20',
        createdAt: '2025-04-15 12:00:00'
        });

      const res = await request(app).get('/tasks/Test1');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);  
    });

    test('Get Task using an invalid username should return an error message', async() => {
      const res= await request(app).get('/tasks/FakeUser');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'No tasks found' });
    });
  });