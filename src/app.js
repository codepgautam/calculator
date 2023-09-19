const express = require('express');
const bodyParser = require('body-parser');
const calculatorRoutes = require('./routes/calculator');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', calculatorRoutes);

app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
});
