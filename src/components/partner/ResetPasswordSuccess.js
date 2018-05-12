import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';

export class ResetPasswordSuccess extends Component {
    render() {
        return (
          <div className="container">
            <Paper className="account-paper" zDepth={1}>
              <h1>You are updated your password</h1>
              <p>
                <Link to='/login'>Login</Link>&nbsp;&nbsp;here now.
              </p>
            </Paper>
          </div>
        );
    }
}
