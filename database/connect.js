const dotenv=require('dotenv');

dotenv.config();
const MongoClient=require('mongodb').MongoClient;

let _db;

const initDB= (callback) => {
    if(_db)
        {
            console.log('DB is already initialized ✅');
            return callback(null,_db);
        }
    MongoClient.connect(process.env.DB_URI)
        .then((client)=>
            {
                _db=client;
                callback(null,_db);
            })
        .catch((err)=>
            {
                callback(err);
            });        
};

const getDB= ()=>
    {
        if(!_db)
            {
                throw Error('DB not initialized ❌');
            }
        return _db;    
    };

module.exports={
    initDB,
    getDB
};    