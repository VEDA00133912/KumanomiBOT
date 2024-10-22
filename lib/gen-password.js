module.exports = function generatePasswords(length, count) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    
    const generatePassword = (length) => {
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    };

    const passwords = [];
    for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(length));
    }

    return passwords;
};
