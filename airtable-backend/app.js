import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from 'express-session';
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import airtableRoutes from "./routes/airtableRoutes.js";
import changelogRoutes from "./routes/changelogRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: "your_secret_key", // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/auth", authRoutes);
app.use("/airtable", airtableRoutes);
app.use("/changelog", changelogRoutes);

export default app;
