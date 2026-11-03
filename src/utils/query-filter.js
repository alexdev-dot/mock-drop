function filterByQueryParams(data, queryParams) {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return data;
  }

  return data.filter(item => {
    return Object.entries(queryParams).every(([param, value]) => {
      const itemValue = item[param];

      if (itemValue === undefined || itemValue === null) {
        return false;
      }

      if (typeof itemValue === 'number') {
        const numValue = parseFloat(value);
        return itemValue === numValue;
      }

      if (typeof itemValue === 'boolean') {
        const boolValue = value.toLowerCase() === 'true';
        return itemValue === boolValue;
      }

      return String(itemValue).toLowerCase() === String(value).toLowerCase();
    });
  });
}

module.exports = { filterByQueryParams };
