import React, { Component } from 'react';
import $ from 'jquery';
import ApiURL from '../../apiClient';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Geocoder from 'geocoder';
import AlarmMapContainer from './AlarmMapContainer';
import Menu from 'material-ui/Menu';
import MapMarkerIcon from 'material-ui/svg-icons/maps/place';
import Dialog from 'material-ui/Dialog';
import store from '../../store.js';
import { setAlarmState } from '../../actions/alarmActions.js';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    padding: 10,
    width: 'calc(100% - 20px)',
    margin: '20px 10px',
  },
  cancel: {
    position: 'relative',
    left:    0,
    bottom:   0,
    color: '#eee'
  },
  menu: {
    padding: '0px',
    color: '#ddd',
  },
  menuitem: {
      width: '100%',
      padding: '0 0 0 30px',
      textAlign: 'left',
      margin: 0,
      float: 'left',
      color: '#ddd',
      height: '80px',
      borderBottom: '2px solid #303030',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
};

export class Alarm extends Component {
  constructor(props) {
      super(props);

      this.state = {
          openAlarm: {
            id: 0,
            status : false,
            loction: { latitude: 0, longitude: 0},
            guards: [],
            victim: "",
            address: null,
          },
          dispatchGuard: 0,
          alarmRequestId: 0,
          alarmId: 0,
          openDeny: false,
          openAck: false,
          openAlarmModal: true,
      };
  }

  componentWillMount() {
    if (!this.props.partner.loggedIn) {
      this.props.history.push('/login');
    }

    $.ajax ({
      url: ApiURL('company/open_alarms'), type: "GET", dataType: "json", contentType: "application/json",
      success: this.getOpenAlarmResponseHandler.bind(this)
    });
  }

  componentDidMount() {
    this.setState({ browserTitle: document.title });
    document.title = "Incoming Alarm";
  }

  getAddressFromGeoData = (geoData) => {
    if (!geoData.results || geoData.results.length === 0) {
      return '';
    }
    const address_components = geoData.results[0].address_components;
    return address_components ? `
      ${address_components[0].long_name}
      ${address_components[1].long_name},
      ${address_components[4].long_name}` : '';
  }

  getOpenAlarmResponseHandler = (data) => {
    if (!data.status) {
      this.props.history.push('/dashboard');
    } else {
      let alarmData = data;
      Geocoder.reverseGeocode(data.location.latitude, data.location.longitude, (err, geoData) => {
        if (!err) {
          // Set the address of alarm
          alarmData.address = this.getAddressFromGeoData(geoData);
          this.setState({ openAlarm: alarmData });
        }
      });

      // Set the addresses of guards
      data.guards.forEach((guard, index) => {
        let address = null;
        Geocoder.reverseGeocode(guard.latitude, guard.longitude, (err, geoData) => {
          if (!err) {
            address = this.getAddressFromGeoData(geoData);
          }
          alarmData.guards[index].address = address;
          this.setState({ openAlarm: alarmData });
        });
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.title = this.state.browserTitle;
  }

  handleOpenDeny = () => {
    this.setState({ openDeny: true });
  };

  handleCloseDeny = () => {
    this.setState({ openDeny: false });
  };

  denyRequest = (alarmId) => {
    $.ajax ({
      url: ApiURL('company/deny_request'),
      type: "POST",
      data: JSON.stringify({
        "alarm": {
          "alarm_id": alarmId
        }
      }),
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
                  store.dispatch(setAlarmState(false));
                  this.setState({openDeny: false});
                  this.props.history.push('/dashboard');
                }.bind(this)
    });
  }

  handleCloseAck = () => {
    const {
      dispatchGuard: guard_id,
      alarmId: alarm_id
    } = this.state;

    $.ajax ({
      url: ApiURL('company/cancel_delegation'),
      type: "POST",
      data: JSON.stringify({
        "alarm": {
          "alarm_id": alarm_id,
          "guard_id": guard_id,
        }
      }),
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
                  this.setState({ openAck: false });
                  clearInterval(this.interval);
                }.bind(this),
    });
  };

  cancelDelegationHandler = (data) => {
    this.setState({ openAck: false });
    clearInterval(this.interval);
  }

  handleOpenAck = (alarm, request, guard) => {
    this.setState({
      openAck: true,
      dispatchGuard: guard,
      alarmRequestId: request,
      alarmId: alarm,
    });
    this.sendGuard(alarm, request, guard);
  };

  sendGuard = (alarm_id, request_id, guard_id) => {
    $.ajax ({
      url: ApiURL('company/ack_request'),
      type: "POST",
      data: JSON.stringify({
        "alarm": {
          "alarm_id": request_id,
          "guard_id": guard_id
        }
      }),
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
                  this.interval = setInterval(() => this.checkDispatched(alarm_id), 1000);
                }.bind(this)
    });
  }

