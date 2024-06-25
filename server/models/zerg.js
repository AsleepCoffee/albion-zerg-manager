// server/models/zerg.js

class Zerg {
    constructor(name, comp, caller, hammers, sets) {
      this.name = name;
      this.comp = comp;
      this.caller = caller;
      this.hammers = hammers;
      this.sets = sets;
    }
  }
  
  module.exports = Zerg;
  