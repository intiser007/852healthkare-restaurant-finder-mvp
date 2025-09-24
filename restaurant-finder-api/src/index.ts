import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { suggestionRouter } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Restaurant Finder API is running' });
});

app.use('/api', suggestionRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
