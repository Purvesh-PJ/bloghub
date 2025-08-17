const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('[ My_Blog_Database ] Database Connection Successful');
  }).catch((err) => {
    console.log('Error in database connection: ' + err);
});

const My_Blog_Database = mongoose.connection;

module.exports = My_Blog_Database;


