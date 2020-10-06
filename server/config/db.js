const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://leomeliande:xbYzPnQz1WpwQN93@cluster0.xshul.gcp.mongodb.net/gyramais?retryWrites=true&w=majority";

try {  
  mongoose.connect(dbURI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
  }, () => {
      console.log('Banco de dados conectado!');
  })
} catch(err) {
  console.log(err)
}

// Models
require("../models/Messages");