const request= require('supertest');
const express= require('express');
const {MongoClient} = require('mongodb');
const timeLogRoutes= require('../routes/timeLogs');
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
    app.use('/timeLogs', timeLogRoutes);
});

afterAll(async () => {
    await connection.close();
});

describe('Goal Routes', () => {
    beforeEach(async () => {
        const user = { username: 'Test1', firstName: 'Test', lastName: 'One', email: 'test@example.com', birthday: '01/01/1990', timeZone: 'MST' };
        const { insertedId } = await db.collection('users').insertOne(user);
        const task = {
            username: 'Test1',
            title: 'Test Task',
            description: 'Testing...',
            status: 'Active',
            priority: 'Low',
            dueDate: '2025-04-20',
            createdAt: '2025-04-15 12:00:00' 
        };
        const { Id } = await db.collection('tasks').insertOne(task);
    });

    afterEach(async () => {
      await db.collection('time-logs').deleteMany({});
    });
  
    test('Get All TimeLogs', async () => {
      await db.collection('time-logs').insertOne({
        username: "Test1",
        task: "Test Task",
        duration: "10 Minutes",
        note: "Working on it",
        loggedAt: "2025-04-15 12:00:00"
      });
  
      const res = await request(app).get('/timeLogs');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('If the TimeLog Database is empty, Get All TimeLogs should return an error message', async() => {
       const res = await request(app).get('/timeLogs');
       expect(res.statusCode).toBe(404);
       expect(res.body).toEqual({ message: 'No time logs found' });
    });

    test('Get Time Logs using a valid Username should return a 200 status', async() => {
       await db.collection('time-logs').insertOne({
          username: "Test1",
          task: "Test Task",
          duration: "10 Minutes",
          note: "Working on it",
          loggedAt: "2025-04-15 12:00:00"
        });
    
       const res = await request(app).get('/timeLogs/Test1');
       expect(res.statusCode).toBe(200);
       expect(res.body.length).toBeGreaterThan(0);  
    });

    test('Get Time Logs using an invalid username should return an error message', async() => {
       const res= await request(app).get('/timeLogs/FakeUser');
       expect(res.statusCode).toBe(404);
       expect(res.body).toEqual({ message: 'No time logs found' });
    });

    test('Get Specific Time Logs using a valid Username and a valid Task should work', async() => {
        await db.collection('time-logs').insertOne({
            username: "Test1",
            task: "Test Task",
            duration: "10 Minutes",
            note: "Working on it",
            loggedAt: "2025-04-15 12:00:00"
          });
      
         const res = await request(app).get('/timeLogs/Test1/Test Task');
         expect(res.statusCode).toBe(200);
         expect(res.body.length).toBeGreaterThan(0); 
    });

    test('Get Specific Time Logs using a valid Username and an invalid Task should return an error', async() =>{
        await db.collection('time-logs').insertOne({
            username: "Test1",
            task: "Test Task",
            duration: "10 Minutes",
            note: "Working on it",
            loggedAt: "2025-04-15 12:00:00"
          });
      
         const res = await request(app).get('/timeLogs/Test1/InvalidTask');
         expect(res.statusCode).toBe(404);
         expect(res.body).toEqual({ message: 'No time logs found' });
    });

    test('Get Specific Time Logs using an invalid Username and a valid Task should return an error', async() =>{
        await db.collection('time-logs').insertOne({
            username: "Test1",
            task: "Test Task",
            duration: "10 Minutes",
            note: "Working on it",
            loggedAt: "2025-04-15 12:00:00"
          });
      
         const res = await request(app).get('/timeLogs/Test8/Test Task');
         expect(res.statusCode).toBe(404);
         expect(res.body).toEqual({ message: 'No time logs found' });
    });
    
    test('Get Specific Time Logs using an invalid Username and an invalid Task should return an error', async() =>{

         const res = await request(app).get('/timeLogs/InvalidUsername/InvalidTask');
         expect(res.statusCode).toBe(404);
         expect(res.body).toEqual({ message: 'No time logs found' });
    });
  });