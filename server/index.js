const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const authRouter = require('./routers/authRouter');

require('dotenv').config({ path: './.env' }); // Specify path to your .env file

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Backend connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRouter);

// app.use('/api/posts', postsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Backend server start on port 8000`);
});
