const ObjectId= require('mongodb').ObjectId;
const { format }=require('date-fns');

const mongodb=require('../database/connect');

const getSingleUsername=async (req, res) => {
  // #swagger.tags=[Tasks]
  try
  {
    const username= req.params.username;
    const result= await mongodb.getDB().db().collection('tasks').find({ username: username }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the tasks", error: error.message });
  }
 
  };  

const getAll= async (req, res) => {
  // #swagger.tags=[Tasks]
  try
  {
    const result= await mongodb.getDB().db().collection('tasks').find().toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the tasks", error: error.message });
  }
  
  };
  
const createTask= async (req,res) => 
  {
    // #swagger.tags=[Tasks]
    try
    {
      //Creating a date object and applying format to insert it into the database
      let now= Date.now()  
      let creationDateNow= format(now, 'yyyy-MM-dd HH:mm:ss');
      
      
      const task=
      {
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        createdAt: creationDateNow
      }
      //Searching for the username in the users database.
      const user= task.username;
      const result= await mongodb.getDB().db().collection('users').find({ username: user }).toArray();
      if (result.length === 0) {
        return res.status(404).json({ message: 'No username was found. Please create a new user or use an existing username to create a new task'});
      }
      //Inserting the task in the database if a valid username was used
      const response= await mongodb.getDB().db().collection('tasks').insertOne(task);
      if(response.acknowledged > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while adding the task");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the task", error: error.message });
    }
    
  }

const updateTask= async (req,res) =>
  {
    // #swagger.tags=[Tasks]
    try
    {
      
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to update a task.');
      }
      const taskId= new ObjectId(req.params.id);
      // Searching for the task to get the creation date
      const result= await mongodb.getDB().db().collection('tasks').find({ _id: taskId }).toArray();
      if (result.length === 0) {
          return res.status(404).json({ message: 'No task found' });
      }
      
      const task=
      {
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        createdAt: result[0].createdAt
      }
      //Searching for the username in the users database.
      const user= task.username;
      const r= await mongodb.getDB().db().collection('users').find({ username: user }).toArray();
      if (r.length === 0) {
        return res.status(404).json({ message: 'No username was found. Please create a new user or use an existing username to update the task'});
      }
      //If the username is valid, the task will be updated
      const response= await mongodb.getDB().db().collection('tasks').replaceOne({ _id: taskId }, task);
      if(response.modifiedCount > 0)
        {
         res.status(204).send();
        }
      else
       {
         res.status(500).json(response.error || "Some error occur while updating the task");
       }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the task", error: error.message });
    }
    
  }
  
const deleteTask= async (req,res) =>
  {
    // #swagger.tags=[Tasks]
    try
    {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid task id to delete a task.');
      }

      const taskId= new ObjectId(req.params.id);
      const response = await mongodb.getDB().db().collection('tasks').deleteOne({ _id: taskId });
      if(response.deletedCount > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while deleting the task");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the task", error: error.message });
    }
    
  }

module.exports = {
    getSingleUsername,
    getAll,
    createTask,
    updateTask,
    deleteTask
};