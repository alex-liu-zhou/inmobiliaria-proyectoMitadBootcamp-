const connection = require("../config/db");
const bcrypt = require("bcrypt");

class RealestatesController {
  viewRealEstates = (req, res) => {
    let sql = `SELECT * FROM realestate WHERE realestate_isdeleted = 0`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render("realestates", { result });
    });
  };
  addRealEstate = (req, res) => {
    res.render("createRealEstate");
  };
  createRealEstate = (req, res) => {
    console.log(req.body);
    const {
      realestate_name,
      email,
      password,
      phone_number,
      realestate_description,
    } = req.body;
    let message1 = "";
    let message2 = "";
    let message3 = "";
    let message4 = "";
    let validator = true;
    if (!realestate_name) {
      message1 = "Introduzca el nombre de la inmobiliaria";
      validator = false;
    }
    if (!email) {
      message2 = "Introduzca email de contacto";
      validator = false;
    }
    if (!password) {
      message3 = "Introduzca una contraseña";
      validator = false;
    }
    if (!phone_number) {
      message4 = "Introduzca un telefono de contacto";
      validator = false;
    }
    if (!validator) {
      return res.render("createRealEstate", {
        message1,
        message2,
        message3,
        message4,
      });
    }

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) throw hashErr;
      let data = [
        realestate_name,
        email,
        hash,
        phone_number,
        realestate_description,
      ];
      let sql = `INSERT INTO realestate (realestate_name, email, password, phone_number,realestate_description) 
      VALUES (?,?,?,?,?)`;
      if (req.file != undefined) {
        sql = `INSERT INTO realestate (realestate_name, email, password, phone_number,realestate_description,realestate_img) VALUES (?,?,?,?,?,?)`;
        data.push(req.file.filename);
      }
      connection.query(sql, data, (err, result) => {
        if (err) {
          if (err.errno == 1062) {
            res.render("createRealEstate", { message2: "Email ya existe" });
          } else {
            throw err;
          }
        } else {
          res.redirect("/");
        }
      });
    });
  };
  viewOneRealEstate = (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM realestate WHERE realestate_id = ? 
      and realestate_isdeleted = 0`;
    let data = [id];
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      let sqlHouses = `SELECT * FROM households WHERE realestate_id = ? AND house_isdeleted = 0`;
      connection.query(sqlHouses, data, (err2, resultHouse) => {
        if (err2) throw err2;
        res.render("viewRealEstate", { rEstate: result[0], resultHouse });
      });
    });
  };
}

module.exports = new RealestatesController();
