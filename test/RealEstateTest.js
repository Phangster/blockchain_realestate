const RealEstate = artifacts.require("../contracts/RealEstate.sol");

const propertyId = [0,1,2,3];
contract("RealEstate", (accounts) => {

  let [alice, bob] = accounts;
  it("should create a property", async () => {
    const contractInstance = await RealEstate.new();
    const result = await contractInstance._createProperty('tampines', 20, {from: alice})
    assert.equal(result.receipt.status, true);
  });

  //How to test public view return in truffle?

});