  checkDispatched = (alarm) => {
    $.ajax ({
      url: ApiURL(`company/alarm_status/${alarm}`), type: "GET", dataType: "json", contentType: "application/json",
      success: function(data) {
                  if (data.status === "responding") {
                    store.dispatch(setAlarmState(false));
                    this.props.history.push('/dashboard');
                  }
                }.bind(this)
    });
  }

  onCloseAlarmModal = () => {
    this.setState({ openAlarmModal: false })
  }

  render() {
    const {
      openAlarm: originalOpenAlarm,
      openAck,
      openDeny,
      openAlarmModal,
    } = this.state;

    let openAlarm = originalOpenAlarm.status ? originalOpenAlarm : {
                                                id: 0,
                                                status : false,
                                                guards: [],
                                                loction: { latitude: 0, longitude: 0 },
                                                victim: ""
                                              };

    const denyActions = [
      <RaisedButton label="Cancel" primary onClick={this.handleCloseDeny} style={{ marginRight: '20px' }} />,
      <RaisedButton label="Yes, send no guard" secondary onClick={() => this.denyRequest(originalOpenAlarm.id)} />,
    ];

    const ackActions = [
      <RaisedButton label="Cancel" primary onClick={this.handleCloseAck} />,
    ];

    const alarmActions = [
      <RaisedButton label="Ok" primary onClick={this.onCloseAlarmModal} />,
    ];

    return (
      <div className="alarm-page-container">
        <div className="sidebar-wrapper">
          <div className="alarms-box">
            <div className="victim-info">
              <div className="alarm-header">
                Victim<span>in danger</span>
              </div>
              <div className="location-details">
                <div className="street-name">
                  <div className="map-marker"><MapMarkerIcon /></div>
                  <b>{openAlarm.address}</b>
                </div>
                <p>{openAlarm.victim.firstname} {openAlarm.victim.lastname}</p>
                <p>{openAlarm.victim.age} {openAlarm.victim.gender}, {openAlarm.victim.size}</p>
              </div>
            </div>
            <div className="guard-items">
              <Menu style={styles.menu}>
                {
                  openAlarm.guards.map((guard, i) =>
                    <MenuItem
                      key={i}
                      data-id={guard.id}
                      style={styles.menuitem}
                      onClick={() => this.handleOpenAck(openAlarm.alarm_id, openAlarm.id, guard.id)}
                    >
                      <div className="guard-status">
                        <div className="guard-title">
                          <span className="name">{guard.name}</span>
                          <div className="status">{guard.address}</div>
                        </div>
                        <div className="alert-led">{String.fromCharCode('A'.charCodeAt(0) + i)}</div>
                      </div>
                    </MenuItem>
                  )
                }
              </Menu>
            </div>
            <div className="inform">
                <p>{openAlarm.guards.length} companies connected</p>
                <p className="notify">Waiting for acceptance.</p>
            </div>
          </div>
          <RaisedButton
            label="Send no guard?"
            style={styles.button}
            onClick={this.handleOpenDeny}
          />
          <Dialog
            title="Send no guard"
            actions={denyActions}
            modal
            open={openDeny} />
          <Dialog
            title="Dispatch guard"
            actions={ackActions}
            modal
            open={openAck} />
          <Dialog
            title="Incoming Alarm"
            actions={alarmActions}
            modal
            open={openAlarmModal}>
              <audio autoPlay controls style={{display: 'none'}}>
                <source src={require('../../sounds/alarm_sound.mp3')} type="audio/mpeg" />
              </audio>
          </Dialog>
        </div>
        <div className="map-container">
          <AlarmMapContainer alarm={originalOpenAlarm} />
        </div>
      </div>
    );
  }
}
