const axios = require('axios');

async function translater(text, source, target) {
  return axios.get('https://script.google.com/macros/s/AKfycbyZzeACcCpM2PNgoYN1jg64CTzZcXCx-xYHp9WC6yNQYdrCmyYcER-_vR8A-D2Epvok_w/exec', {
    params: {
      text,
      source,
      target
    }
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw error;
  });
}

module.exports = { translater };