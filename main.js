const SHA256 = require('crypto-js/sha256')
class Block{
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}



class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }
  createGenesisBlock(){
    return new Block(0, "01/01/2018", "Genesis block", "0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock);
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

moisheCoin.addBlock(new Block(1, "11/01/2018", { amount: 4 }));
moisheCoin.addBlock(new Block(1, "26/01/2018", { amount: 10 }));
console.log("is this valid? " + moisheCoin.isChainVailid())

moisheCoin.chain[1].data = {amount: 100}
moisheCoin.chain[1].hash = moisheCoin.chain[1].calculateHash();
console.log("is this valid? " + moisheCoin.isChainVailid())


// console.log(JSON.stringify(moisheCoin, null, 4));
