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

  $.getJSON('./Solidity/build/contracts/DataContractCreator.json', function(data){
    console.log(data);
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var DataCreatorArtifact = data;
    App.contracts.DataContractCreator = TruffleContract(DataCreatorArtifact);
    //set the provider for our contracts
    App.contracts.DataContractCreator.setProvider(App.web3Provider);
        console.log(App.contracts.DataContractCreator);
    //hier nieuwe functies aan chainen als we willen dat die worden geladen bij het begin
    //van de pagina.
  }),

  $.getJSON('./Solidity/build/contracts/DataContract.json', function(data){
    console.log(data);
    var DataContractArtifact = data;
    App.contracts.DataContract = TruffleContract(DataContractArtifact);
    console.log(App.contracts.DataContract);
    App.contracts.DataContract.setProvider(App.web3Provider);
      return App.getDeployedContractAdresses();
  });
  console.log(App.contracts.DataContract);
},

getDeployedContractAdresses: function(){
  //vars hier
  App.contracts.DataContractCreator.at('0xe08bd3d15b00490d4dbfed3fbe33c6a6c8ce5878').then(function(instance){
    DataContractCreatorInstance = instance;
    DataContractCreatorInstance.getDeployedContracts.call().then((r) => {
   $('#amountOfContracts').text(r.length);
   console.log("requested amount of deployed contracts");
 });
});
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
    App.contracts.DataContractCreator.at('0xe08bd3d15b00490d4dbfed3fbe33c6a6c8ce5878').then(function(instance){
    DataContractCreatorInstance = instance;
    console.log(web3.eth.getBalance(account)); //check balance?
    DataContractCreatorInstance.createDataContract(1500, {from: account, gas}).then((r) =>
     { console.log('deployment is succesfull');
      $('contractSucces').text('succes');
      console.log(App.requestAdresses());
     });
  //  DataContractInstance.createDataContract(500, account);
  });
});
},
requestPrice: function(){
  //hier zullen we de functie nog moeten meegeven van Het
  //contract dat getoond wordt, momenteel nog niet mogelijke
  //tot ik zelf accs kan aanmaken.
  // console.log("datacontract isDeployed = ");
  // console.log(App.contracts.DataContractCreator.isDeployed());
  App.contracts.DataContract.at('0xa1ace1bbc2c437ffd60da9b3f7e25d16dfaebc86').then(function(instance){
  DataContractInstance = instance;
  console.log(DataContractInstance);
//  DataContractinstance = DataContractI.at("0x8737a42306d1b59169a7fc54c286b596e5eafbcb");

  DataContractInstance.PriceOfData.call().then(function(result){
    console.log(result);
    $('#contractPrice').text(result);
  }).catch(function(err){
    console.log(err);
  });
});
},
requestAdresses: function(){

  App.contracts.DataContractCreator.at('0xe08bd3d15b00490d4dbfed3fbe33c6a6c8ce5878').then(function(instance){
    DataContractCreatorInstance = instance;
    console.log(DataContractCreatorInstance);

    DataContractCreatorInstance.getDeployedContracts.call().then(function(result){
      console.log(result);
      $('contract-addresses').text(result);
        return result;
    }).catch(function(err){
      console.log(err);
    });
  });

},

//can comment away from here ( written on train not tested)

// requestBuyersCount: function(){
//
//   App.contracts.DataContract.at('').then(function(instance){
//     DataContractInstance = instance;
//
//     DataContractInstance.buyersCount.call().then(function(){
//       console.log(result);
//       //$('buyersCount').text(result);
//     }).catch(function(err){
//       console.log(err);
//     });
//   });
// },
//
//   isUserBacker: function(){
//
//     App.contracts.DataContract.at('').then(function(instance){
//       DataContractInstance = instance;
//
//       DataContractInstance.backers.call(msg.sender).then(function(r){
//         if(r === true)
//           console.log('Person is a backeer');
//         else console.log('Person is not a backer');
//       }).catch(function(err){
//         console.log(err);
//       });
//     });
//   },
//
//   createBuyRequest: function(){
//
//     App.contracts.Datacontract.at('').then(function(instance){
//       DataContractInstance = instance;
//
//       //hier price of data functie oproepen - klopt de requestbuy()? or gebeurt dit in send?
//       DataContractInstance.createBuyRequest.send(requestPrice()).then(function(r){
//         console.log(r);
//       }).catch(function(err){
//         console.log(err);
//       });
//     });
//   },
//
//   changeDataContractPrice: function(){
//
//     App.contracts.Datacontract.at('').then(function(instance){
//       DataContractInstance = instance;
//
//       DataContractInstance.changePrice(1500).send().then(function(r){
//         console.log(r);
//       }).catch(function(err){
//         console.log(err);
//       });
//     });
//   }

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

$('btn-contract-buyers').click(function(){
  console.log("amount of buyers clicked");
  App.requestBuyersCount();
});

$('btn-contract-isBacker').click(function(){
  console.log("is user a backer? clicked");
  App.isUserBacker();
});

$('btn-contract-buy').click(function(){
  console.log("buy contract clicked");
  App.createBuyRequest();
});

$('btn-contract-addresses').click(function(){
  console.log('requesting adresses....');
  App.requestAdresses();
})



//$(document).on('click', '.btn-create', App.createContract);
