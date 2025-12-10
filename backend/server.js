import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import getPort from 'get-port';
import certificateRoutes from './routes/certificateRoutes.js';
import { initializeLedger } from './services/ledgerService.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Initialize ledger file if it doesn't exist
initializeLedger();

// Routes
app.use('/api', certificateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MarkSure Academic Ledger API is running',
    author: 'John Mark Fornah'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server with automatic port selection
async function startServer() {
  // Use PORT from environment variable, or find a free port starting from 5000
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : await getPort({ port: 5000 });
  
  app.listen(PORT, () => {
    console.log(`🚀 MarkSure Academic Ledger API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

