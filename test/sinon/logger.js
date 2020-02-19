class Logger {
  constructor() {
    this.messages = [];
  }

  log(message) {
    if (message === undefined){
      throw new Error("empty message cannot be logged");
    }
    this.messages.push(message);
    // eslint-disable-next-line no-console
    console.log(message);
  }
  messageCount(){
    return 0;//this.messages.length;
  }
}

module.exports = Logger;
