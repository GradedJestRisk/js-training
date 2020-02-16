class Logger {
  constructor() {
    this.messages = [];
  }

  log(message) {
    this.messages.push(message);
    // eslint-disable-next-line no-console
    console.log(message);
  }
}

module.exports = Logger;
