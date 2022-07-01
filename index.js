const express = require('express');
const cors = require('cors');

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dq5st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
// console.log(uri);

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todo').collection('todos');

        app.get('/todos', async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const todo = await cursor.toArray();
            res.send(todo);
        });

        
        app.post('/add', async (req, res) => {
            const todo = await todoCollection.insertOne(req.body);
            res.send(todo);
        });

        app.delete('/delete-todo/:id', async (req, res) => {
            const result = await todoCollection.deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.json(result)
        })


            app.put('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body.title;
            const filter = {
                _id: ObjectId(id)
            }
            const updateDoc = {
                $set: {
                    title: body
                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc)
            res.json(result)
        })



        // update orders status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id
            const result = await ordersCollection.updateOne({
                _id: ObjectId(id)
            }, {
                $set: {
                    status: 'Approved',
                }
            })
            res.json(result);
        })
    
    } finally {


    }
}

run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Running todo server');
});

app.listen(port, () => {
    console.log('listing to port', port);
});