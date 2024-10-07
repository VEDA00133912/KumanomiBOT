module.exports = {
    extractVanity: (url) => {
        const vanityRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|com|app\.com)\/invite\/|discord\.gg\/)([A-Za-z0-9-]+)/;
        const match = url.match(vanityRegex);
        if (match) {
            return match[5]; 
        }
        return null;
    }
};