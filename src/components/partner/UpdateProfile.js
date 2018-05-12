import React from 'react';
import Auth from 'j-toker';
import { ValidatorForm } from 'react-form-validator-core';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

export class UpdateProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            partner: Auth.user,
            formData: {
              name:   Auth.user.name
            },
            submitted: false,
            errors: '0',
        };
    }

    componentDidMount() {
      const { formData } = this.state;
      setTimeout(() => {
        formData.name    = Auth.user.name;
        this.setState({ formData });
      }, 600);
      console.log(formData);
    }

    handleChange = (event) => {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }

    handleSubmit = (history) => {
        this.setState({ submitted: true }, () => {
          Auth.updateAccount({
            name:    document.getElementById('name').value,
          })
          .then(function() {
            history.push('/account');
          })
          .fail(res => {
            document.getElementById("errorLabel").className = '';
            this.setState({ submitted: false });
          })
        });
    }

    render() {
        const { formData, submitted } = this.state;
        return (
            <div className="container">
                <Paper className="account-paper">
                    <h2 className="page-title">Update profile</h2>
                    <ValidatorForm
                        ref="form"
                        className="account-form-wrapper"
                        onSubmit={ () => this.handleSubmit(this.props.history) } 
                    >
                        <h5 id="errorLabel" className="hide error-message">Please fix the shown errors</h5>
                        <TextField
                            floatingLabelText="Company name"
                            onChange={this.handleChange}
                            name="name"
                            id="name"
                            value={formData.name}
                        />
                        <RaisedButton
                            type="submit"
                            label={
                                (submitted && 'Your account is being updated!')
                                || (!submitted && 'Account update')
                            }
                            disabled={submitted}
                            className="account__btn-submit"
                        />
                    </ValidatorForm>
                </Paper>
            </div>
        );

    }
}
