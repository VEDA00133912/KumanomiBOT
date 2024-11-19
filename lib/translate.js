const axios = require('axios');

async function translater(text, source, target) {
  return axios.get('https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec', {
    params: {
      text,
      source,
      target
    }
  }).then(response => {
    return response.data;
  }).catch(error => {
    throw error;
  });
}

module.exports = { translater };
