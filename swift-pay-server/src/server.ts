import mongoose from 'mongoose';
import config from './config/db';
import app from './index';



// connect mongodb with mongose
const database_Url = config.database_url;
const port = config.port;

async function main() {
  try {
    await mongoose.connect(database_Url as string);
    console.log('MongoDB connected succesfully with Atlas');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

main();