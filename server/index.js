const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const authRouter = require('./routers/authRouter');
const productRouter = require('./routers/productRouter');

const boqRouter = require('./routers/Boq/boqRouter');
const hardwareRouter = require('./routers/Boq/hardwareRouter');
const softwareRouter = require('./routers/Boq/softwareRouter');
const serviceRouter = require('./routers/Boq/serviceRouter');

const projectRouter = require('./routers/Project/projectRouter');
const orderRouter = require('./routers/Project/orderRouter');

const app = express();
 
require('dotenv').config({ path: './.env' }); // Specify path to your .env file


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
app.use('/api', productRouter);

app.use('/api', boqRouter);
app.use('/api', hardwareRouter);
app.use('/api', softwareRouter);
app.use('/api', serviceRouter);

app.use('/api', projectRouter);
app.use('/api', orderRouter);

app.listen(process.env.PORT, () => {
    console.log(`Backend server started on port 8000`);
});
