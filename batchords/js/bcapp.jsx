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
    return (
      <div id="bcApp">
        <Pad />
      </div>
    );
  }
}

export default BCApp;
