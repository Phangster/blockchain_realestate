pragma solidity >=0.4.21 <0.7.0;

import "./RealEstate.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

contract PropertyOwnership is RealEstate, ERC721{

    using SafeMath for uint256;

    mapping (uint => address) propertyApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerPropertyCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return propertyToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerPropertyCount[_to] = ownerPropertyCount[_to].add(1);
        ownerPropertyCount[msg.sender] = ownerPropertyCount[msg.sender].sub(1);
        propertyToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (propertyToOwner[_tokenId] == msg.sender || propertyApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        propertyApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}