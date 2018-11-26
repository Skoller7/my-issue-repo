var DataContractCreator = artifacts.require("DataContractCreator");
var DataContract = artifacts.require("DataContract");

// module.exports = function(deployer){
//   deployer.deploy(DataContractCreator);
// }

//double deploy uncomment this
// module.exports = function(deployer) {
//   deployer.deploy(DataContractCreator).then(function(){
//         return deployer.deploy(DataContract, 500, DataContractCreator.address)
// });
// };

module.exports = function(deployer){
  deployer.deploy(DataContractCreator).then(function(){
    return deployer.deploy(DataContract, 500, DataContractCreator.address)
  });
};


// //only dataContract deploy
// module.exports = function(deployer) {
//   deployer.deploy(DataContract(500, ));
// };

// Is it also possible to let another contract deploy a new other contract
// So it can store the created contracts in an array
