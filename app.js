const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, data, previousHash) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.seed = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp + this.previousHash + JSON.stringify(this.data) + this.seed
    ).toString();
  }

  findBlock(dificult) {
    while (this.hash.substring(0, dificult) !== Array(dificult + 1).join("0")) {
      this.seed++;
      this.hash = this.calculateHash();
    }
    console.log("New BlockOn : " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.dificult = 3;
  }

  createGenesisBlock() {
    return new Block(new Date(), "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.findBlock(this.dificult);
    this.chain.push(newBlock);
  }

  validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const preBlock = this.chain[i - 1];

      if (block.hash != block.calculateHash()) {
        return false;
      }
      if (block.previousHash != preBlock.hash) {
        return false;
      }
      return true;
    }
  }
}

let ervitium = new BlockChain();
console.log("Mining block");
ervitium.addBlock(new Block(new Date(), { quantity: 10 }));
console.log("Mining block");
ervitium.addBlock(new Block(new Date(), { quantity: 2 }));
console.log("Mining block");
ervitium.addBlock(new Block(new Date(), { quantity: 1 }));
console.log("Mining block");
ervitium.addBlock(new Block(new Date(), { quantity: 1 }));
console.log("Finished...");

console.log(JSON.stringify(ervitium, null, 4));
console.log(ervitium.validateChain());
