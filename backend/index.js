const express = require('express');
const cors = require('cors');
const {VertexAI} = require('@google-cloud/aiplatform');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: process.env.GOOGLE_CLOUD_PROJECT, location: 'us-central1'});
const model = 'gemini-1.0-pro-001';

// Instantiate the model
const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message for Gemini proxy:', message);

  res.setHeader('Content-Type', 'text/plain');

  try {
    const stream = await generativeModel.generateContentStream({
      contents: [{role: 'user', parts: [{text: message}]}],
    });

    for await (const item of stream.stream) {
      if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts) {
        const part = item.candidates[0].content.parts[0];
        if (part.text) {
          res.write(part.text);
        }
      }
    }
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    res.status(500).send('Error communicating with the AI service.');
  } finally {
    res.end();
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
