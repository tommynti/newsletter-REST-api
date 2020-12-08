const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const articlesRoutes = require('./routes/articles-routes');
const categoriesRoutes = require('./routes/categories-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);

mongoose.connect('mongodb+srv://thomas:test123@cluster0.ejm7y.mongodb.net/news?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });
    })
    .catch(err => {
        console.log(err);
    });

