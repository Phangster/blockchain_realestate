pragma solidity >=0.4.21 <0.7.0;

iimport "./SafeMath.sol";
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
        prevAdd = 0;
    }
    
    event AddAsset(address _owner, uint _AssetID);
    event TransferAsset(address indexed _from, address indexed _to, uint _AssetID);
    
    modifier check(uint cost) {
        require(msg.value >= (cost)*1e18);
        _;
    }
    
    mapping (address => Asset[]) public property;
    mapping (address => uint) ownerPropertyCount;
    
    mapping (address => uint) private balances;
    
    function getBalance() public view returns (uint) {
        /* Get the balance of the sender of this transaction */
        return balances[msg.sender];
    }
    
    function _createProperty(string memory location, uint cost) public onlyOwner {
        uint state = 1;
        ownerPropertyCount[msg.sender]++;
        
        Asset memory myAsset = Asset({
            ownerAddress: msg.sender,
            prevAddress: 0x00,
            location: location,
            ID: idCounter,
            cost: cost,
            state: state
        });
        idCounter = idCounter.add(1);
        property[msg.sender].push(myAsset)-1;
        emit AddAsset(msg.sender, idCounter);
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
    
    // function _currentPropertyOwner(uint propertyID) public view returns (address){
    //     //for loop to search for all the owner property id match
    //     uint i;
    //     for(i = 0; i<property[msg.sender].length; i++ ){
    //         if(property[msg.sender][i].ID == propertyID){
    //             return(property[msg.sender][i].ownerAddress);
    //         }
    //     }
    // }
  
    // function _numOfPropertyOwnerHas(address _owner) public view returns (uint){
    //     uint count = 0;
    //     for(uint i=0; i<property[msg.sender].length; i++) {
    //         if(property[msg.sender][i].ownerAddress == _owner) {
    //           count++;
    //         }
    //     }
    //     return(count);
    // }
  
    function _transferProperty(address _buyer, uint assetIdx) public payable check(property[msg.sender][i].cost) returns (uint balance){
        uint i;
        for(i=0; i<(property[msg.sender].length); i++){
            if(property[msg.sender][i].ID == assetIdx){
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

}