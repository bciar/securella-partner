import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import CenterFocusIcon from 'material-ui/svg-icons/image/center-focus-strong';

import marker_red from '../img/marker_red.png';
import marker_green from '../img/marker_green.png';
import marker_yellow from '../img/marker_yellow.png';

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      bounds: null,
      shouldCenter: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ shouldCenter: true });
    }, 1500);
  }

  componentWillReceiveProps(nextProps) {
    const { availableGuards, operatingGuards, occupiedGuards, google, selectedGuard } = nextProps;
    if (this.props.selectedGuard && (selectedGuard !== this.props.selectedGuard)) {
      if (this.refs.mapContainer && this.refs.mapContainer.map) {
        const markerPos = new google.maps.LatLng(selectedGuard.latitude, selectedGuard.longitude);
        this.refs.mapContainer.map.panTo(markerPos);
      }
    }

    let bounds = null;
    if (google) {
      bounds = new google.maps.LatLngBounds();

      availableGuards.forEach(guard => {
        const markerPos = new google.maps.LatLng(guard.latitude, guard.longitude);
        bounds.extend(markerPos);
      });

      operatingGuards.forEach(guard => {
        const markerPos = new google.maps.LatLng(guard.latitude, guard.longitude);
        bounds.extend(markerPos);
      });

      occupiedGuards.forEach(guard => {
        const markerPos = new google.maps.LatLng(guard.latitude, guard.longitude);
        bounds.extend(markerPos);
      });
      this.setState({ bounds });
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  onCenterMap = () => {
    if (this.refs.mapContainer && this.refs.mapContainer.map && this.state.bounds && this.state.shouldCenter) {
      this.refs.mapContainer.map.fitBounds(this.state.bounds);
      this.refs.mapContainer.map.panToBounds(this.state.bounds);
      this.setState({ shouldCenter: false });
    }
  }

  render() {
    const jsx_Marker = (guard, marker_url) => (
      <Marker
        key={guard.id}
        title = {guard.name}
        name = {guard.name}
        position={{lat: guard.latitude, lng: guard.longitude}}
        icon={{ url: marker_url }}
        onClick= { this.onMarkerClick }
      />
    );

    this.onCenterMap();

    return (
      <div className="map-container">
        <IconButton onClick={() => this.setState({ shouldCenter: true })}><CenterFocusIcon /></IconButton>
        <Map
          ref="mapContainer"
          google={this.props.google}
          className="dash-map-container__size"
          onClick={this.onMapClick}
        >
          { this.props.operatingGuards.map(guard=>jsx_Marker(guard, marker_red)) }
          { this.props.availableGuards.map(guard=>jsx_Marker(guard, marker_green)) }
          { this.props.occupiedGuards.map(guard=>jsx_Marker(guard, marker_yellow)) }

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            className="dash-map-infowindow"
          >
                <p className="dash-map-infowindow__p">{this.state.selectedPlace.name}</p>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCZ0GwtkfcDCdTUCVpxajJXfX4A5sx7les')
})(MapContainer)
