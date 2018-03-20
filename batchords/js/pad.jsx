import React from 'react';
import PropTypes from 'prop-types';

class Pad extends React.Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    // this.handlePadClick = this.handlePadClick.bind(this);
    this.onClick = this.handleClick.bind(this);
    this.state = { pad_a: {}, pad_b: {}, pad_c: {}, pad_d: {}, pad_e: {}, pad_f: {}, pad_g: {}, pad_h: {} };
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
          pad_a: data.pads_info.pad_a,
          pad_b: data.pads_info.pad_b,
          pad_c: data.pads_info.pad_c,
          pad_d: data.pads_info.pad_d,
          pad_e: data.pads_info.pad_e,
          pad_f: data.pads_info.pad_f,
          pad_g: data.pads_info.pad_g,
          pad_h: data.pads_info.pad_h,
        });
      })
      .catch(error => console.log(error));
  }

  // handlePadClick() {
  //   var embed = new Flat.Embed('embed-container');
  //   embed.play().then(function () {
  //     // The score is playing
  //   });
  //   console.log("testing");
  //   console.log(this.state)
  // }

  handleClick(event) {
    const {id} = event.target;
    var embed = new Flat.Embed('embed-container');

    switch(id) {
      case "play_score":
        console.log("playing score");
        embed.play().then(function () {
        // The score is playing
        });
        break;

      case "stop_score":
        embed.stop().then(function () {
        });
        break;

      case "pause_score":
        embed.pause().then(function () {
          // The playback is paused
        });
        break;

      case "seek_note_left":
        embed.getCursorPosition().then(function (position) {
          var new_pos = 0;
          if(position.noteIdx != 0){
              new_pos = position.noteIdx - 1;
          }
          embed.setCursorPosition({
          partIdx: position.partIdx,
          staffIdx: position.staffIdx,
          voiceIdx: position.voiceIdx,
          measureIdx: position.measureIdx,
          noteIdx: new_pos
          }).then(function (position) {
              console.log(position)
          });
        });
        break;

      case "seek_note_right":
        console.log("Moving note right");
        embed.getCursorPosition().then(function (position) {
          embed.setCursorPosition({
          partIdx: position.partIdx,
          staffIdx: position.staffIdx,
          voiceIdx: position.voiceIdx,
          measureIdx: position.measureIdx,
          noteIdx: position.noteIdx + 1
          }).then(function (position) {
            console.log(position)
          });
        });
        break;

      case "seek_m_left":
        embed.getCursorPosition().then(function (position) {
          var new_pos = 0;
          if(position.measureIdx != 0){
              new_pos = position.measureIdx - 1;
          }
          embed.setCursorPosition({
              partIdx: position.partIdx,
              staffIdx: position.staffIdx,
              voiceIdx: position.voiceIdx,
              measureIdx: new_pos,
              noteIdx: 0
          }).then(function (position) {
              console.log(position)
          });
        });
        break;

      case "seek_m_right":
        embed.getCursorPosition().then(function (position) {
          var new_pos = 0;
          if(position.measureIdx != 0){
              new_pos = position.measureIdx + 1;
          }
          embed.setCursorPosition({
              partIdx: position.partIdx,
              staffIdx: position.staffIdx,
              voiceIdx: position.voiceIdx,
              measureIdx: new_pos,
              noteIdx: 0
          }).then(function (position) {
              console.log(position)
          });
        });
        break;

      case "enable_edit":
        embed.focusScore().then(function () {
        // Focus is now on the score
        });
        break;

    }
    console.log(id);
  }

  render() {
    let padA = null;
    let padB = null;
    let padC = null;
    let padD = null;
    let padE = null;
    let padF = null;
    let padG = null;
    let padH = null;
    // if (this.state.loaded) {
    if (true) {
      padA = (
        <div className="pad col-sm-3">
          <button className="button pad_a" id={this.state.pad_a.id} onClick={this.onClick}>
            {this.state.pad_a.name}
          </button>
        </div>
      );
      padB = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_b.id} onClick={this.onClick}>
            {this.state.pad_b.name}
          </button>
        </div>
      );
      padC = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name}
          </button>
        </div>
      );
      padD = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_d.id} onClick={this.onClick}>
            {this.state.pad_d.name}
          </button>
        </div>
      );
      padE = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_e.id} onClick={this.onClick}>
            {this.state.pad_e.name}
          </button>
        </div>
      );
      padF = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_f.id} onClick={this.onClick}>
            {this.state.pad_f.name}
          </button>
        </div>
      );
      padG = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_g.id} onClick={this.onClick}>
            {this.state.pad_g.name}
          </button>
        </div>
      );
      padH = (
        <div className="pad col-sm-3">
          <button className="button" id={this.state.pad_h.id} onClick={this.onClick}>
            {this.state.pad_h.name}
          </button>
        </div>
      );
    }
    return (
      <div className="pad-group">
        <div className="row">
          {padA}
          {padB}
          {padC}
          {padD}
        </div>
        <div className="row">
          {padE}
          {padF}
          {padG}
          {padH}
        </div>
      </div>
    );
  }
}

// Likes.propTypes = {
//   postid: PropTypes.number.isRequired,
// };

export default Pad;
