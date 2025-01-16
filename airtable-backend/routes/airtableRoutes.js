import express from "express";
const router = express.Router();

import {
  projects,
  tables,
  tickets,
  getUserList,
  workflows,
} from "../controllers/airtableController.js";
import { authenitication } from "../middleware/auth.middleware.js";

router.get("/projects", authenitication, projects);
router.get("/tables/:baseId", authenitication, tables);
router.get("/tickets/:baseId/:tableId", authenitication, tickets);
router.get("/users/:baseId/:usersTableId", authenitication, getUserList);
router.get("/retriveComments/:baseId/:tableId", authenitication, workflows);

export default router;
