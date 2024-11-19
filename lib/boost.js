// lib/boost.js

module.exports.getBoostLevel = (count) => {
  if (count >= 14) {
    return 3;
  } else if (count >= 7) {
    return 2;
  } else if (count >= 2) {
    return 1;
  } else {
    return 0;
  }
};
