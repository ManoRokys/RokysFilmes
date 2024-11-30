import express from "express";
import multer from "multer";
import connection from "./config/sequelize-config.js";
import Galeria from "./models/Galeria.js";

const app = express();

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

connection
  .query(`CREATE DATABASE IF NOT EXISTS galeriaRokys;`)
  .then(() => {
    console.log("O banco de dados está criado.");
  })
  .catch((error) => {
    console.log(error);
  });


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.set("view engine", "ejs");

const upload = multer({ dest: "public/uploads/" });

app.get("/", (req, res) => {
  Galeria.findAll().then((imagens) => {
    res.render("index", {
      imagens: imagens,
    });
  });
});

app.post("/uploads", upload.single("file"), (req, res) => {
  const { titulo, ano } = req.body;
  const file = req.file.filename;

  Galeria.create({
    file: file,
    titulo: titulo,
    ano: ano,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(`Erro ao salvar no banco: ${error}`);
      res.redirect("/");
    });
});

const port = 8081;
app.listen(port, (error) => {
  if (error) {
    console.log(`Ocorreu um erro! ${error}`);
  } else {
    console.log(`Servidor iniciado com sucesso em: http://localhost:${port}.`);
  }
});
