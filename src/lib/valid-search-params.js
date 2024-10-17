export const validSearchParams = (objValues) => {
  let results = {};

  for (const key in objValues) {
    const value = objValues[key];
    if (value && value.length !== 0) results[key] = value;
  }
  if (Object.keys(results).length === 0) results = undefined;

  return results;
};
