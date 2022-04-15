const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const cloudinary = require("cloudinary").v2;

//Installation package crypto

// const SHA256 = require("crypto-js/sha256");
// const encBase64 = require("crypto-js/enc-base64");
// const uid2 = require("uid2");

//Import de mon model user
const User = require("../models/Users-models");

//Import de mon model offer
const Offer = require("../models/Offers-model");
const { append } = require("express/lib/response");
const { find } = require("../models/Users-models");
//console/log(Offer);

//Récupération du Token

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

// Création première route offer/publish :

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  //isAuthentify
  try {
    // Lien vers Cloudinary - fichier index.js
    const pictureToUpload = req.files.picture.path;
    const result = await cloudinary.uploader.upload(pictureToUpload);
    console.log(result);

    //Création d'une nouvelle annonce liée à mon User
    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { ETAT: req.fields.condition },
        { EMPLACEMENT: req.fields.city },
        { MARQUE: req.fields.brand },
        { TAILLE: req.fields.size },
        { COULEUR: req.fields.color },
      ],
      product_image: result,
      owner: req.user,
    });

    await newOffer.save();
    res.status(200).json({
      message: `Offer successfully created !`,
      newOffer,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Création d'une route offers

router.get("/offers", async (req, res) => {
  try {
    const filter = {};

    //Gestion du Title
    if (req.query.title) {
      //console.log(req.query.title);
      filter.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filter.product_price = { $gte: req.query.priceMin };
    }

    //Si j'ai déjà créé une clé product_price dans mon objet filter

    if (req.query.priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = req.query.priceMax;
      } else {
        filter.product_price = {
          $lte: req.query.priceMax,
        };
      }
    }

    const sortFilter = {};

    if (req.query.sort === "price-desc") {
      sort.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
      sort.product_price = "asc";
    }

    //Gestion de la pagination - par défaut ici 3 annonces par page
    //Si ma page est 1 - je veux voir toutes les offres - je devrais skip 0 annonce
    //Si ma page est 2 - je devrais skip 3 annonce

    // PAGE-1 * la limite (3 par défaut);

    let limit = 3;
    if (req.query.limit) {
      limit = req.query.limit;
    }

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const listOfName = await Offer.find(filter)
      .sort(sortFilter)
      .skip((page - 1) * limit) //(req.query.page(Page1))
      .limit(limit)
      .select("product_name product_description product_price");

    const count = await Offer.countDocuments(filter);
    res.status(200).json({ count: count, listOfName: listOfName });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Création d'une route offer/:id

router.get("/offer/:id", async (req, res) => {
  console.log("La Route offer/id a été empruntée");
  try {
    const offerById = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account.username email - _id", //Toutes les clés sauf l'ID
    });

    //console.log(req.params.id);

    if (!offerById) {
      res.status(400).json({ message: "Offer not found in database" });
    } else {
      res.status(200).json(offerById);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
