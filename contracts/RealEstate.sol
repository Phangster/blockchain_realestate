pragma solidity >=0.4.21 <0.7.0;

import "./SafeMath.sol";

contract RealEstate {

  using SafeMath for uint256;

  struct Property{
    address ownerAddress;
    string  location;
    uint    ID;
    uint    cost;
    uint    state;
  }

  uint idCounter;
  address public owner;  

  constructor() public{
    owner = msg.sender;
    idCounter = 0;
  }

  mapping (address => Property[]) public property;

  event AddProperty(address _owner, uint _landIdx);
  event TransferProperty(address indexed _from, address indexed _to, uint _landIdx);

  modifier checkIfAmountEnough(uint cost) {
    require(msg.value >= (cost)*1e18);
    _;
  }

  function _createProperty(string memory location, uint cost) public payable {
    require(msg.sender == owner);
    uint state = 0;
    idCounter = idCounter.add(1);
      Property memory myProperty = Property(
          {
              ownerAddress: msg.sender,
              location: location,
              ID: idCounter,
              cost: cost,
              state: state
              
          });
      property[msg.sender].push(myProperty);
      emit AddProperty(msg.sender, idCounter);
  }

  function _getPropertyDetails(address landOwner, uint propertyID) public view returns (address, string memory, uint, uint){
    return( 
      property[landOwner][propertyID].ownerAddress,
      property[landOwner][propertyID].location, 
      property[landOwner][propertyID].ID, 
      property[landOwner][propertyID].cost);
  }

  function _transferProperty(address payable _buyer, uint propertyID) public payable checkIfAmountEnough(property[msg.sender][propertyID].cost) returns (bool){
    require(msg.sender == owner);
    uint state = 1;
    for(uint i=0; i<(property[msg.sender].length); i++) {
      if(property[msg.sender][i].ID == propertyID) {
        Property memory myProperty = Property({
          ownerAddress: _buyer,
          location: property[msg.sender][i].location,
          cost: property[msg.sender][i].cost,
          ID: propertyID,
          state: state
        });
        property[_buyer].push(myProperty);   
        
        //remove land from current ownerAddress
        delete property[msg.sender][i];

        emit TransferProperty(msg.sender, _buyer, propertyID);                
        _buyer.transfer((property[msg.sender][i].cost)*1e18);
        return true;
      }
    }
    return false;
  }
}
