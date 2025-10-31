const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gkaujxr.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

app.get("/", (req, res) => {
    res.send("Simple CRUD Server is running");
});

async function run() {
    try {
        await client.connect();

        const usersDB = client.db("usersDB");
        const usersCollection = usersDB.collection("users");

        // add database related api's here
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });
        
        app.post("/users", async (req, res) => {
            const data = req.body;
            const result = await usersCollection.insertOne(data);
            res.send(result);
        });

        app.patch("/users/:id", async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const options = {};
            const result = await usersCollection.updateOne(query, update, options);
            res.send(result);
        });

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        //
    }
}

run().catch(console.dir);

app.listen(port, (req, res) => {
    console.log(
        `Simple CRUD Server is listening on: ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`,
    );
});
