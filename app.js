const express = require('express');
const app = express();

const records = require('./records');

//Send a GET request to /quotes READ a list of quotes
app.get('/quotes', async (req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
});

//Send a GET request to /quotes/:id READ (View) a quote
app.get('/quotes/:id', async (req, res) => {
    const singleQuote = await records.getQuote(req.params.id);
    res.json(singleQuote);
});

//Send a POST request to /quotes CREATE a new quote
//Send a PUT request to /quotes/:id UPDATE (edit) a quote
//Send a DELETE request to /quotes/:id DELETE a quote
//Send a GET request to /quotes/quote/random READ (View) a random quote


app.listen(3000, () => console.log('Quote API listening on port 3000!'));