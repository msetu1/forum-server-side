const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port =process.env.PORT||5000;

// middleware 
app.use(cors());
app.use(express.json());

// mongodb 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dthbdpl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();

    // my important collection 
const allPostsCollection=client.db('forumDb').collection('posts')
const usersCollection=client.db('forumDb').collection('users')
const announcementsCollection=client.db('forumDb').collection('announcements')

// announcements 
app.post('/announcements',async(req,res)=>{
  const result =await announcementsCollection.insertOne(req.body)
  res.send(result)
  console.log(result);
})
app.get('/announcements',async(req,res)=>{
  const result =await announcementsCollection.find().toArray()
res.send(result)
console.log(result);
})
app.get('/users/:email',async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query)
  let admin = false;
  if (user) {
    admin = user?.role === 'admin';
  }

  res.send({ admin })
  console.log(admin);
  console.log(user);
});


// users
app.post('/users',async(req,res)=>{
  const result =await usersCollection.insertOne(req.body)
  res.send(result)
  console.log(result);
})
app.get('/users',async(req,res)=>{
  const result =await usersCollection.find().toArray()
res.send(result)
console.log(result);
})

// admin 
app.patch('/users/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const updateDoc={
    $set:{
      role:'admin',
    }
  }
  const result=await usersCollection.updateOne(query,updateDoc)
  res.send(result);
})

// add post 
app.get('/posts',async(req,res)=>{
const result =await allPostsCollection.find().toArray()
res.send(result)
})
app.post('/posts',async(req,res)=>{
    const result =await allPostsCollection.insertOne(req.body)
    res.send(result)
})

// app.patch('/posts/update/:id',async(req,res)=>{
//   const votes=req.body;
//   console.log(votes);
//   const id=req.params.id;
//   console.log(id);
//   const filter={_id:new ObjectId(id)};
//   const updateDoc={
//     $set:{
//       upVote:votes.upVote,
//       downVote:votes.downVote
//     }

//   }
//   const result=await allPostsCollection.updateOne(filter, updateDoc)
  
//   res.send(result);
// })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('online platform and forum');
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});
