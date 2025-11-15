const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connection')
const { adminAuth } = require('./middleware/adminAuth')
const cartRoute = require('./routes/index')
const authRoutes = require('./routes/authRoutes');
const couponRoutes = require('./routes/couponRoutes')
const adminRoutes = require('./routes/adminRoutes')
require("dotenv").config();
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173", 
    process.env.FRONTEND_URL 
];

// app.use(cors({
//   origin: "*"
// }));

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); 
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true                  
}));


connectToMongoDB(process.env.MONGO_URI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("error...", err))


app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/cart', cartRoute)
app.use('/auth', authRoutes);
app.use('/coupon', couponRoutes);
app.use('/admin', adminRoutes)

// app.listen(PORT, () => {
//     console.log(`App started at port ${PORT}`)
// })
export default app;