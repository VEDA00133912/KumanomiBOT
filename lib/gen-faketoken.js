function getRandomMemberIds(members, count) {
  return Array.from({ length: count }, () => members.random().id);
}

function generateToken(memberId) {
  const base64Id = Buffer.from(memberId).toString('base64').replace(/=/g, ''); 
  const randomSegment = length => Array.from({ length }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'.charAt(Math.floor(Math.random() * 64))).join('');
  return `${base64Id}.${randomSegment(6)}.${randomSegment(32)}`;
}

function generateTokens(members, count) {
  const memberIds = getRandomMemberIds(members, count);
  return memberIds.map(generateToken);
}

module.exports = { generateTokens };
