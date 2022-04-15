//N°2 Afficher la 2e page

//N°3 Affiche les annonces avec le titre pantalon
// const listOfOffers = await Offer.find({
//   product_name: new RegExp(req.query.name, "i"),
// }).select("product_name product_description product_details product_price");

//N°4 Affiche toutes les annonces avec le titre pantalon qui ont un prix max de 100

// Création de mon objet vide pour contenir mes différents critères
// let objectFilter = {};
// objectFilter.product_name = req.query.name;
// objectFilter.product_price = { $lte: req.query.priceMax };

// const listOfOffers = await Offer.find(objectFilter).select(
//   "product_name product_description product_details product_price"
// );
// console.log(objectFilter);

//N°5 Affiche toutes les annonces dont les prix sont compris entre 40 et 200

// const listOfOffers = await Offer.find({
//   product_price: {
//     $gte: req.query.priceMin,
//     $lte: req.query.priceMax,
//   },
// })
//   .sort({ product_price: `desc` })
//   .select("product_name product_description product_details product_price");
// console.log(listOfOffers);

//N°6 Trier par prix décroissant

// const listOfOffers = await Offer.find()
//   .sort({ product_price: `desc` })
//   .select("product_name product_description product_details product_price");

//N°7 Trier par prix croissant

// const listOfOffers = await Offer.find()
//   .sort({ product_price: `asc` })
//   .select("product_name product_description product_details product_price");

//N°8 Affiche toutes les annonces de jupe par prix croissant

// const listOfOffers = await Offer.find({
//   product_name: new RegExp(req.query.name, "i"),
// })
//   .sort({ product_price: "asc" })
//   .select("product_name product_description product_details product_price");

//console.log(req.query.name);
//   res.status(200).json(listOfOffers);
// } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
// });

// if (req.query.title) {
//     let filter = {};
//     //console.log(req.query.title);
//     filter.product_name = new RegExp(req.query.title, "i");
//     filter.product_price = {
//       $lte: req.query.priceMax,
//       $gte: req.query.priceMin,
//     };

//     let listOfName = await Offer.find(filter)
//       .sort({ product_price: `desc` })
//       .select(
//         "product_name product_description product_details product_price"
//       );

//     res
//       .status(200)
//       .json({ message: "Filtre(s) bien appliqué(s)", listOfName });
//   } else {
//     res
//       .status(400)
//       .json({ message: "Merci de renseigner au moins un filtre" });
//   }
// } catch (error) {
//   res.status(400).json({ error: error.message });
// }
// });
