import React from 'react';
import Auth from 'j-toker';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';

export class RequestPasswordReset extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                email: '',
                password: ''
            },
            submitted: false,
            errors: false
        };
    }

    componentWillMount() {
      Auth.validateToken()
        .then(function(partner) {
        this.props.history.push('/reset_password');
      });
    }

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        document.getElementById("errorLabel").className = 'hidden';
        this.setState({ formData });
    }

    handleSubmit = (history) => {
        this.setState({ submitted: true }, () => {
          Auth.requestPasswordReset({
            email: document.getElementById('email').value,
            redirect_url: '/reset_password'
          })
          .then(function(partner) {
            history.push('/request_password_success');
          })
          .fail(res => {
            document.getElementById("errorLabel").className = '';
            this.setState({ submitted: false });
          })
        });
    }

    render() {
        const { formData, submitted } = this.state;
        if (Auth.user.signedIn) {
          return (
                <div>
                    <h1 className="page-title">You are in!</h1>
                </div>
            );
        }
        else {
          return (
            <div className="container">
                <Paper className="account-paper">
                    <h2 className="page-title">Reset your Password</h2>
                    <ValidatorForm
                        ref="form"
                        onSubmit={ () => this.handleSubmit(this.props.history) } >
                        <h3 id="errorLabel" className="hidden"> Email or password wrong</h3>
                        <TextValidator
                            floatingLabelText="Email"
                            onChange={this.handleChange}
                            name="email"
                            id="email"
                            value={formData.email}
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <br />
                        <RaisedButton
                            type="submit"
                            label={
                                (submitted && 'Processing...')
                                || (!submitted && 'Get a new password')
                            }
                            disabled={submitted}
                        />
                    </ValidatorForm>
                </Paper>
              </div>
          );
        }
    }
}
