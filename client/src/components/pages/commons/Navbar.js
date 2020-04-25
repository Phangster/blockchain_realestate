import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DrawerLeft from './DrawerLeft'
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit *3,
    width: '100%'
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

class Navbar extends Component {

  constructor() {
    super();
    this.state = {
        open: false
    }
  }  

  toggleDrawer() {
    this.setState({
        open: !this.state.open
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <DrawerLeft className={classes.menuButton} open={this.state.open} color="contrast" onClick={this.toggleDrawer.bind(this)} />
          <Typography className={classes.flex} style={{textAlign: 'center'}} type="title" color="inherit">
            Property Ownership 
          </Typography>
          <div>
            <IconButton color="contrast" onClick={this.props.login}>
              <AccountCircle/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);