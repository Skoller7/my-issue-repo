pragma solidity ^0.4.17;


contract DataContractCreator {
    address[]public deployedDataContracts; //alle gemaakte adressen opslaan.

    //maakt persoonlijke contracten per gebruiker.
    function createDataContract(uint price) public {
        address newDataContract = new DataContract(price, msg.sender);
        deployedDataContracts.push(newDataContract);
    }

    function getDeployedContracts() public view returns(address[])  {
      return deployedDataContracts;
    }
}


contract DataContract {

    //contract variables.
    address public dataSeller;
    uint public buyersCount = 0;
    uint public priceOfData;
    mapping(address => bool) public backers; //mapps ipv array -> veel goedkoper.


    constructor(uint price, address creator) public {
        dataSeller = creator; //omdat dit contract door een ander contract wordt gemaakt. Creator meegeven
        priceOfData = price; //verkoopprijs
    }

    modifier restricted(){
        require(msg.sender == dataSeller);
        _;
    }

    //get users address -> zodat deze persoon de prijs kan veranderen.
    function changePrice(uint newPrice) public restricted{
        priceOfData = newPrice; //prijs nog aanpassen naar ether ipv WEI.
    }

    function createBuyRequest() public payable {
        require(msg.value >= priceOfData); //voert deze functie enkels als het voldoet aan de require

        backers[msg.sender] = true;
        buyersCount++;
    }
    function getPrice() public view returns(uint){
      return priceOfData;
    }

    function getBuyersCount() public view returns(uint){
      return buyersCount;
    }

}
