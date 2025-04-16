const ObjectId= require('mongodb').ObjectId;

const mongodb=require('../database/connect');

const getUsername=async (req, res) => {
  // #swagger.tags=[Goals]
  try
  {
    const username= req.params.username;
    const result= await mongodb.getDB().db().collection('goals').find({ username: username }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No goals found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the goals", error: error.message });
  }
 
  };  

const getAll= async (req, res) => {
  // #swagger.tags=[Goals]
  try
  {
    const result= await mongodb.getDB().db().collection('goals').find().toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No goals found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the goals", error: error.message });
  }
  
  };
  
const createGoal= async (req,res) => 
  {
    // #swagger.tags=[Goals]
    try
    {
      const goal=
      {
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        targetHours: req.body.targetHours,
        currentProgress: req.body.currentProgress,
        deadline: req.body.deadline,
      }
      //Searching for the username in the users database.
      const user= goal.username;
      const result= await mongodb.getDB().db().collection('users').find({ username: user }).toArray();
      if (result.length === 0) {
        return res.status(404).json({ message: 'No username was found. Please create a new user or use an existing user to create a new goal'});
      }
      //Inserting the goal in the database if a valid username was used
      const response= await mongodb.getDB().db().collection('goals').insertOne(goal);
      if(response.acknowledged > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while adding the goal");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the goal", error: error.message });
    }
    
  }

const updateGoal= async (req,res) =>
  {
    // #swagger.tags=[Goals]
    try
    {
      
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to update a goal.');
      }
      const goalId= new ObjectId(req.params.id);
      
      const goal=
      {
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        targetHours: req.body.targetHours,
        currentProgress: req.body.currentProgress,
        deadline: req.body.deadline,
      }
      //Searching for the username in the users database.
      const user= goal.username;
      const r= await mongodb.getDB().db().collection('users').find({ username: user }).toArray();
      if (r.length === 0) {
        return res.status(404).json({ message: 'No username was found. Please create a new user or use an existing username to update the goal'});
      }
      //If the username is valid, the goal will be updated
      const response= await mongodb.getDB().db().collection('goals').replaceOne({ _id: goalId }, goal);
      if(response.modifiedCount > 0)
        {
         res.status(204).send();
        }
      else
       {
         res.status(500).json(response.error || "Some error occur while updating the goal");
       }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the goal", error: error.message });
    }
    
  }
  
const deleteGoal= async (req,res) =>
  {
    // #swagger.tags=[Goals]
    try
    {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid goal id to delete a goal.');
      }

      const goalId= new ObjectId(req.params.id);
      const response = await mongodb.getDB().db().collection('goals').deleteOne({ _id: goalId });
      if(response.deletedCount > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while deleting the goal");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the goal", error: error.message });
    }
    
  }

module.exports = {
    getUsername,
    getAll,
    createGoal,
    updateGoal,
    deleteGoal
};