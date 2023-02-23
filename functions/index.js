const functions = require("firebase-functions");
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const Busboy = require("busboy");
const os = require("os");
const path = require("path");
const fs = require("fs");
const serviceAccount = require('./metaone-ec336-firebase-adminsdk-or3sd-58e3b79ec1.json');

//to convert files into images
var convertapi = require('convertapi')('be9ArnZsDViI9ibr');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'metaone-ec336.appspot.com'
});
const bucket = getStorage().bucket();
const app =express();
const region = functions.region('asia-south1');
app.use(cors);

// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// Login Api
//Get All users
app.get('/logins',async (req,res)=>{
    const snapshot = await admin.firestore().collection("users").get();

    let users = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();

        users.push({id,...data});
    })
    res.status(200).send(JSON.stringify(users));
});

//Get Single user by ID
app.get("/login/:id",async (req,res)=>{
    const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({id:userId, ...userData}));
})

app.post("/saveAvatar", async (req,res)=>{
   const data = req.body;
   const snapshot = await admin.firestore().collection("avtars").doc(req.body.userID).get();
  if(snapshot.exists){
    await admin.firestore().collection("avtars").doc(req.body.userID).update(data);
    res.status(200).send(req.body.userID + " updated");
  }else{
    await admin.firestore().collection("avtars").doc(req.body.userID).set(data);
    res.status(200).send(req.body.userID + " added");
  }

})

app.get("/getAvtar/:userID",async (req,res)=>{
  console.log(req.params.userID)
  const snapshot = await admin.firestore().collection("avtars").doc(req.params.userID).get();
if(snapshot.exists){
  const userId = snapshot.id;
  const avtarData = snapshot.data();

  res.status(200).send({id:userId, ...avtarData,status:true});
}else{
  res.status(500).send({Message:"no data found",status:false});
}
  
})
// Spaces (particular User)
app.get('/spaces/:userID/:limit/:lastName',async (req,res)=>{
  let limit = parseInt(req.params.limit)
     const snapshot = await admin.firestore().collection("spaces").where("userID","==", req.params.userID).orderBy("name").startAfter(req.params.lastName).limit(limit).get();

    let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();
       
        spaces.push({id,...data});
    })
     res.status(200).send(JSON.stringify(spaces));
});

//serch spaces
app.get('/serchSpaces/:userID/:name',async (req,res)=>{
  let name = req.params.name.toString();
     const snapshot = await admin.firestore().collection("spaces").where("userID","==", req.params.userID).get();

    let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();
       if(data.name.includes(name)){
        spaces.push({id,...data});
       }
       
    })
     res.status(200).send(JSON.stringify(spaces));
});
app.get("/getstoreData",async (req,res)=>{
  const snapshot = await admin.firestore().collection("chirag").doc(req.params.id).get();

  const spaceId = snapshot.id;
  const spaceData = snapshot.data();

  res.status(200).send(JSON.stringify(spaceData));
})
app.get("/storeData/:id",async (req,res)=>{
  await admin.firestore().collection("chirag").doc(req.body.userID).set({data:req.params.id});
  res.status(200).send(req.body.userID + " added");
})


app.post("/addSpace",async (req,res)=>{
    const space = req.body;
    const name = req.body.name;
    await admin.firestore().collection("spaces").add(space);
    res.status(200).send(space.name + " added");
})

app.get("/space/:id",async (req,res)=>{
    const snapshot = await admin.firestore().collection("spaces").doc(req.params.id).get();

    const spaceId = snapshot.id;
    const spaceData = snapshot.data();

    res.status(200).send(JSON.stringify({id:spaceId, ...spaceData}));
})

app.delete("/space/:id",async (req,res)=>{
 
    await admin.firestore().collection("spaces").doc(req.params.id).delete();
    res.status(200).send(req.params.id + " deleted");
})

app.put("/spaces/:id",async (req,res)=>{
    const body = req.body;
    await admin.firestore().collection("spaces").doc(req.params.id).update({
        ...body
    });
    res.status(200).send(req.params.id + " updated");
})


