import React, { Component } from "react";
import RealEstate from "../../contracts/RealEstate.json";
import getWeb3 from "../../getWeb3";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class RegisterProperty extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      storageValue: null, 
      web3: null, 
      contract: null,
      accounts: null, 

      location: null,
      cost: null,
      currentAddress: null,
      propertyOwner: null,

      blockNumber: null,
      transactionHash: null,
      from: null,
      to: null,
      contractAddress: null,
      gasUsed: null,
      logs:[],

      newOwnerAddress: null,
      propertyId: null
    };
  }

  componentWillMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RealEstate.networks[networkId];

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3: web3, 
        accounts: accounts, 
        currentAddress: accounts[0], 
        deployedNetwork: deployedNetwork 
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  createProperty = async (location, cost ) =>{
    const { accounts, deployedNetwork, web3 } = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );
    
    this.setState({contract: contract})
    console.log(this.state.contract)

    await contract.methods._createProperty(location, cost)
    .send(
      { from: accounts[0], gas: 800000, value: cost })
    .then((txReceipt) =>
      this.setState({
        transactionHash: txReceipt.transactionHash,
        blockNumber: txReceipt.blockNumber,
        from: txReceipt.from,
        to: txReceipt.to,
        logs: txReceipt.logs,
        contractAddress: txReceipt.contractAddress
      })
    )
    console.log(this.state)
  }

  transferOwnership = async (newOwnerAddress, propertyId) => {
    const {contract, currentAddress} = this.state;
    await contract.methods._transferProperty(newOwnerAddress, propertyId)
    .send(
      { from: currentAddress, to: newOwnerAddress, gas: 800000})
    .then((txReceipt) =>
      this.setState({
        transactionHash: txReceipt.transactionHash,
        blockNumber: txReceipt.blockNumber,
        from: txReceipt.from,
        to: txReceipt.to,
        logs: txReceipt.logs
      })
    )
    console.log(this.state)
  }

  // how to know if my contract has been successfully deployed ?
  // how to get the methods from the contract/ or why methods is not showing
  getPropertyDetails = async (address, id) => {

    const {deployedNetwork, web3 } = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );

    const response = await contract.methods._getPropertyDetails(address, id).call();
    this.setState({ storageValue: response });
  }

  gweiToEther(amount) {
    const web3 = this.state.web3
    const cost = web3.utils.fromWei(amount, 'ether');
    console.log(cost)
    return cost
  }

  handleSubmitCreateProperty(event) {
    event.preventDefault();
    const location = this.state.location;
    const cost = this.state.cost
    this.createProperty(location, cost)
    console.log(location)
    console.log(cost)

  }

  handleChangeCreateProperty(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmitTransferOwnership(event) {
    event.preventDefault();
    const newOwnerAddress = this.state.newOwnerAddress;
    const propertyId = this.state.propertyId;

    this.transferOwnership(newOwnerAddress, propertyId);
    console.log(newOwnerAddress);
    console.log(propertyId);
  }

  handleChangeTransferOwnership(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmitGetProperty(event) {
    event.preventDefault();
    const address = this.state.propertyOwner;
    const id = this.state.propertyId;

    this.getPropertyDetails(address, id);
    console.log(address);
    console.log(id);
  }

  handleChangeGetProperty(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App" style={{display: 'grid'}}>
        <h1>Register a Property</h1>
        <p>My Account: {this.state.currentAddress}</p>
        <div style={{width: '100%', display: 'grid', justifyContent: 'center'}}>
          <form style={{width: '400px', alignItems: 'center', boxShadow: '10px 10px 5px grey', paddingBottom: '30px'}} onSubmit={this.handleSubmitCreateProperty.bind(this)}>
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Location" variant="outlined" type="text" name="location" placeholder="eg. Pasir Ris, Tampines" value={this.state.location} onChange={this.handleChangeCreateProperty.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Cost" variant="outlined" type="text" name="cost" placeholder="asking price" value={this.state.cost} onChange={this.handleChangeCreateProperty.bind(this)}/>
            </div>
            <div style={{marginTop: '20px'}}>
              <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </div>
          </form>
          <div style={{paddingLeft: '20px'}}>
            <h3>Transaction Hash</h3>
            <h5>{this.state.transactionHash}</h5>
          </div>
        </div>
        <h1>Transfer a Property</h1>
        <div style={{width: '100%', display: 'grid', justifyContent: 'center'}}>
          <form style={{width: '400px', alignItems: 'center', boxShadow: '10px 10px 5px grey', paddingBottom: '30px'}} onSubmit={this.handleSubmitTransferOwnership.bind(this)}>
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="To Address" variant="outlined" type="text" name="newOwnerAddress" placeholder="eg. 0x38euhfj....." value={this.state.newOwnerAddress} onChange={this.handleChangeTransferOwnership.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Property ID" variant="outlined" type="text" name="propertyId" placeholder="eg. 1, 2, 3 ..." value={this.state.propertyId} onChange={this.handleChangeTransferOwnership.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </div>
          </form>
          <div style={{paddingLeft: '20px'}}>
            <h3>New Owner</h3>
            <h5>{this.state.newOwnerAddress}</h5>
          </div>
        </div>
        <h1>Get a Property</h1>
        <div style={{width: '100%', display: 'grid', justifyContent: 'center'}}>
          <form style={{width: '400px', alignItems: 'center', boxShadow: '10px 10px 5px grey', paddingBottom: '30px'}} onSubmit={this.handleSubmitGetProperty.bind(this)}>
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Land Owner Address" variant="outlined" type="text" name="propertyOwner" placeholder="eg. 0x38euhfj....." value={this.state.propertyOwner} onChange={this.handleChangeGetProperty.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Property ID" variant="outlined" type="text" name="propertyId" placeholder="eg. 1, 2, 3 ..." value={this.state.propertyId} onChange={this.handleChangeGetProperty.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </div>
          </form>
          <div style={{paddingLeft: '20px'}}>
            <h3>Property</h3>
            <h5>{this.state.storageValue}</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterProperty;
