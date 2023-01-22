import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { MongoClient, ObjectId} from "mongodb"


const PORT = process.env.PORT|| 3001;
const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log("run");
})

//parte dei clienti
app.get("/signup", async (req,res)=>{
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/people?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
    });
  });
})
app.put("/login", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/people?retryWrites=true&w=majority", function(err, db) {
      if (err) throw err;
      var dbo = db.db("targa");
      dbo.collection("users").insertOne(info,(err,result)=>{
      if (err) throw err;
      res.send(result)
      })
    });
})