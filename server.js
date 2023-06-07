const express = require('express');
const healthRoutes = require('./routes/health');
const receitasRoutes = require('./routes/receitas');
const usersRoutes = require('./routes/users');
const logger = require('./middleware/logger');

const server = express();

server.use(express.json());

server.use(logger);

server.use(healthRoutes.router);
server.use(receitasRoutes.router);
server.use(usersRoutes.router);

module.exports = { server };