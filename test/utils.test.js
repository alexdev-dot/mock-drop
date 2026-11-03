const { loadJsonFile } = require('../src/utils/json-loader');
const { generateId } = require('../src/utils/id-generator');
const { filterByQueryParams } = require('../src/utils/query-filter');
const { DataStore } = require('../src/utils/data-store');
const fs = require('fs');
const path = require('path');

describe('Utils', () => {
  describe('loadJsonFile', () => {
    const testJsonPath = path.join(__dirname, 'test-utils-data.json');

    beforeEach(() => {
      const testData = { users: [{ id: 1, name: 'Alice' }] };
      fs.writeFileSync(testJsonPath, JSON.stringify(testData, null, 2));
    });

    afterEach(() => {
      if (fs.existsSync(testJsonPath)) {
        fs.unlinkSync(testJsonPath);
      }
    });

    it('should load valid JSON file', () => {
      const result = loadJsonFile(testJsonPath);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.users).toHaveLength(1);
    });

    it('should return error for non-existent file', () => {
      const result = loadJsonFile('nonexistent.json');
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should return error for invalid JSON', () => {
      fs.writeFileSync(testJsonPath, '{ invalid json }');
      const result = loadJsonFile(testJsonPath);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });
  });

  describe('generateId', () => {
    it('should generate ID 1 for empty array', () => {
      const id = generateId([]);
      expect(id).toBe(1);
    });

    it('should generate ID based on max existing ID', () => {
      const items = [{ id: 1 }, { id: 3 }, { id: 5 }];
      const id = generateId(items);
      expect(id).toBe(6);
    });

    it('should handle items without ID', () => {
      const items = [{ name: 'A' }, { name: 'B' }];
      const id = generateId(items);
      expect(id).toBe(1);
    });
  });

  describe('filterByQueryParams', () => {
    const data = [
      { id: 1, name: 'Alice', age: 25, active: true },
      { id: 2, name: 'Bob', age: 30, active: false },
      { id: 3, name: 'Charlie', age: 25, active: true }
    ];

    it('should return all data when no query params', () => {
      const result = filterByQueryParams(data, {});
      expect(result).toHaveLength(3);
    });

    it('should filter by string field (case-insensitive)', () => {
      const result = filterByQueryParams(data, { name: 'alice' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should filter by number field', () => {
      const result = filterByQueryParams(data, { age: '25' });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.age === 25)).toBe(true);
    });

    it('should filter by boolean field', () => {
      const result = filterByQueryParams(data, { active: 'true' });
      expect(result).toHaveLength(2);
      expect(result.every(item => item.active === true)).toBe(true);
    });

    it('should filter by multiple parameters', () => {
      const result = filterByQueryParams(data, { name: 'Alice', age: '25' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
      expect(result[0].age).toBe(25);
    });

    it('should return empty array when no matches', () => {
      const result = filterByQueryParams(data, { name: 'NonExistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('DataStore', () => {
    let dataStore;

    beforeEach(() => {
      dataStore = new DataStore();
      dataStore.setData({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ],
        posts: [{ id: 101, title: 'Hello' }]
      });
    });

    it('should get resource', () => {
      const users = dataStore.getResource('users');
      expect(users).toHaveLength(2);
    });

    it('should check if resource exists', () => {
      expect(dataStore.hasResource('users')).toBe(true);
      expect(dataStore.hasResource('nonexistent')).toBe(false);
    });

    it('should find item by ID', () => {
      const item = dataStore.findItem('users', 1);
      expect(item).toBeDefined();
      expect(item.name).toBe('Alice');
    });

    it('should return null for non-existent item', () => {
      const item = dataStore.findItem('users', 999);
      expect(item).toBeNull();
    });

    it('should find item index', () => {
      const index = dataStore.findItemIndex('users', 1);
      expect(index).toBe(0);
    });

    it('should add item', () => {
      const newItem = { id: 3, name: 'Charlie' };
      const success = dataStore.addItem('users', newItem);
      expect(success).toBe(true);
      expect(dataStore.getResource('users')).toHaveLength(3);
    });

    it('should update item', () => {
      const updatedItem = { id: 1, name: 'Alice Updated' };
      const success = dataStore.updateItem('users', 0, updatedItem);
      expect(success).toBe(true);
      expect(dataStore.getResource('users')[0].name).toBe('Alice Updated');
    });

    it('should delete item', () => {
      const deleted = dataStore.deleteItem('users', 0);
      expect(deleted).toBeDefined();
      expect(deleted.name).toBe('Alice');
      expect(dataStore.getResource('users')).toHaveLength(1);
    });

    it('should get resource names', () => {
      const names = dataStore.getResourceNames();
      expect(names).toEqual(['users', 'posts']);
    });
  });
});
