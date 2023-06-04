import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { MongoClient,ObjectId} from "mongodb"
import multer from "multer"
import {readFileSync,createReadStream} from 'fs'
import path from "path"
import { parse } from "csv-parse";
import axios from "axios"

const PORT = 4000;
const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log("run");
})

//per le immagini
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
          result[0].chats[info.id2].push({me:info.messaggio,date:info.date,time:info.time})
          obj=result[0].chats
          dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
            if (err) throw err;
          })
        }else{
          //per me
          result[0].chats[info.id2]=[{me:info.messaggio,date:info.date,time:info.time}]
          obj=(result[0].chats);
          dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
            if (err) throw err;
          })
        }
      }else{
        obj[info.id2]=[{me:info.messaggio,date:info.date,time:info.time}]
        dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$set:{chats:obj}},(err,result)=>{
          if (err) throw err;
        })
      }
    })
    dbo.collection("users").find({_id:new ObjectId(info.id2)}).toArray(function(err, result) {
      if(result[0].chats){
        if(result[0].chats[info.id]){
          //per te
          result[0].chats[info.id].push({te:info.messaggio,date:info.date,time:info.time})
          obj2=result[0].chats
          dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
            if (err) throw err;
          })
        }else{
          //per te
          result[0].chats[info.id]=[{te:info.messaggio,date:info.date,time:info.time}]
          obj2=(result[0].chats);
          dbo.collection("users").updateOne({_id:new ObjectId(info.id2)},{$set:{chats:obj2}},(err,result)=>{
            if (err) throw err;
          })
        }
      }else{
        obj2[info.id]=[{te:info.messaggio,date:info.date,time:info.time}]
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
  res.redirect("https://targa-af08a.web.app/modifica")
})
app.post('/post/:id', upload.single('avatar'), function (req, res) {
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(req.params.id)},{$push:{post:{id:req.file.path.replace(".jpg","").substring(8,req.file.path.replace(".jpg","").length),postImage:readFileSync(req.file.path).toString("base64")}}},(err,result)=>{
      if (err) throw err;
    })
  })
  setTimeout(()=>res.redirect("https://targa-af08a.web.app/post/"+req.file.path.replace(".jpg","").substring(8,req.file.path.replace(".jpg","").length)),1000)
})
app.put('/updatePost', upload.single('avatar'), function (req, res) {
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(info.id),"post.id":info.postid},{$set:{"post.$.commento":info.commento}},(err,result)=>{
      if (err) throw err;
    })
  })
})
app.put("/deletePost", async (req,res)=>{
  let info=JSON.parse(Object.keys(req.body)[0]);
  MongoClient.connect("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority", function(err, db) {
    if (err) throw err;
    var dbo = db.db("targa");
    dbo.collection("users").updateOne({_id:new ObjectId(info.id)},{$pull:{post:{id:info.postid}}},(err,result)=>{
      if (err) throw err;
      res.send(result)
    })
  });
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
app.get("/gasPrezzo", async (req,res)=>{
  let x=[]
  createReadStream("./prezzo.csv")
  .pipe(parse({ delimiter: ",", from_line: 3 }))
  .on("data", function (row) {
    x.push({
      id:row[0].split(";")[0],
      type:row[0].split(";")[1],
      prezzo:row[0].split(";")[2],
    });
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    res.send(x);
    console.log("finished");
  })
})
app.get("/gasAnagrafica", async (req,res)=>{
  let x=[]
  createReadStream("./anagrafica.csv")
  .pipe(parse({ delimiter: ",", from_line: 3 }))
  .on("data", function (row) {
    x.push({
      id:row[0].split(";")[0],
      gestore:row[0].split(";")[1],
      bandiera:row[0].split(";")[2],
      indirizzo:row[0].split(";")[5],
      comune:row[0].split(";")[6],
      latitudine:row[0].split(";")[8],
      longitudine:row[0].split(";")[9],
    });
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    res.send(x);
    console.log("finished");
  })
})
app.get("/gas", async (req,res)=>{
  axios.get("https://targa.onrender.com/gasAnagrafica").then((response)=>{
    axios.get("https://targa.onrender.com/gasPrezzo").then((response2)=>{
      response2.data.map(row=>{
        var foundIndex=response.data.findIndex(item=>{
          return item.id===row.id
        })
        response.data[foundIndex][row.type]=row.prezzo
      })
      res.send(response.data)
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  })
})
