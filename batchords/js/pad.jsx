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
    embed.play().then(function () {
      // The score is playing
    });
  }

  render() {
    return (
      <div className="pad">
        <button id="pad-button" onClick={handleLikeClick}>
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
