require('dotenv').config();
require('express-async-error');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const { xss } = require('express-xss-sanitizer');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// Database
const connectDB = require('./db/connect');

//  auth middleware 
const authenticateUser = require('./middleware/auth');

// router 
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handlers (middlewares)
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

// Extra Packages (Middlewares)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

// Dummy Route for Checking if deployed

app.get('/', (req, res) => res.send('inaka pao kupal'));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// Middlewares Error Handler
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server Listening on Port: ${port}`));
  } catch (error) {
    console.log(error);
  }
}

start();