import React from 'react';
import Pad from './pad';


class BCApp extends React.Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
  }

  componentDidMount() {
  }


  render() {
    var container = document.getElementById('bcApp_div');
    return (
      <div id="bcApp">
        <Pad api_url={container.getAttribute('api_url')}/>
      </div>
    );
  }
}

export default BCApp;
