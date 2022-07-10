const express = require('express');
const cors = require('cors');
const Compute = require('./split-payments/compute');

const app = express();
const PORT = 6000;

// Express middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ status: 'App is running...' });
});

app.post('/split-payments/compute', new Compute().compute);

// App listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
