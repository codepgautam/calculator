const express = require('express');
const bodyParser = require('body-parser');
const calculatorRoutes = require('./routes/calculator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', calculatorRoutes);

app.listen(PORT, () => {
    console.log(`Application is running on port:${PORT}`);
});
