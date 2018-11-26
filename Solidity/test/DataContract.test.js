//Could be that this file does not work -> created via react.js try the react version
//To test the contract and this test code.
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledDataContractCreator = require('../build/DataContractCreator.json');
const compiledDataContract = require('../build/DataContract.json');

let accounts;
let creator;
let dataContractAddress;
let dataContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  creator = await new web3.eth.Contract(JSON.parse(compiledDataContractCreator.interface))
.deploy({data: compiledDataContractCreator.bytecode})
.send({ from: accounts[0], gas:'1000000'});

//accounts[0] is hier de creator van het contract.
await creator.methods.createDataContract('100').send({
  from: accounts[0],
  gas: '1000000'
});

[dataContractAddress] = await creator.methods.getDeployedContracts().call();
//dataContractAddress = addresses[0];

dataContract = await new web3.eth.Contract(
  JSON.parse(compiledDataContract.interface),
  dataContractAddress);
});

//does the deploy work?
describe('DataContracts', () => {
  it('deploys a Contract creator and a dataContract', () => {
    assert.ok(creator.options.address);
    assert.ok(dataContract.options.address);
  });

  it('marks caller as the contract manager', async () => {
    const manager = await dataContract.methods.dataSeller().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as buyers', async () => {
    await dataContract.methods.createBuyRequest().send({
      value: '200',
      from: accounts[1] //ganache generates 10 accounts for testing. (different addresses).
    });
  const isBuyer = await dataContract.methods.backers(accounts[1]).call();
  assert(isBuyer); //is hij een contributor geworden?
  });

  it('requires a minimum amount to buy', async () =>{
    try {
      await dataContract.methods.contribute().send({
        value: '5', //has to be 100.
        from: accounts[2]
      });
      assert(false);
    }catch (err) {
      assert(err);
    }
  });
});
