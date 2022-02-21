const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, data, previousHash) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.timestamp + this.previousHash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(new Date(), "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.hash = newBlock.calculateHash();
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
ervitium.addBlock(new Block(new Date(), { quantity: 10 }));
ervitium.addBlock(new Block(new Date(), { quantity: 2 }));
ervitium.addBlock(new Block(new Date(), { quantity: 1 }));
ervitium.addBlock(new Block(new Date(), { quantity: 1 }));

console.log(JSON.stringify(ervitium, null, 4));
console.log(ervitium.validateChain());
