import React from 'react';
import {SignOut} from './Sign_out.js';
import { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Auth from 'j-toker';
import { Link } from 'react-router-dom'
var enzyme = require('enzyme');
enzyme.configure({ adapter: new Adapter() });

test('should sign out', () => {
      Auth.signOut(true);
  const checkIt = shallow(
    <SignOut />
  );

});
