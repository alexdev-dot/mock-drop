class DataStore {
  constructor() {
    this.data = null;
  }

  setData(newData) {
    this.data = newData;
  }

  getData() {
    return this.data;
  }

  getResource(resourceName) {
    if (!this.data) {
      return null;
    }
    return this.data[resourceName] || null;
  }

  hasResource(resourceName) {
    if (!this.data) {
      return false;
    }
    return resourceName in this.data;
  }

  findItem(resourceName, id) {
    const resource = this.getResource(resourceName);
    if (!resource || !Array.isArray(resource)) {
      return null;
    }
    return resource.find(item => item.id === id) || null;
  }

  findItemIndex(resourceName, id) {
    const resource = this.getResource(resourceName);
    if (!resource || !Array.isArray(resource)) {
      return -1;
    }
    return resource.findIndex(item => item.id === id);
  }

  addItem(resourceName, item) {
    const resource = this.getResource(resourceName);
    if (!resource || !Array.isArray(resource)) {
      return false;
    }
    resource.push(item);
    return true;
  }

  updateItem(resourceName, index, item) {
    const resource = this.getResource(resourceName);
    if (!resource || !Array.isArray(resource) || index < 0 || index >= resource.length) {
      return false;
    }
    resource[index] = item;
    return true;
  }

  deleteItem(resourceName, index) {
    const resource = this.getResource(resourceName);
    if (!resource || !Array.isArray(resource) || index < 0 || index >= resource.length) {
      return null;
    }
    return resource.splice(index, 1)[0];
  }

  getResourceNames() {
    if (!this.data) {
      return [];
    }
    return Object.keys(this.data);
  }
}

module.exports = { DataStore };
