const express = require('express');
const app = express();
const cors = require('cors');
const messages = [];

app.use(express.json());
//middlewares
app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.status(200).json(messages);
});

app.post('/', (req, res) => {
  const message = req.body;
  if (message.origin && message.text) {
    messages.unshift(message);
    console.log(message);
    res.status(200).json({
      result: true,
      message,
    });
  } else {
    res.status(400).json({
        result:false
    })
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
