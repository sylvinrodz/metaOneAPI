const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app =express();
app.use(cors());

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
admin.initializeApp();
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
    await admin.firestore().collection("spaces").doc(name).add(...space);
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
exports.api = functions.region('asia-south1').https.onRequest(app);

exports.userRegister = functions.region('asia-south1').auth.user().onCreate(async(user) => {
    const email = user.email; // The email of the user.
    const displayName = user.displayName; // The display name of the user.
    const uid = user.uid; 
    const d = {
        email,displayName,uid
    }
    await admin.firestore().collection("users").add(d);
  });