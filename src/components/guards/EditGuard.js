import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';
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

export class EditGuard extends React.Component {
  constructor(props) {
      super(props);
      const id = this.props.match.params.id.valueOf();
      this.state = {
          guardId: id ,
          formData: {
            name: '',
            email: '',
          },
          submitted: false,
          errors: false,
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { guardId } = this.state;

    return $.ajax ({
      url: ApiURL(`company/guard/${guardId}`),
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: this.handleGetSuccess.bind(this)
    })
  }

  handleGetSuccess = (data) => {
    this.setState({ formData: data });
  }

  handlePutSuccess = (data) => {
    this.props.history.push('/guards');
  }

  handleChange = (e) => {
    let { formData } = this.state;
    formData[e.target.name] = e.target.value;
    this.setState({ formData, errors: false });
  }

  handleError = () => {
    this.setState({ submitted: false, errors: true });
  }

  handleSubmit = (history) => {
    const { guardId, formData } = this.state;

    $.ajax ({
      url: ApiURL(`company/guard/${guardId}`),
      type: "PUT",
      data: JSON.stringify({
        "guardian": {
          "name": formData.name,
          "email": formData.email,
        }
      }),
      dataType: "json",
      contentType: "application/json",
      success: this.handlePutSuccess.bind(this),
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
              <h2>Update guard</h2>
              <h5 id="errorLabel" className={errors ? '' : 'hidden'}>Update is failed. Please try again</h5>
              <div className="fields-wrapper">
                <TextValidator
                    floatingLabelText="Guard Name"
                    onChange={this.handleChange}
                    name="name"
                    id="name"
                    value={formData.name}
                    validators={['required']}
                    errorMessages={['Please type name']}
                />
                <TextValidator
                    floatingLabelText="Email"
                    onChange={this.handleChange}
                    name="email"
                    id="email"
                    value={formData.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['Please type email', 'Email is not valid']}
                />
                <RaisedButton
                    type="submit"
                    label={
                        (submitted && 'Guard is being created!')
                        || (!submitted && 'update guard')
                    }
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