//New Default Spaces
app.get('/newSpaces/:limit/:lastName',async (req,res)=>{
  let limit = parseInt(req.params.limit)
  const snapshot = await admin.firestore().collection("demoSpace").orderBy("name").startAfter(req.params.lastName).limit(limit).get();

 let spaces = [];
 snapshot.forEach(doc =>{
     let id = doc.id;
     let data = doc.data();
    
     spaces.push({id,...data});
 })
  res.status(200).send(JSON.stringify(spaces));
});



app.post("/addnewSpacesInUser",async (req,res)=>{
  const newSpacesID = req.body.newSpacesID;
  const userID = req.body.userID;

  // get user Data
  const usersSpace = await admin.firestore().collection("users").doc(userID).get();

  // get new Space Data
 const newSpaces = await admin.firestore().collection("demoSpace").doc(newSpacesID).get();
    const newSpacesData = {newSpacesID,...newSpaces.data()};
    newSpacesData.name = usersSpace.data().displayName + " " + newSpacesData.name;
    const d = {author:usersSpace.data().displayName,...newSpacesData}

    //add new space to spaces
    const sdata =await admin.firestore().collection("spaces").add({userID,...d});
    
    // get models from new space
   const newSpacesObjects = await admin.firestore().collection("demoSpaceModel").where("spaceID","==",newSpacesID).get();

   newSpacesObjects.forEach(doc =>{
       let id = doc.id;
       let data = doc.data();
       let concat = {id,...data};
        concat.spaceID = sdata.id;
       
      // add newspacemodels to space modals
       admin.firestore().collection("modals").add(concat)
      
   })
   
   res.status(200).json({
    message:"new space added in "+ usersSpace.data().displayName + " as " + newSpacesData.name,
    id:sdata.id
  });
})

