import { load } from "cheerio";

import { getDatabaseClient } from "../utils/databaseConnection.js";
import axios from "axios";

/**
 * Get all bases (metadata).
 */
export const getBases = async (accessToken) => {
  if (!accessToken) {
    return res.status(401).send("Please authenticate first by visiting /auth");
  }
  try {
    const { db } = getDatabaseClient();
    const existingBases = await db.collection("Bases").find({}).toArray();
    if (existingBases.length > 0) {
      return existingBases;
    }
    const getBases = await axios.get(`${process.env.AIRTABLE_URL}meta/bases`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    db.collection("Bases").insertMany(getBases.data.bases);
    return getBases.data.bases;
  } catch (error) {
    console.error("Error fetching tables:", error.message);
    throw error;
  }
};

/**
 * Get tables for a specific base.
 * @param {string} baseId - Airtable base ID.
 */
export const getTables = async (accessToken, baseId) => {
  if (!accessToken) {
    return res.status(401).send("Please authenticate first by visiting /auth");
  }
  try {
    const { db } = getDatabaseClient();

    const existingBases = await db
      .collection("Tables")
      .find({ baseId })
      .toArray();
    if (existingBases.length > 0) {
      return existingBases;
    }

    const url = `${process.env.AIRTABLE_URL}meta/bases/${baseId}/tables`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    db.collection("Tables").insertMany(
      response.data.tables.map((table) => ({ ...table, baseId: baseId }))
    );
    return response.data.tables;
  } catch (error) {
    console.error("Error fetching tables:", error.message);
    throw error;
  }
};

/**
 * Get all tickets (records) from a specific table.
 * @param {string} baseId - Airtable base ID.
 * @param {string} tableId - Airtable table ID.
 */
export const getTickets = async (accessToken, baseId, tableId) => {
  if (!accessToken) {
    return res.status(401).send("Please authenticate first by visiting /auth");
  }
  const encodedTableName = encodeURIComponent(tableId);
  const url = `${process.env.AIRTABLE_URL}${baseId}/${encodedTableName}`;
  let tickets = [];
  let offset = null;
  console.log("url", url);
  try {
    const { db } = getDatabaseClient();
    const existingBases = await db
      .collection("Tickets")
      .find({ tableId })
      .toArray();
    if (existingBases.length > 0) {
      return existingBases;
    }
    do {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { offset },
      });

      tickets = tickets.concat(response.data.records);
      offset = response.data.offset; // Set the next page offset
    } while (offset);

    db.collection("Tickets").insertMany(
      tickets.map((ticket) => ({ ...ticket, tableId }))
    );
    return tickets;
  } catch (error) {
    console.error(
      `Error fetching tickets for table ${tableId}:`,
      error.message
    );
    throw error;
  }
};

/**
 * Get all users (from Users table).
 * @param {string} baseId - Airtable base ID.
 * @param {string} usersTableId - Users table ID.
 */
export const getUsers = async (accessToken, baseId, usersTableId) => {
  if (!accessToken) {
    return res.status(401).send("Please authenticate first by visiting /auth");
  }
  try {
    const { db } = getDatabaseClient();

    const existingBases = await db.collection("Users").find({}).toArray();
    if (existingBases.length > 0) {
      return existingBases;
    }

    const url = `${process.env.AIRTABLE_URL}${baseId}/${usersTableId}`;
    const records = [];
    let offset;

    do {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          offset,
        },
      });

      records.push(...response.data.records);
      offset = response.data.offset;
    } while (offset);

    const result = records.map((record) => ({
      id: record.id,
      fields: record.fields,
      createdTime: record.createdTime,
    })); // Return user data

    db.collection("Users").insertMany(
      result.map((user) => ({ ...user, baseId, usersTableId }))
    );
    return result;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};

/**
 * Fetch all the bases, tables, tickets, and users in a sequence.
 * @param {string} accessToken - The authentication token.
 * @param {string} baseId - Airtable base ID.
 * @param {string} usersTableId - Users table ID.
 */
