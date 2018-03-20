import React from 'react';
import PropTypes from 'prop-types';
import Pad from './pad';

class Pads extends React.Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.handlePadClick = this.handlePadClick.bind(this);
    this.state = { pad_a: {}, pad_b: {} };
  }

  componentDidMount() {
    const url = `/api/pads`;
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          pad_a: data.pad_a,
          pad_b: data.pad_b,
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Pad pad_data={this.state.pad_a} />
    );
  }
}

// Likes.propTypes = {
//   postid: PropTypes.number.isRequired,
// };

export default Pads;