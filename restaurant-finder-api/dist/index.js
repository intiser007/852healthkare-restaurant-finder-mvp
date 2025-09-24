"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Restaurant Finder API is running' });
});
app.use('/api', routes_1.suggestionRouter);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
});