export const getAllData = async (accessToken, baseId, usersTableId) => {
  if (!accessToken) {
    throw new Error("Please authenticate first by visiting /auth");
  }

  try {
    const { db } = getDatabaseClient();

    // Fetch the bases first
    const bases = await getBases(accessToken);

    // Once the bases are fetched, fetch tables for the given base
    const tables = await getTables(accessToken, baseId);

    // Fetch tickets for the specific table
    const tickets = await getTickets(accessToken, baseId, tables[0]?.id); // Assuming you fetch tickets from the first table

    // Fetch users from the users table
    const users = await getUsers(accessToken, baseId, usersTableId);

    // Return all the data
    return {
      bases,
      tables,
      tickets,
      users,
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

/**
 * Parse Revision History HTML
 * @param {string} html - HTML content of the revision history
 * @returns {Array} - List of revision entries with assignee and status
 */
export const parseRevisionHistory = (html) => {
  const $ = load(html);
  const revisions = [];

  $(".revision-entry").each((i, el) => {
    const assignee = $(el).find(".assignee").text().trim();
    const status = $(el).find(".status-change").text().trim();
    const timestamp = $(el).find(".timestamp").text().trim();

    revisions.push({ assignee, status, timestamp });
  });

  return revisions;
};

/**
 * Store Revision History in MongoDB
 * @param {string} baseId
 * @param {string} tableId
 * @param {string} recordId
 * @param {Array} revisions
 */
export const storeRevisionHistory = async (
  baseId,
  tableId,
  recordId,
  revisions
) => {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("revisions");

    const document = {
      baseId,
      tableId,
      recordId,
      revisions,
      fetchedAt: new Date(),
    };

    await collection.insertOne(document);
    console.log(`Revision history stored for record: ${recordId}`);
  } catch (error) {
    console.error("Error storing revision history:", error.message);
    throw error;
  } finally {
    await client.close();
  }
};

export const getCookies = async (email, password) => {
  try {
    const response = await axios.post(
      "https://airtable.com/login?_gl=1*yshegr*_gcl_au*OTE0NjA4NDguMTczNjUwNDE1Nw..*_ga*MTI3Nzc1NjUwNy4xNzM2NTAwMTI3*_ga_VJY8J9RFZM*MTczNjUwNDE1Ny4yLjEuMTczNjUwNDY1Mi42MC4wLjA.",
      {
        email,
        password,
      }
    );

    // Assuming the cookies are returned in the `set-cookie` header
    const cookies = response.headers["set-cookie"];
    if (!cookies) {
      throw new Error("Failed to retrieve cookies");
    }

    return cookies;
  } catch (error) {
    console.error("Error retrieving cookies:", error);
    throw error;
  }
};

export const fetchRecordsFromAirtable = async (token, baseId, tableId) => {
  try {
    const apiKey = token;
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data.records;
  } catch (error) {
    console.log("Error fetching records from Airtable:", error);
    throw error;
  }
};

export const workflow = async (token, baseId, tableId) => {
  return await processTasks(token, baseId, tableId);
};

// Fetch cookies from Airtable
async function getCookiesFromAirtable(token, baseId) {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${baseId}/cookies`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.cookies;
  } catch (error) {
    console.error("Error fetching cookies:", error);
    throw error;
  }
}

// Validate cookies
async function validateCookies(cookies, baseId) {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${baseId}/readRowActivitiesAndComments`,
      {
        headers: { Cookie: cookies },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Invalid cookies", error);
    return false;
  }
}

async function fetchRevisionHistory(taskId, baseId, cookies) {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${baseId}/readRowActivitiesAndComments?taskId=${taskId}`,
      {
        headers: { Cookie: cookies },
      }
    );
    const $ = cheerio.load(response.data); // Parse HTML response
    const revisions = [];

    $(".revision").each((i, elem) => {
      revisions.push({
        date: $(elem).find(".date").text(),
        comment: $(elem).find(".comment").text(),
        user: $(elem).find(".user").text(),
      });
    });

    return revisions;
  } catch (error) {
    console.error("Error fetching revision history:", error);
    throw error;
  }
}

// Main function to process tasks
async function processTasks(token, baseId, taskId) {
  try {
    const cookies = await getCookiesFromAirtable(token, baseId);
    if (!(await validateCookies(cookies, baseId))) {
      console.error("Cookies are invalid");
      return;
    }
    const revisions = await fetchRevisionHistory(taskId, baseId, cookies);
    return revisions
   
  } catch (error) {
    console.error("Error processing tasks:", error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("Airtable API Error:", error.response.data.error.message);
    }
  }
}
