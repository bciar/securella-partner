import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';
import $ from 'jquery';
import ApiURL from '../../apiClient';
import Paper from 'material-ui/Paper'

const styles = {
  root: {
    justifyContent: 'space-around',
  },
  paper: {
      width: '50%',
      margin: 20,
      padding: 40,
      textAlign: 'center',
      display: 'inline-block',
      backgroundColor: '#424242',
  }
};

export class CreateGuard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        formData: {
          name: '',
          email: '',
          password: '',
          repeatPassword: '',
        },
        submitted: false,
        errors: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { formData } = this.state;
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
        if (value !== formData.password) {
            return false;
        }
        return true;
    });
  }

  handleChange = (e) => {
    let { formData } = this.state;
    formData[e.target.name] = e.target.value;
    this.setState({ formData, errors: false });
  }

  handleSuccess = (data) => {
    this.props.history.push('/guards');
  }

  handleError = () => {
    this.setState({ submitted: false, errors: true });
  }

  handleSubmit = (history) => {
    const { formData } = this.state;

    $.ajax ({
      url: ApiURL('company/create_guard'),
      type: "POST",
      data: JSON.stringify({
        "guardian": {
          "name": formData.name,
          "email": formData.email,
          "password": formData.password,
          "password_confirmation": formData.password_confirmation
        }
      }),
      dataType: "json",
      contentType: "application/json",
      success: this.handleSuccess.bind(this),
      error: this.handleError.bind(this),
    });
  }

  render() {
    const { formData, submitted, errors } = this.state;

    return (
      <div className="create-guard-container">
        <Paper style={styles.paper}>
          <ValidatorForm
            ref="form"
            onSubmit={ () => this.handleSubmit(this.props.history) } >
            <h2>Register a New Guard</h2>
            <h5 id="errorLabel" className={errors ? '' : 'hidden'}> Email vergeben oder Password zu kurz (min. 8 Zeichen)</h5>
            <div className="fields-wrapper">
              <TextValidator
                floatingLabelText="Guard Name"
                onChange={this.handleChange}
                name="name"
                id="name"
                value={formData.name}
                validators={['required']}
                errorMessages={['Please type your name']}
              />
              <TextValidator
                floatingLabelText="Email"
                onChange={this.handleChange}
                name="email"
                id="email"
                value={formData.email}
                validators={['required', 'isEmail']}
                errorMessages={['Please type your email', 'This Email is not valid']}
              />
              <TextValidator
                floatingLabelText="Password"
                onChange={this.handleChange}
                name="password"
                type="password"
                id="password"
                validators={['required']}
                errorMessages={['Please type password']}
                value={formData.password}
              />
              <TextValidator
                floatingLabelText="Confirm password"
                onChange={this.handleChange}
                name="repeatPassword"
                type="password"
                id="password_confirmation"
                validators={['isPasswordMatch', 'required']}
                errorMessages={['Password mismatch', 'Please confirm password']}
                value={formData.repeatPassword}
              />
              <RaisedButton
                type="submit"
                label={submitted ? 'Guard is being created!' : 'Create guard'}
                disabled={submitted}
                style={{
                  marginTop: '50px',
                }}
              />
            </div>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}
