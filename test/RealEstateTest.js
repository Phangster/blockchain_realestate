const RealEstate = artifacts.require("../contracts/RealEstate.sol");

const propertyId = [0,1,2,3];
contract("RealEstate", (accounts) => {

  it("should create a property", async () => {
    contractInstance = await RealEstate.new();
    const result = await contractInstance._createProperty('tampines', 20, {from: accounts[0], value: 20})
    assert.equal(result.receipt.status, true);
  });

  it("should transfer a property", async () => {
    contractInstance = await RealEstate.new();
    const result = await contractInstance._transferProperty(accounts[1], propertyId[0], {from: accounts[0], value: 20})
    assert.equal(result.receipt.status, true);
  });

  it("should get number of property owner has", async () => {
    contractInstance = await RealEstate.new();
    await contractInstance._createProperty('tampines', 20, {from: accounts[0], value: 20}).then(()=>{
      contractInstance._transferProperty(accounts[1], propertyId[0], {from: accounts[0]}).then(()=>{
        contractInstance._getPropertyDetail.call(accounts[0], 0, {from: accounts[0]}).then((result) => {
          expect.to.exist(result);
        });
      })
    })
  });


  // it("should get current price of a property", async () => {
  //   contractInstance = await RealEstate.new();
  //   await contractInstance._createProperty('tampines', 20, {from: accounts[0], value: 20}).then(()=>{
  //     contractInstance._getCurrentPrice.call(accounts[0], 0, {from: accounts[0]}).then((result) => {
  //       expect.to.exist(result);
  //     });
  //   })
  // });

});
