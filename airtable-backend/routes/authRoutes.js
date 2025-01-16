import { authenitication, getAccessToken } from "../controllers/authController.js";
import express from "express";

const router = express.Router();


router.get("/auth", authenitication);
router.get("/callback", getAccessToken);

export default router;
