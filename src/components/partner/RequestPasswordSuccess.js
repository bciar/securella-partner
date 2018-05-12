import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export class RequestPasswordSuccess extends Component {
    render() {
        return (
          <div className="container">
            <Paper className="account-paper" zDepth={1}>
              If your Email is registered, you will receive an email with a link to change your password within the next 15 minutes.
              <br/>
              <b>Please check your inbox.</b>
            </Paper>
          </div>
        );
    }
}
