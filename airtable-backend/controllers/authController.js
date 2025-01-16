import axios from "axios";
import crypto from "crypto";
import qs from "qs";

export const authenitication = async (req, res) => {
  // Generate the PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  req.session.codeVerifier = codeVerifier;
  const state = crypto.randomBytes(32).toString("hex"); // You should generate a random state for security purposes
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = `http://localhost:${process.env.PORT}/auth/callback`;
  const authorizationUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=data.records:read data.records:write schema.bases:read&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  res.redirect(authorizationUrl);
};

/**
 * Generate a random code verifier
 * @returns {string} A random string of 43–128 characters
 */
function generateCodeVerifier() {
  const randomBytes = crypto.randomBytes(32); // Generate 32 random bytes
  return randomBytes.toString("base64url"); // Base64URL-encode the string
}

/**
 * Generate the code challenge from the code verifier
 * @param {string} codeVerifier - The code verifier string
 * @returns {string} A Base64URL-encoded SHA256 hash of the code verifier
 */
function generateCodeChallenge(codeVerifier) {
  const hash = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64"); // SHA256 hash
  return hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // Convert to Base64URL
}

export const getAccessToken = async (req, res) => {
  const REDIRECT_URI = `http://localhost:${process.env.PORT}/auth/callback`;
  const { code } = req.query;

  const credentials = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");
  const authHeader = `Basic ${credentials}`;
  try {
    const response = await axios.post(
      "https://airtable.com/oauth2/v1/token",
      qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code_verifier: req.session.codeVerifier,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
      }
    );
    res.redirect(
      `http://localhost:4200?access_token=${response.data.access_token}`
    );
    // Handle the response here
  } catch (error) {
    // Handle the error here
    console.error(error);
  }
};
