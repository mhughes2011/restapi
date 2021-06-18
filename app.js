const express = require('express');
const app = express();

const records = require('./records');

app.use(express.json());

//Send a GET request to /quotes READ a list of quotes
app.get('/quotes', async (req, res) => {
    try{
        const quotes = await records.getQuotes();
        res.json(quotes);
    }catch(err) {
        res.json({message: err.message});
    }
});

//Send a GET request to /quotes/:id READ (View) a quote
app.get('/quotes/:id', async (req, res) => {
    try{
        const singleQuote = await records.getQuote(req.params.id);
        if(singleQuote){
            res.json(singleQuote);
        } else {
            res.status(404).json({message: "Quote not found."});
        }
    }catch(err) {
        res.status(500).json({message: err.message});
    }
});

//Send a POST request to /quotes CREATE a new quote
app.post('/quotes', async (req, res) => {
    try{
        if(req.body.author && req.body.quote) {
            const newQuote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.status(201).json(newQuote);
        } else {
            res.status(400).json({message: "Quote and author required."});
        }
    }catch(err) {
        res.status(500).json({message: err.message});
    }
});

//Send a PUT request to /quotes/:id UPDATE (edit) a quote
app.put('/quotes/:id', async(req, res) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if(quote) {
            quote.quote = req.body.quote;
            quote.author = req.body.author;
            await records.updateQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({message: 'Quote not found'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//Send a DELETE request to /quotes/:id DELETE a quote
//Send a GET request to /quotes/quote/random READ (View) a random quote


app.listen(3000, () => console.log('Quote API listening on port 3000!'));