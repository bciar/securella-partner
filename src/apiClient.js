let backendHost;
const hostname = window && window.location && window.location.hostname;

if(hostname === 'security.seon.network') {
  backendHost = 'https://api.seon.network';
} else if(hostname === 'security.staging.seon.network') {
  backendHost = 'https://api.staging.seon.network';
} else {
  backendHost = 'http://127.0.0.1:3000';
}

const apiVersion = 'v1';
const API_ROOT = `${backendHost}/api/${apiVersion}/`;

const ApiURL = (slug) => {
  return API_ROOT + slug;
}

export default ApiURL;
