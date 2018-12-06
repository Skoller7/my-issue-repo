App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function(){

    if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  // else if (window.web3) {
  //   //App.web3Provider = window.web3.currentProvider;
  // }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(App.web3Provider);
    return App.initContract1();
  },

initContract1: function(){
  $.getJSON('./Solidity/build/contracts/DataContractCreator.json').then(DataCreatorArtifact => {
    App.contracts.DataContractCreator = TruffleContract(DataCreatorArtifact);
    App.contracts.DataContractCreator.setProvider(App.web3Provider);
    return $.getJSON('./Solidity/build/contracts/DataContract.json')
  }).then(DataContractArtifact => {
    App.contracts.DataContract = TruffleContract(DataContractArtifact);
    App.contracts.DataContract.setProvider(App.web3Provider);
    console.log(App.getDeployedContractAdresses())
    console.log(App.contracts);
  })
},
createBuyRequest: function(){

  web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }
  var gas = 2000000;
  var account = accounts[1];
  App.contracts.DataContract.deployed().then(instance => {
    instance.createBuyRequest({from: account, gas, value: 1000000 }).then((r) => {
      console.log("buy request completed");
      $('#buying-succes').text("You succesfully bought the data!");
    })
  })
})
},

getDeployedContractAdresses: function(){
  App.contracts.DataContractCreator.deployed().then(instance => {
    return instance.getDeployedContracts.call()
  }).then(deployedContracts => {
    console.log("requested amount of deployed contracts:", deployedContracts.length)
    $('#amountOfContracts').text(deployedContracts.length);
  })
},

createNewContract : function(){
  console.log('creating new contract. . .');
  //checking the user accounts.
  web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }
   var gas = 1000000;
   var account = accounts[0];
   //adress verandere hier bij nieuwe ganacha load 0x6fea428ed5b5b4804572a0df7766b71f68a44da8
    App.contracts.DataContractCreator.deployed().then(function(instance){
    DataContractCreatorInstance = instance;
    console.log(web3.eth.getBalance(account)); //check balance?
    DataContractCreatorInstance.createDataContract(1500, {from: account, gas}).then((r) =>
     { console.log('deployment is succesfull');
      $('#contractSucces').text('succes');
      console.log(App.requestAdresses());
     });
  //  DataContractInstance.createDataContract(500, account);
  });
});
},
requestPrice: function(){

  App.contracts.DataContract.deployed().then(function(instance){
    return instance.getPrice.call()
  }).then(priceOfData => {
    console.log("Succesfully retrieved price of data :", priceOfData);
    $('#contractPrice').text(priceOfData);
  })
},
requestAdresses: function(){

  App.contracts.DataContractCreator.deployed().then(function(instance){
    DataContractCreatorInstance = instance;
    console.log(DataContractCreatorInstance);

    DataContractCreatorInstance.getDeployedContracts.call().then(function(result){
      console.log(result);
      $('#contract-addresses').text(result);
        return result;
    }).catch(function(err){
      console.log(err);
    });
  });

},

//can comment away from here ( written on train not tested)

requestBuyersCount: function(){

  App.contracts.DataContract.deployed().then(function(instance){
    DataContractInstance = instance;

    DataContractInstance.getBuyersCount.call().then(function(result){
      $('#buyers').text(result);
      //$('buyersCount').text(result);
    }).catch(function(err){
      console.log(err);
    });
  });
},
//
  isUserBacker: function(){

    App.contracts.DataContract.deployed().then(function(instance){
      DataContractInstance = instance;

        web3.eth.getAccounts(function(error, accounts) {
          var account = accounts[0];
      DataContractInstance.backers.call(account).then(function(r){
        if(r === true)
          console.log('Person is a backer');
        else $('#isBacker').text('User is not a backer');
      }).catch(function(err){
        console.log(err);
      });
    });
  })
  },
//
  changeDataContractPrice: function(){

    App.contracts.Datacontract.deployed().then(function(instance){
      DataContractInstance = instance;

      DataContractInstance.changePrice(1500).send().then(function(r){
        console.log(r);
      }).catch(function(err){
        console.log(err);
      });
    });
  }

  //tot hier


}

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});

$('.btn-create-contract-request').click(function(){
   App.getDeployedContractAdresses();
});

$('.btn-create-contract').click(function(){
   App.createNewContract();
});

$('.btn-contract-price').click(function(){
  console.log("price request clicked");
   App.requestPrice();
});

$('.btn-contract-buyers').click(function(){
  console.log("amount of buyers clicked");
  App.requestBuyersCount();
});

$('.btn-contract-isBacker').click(function(){
  console.log("is user a backer? clicked");
  App.isUserBacker();
});

$('.btn-contract-buy').click(function(){
  console.log("buy contract clicked");
  App.createBuyRequest();
});

$('.btn-contract-addresses').click(function(){
  console.log('requesting adresses....');
  App.requestAdresses();
})




//$(document).on('click', '.btn-create', App.createContract);
