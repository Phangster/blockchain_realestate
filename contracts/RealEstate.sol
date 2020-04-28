pragma solidity >=0.4.21 <0.7.0;

import "./SafeMath.sol";
import "./Ownable.sol";

contract RealEstate is Ownable {

    using SafeMath for uint256;

    struct Asset {
        address ownerAddress;
        address prevAddress;
        string  location;
        uint    ID;
        uint    cost;
        uint    state;
    }

    uint idCounter;
    address prevAdd;
    address public owner;  

    constructor() public{
        owner = msg.sender;
        idCounter = 0;
    }
  
    event AddAsset(address _owner, uint _AssetID);
    event TransferAsset(address indexed _from, address indexed _to, uint _AssetID);

    mapping (address => Asset[]) public property;
    mapping (address => uint) ownerPropertyCount;

    mapping (address => uint) private balances;

    function getBalance() public view returns (uint) {
        /* Get the balance of the sender of this transaction */
        return balances[msg.sender];
    }
  
    function _createProperty(string memory location, uint cost) public payable onlyOwner {
        uint state = 1;
        ownerPropertyCount[msg.sender]++;
        
        Asset memory myAsset = Asset({
            ownerAddress: msg.sender,
            prevAddress: address(0),
            location: location,
            ID: idCounter,
            cost: cost,
            state: state
        });
        idCounter = idCounter.add(1);
        property[msg.sender].push(myAsset)-1;
        emit AddAsset(msg.sender, idCounter);
    }

    function _numOfPropertyOwnerHas(address _owner) public view returns (uint){
        return (property[_owner].length);
    }

    function _getCurrentPrice(address _owner, uint propertyId) public view returns (uint) {
        return (property[_owner][propertyId].cost);
    }
  
    //gets the details of the property
    function _getPropertyDetail(address assetOwner, uint propertyID) public view returns (address, address, string memory, uint, uint, uint){
        return(property[assetOwner][propertyID].ownerAddress,
        property[assetOwner][propertyID].prevAddress,
        property[assetOwner][propertyID].location, 
        property[assetOwner][propertyID].ID, 
        property[assetOwner][propertyID].cost,
        property[assetOwner][propertyID].state);
    }

    function _transferProperty(address payable _buyer, uint assetIdx) public payable returns (uint balance){
        uint i;
        for(i=0; i<(property[msg.sender].length); i++){
            if(property[msg.sender][i].ID == assetIdx){
                require(msg.value >= property[msg.sender][i].cost*1e18);
                Asset memory myAsset = Asset({
                    ownerAddress: _buyer,
                    prevAddress: msg.sender,
                    location: property[msg.sender][i].location,
                    ID: property[msg.sender][i].ID,
                    cost: property[msg.sender][i].cost,
                    state: property[msg.sender][i].state++
                });
            property[_buyer].push(myAsset);
            delete property[msg.sender][i];
            balances[msg.sender] -= property[msg.sender][i].cost;
            _buyer.transfer(property[msg.sender][i].cost*1e18);
            emit TransferAsset(msg.sender, _buyer, assetIdx);
            
            return balances[msg.sender];
            }
        }
    }

    function _buyAProperty(address payable _seller, uint assetIdx) public payable returns (uint balance){
        uint i;
        for(i=0; i<(property[_seller].length); i++){
            if(property[_seller][i].ID == assetIdx){    
                require(msg.value >= property[_seller][i].cost*1e18);
                Asset memory myAsset = Asset({
                    ownerAddress: msg.sender,
                    prevAddress: _seller,
                    location: property[_seller][i].location,
                    ID: property[_seller][i].ID,
                    cost: property[_seller][i].cost,
                    state: property[_seller][i].state++
                });
            property[msg.sender].push(myAsset);
            delete property[_seller][i];
            balances[_seller] -= property[_seller][i].cost*1e18;
            msg.sender.transfer(property[_seller][i].cost*1e18);
            emit TransferAsset(_seller, msg.sender, assetIdx);
            
            return balances[msg.sender];
            }
        
        }
    }

// function _currentPropertyOwned(uint propertyID) public view returns (address){
//     //for loop to search for all the owner property id match
//     uint i;
//     for(i = 0; i<property[msg.sender].length; i++ ){
//         if(property[msg.sender][i].ID == propertyID){
//             return(property[msg.sender][i].ownerAddress);
//         }
//     }
// }

//   function _numOfPropertyOwnerHas(address _owner) public view returns (uint){
//       uint count = 0;
//       for(uint i=0; i<property[msg.sender].length; i++) {
//           if(property[msg.sender][i].ownerAddress == _owner) {
//              count++;
//           }
//       }
//       return(count);
//   }

// function _getAllPropertiesInOwnerArray(address _owner) public view returns (uint){
//     uint i;
//     uint j;
//     for(i=0; i<property[_owner].length; i++){
//         for(j=0; i<property[_owner][i].length; j++){
//             return(property[_owner][i][j].location);
//         }
//     }
// }

}