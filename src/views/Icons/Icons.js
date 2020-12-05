import React, { Component } from 'react';
class PatientList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,

    };
    this._mounted = true;
  }

  componentWillMount() {
    this.destroysession();
  }

  destroysession = () => {
    let localStorage
    // If we're testing, use a local storage polyfill
    if (global.process && process.env.NODE_ENV === 'test') {
      localStorage = require('localStorage')
    } else {
      // If not, use the browser one
      localStorage = global.window.localStorage
    }
    localStorage.removeItem('token')
    localStorage.removeItem('users')
    window.location = '/admin'
  }

  componentWillUnmount() {
    this._mounted = false
  }


  render() {
    return (
      <div  >

      </div>
    );
  }
}
export default (PatientList);
