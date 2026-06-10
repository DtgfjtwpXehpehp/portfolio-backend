"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const aboutRoutes_1 = __importDefault(require("./aboutRoutes"));
const contactRoutes_1 = __importDefault(require("./contactRoutes"));
const resumeRoutes_1 = __importDefault(require("./resumeRoutes"));
const documentsRoutes_1 = __importDefault(require("./documentsRoutes"));
const router = express_1.default.Router();
router.use('/projects', projectRoutes_1.default);
router.use('/about', aboutRoutes_1.default);
router.use('/contact', contactRoutes_1.default);
router.use('/resume', resumeRoutes_1.default);
router.use("/documents", documentsRoutes_1.default);
exports.default = router;


export default router