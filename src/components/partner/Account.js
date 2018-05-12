import React from 'react';
import Auth from 'j-toker';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {GridList, GridTile} from 'material-ui/GridList';

export class Account extends React.Component {

  componentWillMount() {
    if (!this.props.partner.loggedIn) {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div className="container">
        <Paper className="account-paper" zDepth={2}>
          <h2 className="page-title">Profile</h2>
          <div className="account-paper__grid-list">
            <GridList cellHeight={50}>
              <GridTile className="grid-title">Company Name:</GridTile>
              <GridTile className="grid-value"> {Auth.user.name} </GridTile>
              <GridTile className="grid-title">Email:</GridTile>
              <GridTile className="grid-value"> {Auth.user.email} </GridTile>
            </GridList>
          </div>
          <div className="account-paper-button-wrapper">
            <RaisedButton href="/update_profile" label="Update profile" className="account-paper__button"/>
            <RaisedButton href="/reset_password" label="Change password" className="account-paper__button" />
          </div>
        </Paper>
      </div>
    );
  }
}
