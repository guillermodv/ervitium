const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAdress, toAddress, amount) {
    this.fromAdress = fromAdress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.seed = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        this.previousHash +
        JSON.stringify(this.transactions) +
        this.seed
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
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  createGenesisBlock() {
    return new Block(new Date(), [], "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLastBlock().hash;
  //   newBlock.findBlock(this.dificult);
  //   this.chain.push(newBlock);
  // }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(minerAddress) {
    let block = new Block(new Date(), this.pendingTransactions);

    block.previousHash = this.getLastBlock().hash;
    block.findBlock(this.dificult);

    console.log("New Block has been mined");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward),
    ];
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAdress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
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
// console.log("Mining block");
// ervitium.addBlock(new Block(new Date(), { quantity: 10 }));
// console.log("Mining block");
// ervitium.addBlock(new Block(new Date(), { quantity: 2 }));
// console.log("Mining block");
// ervitium.addBlock(new Block(new Date(), { quantity: 1 }));
// console.log("Mining block");
// ervitium.addBlock(new Block(new Date(), { quantity: 1 }));

ervitium.addTransaction(new Transaction("000xErvity", "000xChicho", 100));
ervitium.addTransaction(new Transaction("000xJuan", "000xChicho", 100));
ervitium.addTransaction(new Transaction("000xMaxy", "000xChicho", 50));

console.log("starting mining");
ervitium.minePendingTransactions("000xMiner");

console.log(JSON.stringify(ervitium, null, 4));

console.log(
  "Balance de 000xChicho:",
  ervitium.getBalanceOfAddress("000xChicho")
);
console.log("Balance de 000xMiner:", ervitium.getBalanceOfAddress("000xMiner"));

console.log("Finished...");

console.log(ervitium.validateChain());
