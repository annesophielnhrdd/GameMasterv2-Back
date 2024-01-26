import { connect } from 'mongoose';

const CONNECTION_STRING = process.env.CONNECTION_STRING;

connect(CONNECTION_STRING, { connectTimeoutMS: 2000 })
  .then(() => console.log('[BACKEND] Database connected'))
  .catch(error => console.error(error));
