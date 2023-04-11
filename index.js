import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { MongoClient,ObjectId} from "mongodb"
import multer from "multer"
import {readFileSync} from 'fs'
import path from "path"

const PORT = process.env.PORT|| 3001;
const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log("run");
})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

//parte delle auto
app.get("/auto", async (req,res)=>{
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("auto").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
    });
  });
})
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
        if(result[0].chats[info.id2]){
          //per me
          result[0].chats[info.id2].push({me:info.messaggio})
          obj=result[0].chats
          dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
            if (err) throw err;
          })
        }else{
          //per me
          result[0].chats[info.id2]=[{me:info.messaggio}]
          obj=(result[0].chats);
          dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
            if (err) throw err;
          })
        }
      }else{
        obj[info.id2]=[{me:info.messaggio}]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
    dbo.collection("users").find({_id:new ObjectId(info.id2)}).toArray(function(err, result) {
      if(result[0].chats){
        if(result[0].chats[info.id]){
          //per te
          result[0].chats[info.id].push({te:info.messaggio})
          obj2=result[0].chats
          dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
            if (err) throw err;
          })
        }else{
          //per te
          result[0].chats[info.id]=[{te:info.messaggio}]
          obj2=(result[0].chats);
          dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
            if (err) throw err;
          })
        }
      }else{
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
app.post('/profile/:id', upload.single('avatar'), function (req, res) {
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(req.params.id)},{$set:{images:{profileImage:readFileSync(req.file.path).toString("base64")}}},(err,result)=>{
      if (err) throw err;
    })
  })
  res.redirect("https://targa-af08a.web.app/")
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
app.put("/follow", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").find({_id:new ObjectId(info.id)}).toArray(function(err, result) {
      if(result[0].followers){
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$push:{followers:info.myid}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{followers:[info.myid]}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
    dbo.collection("users").find({_id:new ObjectId(info.myid)}).toArray(function(err, result) {
      if(result[0].seguiti){
        dbo.collection("users").updateOne({_id:new ObjectId(info.myid)},{$push:{seguiti:info.id}},(err,result)=>{
          if (err) throw err;
        })
      }else{
        dbo.collection("users").updateOne({_id:new ObjectId(info.myid)},{$set:{seguiti:[info.id]}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
  })
})