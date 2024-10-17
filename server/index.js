import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/auth-route.js';
import adminRoutes from './routes/adminRoute.js';
import cookieParser from 'cookie-parser';


dotenv.config()


mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('db connect');
    
})
.catch((err) => {
    console.log(err);
    
})

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('server running on ');
    
});

app.use('/api', userRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)



 app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    });
 });
