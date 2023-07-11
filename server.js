const express = require('express');
const cors = require('cors');
const JishoAPI = require('unofficial-jisho-api');

const jisho = new JishoAPI();

const app = express();
app.use(cors());

const scrapeForPhrase = async (word) => {
  return await jisho.scrapeForPhrase(word);
}

app.get('/search/:word', async (req, res) => {
    try {
        const word = req.params.word;
        const wordData = await scrapeForPhrase(word);
        const wordResult = extractData(wordData);
        res.json(wordResult);

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('An error occurred while searching for the word.');
    }
});


app.get('/', async (req, res) => {
  res.send('Hello')
});

function extractData(data) {
    const result = {};

    // Extract required fields from top level
    result.found = data.found;
    result.tags = data.tags;
    result.audio = data.audio?.[0]?.uri;

    // Extract required fields from meanings
    result.meanings = data.meanings.map(meaning => {
        return {
            definition: meaning.definition,
            english: meaning.sentences.map(sentence => sentence.english),
            japanese: meaning.sentences.map(sentence => sentence.japanese),
            pieces: meaning.sentences.map(sentence => sentence.pieces),
        };
    });

    return result;
}




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
