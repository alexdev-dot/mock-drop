const { parseArguments, validateArguments } = require('../src/cli/arguments');

describe('CLI Arguments', () => {
  describe('parseArguments', () => {
    it('should parse basic arguments', () => {
      const args = ['db.json'];
      const result = parseArguments(args);
      expect(result.jsonFile).toBe('db.json');
      expect(result.port).toBe(3000);
      expect(result.delay).toBe(0);
    });

    it('should parse port argument', () => {
      const args = ['db.json', '--port', '8080'];
      const result = parseArguments(args);
      expect(result.jsonFile).toBe('db.json');
      expect(result.port).toBe(8080);
    });

    it('should parse delay argument', () => {
      const args = ['db.json', '--delay', '500'];
      const result = parseArguments(args);
      expect(result.jsonFile).toBe('db.json');
      expect(result.delay).toBe(500);
    });

    it('should parse both port and delay', () => {
      const args = ['db.json', '--port', '4000', '--delay', '1000'];
      const result = parseArguments(args);
      expect(result.jsonFile).toBe('db.json');
      expect(result.port).toBe(4000);
      expect(result.delay).toBe(1000);
    });

    it('should detect help flag', () => {
      const args = ['--help'];
      const result = parseArguments(args);
      expect(result.help).toBe(true);
    });

    it('should detect version flag', () => {
      const args = ['--version'];
      const result = parseArguments(args);
      expect(result.version).toBe(true);
    });
  });

  describe('validateArguments', () => {
    it('should validate correct arguments', () => {
      const args = {
        jsonFile: 'db.json',
        port: 3000,
        delay: 0,
        help: false,
        version: false
      };
      const errors = validateArguments(args);
      expect(errors).toHaveLength(0);
    });

    it('should return error when no JSON file provided', () => {
      const args = {
        jsonFile: null,
        port: 3000,
        delay: 0,
        help: false,
        version: false
      };
      const errors = validateArguments(args);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('JSON file path');
    });

    it('should validate when help is requested', () => {
      const args = {
        jsonFile: null,
        port: 3000,
        delay: 0,
        help: true,
        version: false
      };
      const errors = validateArguments(args);
      expect(errors).toHaveLength(0);
    });

    it('should validate when version is requested', () => {
      const args = {
        jsonFile: null,
        port: 3000,
        delay: 0,
        help: false,
        version: true
      };
      const errors = validateArguments(args);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid port', () => {
      const args = {
        jsonFile: 'db.json',
        port: 70000,
        delay: 0,
        help: false,
        version: false
      };
      const errors = validateArguments(args);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('port');
    });

    it('should reject negative delay', () => {
      const args = {
        jsonFile: 'db.json',
        port: 3000,
        delay: -100,
        help: false,
        version: false
      };
      const errors = validateArguments(args);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('delay');
    });
  });
});
