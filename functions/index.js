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
const FileType = require('file-type');
const serviceAccount = require('./metaone-ec336-firebase-adminsdk-or3sd-58e3b79ec1.json');

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

app.get("/login/:id",async (req,res)=>{
    const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    res.status(200).send(JSON.stringify({id:userId, ...userData}));
})

app.get('/spaces',async (req,res)=>{
    const snapshot = await admin.firestore().collection("spaces").get();

    let spaces = [];
    snapshot.forEach(doc =>{
        let id = doc.id;
        let data = doc.data();

        spaces.push({id,...data});
    })
    res.status(200).send(JSON.stringify(spaces));
});

app.post("/addSpace",async (req,res)=>{
    const space = req.body;
    const name = req.body.name;
    await admin.firestore().collection("spaces").add(space);
    res.status(200).send(space.name + " added");
})

app.post("/addItemInSpace",async (req,res)=>{
    const space = req.body;
   
    await admin.firestore().collection("spaces").doc(space.id).add(space);
    res.status(200).send("Item added");
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

app.post('/upload', function(req, res) {
    cors(req, res, () => {
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
          const uid = uuidv4();
          console.log(JSON.parse(formData.get('position')))
          await admin.firestore().collection("spacesObjects").add({name: formData.get('name'), postion: [JSON.parse(formData.get('position'))] ,object:"img_url" ,spaceID:formData.get('spaceId')});
          res.status(200).json({
            message: "object added",
            data:img_url
          });
          return;
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
                console.log(JSON.parse(formData.get('position')))
                return
                const img_url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(signedUrls[0].name) + "?alt=media&token=" + uid;
                await admin.firestore().collection("spacesObjects").add({name: formData.get('name'), postion: JSON.parse(formData.get('position')) ,object:img_url ,spaceID:formData.get('spaceId')});
                res.status(200).json({
                  message: "object added",
                  data:img_url
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          });
          busboy.end(req.rawBody);
    })
 });
 app.post('/somewhere', (req, res) => {
    cors(req, res, () => {
      const bb = new Busboy({ headers: req.headers });
      let uploadData = null;
      bb.on('file', async(name, file, filename, encoding, mimeType) => {
        
const myArray = filename.split(".");
if(myArray[myArray.length - 1] != "glb"){
  return  res.status(500).json({
    error: "only GLB file allowed!"
  });
}
// const filepath = path.join(os.tmpdir(), filename);
//         uploadData = { file: filepath, type: mimetype };
//         file.pipe(fs.createWriteStream(filepath));
        // console.log(
        //   `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        //   filename,
        //   encoding,
        //   mimeType
        // );
        // file.on('data', (data) => {
        //   if(data.length > 10485760){
        //     return  res.status(500).json({
        //       message: "only 10 MB GLB file allowed!"
        //     });
        //   }
        //   console.log(`File [${name}] got ${data.length} bytes`);
        // }).on('close', () => {
        //   console.log(`File [${name}] done`);
        // });
      });
      let formData = new Map();

      bb.on('field', (fieldname, val) => {
        formData.set(fieldname, val);
      });
    bb.on("finish", () => {
      let data = {
        name : formData.get('name'),
        postion : formData.get('postion'),
        spaceId: formData.get('spaceId')
      }
      return res.status(200).json({
        message: "It worked!",
        data:data
      });
     
     
    });
    bb.end(req.rawBody);
});
  });
exports.api = region.https.onRequest(app);

exports.userRegister = region.auth.user().onCreate(async(user) => {
    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.
    const uid = user.uid; 
    const d = {
        email,displayName,uid
    }
    await admin.firestore().collection("users").add(d);
  });


 
