const connection = require("../config/db");

class HouseholdsController {
  viewOneHouse = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM households WHERE households_id = ?`;
    let data = [id];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      let sql2 = `SELECT * FROM houseimages WHERE households_id = ?`;
      connection.query(sql2, data, (err2, images) => {
        if (err2) throw err2;
        res.render("viewOneHouse", { house: result[0], images });
      });
    });
  };

  formHouseHold = (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    res.render("formhouse", { name, id });
  };

  editFormHouse = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM households WHERE households_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("edithouse", { house: result[0] });
    });
  };

  editHouse = (req, res) => {
    const id = req.params.id;
    const { city, address, built_year, m2, description } = req.body;
    console.log(req.body);
    let sql = `UPDATE households SET city = ?, address = ?,built_year = ?, m2 = ?,description = ?
    WHERE households_id = ${id}`;
    let data = [city, address, built_year, m2, description];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.redirect(`/houseHolds/viewOneHouseHold/${id}`);
    });
  };

  createHouseHold = (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    const { city, address, built_year, m2, description } = req.body;
    let message1 = "";
    let message2 = "";
    let message3 = "";
    let validator = true;
    if (!city) {
      message1 = "debe introducir una ciudad";
      validator = false;
    }
    if (!address) {
      message2 = "introduzca una direccion";
      validator = false;
    }
    if (
      !built_year ||
      isNaN(parseInt(built_year)) ||
      parseInt(built_year) < 1901
    ) {
      message3 = "año incorrecto o inferior a 1901";
      validator = false;
    }
    if (!validator) {
      return res.render("formhouse", {
        id,
        name,
        message1,
        message2,
        message3,
      });
    } else {
      let data = [city, address, built_year, m2, description, id];
      let sql = `INSERT INTO households (city,address,built_year,m2,description,realestate_id)
    VALUES (?,?,?,?,?,?)`;
      console.log(req.body);
      if (req.file != undefined) {
        sql = `INSERT INTO households (city,address,built_year,m2,description,realestate_id,house_img)
      VALUES (?,?,?,?,?,?,?)`;
        data.push(req.file.filename);
      }
      connection.query(sql, data, (err, result) => {
        if (err) throw err;
        res.redirect(`/realestates/viewOneRealEstate/${id}`);
      });
    }
  };

  allHouses = (req, res) => {
    let sql = `SELECT * FROM households WHERE house_isdeleted = 0`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("viewAllHouses", { result });
    });
  };

  logicdelete = (req, res) => {
    const id = req.params.id;
    let sql = `UPDATE households SET house_isdeleted = 1 WHERE households_id = ${id}`;
    connection.query(sql, (err, result2) => {
      if (err) throw err;
      let sql2 = `SELECT * FROM households WHERE house_isdeleted = 0`;
      connection.query(sql2, (err, result) => {
        res.render("viewAllHouses", { result });
      });
    });
  };

  filterHouses = (req, res) => {
    const { city, m2 } = req.body;
    console.log(`----${city}`);
    let data = [city];
    let sql = `SELECT * FROM households WHERE m2 >= ${m2} AND city LIKE "%${city}"`;
    if (m2 == "") {
      sql = `SELECT * FROM households WHERE city LIKE "%${city}"`;
    }
    if (city == "") {
      sql = `SELECT * FROM households WHERE m2 >= ${m2}`;
    }
    connection.query(sql, (err, result) => {
      console.log(result);
      if (err) throw err;
      res.render("viewAllHouses", { result });
    });
  };

  addimages = (req, res) => {
    const { id } = req.params;
    let sql = `INSERT INTO houseimages (images,households_id) VALUES (?,?)`;
    let data = [req.file.filename, id];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      res.redirect(`/houseHolds/viewOneHouseHold/${id}`);
    });
  };

  delete = (req, res) => {
    const { id } = req.params;
    let sql = `DELETE FROM households WHERE households_id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/houseHolds/allHouses");
    });
  };
}

module.exports = new HouseholdsController();
