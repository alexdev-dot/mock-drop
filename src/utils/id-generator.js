function generateId(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 1;
  }
  const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
  return maxId + 1;
}

module.exports = { generateId };
