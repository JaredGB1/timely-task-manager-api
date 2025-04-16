const ObjectId= require('mongodb').ObjectId;
const { format }=require('date-fns');

const mongodb=require('../database/connect');

const getUsername=async (req, res) => {
  // #swagger.tags=[TimeLog]
  try
  {
    const username= req.params.username;
    const result= await mongodb.getDB().db().collection('time-logs').find({ username: username }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No time logs found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the time logs", error: error.message });
  }
 
  };

const getSpecificTimelogs= async (req, res) =>{
  // #swagger.tags=[TimeLog]
  try
  {
    const { username, task } = req.params;
    const result= await mongodb.getDB().db().collection('time-logs').find({ username: username, task: task }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No time logs found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the time logs", error: error.message });
  }
  };

const getAll= async (req, res) => {
  // #swagger.tags=[TimeLog]
  try
  {
    const result= await mongodb.getDB().db().collection('time-logs').find().toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No time logs found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the time logs", error: error.message });
  }
  
  };
  
const createTimeLog= async (req,res) => 
  {
    // #swagger.tags=[TimeLog]
    try
    {
      //Creating a date object and applying format to insert it into the database
      let now= Date.now()  
      let creationDateNow= format(now, 'yyyy-MM-dd HH:mm:ss');
      
      const timeLog=
      {
        username: req.body.username,
        task: req.body.task,
        duration: req.body.duration,
        note: req.body.note,
        loggedAt: creationDateNow
      }
      //Searching for the task in the tasks database.
      const user= timeLog.username;
      const taskTitle= timeLog.task;
      const result= await mongodb.getDB().db().collection('tasks').find({ username: user, title: taskTitle }).toArray();
      if (result.length === 0) {
        return res.status(404).json({ message: 'The task was not found for this username. Please enter an existing task of the user to create a Time Log'});
      }
      //Inserting the time log in the database if a valid username and task was used
      const response= await mongodb.getDB().db().collection('time-logs').insertOne(timeLog);
      if(response.acknowledged > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while adding the time log");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the time log", error: error.message });
    }
    
  }

const updateTimeLog= async (req,res) =>
  {
    // #swagger.tags=[TimeLog]
    try
    {
      //Creating a date object and applying format to update the loggedAt field in the database
      let now= Date.now()  
      let creationDateNow= format(now, 'yyyy-MM-dd HH:mm:ss');
      
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to update a task.');
      }
      const timeLogId= new ObjectId(req.params.id);
      // Checking if the time log exist
      const result= await mongodb.getDB().db().collection('time-logs').find({ _id: timeLogId }).toArray();
      if (result.length === 0) {
          return res.status(404).json({ message: 'No time logs found' });
      }
      
      const timeLog=
      {
        username: req.body.username,
        task: req.body.task,
        duration: req.body.duration,
        note: req.body.note,
        loggedAt: creationDateNow
      }

      //Searching for the task in the tasks database.
      const user= timeLog.username;
      const taskTitle= timeLog.task;
      const r= await mongodb.getDB().db().collection('tasks').find({ username: user, title: taskTitle }).toArray();
      if (r.length === 0) {
        return res.status(404).json({ message: 'The task was not found for this username. Please enter an existing task of the user to create a Time Log'});
      }
      //If the task is valid, the time log will be updated
      const response= await mongodb.getDB().db().collection('time-logs').replaceOne({ _id: timeLogId }, task);
      if(response.modifiedCount > 0)
        {
         res.status(204).send();
        }
      else
       {
         res.status(500).json(response.error || "Some error occur while updating the time log");
       }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the time log", error: error.message });
    }
    
  }
  
const deleteTimeLog= async (req,res) =>
  {
    // #swagger.tags=[TimeLog]
    try
    {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid timeLogId to delete a time log.');
      }

      const timeLogId= new ObjectId(req.params.id);
      const response = await mongodb.getDB().db().collection('time-logs').deleteOne({ _id: timeLogId });
      if(response.deletedCount > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while deleting the time log");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the time log", error: error.message });
    }
    
  }

module.exports = {
    getUsername,
    getAll,
    getSpecificTimelogs,
    createTimeLog,
    updateTimeLog,
    deleteTimeLog
};