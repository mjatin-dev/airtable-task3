import {
  getBases,
  getTables,
  getTickets,
  getUsers,
  workflow,
} from "../utils/airtableApi.js";

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const projects = async (req, res) => {
  try {
    const fetchBases = await getBases(req.token);
    return res.status(200).json(fetchBases);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const tables = async (req, res) => {
  const { baseId } = req.params;
  console.log("baseId", baseId, req.token);
  try {
    const fetchTables = await getTables(req.token, baseId);
    return res.status(200).json(fetchTables);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const tickets = async (req, res) => {
  const { baseId, tableId } = req.params;
  console.log("{ baseId, tableId }", { baseId, tableId });
  try {
    const fetchTickets = await getTickets(req.token, baseId, tableId);
    return res.status(200).json(fetchTickets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getUserList = async (req, res) => {
  try {
    const { baseId, usersTableId } = req.params;
    const fetchUsers = await getUsers(req.token, baseId, usersTableId);
    return res.status(200).json(fetchUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const workflows = async (req, res) => {
  try {
    const { baseId, tableId } = req.params;
    const result = await workflow(req.token,baseId, tableId);
    return res.status(200).json({ data: result, message: "Workflow route" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
