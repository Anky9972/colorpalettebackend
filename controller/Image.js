const fetch = require('node-fetch');


exports.getImage = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    console.log('img url',imageUrl)
    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing image URL' });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    const imageBuffer = await response.buffer();
    const contentType = response.headers.get('Content-Type');


    res.set('Content-Type', contentType);


    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
