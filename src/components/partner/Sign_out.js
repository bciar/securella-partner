import React from 'react';
import Auth from 'j-toker';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import store from '../../store.js';
import {setLoginState} from '../../actions/partnerActions.js'

export class SignOut extends React.Component {

  componentWillMount() {
      Auth.signOut();
      this.props.history.push('/');
      store.dispatch(setLoginState(false));
}



  render() {

    const style = {
      height: 300,
      width: 600,
      margin: 20,
      padding: 40,
      textAlign: 'center',
      display: 'inline-block',
    };

    return (
      <div>
        <Paper style={style} zDepth={1}>
          <h1>You are logged out</h1>
          <p>
            <Link to='/login'>Login</Link> here if you want to go back.
          </p>
        </Paper>
      </div>
    );
  }
}
