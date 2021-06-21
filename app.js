const express = require('express');
const app = express();

const records = require('./records');

//Rather than adding a try catch block to every single call, this asyncHandler is created to allow the route to just call this function and handle all errors; example on post.quotes and put.quotes.:id routes.
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
  }

app.use(express.json());

//Send a GET request to /quotes READ a list of quotes
app.get('/quotes', async (req, res) => {
    try{
        const quotes = await records.getQuotes();
        res.json(quotes);
    }catch(err) {
        res.json({message: err.message});
    }
})

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
})

//Send a POST request to /quotes CREATE a new quote
// app.post('/quotes', async (req, res) => {
//     try{
//         if(req.body.author && req.body.quote) {
//             const newQuote = await records.createQuote({
//                 quote: req.body.quote,
//                 author: req.body.author
//             });
//             res.status(201).json(newQuote);
//         } else {
//             res.status(400).json({message: "Quote and author required."});
//         }
//     }catch(err) {
//         res.status(500).json({message: err.message});
//     }
// })

app.post('/quotes', asyncHandler(async (req, res) => {
    if(req.body.author && req.body.quote) {
        const newQuote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(newQuote);
    } else {
        res.status(400).json({message: "Quote and author required."});
    }
}));

//Send a PUT request to /quotes/:id UPDATE (edit) a quote
app.put('/quotes/:id', asyncHandler(async(req, res) => {
    const quote = await records.getQuote(req.params.id);
    if(quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;
        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({message: 'Quote not found'});
    }
}));

//Send a DELETE request to /quotes/:id DELETE a quote
app.delete('/quotes/:id', async(req, res) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if(quote) {
            await records.deleteQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({message: 'Quote not found'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//Send a GET request to /quotes/quote/random READ (View) a random quote


//This middleware is put at the end to handle any errors after all routes above have been handled.
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
})

app.listen(3000, () => console.log('Quote API listening on port 3000!'));