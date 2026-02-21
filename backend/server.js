const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dsa', require('./routes/dsaRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`[${new Date().toISOString()}] Server restarted successfully`);
});
