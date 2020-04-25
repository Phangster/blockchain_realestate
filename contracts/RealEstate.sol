pragma solidity >=0.4.21 <0.7.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract RealEstate is Ownable {

  using SafeMath for uint256;

  struct Property{
    string  location;
    uint    ID;
    uint    cost;
    uint    state;
  }

  Property[] public property;

  uint idCounter = 0;
  mapping (uint => address) public propertyToOwner;
  mapping (address => uint) ownerPropertyCount;

  modifier onlyOwnerOf(uint _propertyId) {
    require(msg.sender == propertyToOwner[_propertyId]);
    _;
  }

  function _createProperty(string memory _location, uint _cost) public {
    uint state = 0;
    idCounter = idCounter.add(1);
    uint id = property.push(Property(_location, idCounter, _cost, state)) + 1;
    propertyToOwner[id] = msg.sender;
    ownerPropertyCount[msg.sender] = ownerPropertyCount[msg.sender].add(1);
  }


  // function _getOwnersProperty(address _landHolder, uint _idx) public view returns (string memory, uint, uint ,uint) {
  //   return (
  //     property[_landHolder][_idx].location,
  //     property[_landHolder][_idx].ID,
  //     property[_landHolder][_idx].cost,
  //     property[_landHolder][_idx].state,
  //   );
  // }
}
