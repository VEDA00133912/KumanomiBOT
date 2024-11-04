const crypto = require('crypto');

module.exports = function generatePasswords(length, count) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const passwords = [];

    const generatePassword = (length) => {
        let password = '';
        const randomBytes = crypto.randomBytes(length);

        for (let i = 0; i < length; i++) {
            const randomIndex = randomBytes[i] % chars.length;
            password += chars[randomIndex];
        }

        return password;
    };

    for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(length));
    }

    return passwords;
};