app.get("/getSpaceObjects/:spaceID/:SpaceType",async (req,res)=>{
  // res.status(200).send(JSON.stringify(req.params.spaceID));
   const snapshot = await admin.firestore().collection("modals").where("spaceID", "==" ,req.params.spaceID).get();

  let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();

        spaces.push({id,...data});
    })
    res.status(200).send(JSON.stringify(spaces));
})
app.post("/moveSpaceObject",async (req,res)=>{

  const posX = req.body.posX;
  const posY = req.body.posY;
  const posZ = req.body.posZ;
  const rotation = req.body.rotation;
  const scale = req.body.scale;
  const modalID = req.body.modalID;
 await admin.firestore().collection("modals").doc(modalID).update({
  posX:posX,
  posY:posY,
  posZ:posZ,
    rotation:rotation,
    scale:scale
  }).then(()=>{
    res.status(200).send(modalID+ " is updated");
  }).catch((err)=>{
    res.status(500).send(err);
  });

  
   

})
app.post("/addPlayerToRoom",async (req,res)=>{

  const playerID = req.body.playerID;
  const roomID = req.body.roomID;
  const uniqueID = playerID+roomID;
 await admin.firestore().collection("players").doc(uniqueID).set({
  playerID:playerID,
  roomID:roomID,
  uniqueID:uniqueID,
  date:new Date()
  }).then(()=>{
    res.status(200).send(playerID+ " is added");
  }).catch((err)=>{
    res.status(500).send(err);
  });
})
app.post("/removePlayerFromRoom",async (req,res)=>{

  const playerID = req.body.playerID;
  const roomID = req.body.roomID;
  const uniqueID = playerID+roomID;
 await admin.firestore().collection("players").doc(uniqueID).delete().then(()=>{
    res.status(200).send(playerID+ " is removed");
  }).catch((err)=>{
    res.status(500).send(err);
  });
})
app.post("/getPlayers",async (req,res)=>{

  const roomID = req.body.roomID;
 await admin.firestore().collection("players").where("roomID","==",roomID).get().then((resp)=>{
    res.status(200).send(resp.size.toString());
  }).catch((err)=>{
    res.status(500).send(err);
  });
})
app.get("/getSpaceFiles/:spaceID/:SpaceType",async (req,res)=>{
   const snapshot = await admin.firestore().collection("files").where("spaceID", "==" ,req.params.spaceID).get();

  let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();

        spaces.push({id,...data});
    })
    res.status(200).send(JSON.stringify(spaces));
})
app.get("/getSpaceMainObject/:spaceID/:SpaceType",async (req,res)=>{
   const snapshot = await admin.firestore().collection("BaseModel").where("spaceID", "==" ,req.params.spaceID).get();

  let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();

        spaces.push({id,...data});
    })
    res.status(200).send(JSON.stringify(spaces));
})
app.post('/addSpaceFiles', (req, res) => {
  cors(req, res, async() => {
   
      const busboy = new Busboy({ headers: req.headers });
      let uploadData = null;
      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
     
          const filepath = path.join(os.tmpdir(), filename);
          uploadData = { file: filepath, type: mimetype };
          file.pipe(fs.createWriteStream(filepath));
          
        });
        let formData = new Map();

        busboy.on('field', (fieldname, val) => {
          formData.set(fieldname, val);
        });

        busboy.on("finish", async() => {
          
        const spaceData = await admin.firestore().collection("spaces").doc(formData.get('spaceId')).get();
      
        if(spaceData.exists){
          const uid = uuidv4();
       
          bucket
            .upload(uploadData.file, {
              uploadType: "media",
              metadata: {
                metadata: {
                  contentType: uploadData.type,
                  firebaseStorageDownloadTokens: uid
                }
              }
            })
            .then(async(signedUrls ) => {
              const uid = uuidv4();
              const img_url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(signedUrls[0].name) + "?alt=media&token=" + uid;
              await admin.firestore().collection("files").doc(uid).set({id:uid,name: formData.get('name'), postion: formData.get('position'),rotation: formData.get('rotation'),scale: formData.get('scale') ,url:img_url ,spaceID:formData.get('spaceId'),type:formData.get('type')});

              res.status(200).json({
                message: "file added",
                url:img_url,
                id:uid
              });
              
            })
            .catch(err => {
              res.status(500).json({
                error: err
              });
            });
        }else{
          res.status(500).json({
            error: "space Id not exist"
          });
        }
        
        });
        busboy.end(req.rawBody);
  })
});

app.post('/addSpaceObject', (req, res) => {
    cors(req, res, async() => {
     
        const busboy = new Busboy({ headers: req.headers });
        let uploadData = null;
        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
          const myArray = filename.split(".");
          if(myArray[myArray.length - 1] != "glb"){
            return  res.status(500).json({
              error: "only GLB file allowed!"
            });
          }
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = { file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath));
            
          });
          let formData = new Map();

          busboy.on('field', (fieldname, val) => {
            formData.set(fieldname, val);
          });

          busboy.on("finish", async() => {
            
          const spaceData = await admin.firestore().collection("spaces").doc(formData.get('spaceId')).get();
        
          if(spaceData.exists){
            const uid = uuidv4();
         
            bucket
              .upload(uploadData.file, {
                uploadType: "media",
                metadata: {
                  metadata: {
                    contentType: uploadData.type,
                    firebaseStorageDownloadTokens: uid
                  }
                }
              })
              .then(async(signedUrls ) => {
              
                const img_url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(signedUrls[0].name) + "?alt=media&token=" + uid;
                await admin.firestore().collection("modals").doc(uid).set({name: formData.get('name'), postion: formData.get('position'),rotation: formData.get('rotation'),scale: formData.get('scale') ,url:img_url ,spaceID:formData.get('spaceId'),id:uid});
                
                res.status(200).json({
                  message: "object added",
                  url:img_url,
                  id:uid
                });
                
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }else{
            res.status(500).json({
              error: "space Id not exist"
            });
          }
          
          });
          busboy.end(req.rawBody);
    })
 });


exports.api = region.https.onRequest(app);




 