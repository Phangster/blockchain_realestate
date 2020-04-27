import React, { Component } from "react";
import RealEstate from "../../contracts/RealEstate.json";
import getWeb3 from "../../getWeb3";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
      price: null,

      newOwnerAddress: null,
      prevOwnerAddress: null,
      propertyId: null,
      propertyIdTrans: null,

      listofproperty: [],
      numProp: null,
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
        deployedNetwork: deployedNetwork,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

/* HANDLERS */
  handleSubmitCreateProperty(event) {
    event.preventDefault();
    alert("A property ownership contract is being created")
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
    const propertyIdTrans = this.state.propertyIdTrans;

    this.transferOwnership(newOwnerAddress, propertyIdTrans);
    console.log(newOwnerAddress);
    console.log(propertyIdTrans);
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

  /* FUNCTION METHOD CALLS */
  createProperty = async (location, cost ) =>{
    const { accounts, deployedNetwork, web3 } = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );
    
    try{
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
        contractAddress: txReceipt.contractAddress,
        price: cost,
      })
      );
    } catch (err) {
      console.log('errorMessage: ', err.message );
    }
  }

  transferOwnership = async (newOwnerAddress, propertyId) => {
    const {deployedNetwork, web3, currentAddress, price} = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );

    try{
      await contract.methods._transferProperty(newOwnerAddress, propertyId)
    .send(
      { from: currentAddress, to: newOwnerAddress, gas: 800000, value: price})
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
    } catch (err) {
      console.log('errorMessage: ', err.message );
    }
  }

  // how to know if my contract has been successfully deployed ?
  // how to get the methods from the contract/ or why methods is not showing
  getPropertyDetails(address, id){

    const {deployedNetwork, web3} = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );

    try{
      contract.methods._getPropertyDetails(address, id).call()
      .then((res)=>{
        console.log('hello')
      });
    } catch (err) {
      console.log('errorMessage: ', err.message );
    }

  }

  /* Wanted to try running a for loop to call the contract and updates its public view return into an array on react to handle

  getMyProperties = async() => {
    const num = 10
    const address = this.state.currentAddress
    for(let i = 0; i<num; i++){
      const res = await this.getPropertyDetails(address,[i])
      this.setState({ listofproperty: this.state.listofproperty.push(res)})
    }
    console.log(this.state.listofproperty)
  }
  */

  getNumProperties = async() => {
    const {deployedNetwork, web3 } = this.state;

    const contract = new web3.eth.Contract(
      RealEstate.abi,
      deployedNetwork && deployedNetwork.address,
    );

    try{
      await contract.methods.__numOfPropertyOwnerHas().call()
      .then((res)=>{
        console.log(res)
      });
    } catch (err) {
      console.log('errorMessage: ', err.message );
    }

  }

  getBalance(address){
    const {web3} = this.state;
    return web3.eth.getBalance(address)
  }

  gweiToEther(amount) {
    const {web3} = this.state;
    const cost = web3.utils.fromWei(amount, 'ether');
    console.log(cost)
    return cost
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App" style={{display: 'grid'}}>
        <h3>Current Onwer</h3>
        <h2>{this.state.currentAddress}</h2>
        <div><Button variant="contained" color="primary" onClick={() => this.getNumProperties()} >NUM PROPERTIES</Button></div>
        <h2>{this.state.numProp}</h2>
        <Grid container direction="column" justify="space-evenly" alignItems="center" marginTop="5rem">
          <Grid container direction="row" justify="space-evenly" style={{marginBottom:"2rem"}}>
            <Card style={{width: '400px'}} spacing={2}>
              <CardActionArea>
                  <CardMedia
                  style={{height: '140px'}}
                  image= {require ("../../assets/images/Property.jpg")}
                  title="Contemplative Reptile"
                  />
                  <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Register a Property
                  </Typography>
                  <form onSubmit={this.handleSubmitCreateProperty.bind(this)}>
                    <div style={{marginTop: '20px'}}>
                      <TextField id="filled-basic" label="Location" variant="outlined" type="text" name="location" placeholder="eg. Pasir Ris, Tampines" value={this.state.location} onChange={this.handleChangeCreateProperty.bind(this)} />
                    </div >
                    <div style={{marginTop: '20px'}}>
                      <TextField id="filled-basic" label="Cost" variant="outlined" type="text" name="cost" placeholder="asking price" value={this.state.price} onChange={this.handleChangeCreateProperty.bind(this)}/>
                    </div>
                    <div style={{marginTop: '20px'}}>
                      <Button variant="contained" color="primary" type="submit" value="Submit" >Submit</Button>
                    </div>
                  </form>
                  <Typography variant="body2" color="textSecondary" component="p">
                  </Typography>
                  </CardContent>
              </CardActionArea>
            </Card>
            <div style={{width:"400px"}}>
              <h1>TX RECIEPT</h1>
              <h3>Transaction Hash</h3>
              <Typography style={{overflow: 'scroll'}}>{this.state.transactionHash}</Typography>
              <h3>Owner</h3>
              <Typography style={{overflow: 'scroll'}}>{this.state.from}</Typography>
              <h3>Price</h3>
              <Typography style={{overflow: 'scroll'}}>{this.state.cost}</Typography>
            </div>
          </Grid>
          <Grid container direction="row" justify="space-evenly" style={{marginBottom:"2rem"}}>
          <Card style={{width: '400px'}}>
            <CardActionArea>
                <CardMedia
                style={{height: '140px'}}
                image= {require ("../../assets/images/Property.jpg")}
                title="Contemplative Reptile"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Transfer a Property
                </Typography>
                <form onSubmit={this.handleSubmitTransferOwnership.bind(this)}>
                  <div style={{marginTop: '20px'}}>
                    <TextField id="filled-basic" label="To Address" variant="outlined" type="text" name="newOwnerAddress" placeholder="eg. 0x38euhfj....." value={this.state.newOwnerAddress} onChange={this.handleChangeTransferOwnership.bind(this)} />
                  </div >
                  <div style={{marginTop: '20px'}}>
                    <TextField id="filled-basic" label="Property ID" variant="outlined" type="text" name="propertyIdTrans" placeholder="eg. 1, 2, 3 ..." value={this.state.propertyIdTrans} onChange={this.handleChangeTransferOwnership.bind(this)} />
                  </div >
                  <div style={{marginTop: '20px'}}>
                    <Button variant="contained" color="primary" type="submit" value="Submit">Submit</Button>
                  </div>
                </form>
                </CardContent>
            </CardActionArea>
          </Card>
          <div style={{width:"400px"}}>
            <h1>TRANSFERING</h1>
            <h3>New Owner</h3>
            <Typography style={{overflow: 'scroll'}}>{this.state.newOwnerAddress}</Typography>
            <h3>Previous Owner</h3>
            <Typography style={{overflow: 'scroll'}}>{this.state.from}</Typography>
          </div>
          </Grid>
          <Grid container direction="row" justify="space-evenly">
          <Card style={{width: '400px'}}>
            <CardActionArea>
                <CardMedia
                style={{height: '140px'}}
                image= {require ("../../assets/images/Property.jpg")}
                title="Contemplative Reptile"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  View a Property Ownership
                </Typography>
                <form onSubmit={this.handleSubmitGetProperty.bind(this)}>
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
                </CardContent>
            </CardActionArea>
          </Card>
          <div style={{width:"400px"}}>
            <h3>Property</h3>
            <h5>{this.state.storageValue}</h5>
          </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default RegisterProperty;
