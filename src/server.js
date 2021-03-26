const express = require('express');
const server = express();
const routes = require("./routes");

server.set('view engine', 'ejs');
//habilitando arquivos staticos
server.use(express.static("public"))

//routes para
server.use(routes);

server.listen(3000, () => console.log('rodando'))