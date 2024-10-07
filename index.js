const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.port || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// midleware
app.use(cors()); // use when data pass to client site
app.use(express.json())//use when data recive from client site for format json data

app.get('/', (req, res) => {
  res.send('ok server is ok');
})
// app.get('/add-coffee', (req, res) =>{
//     res.send('paici mama');
// })

// app.post('/add-coffee', (req, res) =>{
//     const result = req.body;
//     console.log(result);
//     res.send(result);

// })

app.listen(port, () => {
  console.log('port running', port);

})

// for mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@express-explore.use1c.mongodb.net/?retryWrites=true&w=majority&appName=express-explore`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collection = client.db('equpai-coffee').collection('coffee-items');


    app.get('/coffee-items', async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee-item/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await collection.findOne(query);
      res.send(result);
    })

    app.post('/add-coffee', async (req, res) => {
      const result = req.body;
      console.log(result);
      const query = await collection.insertOne(result);
      res.send(query);
    })

    app.patch('/update/:id', async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const { name, chef, supplier, teste, category, price } = body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name,
          chef,
          supplier,
          teste,
          category,
          price
        }
      }
      const result = await collection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.delete('/delete/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await collection.deleteOne(query);
      res.send(result);
    })

  } finally {

  }
}
run().catch(console.dir);