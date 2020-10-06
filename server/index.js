const { 
    PubSub, 
    GraphQLServer 
} = require("graphql-yoga");

const mongoose = require("mongoose");
const cors = require('cors');
const express = require('express')

let app = express();

app.use(cors());

// Conexão com o BD
require("./config/db");

// Import dos resolvers e tipos
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Conexão com a API
const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

mongoose.connection.once("open", () =>
  server.start(() => console.log("🚀 Servidor GraphQL rodando em http://localhost:4000/"))
);