import React from 'react';
import PropTypes from 'prop-types';

class Pad extends React.Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.handlePadClick = this.handlePadClick.bind(this);
  }

  componentDidMount() {
  }

  handlePadClick() {
    var embed = new Flat.Embed('embed-container');
    embed.play().then(function () {
      // The score is playing
    });
    console.log("testing");
  }

  render() {
    return (
      <div className="pad">
        <button id="pad-button" onClick={this.handlePadClick}>
          test
        </button>
      </div>
    );
  }
}

// Likes.propTypes = {
//   postid: PropTypes.number.isRequired,
// };

export default Pad;
