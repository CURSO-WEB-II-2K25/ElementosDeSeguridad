import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieSession from "cookie-session";
import helmet from "helmet";


// ---------------------------------------------------
// Section - Creates and configures the application
// ---------------------------------------------------
// Create the express app
const app = express();

// Set up CORS
var corsOptions = {
    origin: "http://localhost:5010",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS, Cross-Origin Resource Sharing, to allow API to be accessed by web pages,
// and other web origins. This is a security feature to prevent unauthorized access.
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Enable Helmet, a collection of 14 smaller middleware functions that set HTTP headers
// to secure the application
app.use(helmet());

// Add cookie session
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(
    cookieSession({
        name: "demoyork-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true,
        expires: expiryDate
    })
);

// Set request and response timeout
app.use((req, res, next) => {
    req.setTimeout(5000); // Set request timeout to 5 seconds
    res.setTimeout(5000); // Set response timeout to 5 seconds
    next();
});

// Enable headers for CORS
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});


// ---------------------------------------------------
// Section - Creates the database connection
// ---------------------------------------------------
// Import the database connection variables
import dbConfig  from './config/configDB.js';

// Try to connect to the database
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}/`,{ dbName: dbConfig.DB })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial().then(r => console.log("Initial roles created"));
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Load models
import './models/mdl_Users.js';
import './models/mdl_Roles.js';

// Create the initial roles if they do not exist
async function initial() {
    const Roles = mongoose.model('Roles');
    await Roles.estimatedDocumentCount().then((count) => {
        if (count === 0) {
            const newRoles = [
                {
                    name: "customer",
                    level: 1,
                    description: "Business client"
                },
                {
                    name: "user",
                    level: 3,
                    description: "Normal user"
                },
                {
                    name: "admin",
                    level: 5,
                    description: "Administrator"
                }];

            Roles.insertMany(newRoles).then(() => {
                console.log("added 'customer', 'user' and 'admin' to roles collection");
            }).catch(err => {
                console.log("error", err);
            });
        }
    });
}


// ---------------------------------------------------
// Section - Creates application routes
// ---------------------------------------------------
// Simple route, create a greeting for the API
app.get("/", (req, res) => {
    const msgJson = {
        status_code: 200,
        status_message: "OK",
        body_message: "Welcome to DemoYork application."
    };
    res.status(200).json(msgJson);
});

// Import the routes
import users from './routes/rout_Users.js' ;
import categories from "./routes/rout_Categories.js";

// Create all listener for each route link
app.use('/users', users);
app.use('/categories', categories);

// ---------------------------------------------------
// Section - Creates server
// ---------------------------------------------------
// Set port and listen for requests
const PORT = process.env.PORT || 5010;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Set up the server with keep-alive and headers timeout
server.keepAliveTimeout = 30 * 1000; // 30 seconds
server.headersTimeout = 35 * 1000; // 35 seconds
