const express = require('express');
const router = express.Router();
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

//Send a GET request to /quotes READ a list of quotes
router.get('/quotes', async (req, res) => {
    try{
        const quotes = await records.getQuotes();
        res.json(quotes);
    }catch(err) {
        res.json({message: err.message});
    }
})

//Send a GET request to /quotes/:id READ (View) a quote
router.get('/quotes/:id', async (req, res) => {
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

//Send a GET request to /quotes/quote/random READ (View) a random quote
router.get('/quotes/quote/random', asyncHandler(async (req, res, next) => {
    const ranQuote = await records.getRandomQuote();
    res.json(ranQuote);
}));

//Send a POST request to /quotes CREATE a new quote
// router.post('/quotes', async (req, res) => {
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

router.post('/quotes', asyncHandler(async (req, res) => {
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
router.put('/quotes/:id', asyncHandler(async(req, res) => {
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
router.delete('/quotes/:id', async(req, res) => {
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


module.exports = router;