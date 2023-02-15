import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { MongoClient,ObjectId} from "mongodb"
import multer from "multer"
import {writeFileSync} from 'fs'

const PORT = process.env.PORT|| 3001;
const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log("run");
})
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

//parte dei clienti
app.get("/dati", async (req,res)=>{
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
    });
  });
})
app.put("/signup", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
      if (err) throw err;
      var dbo = db.db("targa");
      dbo.collection("users").insertOne(info,(err,result)=>{
      if (err) throw err;
      res.send(result)
      })
    });
})
app.put("/updateInfo", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:info},(err,result)=>{
      if (err) throw err;
      res.send(result)
    })
  });
})
app.put("/delete-account", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").deleteOne({_id:new ObjectId(info.id)},(err,result)=>{
      if (err) throw err;
      res.send(result)
    })
  });
})
app.put("/send-message", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  let obj={}
  let obj2={}
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({_id:new ObjectId(info.id)}).toArray(function(err, result) {
      if(result[0].chats){
        //per me
        result[0].chats[info.id2].push({me:info.messaggio})
        obj[info.id2]=result[0].chats[info.id2]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        //per me
        obj[info.id2]=[{me:info.messaggio}]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
    dbo.collection("users").find({_id:new ObjectId(info.id2)}).toArray(function(err, result) {
      if(result[0].chats){
        //per te
        result[0].chats[info.id].push({te:info.messaggio})
        obj2[info.id]=result[0].chats[info.id]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        //per te
        obj2[info.id]=[{te:info.messaggio}]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
  });
})
app.put("/like", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({_id:new ObjectId(info.id)}).toArray(function(err, result) {
      if(result[0].giudizio){
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{giudizio:{like:result[0].giudizio.like+1,dislike:result[0].giudizio.dislike}}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{giudizio:{like:1,dislike:0}}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
  })
})
app.put("/dislike", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({_id:new ObjectId(info.id)}).toArray(function(err, result) {
      if(result[0].giudizio){
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{giudizio:{like:result[0].giudizio.like,dislike:result[0].giudizio.dislike+1}}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{giudizio:{like:0,dislike:1}}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
  })
})
app.post('/profile/:id', upload.single('avatar'), function (req, res, next) {
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    const buffer = Buffer.from(req.file.buffer, "base64");
    writeFileSync("./images/profileImage"+req.params.id +"."+req.file.mimetype.split("/")[1], buffer)
    dbo.collection("users").updateOne({_id:new ObjectId(req.params.id)},{$set:{images:{profileImage:"profileImage"+req.params.id +"."+req.file.mimetype.split("/")[1]}}},(err,result)=>{
      if (err) throw err;
    })
  });
  res.redirect("http://localhost:3000")
})
app.get('/fetchImage/:file(*)', (req, res) => {
  res.sendFile("./images/"+req.params.file,{root:"///opt/render/project/src/"});
})
app.put("/coordinate", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{coordinate:{latitude:info.latitude,longitude:info.longitude}}},(err,result)=>{
      if (err) throw err;
      res.send(result)
    })
  });
})