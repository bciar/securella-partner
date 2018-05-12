import React, { Component } from 'react';
import $ from 'jquery';
import ApiURL from '../../apiClient';
import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper'

const styles = {
  root: {
    justifyContent: 'space-around',
  },
  paper: {
    width: '80%',
    margin: 10,
    padding: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  button: {
      margin: 2,
      padding: 10,
  },
};

export class Guard extends Component {
  constructor(props) {
    super(props);
    const id = props.match.params.id.valueOf();
    this.state = {
        guardId: id,
        guardData: {}
    };
  }

  componentWillMount() {
    const { guardId } = this.state;
    const { partner: { loggedIn } } = this.props;

    if (!loggedIn) {
      this.props.history.push('/login');
    }

    return $.ajax ({
      url: ApiURL(`company/guard/${guardId}`),
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: this.successHandler.bind(this)
    });
  }

  successHandler = (data) => {
    this.setState({ guardData: data });
  }

  updateStatus = (status) => {
    const { guardId } = this.state;

    return $.ajax ({
      url: ApiURL(`company/set_guardian_${status}/${guardId}`),
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      success: this.successHandler.bind(this)
    });
  }

  render() {
    const { guardData } = this.state;

    return (
      <div className="guard-details-container">
        <Paper style={styles.paper} zDepth={2}>
          <h2>Guard Detail</h2>
          <div style={styles.root}>
            <GridList cellHeight={50} style={styles.gridList} >
              <GridTile><span className="guard-title">Name: </span></GridTile>
              <GridTile><span className="guard-value"> {guardData.name}</span> </GridTile>
              <GridTile><span className="guard-title"> Email: </span></GridTile>
              <GridTile><span className="guard-value"> {guardData.email} </span></GridTile>
              <GridTile><span className="guard-title"> Status: </span></GridTile>
              <GridTile><span className="guard-value"> {guardData.status} </span></GridTile>
            </GridList>
          </div>
        </Paper>
      </div>
    );
  }
}
