var express = require("express");
var router = express.Router();
const multer = require("../middlewares/multer");
const householdsController = require("../controllers/householdsController");

router.get("/viewOneHouseHold/:id", householdsController.viewOneHouse);

router.get("/formhouse/:id/:name", householdsController.formHouseHold);

router.post(
  "/addHouse/:id/:name",
  multer("casas"),
  householdsController.createHouseHold
);

router.get("/editFormHouse/:id", householdsController.editFormHouse);

router.post("/editHouse/:id", householdsController.editHouse);

router.get("/allHouses", householdsController.allHouses);

router.post("/filterHouses", householdsController.filterHouses);

router.get("/totalDelete/:id", householdsController.delete);

router.get("/logicDelete/:id", householdsController.logicdelete);

router.post("/addimages/:id", multer("casas"), householdsController.addimages);
module.exports = router;
