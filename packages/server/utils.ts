export default class myUtils {
  static clientArr = [];
  static IdIndex(id) {
    for (let i = 0; i < this.clientArr.length; i++) {
      if (this.clientArr[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  static getClientById(id) {
    for (const client of window.clientArr) {
      if (client["id"] == id) {
        return client;
      }
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getClientArr(id) {
    null;
  }
}

// module.exports = myUtils;
