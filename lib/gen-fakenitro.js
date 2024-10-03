function generateNitroLinks(quantity, type) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nitroLinks = [];

  for (let j = 0; j < quantity; j++) {
      let code = Array.from({ length: type === 'nitro' ? 16 : 24 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

      if (type === 'promo') {
          code = code.match(/.{1,4}/g).join('-');
      }

      const baseUrl = type === 'nitro' ? 'https://discord.gift/' : 'https://discord.com/billing/promotions/';
      nitroLinks.push(`${baseUrl}${code}`);
  }
  return nitroLinks;
}

module.exports = { generateNitroLinks };
