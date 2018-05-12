import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import marker_red from '../../img/alarm_marker_red.png';
import marker_green from '../../img/alarm_marker_green.png';

const style = {
  width: '100%',
  height: '100%'
}
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export class AlarmMapContainer extends Component {

  render() {
    const { google } = this.props;

    let guards = [];
    let openAlarm = {
      id: 0,
      status : false,
      guards: [],
      location: { latitude: 0, longitude: 0},
      victim: ""
    };
    let alarmMarkers = [];
    let bounds = null;

    if (google) {
      bounds = new google.maps.LatLngBounds();
    }

    if (this.props.alarm.status) {
      openAlarm = this.props.alarm;
      this.props.alarm.guards.forEach((guard, index) => {
        if (bounds) {
          const markerPos = new google.maps.LatLng(guard.latitude, guard.longitude);
          bounds.extend(markerPos);
        }
        guards.push(
          <Marker
            key={guard.id}
            title={guard.name}
            label={{
              text: labels[index],
              color: 'white',
              fontSize: '24px',
              height: '60px',
            }}
            labelClass="guard-marker-label"
            name={guard.name}
            position={{
              lat: guard.latitude,
              lng: guard.longitude
            }}
            icon={{
              url: marker_green,
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(32,65),
              labelOrigin:  new google.maps.Point(26,26),
            }}
          />
        );
      });

      if (bounds) {
        const alarmPos = new google.maps.LatLng(openAlarm.location.latitude, openAlarm.location.longitude);
        bounds.extend(alarmPos);
      }

      alarmMarkers.push(
        <Marker
          ref="alarmMarker"
          key={openAlarm.id}
          title='Alarm'
          position={{
            lat: openAlarm.location.latitude,
            lng: openAlarm.location.longitude
          }}
          icon={{ url: marker_red }}
        />
      );

      if (this.refs.mapContainer) {
        this.refs.mapContainer.map.fitBounds(bounds);
        this.refs.mapContainer.map.panToBounds(bounds);
      }
    }

    return (
      <div className="alarm-map-container">
        <Map
          ref="mapContainer"
          google={this.props.google}
          style={style}
        >
          {guards}
          {alarmMarkers}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCZ0GwtkfcDCdTUCVpxajJXfX4A5sx7les')
})(AlarmMapContainer)
