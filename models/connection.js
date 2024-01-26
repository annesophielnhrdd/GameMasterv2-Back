const mongoose = require('mongoose');

const CONNECTION_STRING = process.env.CONNECTION_STRING;

mongoose
  .connect(CONNECTION_STRING, { connectTimeoutMS: 2000 })
  .then(() => console.log(`[BACKEND] Database connected`))
  .catch(error => console.error(error));
