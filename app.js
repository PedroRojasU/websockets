const path = require('path');
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
require('dotenv').config();

const timestamp = require('./aux-functions/timestamp');
const generateHash = require('./aux-functions/generateHash');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

MongoClient.connect(URL, { useUnifiedTopology: true }, (err, mongoClient) => {
    if (err) {
        console.log(`${timestamp} - Something went wrong while trying to connect to mongo: ${err}`);
        return;
    }
    console.log(`${timestamp} - Connected successfully to mongodb`);
    const chatsDb = mongoClient.db('corvo').collection('corvo-chat');
    const usersDb = mongoClient.db('corvo').collection('users');

    app.get('/', (req, res) => {
        res.send("<h1>Node.js server</h1>");
    });

    app.get('/insert-users', async (req, res) => {
        await usersDb.insertOne({
            userName: 'Rick Beato',
            nickname: 'beato',
            hash: await generateHash('pyotor26'),
            userType: 'admin',
            email: 'beato@beato.com',
            active: true,
            creationDate: (new Date).toLocaleString(),
            contacts: ['beato'],
            convos: [ObjectID("5fef6bf711f24a698f453711")]
        });
        console.log(`${timestamp} - Inserted dummy user on mongodb`);
        res.send("<h1>Inserted document on mongodb</h1>");
    });

    app.get('/insert-chat', async (req, res) => {
        await chatsDb.insertOne({
            user: 'pedro',
            participants: ['pedro', 'beato'],
            isGroup: false,
            creationDate: (new Date).toLocaleString(),
            messages: [
                {
                    author: 'pedro',
                    type: 'text',
                    content: 'Why, hello there! :D',
                    date: (new Date).toLocaleString(),
                    status: 'viewed'
                },
                {
                    author: 'beato',
                    type: 'text',
                    content: 'Hey I\'m Rick',
                    date: (new Date).toLocaleString(),
                    status: 'viewed'
                },
                {
                    author: 'pedro',
                    type: 'text',
                    content: 'Postmodernist music is real music :)',
                    date: (new Date).toLocaleString(),
                    status: 'viewed'
                },
                {
                    author: 'beato',
                    type: 'text',
                    content: 'K, bye',
                    date: (new Date).toLocaleString(),
                    status: 'viewed'
                },
            ],
        });
        console.log(`${timestamp} - Inserted dummy chat on mongodb`);
        res.send("<h1>Inserted dummy chat on mongodb</h1>");
    });

    app.get('/*', (req, res) => {
        res.redirect('/');
    });

    app.listen(PORT, () => {
        console.log(`${timestamp} - Listening on port ${PORT}...`);
    });
});