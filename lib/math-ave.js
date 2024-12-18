module.exports = function calculateAverage(numbers) {
  const filteredNumbers = numbers.filter(n => n !== null);
  
  if (filteredNumbers.some(isNaN)) {
    return 'すべての数を正しく入力してください。';
  }

  const average = filteredNumbers.reduce((sum, num) => sum + num, 0) / filteredNumbers.length;
  const roundedAverage = average.toFixed(2);

  return `の平均: ${roundedAverage}`;
};
