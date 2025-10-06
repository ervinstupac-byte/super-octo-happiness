const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
  const { message } = req.body;

  console.log(`Received message: ${message}`);

  // Simple echo response for now
  // The frontend expects a stream, but we'll start with a simple response
  // and refine later.
  res.setHeader('Content-Type', 'text/plain');
  res.send(`You said: ${message}`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
