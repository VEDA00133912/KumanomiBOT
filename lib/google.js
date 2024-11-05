const axios = require('axios');
const cheerio = require('cheerio');

async function googleSearch(query) {
    const searchUrl = `https://www.google.co.jp/search?q=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const $ = cheerio.load(data);
    const searchResults = [];
    
    $('div.g').each((i, elem) => {
        if (i >= 5) return;

        const title = $(elem).find('h3').text();
        const link = $(elem).find('a').attr('href');
        
        if (title && link) {
            searchResults.push({ title, link });
        }
    });

    return searchResults;
}

module.exports = googleSearch;
