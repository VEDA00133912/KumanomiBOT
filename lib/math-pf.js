module.exports = function primeFactorization(number) {
    if (isNaN(number) || number <= 1) return '正の整数を入力してください。';
  
    const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    const factors = [];
    
    let n = number;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      let count = 0;
      while (n % i === 0) {
        count++;
        n /= i;
      }
      if (count) factors.push(count > 1 ? `${i}${count.toString().split('').map(d => superscriptDigits[d]).join('')}` : `${i}`);
    }
  
    if (n > 1) factors.push(`${n}`);
    return `**${number}** の素因数分解結果: ${factors.join(' × ')}`;
  };
 