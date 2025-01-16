import axios from 'axios';
import cheerio from 'cheerio';

export const getRevisionHistory = async (req, res) => {
  const { ticketId, cookies } = req.body;

  try {
    const response = await axios.post(`https://api.airtable.com/v0/${ticketId}/readRowActivitiesAndComments`, {}, {
      headers: { Cookie: cookies },
    });

    const $ = cheerio.load(response.data);
    const changes = [];

    $('.activity-entry').each((index, element) => {
      const changeType = $(element).find('.change-type').text();
      const oldValue = $(element).find('.old-value').text();
      const newValue = $(element).find('.new-value').text();

      changes.push({ changeType, oldValue, newValue });
    });

    res.status(200).json(changes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
