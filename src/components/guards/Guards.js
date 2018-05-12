import React, { Component } from 'react';
import $ from 'jquery';
import ApiURL from '../../apiClient';
import { Link } from "react-router-dom";
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
  root: {
    justifyContent: 'space-around',
  },
  paper: {
      width: '80%',
      padding: 10,
      textAlign: 'center',
      display: 'inline-block',
      backgroundColor: '#424242',
  },
};

export class Guards extends Component {
  constructor(props) {
      super(props);

      this.state = {
          guardData: [],
      };
  }

  successHandler = (data) => {
    this.setState({ guardData: data });
  }

  componentWillMount() {
    const { partner: { loggedIn }, history } = this.props;
    if (!loggedIn) {
      history.push('/login');
    }

    return $.ajax ({
      url: ApiURL('company/guards'),
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: this.successHandler.bind(this)
    });
  }

  render() {
    let guardRows = [];

    this.state.guardData.forEach((guard) => {
      guardRows.push(
        <TableRow key={guard.id}>
          <TableRowColumn>
            <p className="name">{guard.name}</p>
          </TableRowColumn>
          <TableRowColumn>
            <span className="email">{guard.email}</span>
          </TableRowColumn>
          <TableRowColumn style={{ width: '120px' }}>
            <Link to={`/guard/${guard.id}`}>
              <div className="show-link">
                <ShowIcon/>Show Details
              </div>
            </Link>
          </TableRowColumn>
          <TableRowColumn style={{ width: '80px' }}>
            <Link to={`/guard/${guard.id}/edit`}>
              <div className="editor-box"><EditIcon /></div>
            </Link>
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <div className="guards-container">
        <h3>Manage your guards</h3>
        <Paper style={{ ...styles.paper, textAlign: 'right' }}>
          <Link to="/guards/new">
            <FlatButton label="Add guard" />
          </Link>
        </Paper>
        <Paper style={{
          ...styles.paper,
          height: 'calc(100vh - 280px)'
        }}>
          <Table height="calc(100vh - 360px)">
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Contact</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '120px' }}>Show Details</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '80px' }}>Edit Guard</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {guardRows}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}
