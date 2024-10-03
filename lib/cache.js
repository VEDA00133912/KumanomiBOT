const fs = require('fs').promises;
const path = require('path');

class Cache {
    static async loadFiles(directory) {
        const files = await fs.readdir(directory);
        const promises = files
            .filter(file => file.endsWith('.js'))
            .map(async (file) => {
                const filePath = path.join(directory, file);
                return require(filePath);
            });
        return Promise.all(promises);
    }
}

module.exports = Cache;
