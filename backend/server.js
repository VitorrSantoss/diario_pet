const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuração do CORS para Produção
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions)); // Aplicando a nova configuração aqui

// Suas rotas
app.use("/api/diario", require("./routes/diariosRoutes"));
app.use("/api/produto", require("./routes/produtoRoutes"));

// Conexão com o banco
mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor rodando !!!`);
  }),
).catch((err) => {
  console.error("Erro ao conectar no MongoDB: ", err);
});