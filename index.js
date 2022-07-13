const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kstuc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('vitaradb').collection('usersCollection');


        app.get('/users', async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            try {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                const user = { name: req.body.name, password: hashedPassword, email: req.body.email };
                const doc = user;
                const result = await usersCollection.insertOne(doc);
                res.send(result);
            }
            catch {
                res.status(500).send()
            }

        })

    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})