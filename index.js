const express = require("express");
const formidable = require("express-formidable");
require("dotenv").config(); //Permet d'activer les variables d'environnement qui se trouvent dans le fichier .env
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

//Importer users-models

const User = require("./models/Users-models");

//Importer offers-models

const Offer = require("./models/Offers-model");

// Importer les routes :

const userRoutes = require("./routes/user-route");

const offerRoutes = require("./routes/offer-route");

//Activer les routes :

app.use(userRoutes);
app.use(offerRoutes);

//Paramétrage de cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Création de la route pour upload Cloudinary

app.post("/upload", async (req, res) => {
  try {
    const pictureToUpload = req.files.picture.path;
    const result = await cloudinary.uploader.upload(pictureToUpload);
    console.log(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////
//Installation package crypto

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//////////////////////////////////////////////////////////////////////////////////////////////////

//Route non existante

app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

//Démarrage du serveur

app.listen(process.env.PORT, () => {
  console.log("Server started !! ");
});
