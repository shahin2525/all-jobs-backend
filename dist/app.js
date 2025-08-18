"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFoundRoutes_1 = __importDefault(require("./app/middlewares/notFoundRoutes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'https://trusted-website.com', // Only allow this domain
    // Only allow GET/POST requests
    credentials: true, // Allow cookies/auth headers
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// application route
app.use('/api/v1', routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
// not found route
app.use(notFoundRoutes_1.default);
// app.use(notFound);
exports.default = app;
