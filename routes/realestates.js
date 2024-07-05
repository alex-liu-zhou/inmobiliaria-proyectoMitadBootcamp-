var express = require("express");
var router = express.Router();
const realestateController = require("../controllers/realestateControllers");
const multer = require("../middlewares/multer");

router.get("/", realestateController.viewRealEstates);

router.get("/inscribeRealEstate", realestateController.addRealEstate);

router.post(
  "/inscribeRealEstate",
  multer("inmobiliarias"),
  realestateController.createRealEstate
);

router.get("/viewOneRealEstate/:id", realestateController.viewOneRealEstate);

module.exports = router;
