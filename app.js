require('dotenv').config();

const express = require("express");
const bodyParser = require('body-parser');
const db = require("./src/models");

<<<<<<< HEAD
const connectToRedis=require('./src/config/redisConnection');
const redisClient =connectToRedis();


=======
>>>>>>> 8e48a21f5a4121f3c20ed3ffe90d3e3354a30831
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.set('view engine', 'ejs');


redisClient.set('myKey', 'myValue', (err, result) => {
    if (err) {
        console.error('Error setting value in Redis:', err);
    } else {
        console.log('Value set in Redis');
    }
});

// Get a value from Redis
redisClient.get('myKey', (err, result) => {
    if (err) {
        console.error('Error getting value from Redis:', err);
    } else {
        console.log('Value from Redis:', result);
    }
});

app.use('/api', userRoutes);


db.sequelize.sync().then((req) => {
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });
});