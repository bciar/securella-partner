import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Auth from 'j-toker';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';
import store from '../../store.js';
import { setLoginState } from '../../actions/partnerActions.js'

const submitButtonStyle = {
  background: '#49ca89',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  minWidth: '50px',
};

export class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formData: {
            email: '',
            password: ''
        },
        submitted: false,
        errors: false,
        isSaveLogin: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    let { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ errors: false, formData });
  }

  handleSubmit = (history) => {
    this.setState({ submitted: true }, () => {
      Auth.emailSignIn({
        email: this.state.formData.email,
        password: this.state.formData.password,
      })
      .then(function(partner) {
        store.dispatch(setLoginState(true));
      })
      .fail(res => {
        this.setState({ submitted: false, errors: true });
      })
    });
  }

  render() {
    const { formData, submitted, errors } = this.state;

    return (
      this.props.partner.loggedIn ? <Redirect to='/dashboard' /> :
        <ValidatorForm
          className="signin-form"
          ref="form"
          onSubmit={() => this.handleSubmit(this.props.history)} >
          <div className="title-wraper">
            <h5>Seon</h5>
            <h2>Control Room</h2>
          </div>
          <div className="login-wrapper">
            <h3 id="errorLabel" className={errors ? '' : 'hidden'}> Email or password wrong</h3>
            <TextValidator
                floatingLabelText="Email"
                onChange={this.handleChange}
                name="email"
                id="email"
                value={formData.email}
                validators={['required']}
                errorMessages={['this field is required']}
            />
            <TextValidator
                floatingLabelText="Password"
                onChange={this.handleChange}
                name="password"
                type="password"
                id="password"
                validators={['required']}
                errorMessages={['this field is required']}
                value={formData.password}
            />
            <div className="buttons-container">
              <div className="buttons">
                <Toggle
                  className="toggle"
                  label="Save login"
                  defaultToggled={true}
                  onToggle={(e, value) => this.setState({ isSaveLogin: value })}
                />
                <RaisedButton
                  type="submit"
                  className="btn-ok"
                  style={submitButtonStyle}
                  label={submitted ? '...' : 'OK'}
                  disabled={submitted}
                />
              </div>
              <p><Link to='/request_password_reset'>forget your password ?</Link></p>
            </div>
          </div>
        </ValidatorForm>
    );
  }
}
