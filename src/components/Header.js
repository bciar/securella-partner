import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import {ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  appbar: {
    background: '#49C98A',
    zDepth: 5
  },
  alarmbar: {
    background: '#E84949',
    zDepth: 5
  },
  logo: {

  }
}

const PublicNavLinks = () => (
  <ToolbarGroup>
    <ToolbarTitle style={styles.logo} />
    <FlatButton label="Login" containerElement={<Link to='/login'>login</Link>}/>
  </ToolbarGroup>
);

const MyNavLinks = () => (
  <ToolbarGroup>
    <ToolbarTitle style={styles.logo} />
    <FlatButton label="Dashboard" containerElement={<Link to='/dashboard'>Dashboard</Link>}/>
    <FlatButton label="Guards" containerElement={<Link to='/guards'>Companies</Link>}/>
    <FlatButton label="Profile" containerElement={<Link to='/account'>account</Link>}/>
    <FlatButton label="Logout" containerElement={<Link to='/logout'>logout</Link>}/>
  </ToolbarGroup>
);


const EmptyNavLinks = () => (
  <ToolbarGroup>
    <ToolbarTitle style={styles.logo}/>
  </ToolbarGroup>
);

export class Head extends Component {

  render() {
    if (this.props.app.loaded) {
      if (this.props.partner.loggedIn) {
        if (this.props.alarm && this.props.alarm.alarm) {
          return (
            <AppBar 
              title=""
              style={styles.alarmbar}
              showMenuIconButton={false}
              iconElementRight={<MyNavLinks />}
            />
          );
        }
        else {
          return ( <AppBar title="SEON" style={styles.appbar} showMenuIconButton={false} iconElementRight={<MyNavLinks />} /> );
        }
      }
      else {
        return ( <AppBar title="SEON" style={styles.appbar} showMenuIconButton={false} iconElementRight={<PublicNavLinks />} /> );
      }
    }
    else {
      return ( <AppBar title="SEON" style={styles.appbar} showMenuIconButton={false} iconElementRight={<EmptyNavLinks />} /> );
    }
  }
}
