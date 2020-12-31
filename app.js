const path = require('path');
const express = require('express');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const timestamp = require('./aux-functions/timestamp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

MongoClient.connect(URL, { useUnifiedTopology: true }, (err, mongoClient) => {
    if (err) {
        console.log(`${timestamp}Something went wrong while trying to connect to mongo: ${err}`);
        return;
    }
    console.log(`${timestamp}Connected successfully to mongodb`);
    const db = mongoClient.db('corvo').collection('corvo-chat');

    app.get('/', (req, res) => {
        res.send("<h1>Node.js server</h1>");
    });

    app.get('/test', (req, res) => {
        db.insertOne({
            name: 'pedro',
            number: 33
        });
        console.log(`${timestamp}Inserted document on mongodb`);
        res.send("<h1>Inserted document on mongodb</h1>");
    });

    app.get('/*', (req, res) => {
        res.redirect('/');
    });

    app.listen(PORT, () => {
        console.log(`${timestamp}Listening on port ${PORT}...`);
    });
});