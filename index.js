const express=require("express");
const cors=require("cors");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const port=7000
const app=express()

app.use(cors())
app.use(express.json())

const users=[];

const secretkey='Your-secret-key';


app.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    users.push({username,password:hashedPassword});
    res.sendStatus(201);
    console.log("user registered succesfully")
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=users.find((us)=>us.username===username)

    if(user){
        const isValiduser=await bcrypt.compare(password,user.password,);
        if(isValiduser){
            const token=await jwt.sign({username},secretkey,{expiresIn:'1hr'})
            res.json({token});
            console.log("login successfully");
        }else{
            res.status(401).json({message:'Invalid Credential,since password does not match'})
        }

    }else{
        res.status(401).json({message:'Invalid Credential, since user name  not found,enter the valid username'})
    }
})



const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://akashsab2005:Akashsab2005@cluster0.deqaml9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const outfitscollection=client.db("Data").collection("outfits");
    const customervreview=client.db("Data").collection("review");
    const post=client.db("Data").collection("insert");

    app.post("/up", async(req,res)=>{
        const data=req.body
        const result=await outfitscollection.insertOne(data)
        res.send(result)
    })
      app.post("/insertpost", async(req,res)=>{
        const data=req.body
        const result=await post.insertOne(data)
        res.send(result)
    })

        app.post("/reviewpost", async(req,res)=>{
        const data=req.body
        const result=await customervreview.insertOne(data)
        res.send(result)
    })

    app.get("/down", async(req,res)=>{
        const shirt=outfitscollection.find();
        const result=await shirt.toArray();
        res.send(result);
    })
        app.get("/insertget", async(req,res)=>{
        const shirt=post.find();
        const result=await shirt.toArray();
        res.send(result);
    })
        app.get("/reviewget", async(req,res)=>{
        const shirt=customervreview.find();
        const result=await shirt.toArray();
        res.send(result);
    })
    

    app.get("/downby/:id", async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const result=await outfitscollection.findOne(filter);
        res.send(result);
    })


        app.get("/reviewget/:id", async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const result=await customervreview.findOne(filter);
        res.send(result);
    })
     app.get("/insertget/:id", async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const result=await post.findOne(filter);
        res.send(result);
    })

    app.patch("/all/:id", async(req,res)=>
    {
        const id=req.params.id;
        const updatedata=req.body;
        const filter={_id:new ObjectId(id)};

        const updatedoc={
            $set:{
                ...updatedata
            },
        }
        const options={upsert:true};
        const result= await outfitscollection.updateOne(filter,updatedoc,options);
        res.send(result);
    })

        app.patch("/reviewpatch/:id", async(req,res)=>
    {
        const id=req.params.id;
        const updatedata=req.body;
        const filter={_id:new ObjectId(id)};

        const updatedoc={
            $set:{
                ...updatedata
            },
        }
        const options={upsert:true};
        const result= await customervreview.updateOne(filter,updatedoc,options);
        res.send(result);
    })
            app.patch("/insertpatch/:id", async(req,res)=>
    {
        const id=req.params.id;
        const updatedata=req.body;
        const filter={_id:new ObjectId(id)};

        const updatedoc={
            $set:{
                ...updatedata
            },
        }
        const options={upsert:true};
        const result= await post.updateOne(filter,updatedoc,options);
        res.send(result);
    })

    app.delete('/delete/:id', async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const filter={_id:new ObjectId(id)};
        const result=await outfitscollection.deleteOne(filter);
        res.send({success:true , message:"data deleted successfully", result});
    })

        app.delete('/reviewdelete/:id', async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const filter={_id:new ObjectId(id)};
        const result=await customervreview.deleteOne(filter);
        res.send({success:true , message:"data deleted successfully", result});
    })
     app.delete('/insertdelete/:id', async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const filter={_id:new ObjectId(id)};
        const result=await post.deleteOne(filter);
        res.send({success:true , message:"data deleted successfully", result});
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.listen( port,()=>{
    console.log(`Connected to ${port}`)
}

)