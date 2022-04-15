const express = require("express");
const router = express.Router();

//Installation package crypto

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Importer le modele User

const User = require("../models/Users-models");

// Création première route user signup

router.post("/user/signup", async (req, res) => {
  console.log("La route est créée");

  try {
    const userMissing = req.fields.username;

    if (userMissing) {
      const emailAlreadyInDataBase = await User.findOne({
        email: req.fields.email,
      });

      if (emailAlreadyInDataBase === null) {
        const salt = uid2(32);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const token = uid2(32);

        //Création du nouveau compte avec mon modèle User
        const newSignUp = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            //avatar: Object, // nous verrons plus tard comment uploader une image
          },
          newsletter: req.fields.newsletter,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newSignUp.save();
        res.status(200).json({
          message: "Account successfully created !",
          id: newSignUp.id,
          token: newSignUp.token,
          account: newSignUp.account,
        });
      } else {
        res.status(400).json({
          message: "Account is already created !",
        });
      }
    } else {
      res.status(400).json({
        message: "User is empty ! Please fill it",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

//Etape n°3 : Création de la route user/login

router.post("/user/login", async (req, res) => {
  console.log("La route logIn a été empruntée");

  try {
    const logIn = await User.findOne({
      email: req.fields.email,
    });
    if (logIn === null) {
      res.status(401).json({ message: "Unauthorized !" }); //Email n'existe pas
    } else {
      const hash = SHA256(req.fields.password + logIn.salt).toString(encBase64);
      console.log(logIn);

      if (logIn.hash === hash) {
        res.status(200).json({
          message: "Connexion possible",
          id: logIn.id,
          token: logIn.token,
          account: logIn.account,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" }); //Password ne correspond pas
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
