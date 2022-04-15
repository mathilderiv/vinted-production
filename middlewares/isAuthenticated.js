const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const cloudinary = require("cloudinary").v2;

//Import de mon model user
const User = require("../models/Users-models");

//Import de mon model offer
const Offer = require("../models/Offers-model");

const isAuthenticated = async (req, res, next) => {
  //   const token = req.fields.token;
  console.log(req.headers.authorization);

  if (req.headers.authorization) {
    //Si on rentre un Token
    //Je continue mes vérifications
    const checkUserToken = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    console.log(checkUserToken);

    if (checkUserToken) {
      req.user = checkUserToken;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized " });
  }
};

module.export = isAuthenticated;
