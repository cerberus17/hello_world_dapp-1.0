const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

const account = '0x9a6d82ef3912d5ab60473124bccd2f2a640769d7'; // Ganache
const privateKey = Buffer.from('70f1384b24df3d2cdaca7974552ec28f055812ca5e4da7a0ccd0ac0f8a4a9b00', 'hex');
const contractAddress = '0x6dd7c1c13df7594c27e0d191fd8cc21efbfc98b4'; // Deployed manually
const abi = [{"constant":true,"inputs":[],"name":"val","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"}],"name":"increment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const contract = new web3.eth.Contract(abi, contractAddress, {
  from: account,
  gasLimit: 3000000,
});

const contractFunction = contract.methods.increment(3);

const functionAbi = contractFunction.encodeABI();

let estimatedGas;
let nonce;

console.log("Getting gas estimate");

contractFunction.estimateGas({from: account}).then((gasAmount) => {
  estimatedGas = gasAmount.toString(16);

  console.log("Estimated gas: " + estimatedGas);

  web3.eth.getTransactionCount(account).then(_nonce => {
    nonce = _nonce.toString(16);

    console.log("Nonce: " + nonce);
    const txParams = {
      gasPrice: '0x09184e72a000',
      gasLimit: 3000000,
      to: contractAddress,
      data: functionAbi,
      from: account,
      nonce: '0x' + nonce
    };

    const tx = new Tx(txParams);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    contract.methods.get().call().then(v => console.log("Value before increment: " + v));

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
      console.log(receipt);
      contract.methods.get().call().then(v => console.log("Value after increment: " + v));
    })
  });
});


