function cleanDomainURL(domain) {
    return domain.replace(/^https?:\/\//, '');
}

module.exports = cleanDomainURL;