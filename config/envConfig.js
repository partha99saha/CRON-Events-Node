const dotenv = require('dotenv');
const path = require('path');
/* eslint-disable */

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Export environment variables
module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    environment: process.env.NODE_ENV,
};


// PORT=3000
// JWT_SECRET=Secret$3579@1246&=907
// DATABASE_URL=./dev_db.sqlite
// NODE_ENV=development
// npx sequelize-cli init 
// npx sequelize-cli db:migrate