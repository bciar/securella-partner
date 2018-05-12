import React, { Component } from 'react';
import $ from 'jquery';
import ApiURL from '../apiClient';
import MenuItem from 'material-ui/MenuItem';
import MapContainer from './MapContainer';
import Menu from 'material-ui/Menu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import FiberManualRecord from 'material-ui/svg-icons/av/fiber-manual-record';
import {red500, yellow500, grey500, green500} from 'material-ui/styles/colors';
import store from '../store.js';
import {setAlarmState} from '../actions/alarmActions.js'

export class Dashboard extends Component {

  constructor(props) {
      super(props);

      this.state = {
          inactiveGuards: [],
          availableGuards: [],
          operatingGuards: [],
          occupiedGuards: [],
          selectedGuard: null,
          openAlarm: {
            id: 0,
            status : false,
            loction: { latitude: 0, longitude: 0},
            guards: [],
            victim: ""
          }
      };
  }

  componentWillMount() {
    if (!this.props.partner.loggedIn) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    this.updateGuards();
    this.interval = setInterval(() => this.updateGuards(), 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  clearGuards = () => {
    this.setState({
      inactiveGuards: [],
      availableGuards: [],
      operatingGuards: [],
      occupiedGuards: []
    });
  }

  updateGuards = () => {
    $.ajax ({
      url: ApiURL('company/inactive_guards'), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) { this.setState({inactiveGuards: data}); }.bind(this)
    });

    $.ajax ({
      url: ApiURL('company/available_guards'), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) { this.setState({availableGuards: data}); }.bind(this)
    });

    $.ajax ({
      url: ApiURL('company/operating_guards'), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) { this.setState({operatingGuards: data}); }.bind(this)
    });

    $.ajax ({
      url: ApiURL('company/occupied_guards'), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) { this.setState({occupiedGuards: data}); }.bind(this)
    });

    // $.ajax ({
    //   url: ApiURL('company/active_alarms'), type: "GET", dataType: "json", contentType: "application/json",
    //   success: function(data) { this.setState({alarms: data}); }.bind(this)
    // });

    $.ajax ({
      url: ApiURL('company/open_alarms'), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) {
        this.setState({ openAlarm: data });
        if (data.status) {
          store.dispatch(setAlarmState(true));
          clearInterval(this.interval);
          this.props.history.push('/alarm');
        }
      }.bind(this)
    });
  }

  sendGuard = (alarm_id, guard_id) => {
    $.ajax ({
      url: ApiURL('company/ack_request'),
      type: "POST",
      data: JSON.stringify({
        "alarm": {
        "alarm_id": alarm_id,
        "guard_id": guard_id
      }
      }),
      dataType: "json",
      contentType: "application/json",
      success: function(data) { this.updateGuards(); }.bind(this)
    });
    this.updateGuards();
  }

  denyRequest = (alarm_id) => {
    $.ajax ({
      url: ApiURL('company/deny_request'),
      type: "POST",
      data: JSON.stringify({
        "alarm": {
        "alarm_id": alarm_id
      }
      }),
      dataType: "json",
      contentType: "application/json",
      success: function(data) { this.updateGuards(); }.bind(this)
    });
  }

  onMenuItemClick = (e, guard) => {
    this.setState(()=>({selectedGuard: guard}));
  }


  setGuardStatus = (e, url) => {
    $.ajax ({
      url: ApiURL(url),
      type: "PUT",
      success: function(data) {
        this.clearGuards();
        this.updateGuards();
      }.bind(this)
    });
  }

  render() {
    const {
      operatingGuards,
      availableGuards,
      occupiedGuards,
      inactiveGuards,
      selectedGuard,
    } = this.state;

    const iconButtonElement = (
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    );

    const rightIconMenu = (guard, color) => (
      <IconMenu iconButtonElement={iconButtonElement}
                style={{marginTop: '-2.5px'}}
                onChange={this.setGuardStatus}>
        { color!==green500 && <MenuItem primaryText="Set Available" value={`company/set_guardian_available/${guard.id}`} /> }
        { color!==yellow500 && <MenuItem primaryText="Set Occupied" value={`company/set_guardian_occupied/${guard.id}`} /> }
        { color!==red500 && <MenuItem primaryText="Set Operating" value={`company/set_guardian_operating/${guard.id}`} /> }
        { color!==grey500 && <MenuItem primaryText="Set Inactive" value={`company/set_guardian_inactive/${guard.id}`} /> }
      </IconMenu>
    );

    let jsx_MenuItem = (guard, color) => (
        <MenuItem
          key={guard.id}
          className="dash__menuitem"
          leftIcon={<FiberManualRecord
                      className={ color===green500 ? "dash__mcircle" : "dash__lcircle" }
                      color={color}/>}
          rightIcon={ rightIconMenu(guard, color) }
          value={ guard }
        >
            {guard.name}
        </MenuItem>
    );

    return (
      <div className="dash__page">
        <div className="dash__menu">
          <Menu onChange={this.onMenuItemClick}>
            { operatingGuards.map((guard) => jsx_MenuItem(guard, red500)) }
            { availableGuards.map((guard) => jsx_MenuItem(guard, green500)) }
            { occupiedGuards.map((guard) => jsx_MenuItem(guard, yellow500)) }
            { inactiveGuards.map((guard) => jsx_MenuItem(guard, grey500)) }
          </Menu>
        </div>
        <div className="dash__map">
          <MapContainer
            availableGuards={availableGuards}
            occupiedGuards={occupiedGuards}
            operatingGuards={operatingGuards}
            selectedGuard={selectedGuard}
          />
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
}
