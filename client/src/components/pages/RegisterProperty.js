import React, { Component } from "react";
import PropertyOwnership from "../../contracts/PropertyOwnership.json";
import getWeb3 from "../../getWeb3";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class RegisterProperty extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null, 
      location: null,
      cost: null,
      currentAddress: null,

      blockNumber: null,
      transactionHash: null,
      from: null,
      to: null,
      contractAddress: null,
      gasUsed: null,
      logs:[],
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
      const deployedNetwork = PropertyOwnership.networks[networkId];
      const instance = new web3.eth.Contract(
        PropertyOwnership.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, currentAddress: accounts[0], contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  createProperty = async (location, cost ) =>{
     const { accounts, contract} = this.state;

    await contract.methods._createProperty(location, cost)
    .send(
      { from: accounts[0], gas: 800000 })
    .then((txReceipt) =>
      this.setState({
        transactionHash: txReceipt.transactionHash,
        blockNumber: txReceipt.blockNumber,
        from: txReceipt.from,
        to: txReceipt.to
      })
    )
  }

  gweiToEther(amount) {
    const web3 = this.state.web3
    const cost = web3.utils.fromWei(amount, 'ether');
    console.log(cost)
    return cost
  }

  handleSubmit(event) {
    event.preventDefault();
    const location = this.state.location;
    const cost = this.state.cost
    this.createProperty(location, cost)

    console.log(location)
    console.log(cost)

  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Register a Property</h1>
        <p>My Account: {this.state.currentAddress}</p>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <form style={{height: '50vh', width: '50%', alignItems: 'center', boxShadow: '10px 10px 5px grey'}} onSubmit={this.handleSubmit.bind(this)}>
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Location" variant="outlined" type="text" name="location" placeholder="eg. Pasir Ris, Tampines" value={this.state.location} onChange={this.handleChange.bind(this)} />
            </div >
            <div style={{marginTop: '20px'}}>
              <TextField id="filled-basic" label="Cost" variant="outlined" type="text" name="cost" placeholder="asking price" value={this.state.cost} onChange={this.handleChange.bind(this)}/>
            </div>
            <div style={{marginTop: '20px'}}>
              <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
            </div>
          </form>
        </div>
        
      </div>
    );
  }
}

export default RegisterProperty;
