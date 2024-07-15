export const checkResult = (generated, selected) => {
  const firstMatchCount = selected.firstField.filter((num) =>
    generated.firstSet.includes(num)
  ).length;

  const secondMatch = selected.secondField === generated.secondSet;

  return firstMatchCount >= 4 || (firstMatchCount >= 3 && secondMatch);
};
