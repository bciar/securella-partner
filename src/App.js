import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Home} from './components/Home.js';
import {Head} from './components/Header.js';
import {connect } from "react-redux";
import { withRouter } from 'react-router'
import Auth from 'j-toker';
import {setLoginState} from './actions/partnerActions.js';
import {setLoadState} from './actions/appActions.js';
import {setAlarmState} from './actions/alarmActions.js';
import './App.css';

const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {status: REQUEST}
  }

  componentWillMount() {
    Auth.validateToken()
      .then(function(partner) {
        this.props.setLoginState(true);
        this.props.setLoadState(true);
      }
      .bind(this))
      .fail(function(partner) {
        this.props.setLoadState(true);
      }
      .bind(this))

    this.setState({status: SUCCESS});
  }

  renderSpinner() {
    return ('Loading...')
  }

  renderApp() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="App">
        <Head partner={this.props.partner} app={this.props.app} alarm={this.props.alarm}/>
        <Home style={{ height: '100%' }} partner={this.props.partner} app={this.props.app} alarm={this.props.alarm}/>
      </div>
      </MuiThemeProvider>
    );
  }

  render() {
    return this.state.status === REQUEST ? this.renderSpinner() : this.renderApp()
  }
};

const mapStateToProps = (state) => {
  return {
      partner: state.partner,
      app: state.app,
      alarm: state.alarm
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoginState: (loggedInState) => {
            dispatch(setLoginState(loggedInState));
        },
        setAlarmState: (alarmState) => {
            dispatch(setAlarmState(alarmState));
        },
        setLoadState: (loadState) => {
          dispatch(setLoadState(loadState));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
