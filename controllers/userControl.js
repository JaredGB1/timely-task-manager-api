const ObjectId= require('mongodb').ObjectId;
const { format }=require('date-fns');

const mongodb=require('../database/connect');

const getSingle=async (req, res) => {
  // #swagger.tags=[Users]
  try
  {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid user id to get a user.' });
    }
    const userId= new ObjectId(req.params.id);
    const result= await mongodb.getDB().db().collection('users').find({ _id: userId }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the user", error: error.message });
  }
 
  };

const getAll= async (req, res) => {
  // #swagger.tags=[Users]
  try
  {
    const result= await mongodb.getDB().db().collection('users').find().toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting the users", error: error.message });
  }
  
  };
  
const createUser= async (req,res) => 
  {
    // #swagger.tags=[Users]
    try
    {
      let now= Date.now()  
      let creationDateNow= format(now, 'yyyy-MM-dd HH:mm:ss');  
      const user=
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        creationDate: creationDateNow,
        timeZone: req.body.timeZone
        
      }
      const response= await mongodb.getDB().db().collection('users').insertOne(user);
      if(response.acknowledged > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while adding the user");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while creating the user", error: error.message });
    }
    
  }

const updateUser= async (req,res) =>
  {
    // #swagger.tags=[Users]
    try
    {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to update a user.');
      }
      const userId= new ObjectId(req.params.id);
      const result= await mongodb.getDB().db().collection('users').find({ _id: userId }).toArray();
      if (result.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      const user=
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        creationDate: result[0].creationDate,
        timeZone: req.body.timeZone
      }
      const response= await mongodb.getDB().db().collection('users').replaceOne({ _id: userId }, user);
      if(response.modifiedCount > 0)
        {
         res.status(204).send();
        }
      else
       {
         res.status(500).json(response.error || "Some error occur while updating the user");
       }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating the user", error: error.message });
    }
    
  }
  
const deleteUser= async (req,res) =>
  {
    // #swagger.tags=[Users]
    try
    {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a contact.');
      }

      const userId= new ObjectId(req.params.id);
      const response = await mongodb.getDB().db().collection('users').deleteOne({ _id: userId });
      if(response.deletedCount > 0)
        {
          res.status(204).send();
        }
      else
        {
          res.status(500).json(response.error || "Some error occur while deleting the user");
        }
    }
    catch (error) 
    {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting the user", error: error.message });
    }
    
  }

module.exports = {
    getSingle,
    getAll,
    createUser,
    updateUser,
    deleteUser
};