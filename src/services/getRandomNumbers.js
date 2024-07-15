export const getRandomNumbers = () => {
  const firstSet = [];
  while (firstSet.length < 8) {
    const num = Math.floor(Math.random() * 19) + 1;
    if (!firstSet.includes(num)) {
      firstSet.push(num);
    }
  }
  const secondSet = Math.floor(Math.random() * 2) + 1;
  return { firstSet, secondSet };
};
