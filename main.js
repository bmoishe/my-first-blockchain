const SHA256 = require('crypto-js/sha256')

class Transactions{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block{
  constructor(timestamp, transactions, previousHash = ''){
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }
  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join('0')){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined:" + this.hash);
  }
}



class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock(){
    return new Block("01/01/2018", "Genesis block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

  minePendingTransactions(mineRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block mined Successfully');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transactions(null, mineRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceofAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance
  }

  isChainVailid(){
    for(let i=1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false
      }
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }

    }
    return true;
  }
}

let moisheCoin = new Blockchain();

moisheCoin.createTransaction(new Transactions('ad1', 'ad2', 100));
moisheCoin.createTransaction(new Transactions('ad2', 'ad1', 50))

console.log('\n Starting the miner')
moisheCoin.minePendingTransactions('moishe- address')
console.log('\nBalance of moishe is', moisheCoin.getBalanceofAddress('moishe- address'))

console.log('\n Starting the miner again')
moisheCoin.minePendingTransactions('moishe- address')

console.log('\nBalance of moishe is', moisheCoin.getBalanceofAddress('moishe- address'))
