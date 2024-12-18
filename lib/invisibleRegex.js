function removeInvisibleCharacters(text) {
    return text.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
}

module.exports = { removeInvisibleCharacters };
