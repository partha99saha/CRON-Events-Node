const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./app/routes/auth');
const eventRoutes = require('./app/routes/event');
const sequelize = require('./app/models').sequelize;
const initializePassport = require('./app/config/passport');
const logger = require('./app/config/logger');
const errorHandler = require('./app/middlewares/errorHandler')
const helmet = require('helmet');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 3000;

// Enable security headers
app.use(cors());
app.use(helmet());

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
initializePassport(passport);

// Routes
app.use('/user', authRoutes);
app.use('/events', passport.authenticate('jwt', { session: false }), eventRoutes);

// Handle errors with middleware
app.use(errorHandler)

// Sync database and 
sequelize.sync()
    .then(() => {
        // start the server
        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });
        console.log('Database connected!');
    })
    .catch((err) => {
        logger.error('Database connection failed:', err);
        console.error('Database connection failed:', err);
    });


