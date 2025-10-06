const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

app.post('/chat', (req, res) => {
  const { message } = req.body;
  console.log(`Received command: ${message}`);

  if (message === 'Render') {
    const gltfPath = path.join(__dirname, 'turbine.gltf');
    fs.readFile(gltfPath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading glTF file:", err);
        res.status(500).send({ error: 'Could not load model' });
        return;
      }
      res.json(JSON.parse(data));
    });
  } else {
    let responseMessage = "";
    switch (message) {
      case 'Analyze':
        responseMessage = "Starting analysis... Please provide more details on what to analyze.";
        break;
      case 'Investigate':
        responseMessage = "Beginning investigation... What are the parameters?";
        break;
      case 'Save':
        responseMessage = "Saving current state... (This feature is not yet implemented).";
        break;
      case 'Generate':
        responseMessage = "Generating new component... Please specify the type. (This feature is not yet implemented).";
        break;
      case 'CFD Simulator':
        responseMessage = "Connecting to CFD Simulator... (This feature is not yet implemented). What would you like to simulate?";
        break;
      case 'AppHub':
        responseMessage = "AppHub provides a unified view of your services. You can visit it by searching for 'App Hub' in the Google Cloud Console.";
        break;
      default:
        responseMessage = `Command not recognized: ${message}`;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(responseMessage);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});