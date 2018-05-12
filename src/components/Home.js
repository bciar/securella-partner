import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

import {Dashboard} from './Dashboard.js';
import {Alarm} from './alarm/Alarm';

import {Guard} from './guards/Guard.js';
import {EditGuard} from './guards/EditGuard.js';
import {Guards} from './guards/Guards.js';
import {CreateGuard} from './guards/CreateGuard.js';

import {SignIn} from './partner/Sign_in.js';
import {SignOut} from './partner/Sign_out.js';

import {RequestPasswordReset}   from './partner/RequestPasswordReset.js';
import {RequestPasswordSuccess} from './partner/RequestPasswordSuccess.js';
import {ResetPassword}          from './partner/ResetPassword.js';
import {ResetPasswordSuccess}   from './partner/ResetPasswordSuccess.js';

import {Account}       from './partner/Account.js';
import {UpdateProfile} from './partner/UpdateProfile.js';

export class Home extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/'               render={(props) => ( <SignIn   {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/dashboard'      render={(props) => ( <Dashboard {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/alarm'          render={(props) => ( <Alarm     {...props} partner={this.props.partner} app={this.props.app} /> )} />

          <Route exact path='/guards'          render={(props) => ( <Guards      {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/guards/new'      render={(props) => ( <CreateGuard {...props} partner={this.props.partner} app={this.props.app} /> )} />

          <Route exact path={"/guard/:id"}      render={(props) => ( <Guard {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path={"/guard/:id/edit"} render={(props) => ( <EditGuard {...props} partner={this.props.partner} app={this.props.app} /> )} />

          <Route exact path='/login'          render={(props) => ( <SignIn  {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/logout'         render={(props) => ( <SignOut {...props} partner={this.props.partner} app={this.props.app} /> )} />

          <Route exact path='/request_password_reset'   render={(props) => ( <RequestPasswordReset   {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/request_password_success' render={(props) => ( <RequestPasswordSuccess {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/reset_password'           render={(props) => ( <ResetPassword          {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/reset_password_success'   render={(props) => ( <ResetPasswordSuccess   {...props} partner={this.props.partner} app={this.props.app} /> )} />

          <Route exact path='/account'        render={(props) => ( <Account        {...props} partner={this.props.partner} app={this.props.app} /> )} />
          <Route exact path='/update_profile' render={(props) => ( <UpdateProfile  {...props} partner={this.props.partner} app={this.props.app} /> )} />
        </Switch>
      </div>
    );
  }
}
