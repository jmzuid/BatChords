import React from 'react';
import PropTypes from 'prop-types';

class Pad extends React.Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    // this.handlePadClick = this.handlePadClick.bind(this);
    this.onClick = this.handleClick.bind(this);
    this.state = { pad_a: {}, pad_b: {}, pad_c: {}, pad_d: {}, pad_e: {}, pad_f: {}, pad_g: {}, pad_h: {}, noteDuration: 3 };
  }

  componentDidMount() {
    const url = `/api/pads/file_operations`;
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
          new_pos = position.measureIdx + 1;
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


      case "pitch_up":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.ShiftChordDiatonicUp', 
              opts: { 
                  actionOrigin:"local.do",
                  measureIdx:position.measureIdx,
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "pitch_down":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.ShiftChordDiatonicDown', 
              opts: { 
                  actionOrigin:"local.do",
                  measureIdx:position.measureIdx,
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "remove_note":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.RemoveNote', 
              opts: { 
                  actionOrigin:"local.do",
                  formatRests: true,
                  insertMode: "replace",
                  isConcertPitch: false,
                  line:position.line,
                  measureIdx:position.measureIdx,
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "incr_note_duration":
        if(this.state.noteDuration == 1){
          return;
        }
        this.setState({noteDuration: this.state.noteDuration - 1});
        console.log(this.state.noteDuration); 
        break;

      case "decr_note_duration":
        if(this.state.noteDuration == 7){
          return;
        }
        this.setState({noteDuration: this.state.noteDuration + 1});
        console.log(this.state.noteDuration); 
        break;

      case "set_note_duration":
        let temp_dur = this.state.noteDuration;
        console.log(temp_dur);
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.ChangeDurationCrossMeasure', 
              opts: { 
                  actionOrigin:"local.do",
                  durationType: temp_dur,
                  formatRests: true,
                  insertMode: "replace",
                  line:position.line,
                  measureIdx:position.measureIdx,
                  nbDots:0,
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "add_measure":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.AddMeasure', 
              opts: { 
                  actionOrigin:"local.do",
                  measureIdx:(position.measureIdx + 1),
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "remove_measure":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.RemoveOrClearMeasure', 
              opts: { 
                  actionOrigin:"local.do",
                  measureIdx:(position.measureIdx),
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "change_staff":
        embed.getCursorPosition().then(function (position) {
          let spos = position.staffIdx;
          if(spos == 1){
            spos = 0;
          } else {
            spos = 1;
          }
          embed.setCursorPosition({
          partIdx: position.partIdx,
          staffIdx: spos,
          voiceIdx: position.voiceIdx,
          measureIdx: position.measureIdx,
          noteIdx: position.noteIdx
          }).then(function (position) {
            console.log(position)
          });
        });
        break;

      case "tutorial":
        window.location.replace("http://localhost:8000/tutorial");
        break;

      case "main_menu":
      case "not_implemented":
        const main_url = `/api/pads/main`;
        fetch(main_url, { credentials: 'same-origin' })
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

        break;

      case "file_menu":
        const file_url = `/api/pads/file_operations`;
        fetch(file_url, { credentials: 'same-origin' })
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

        break;

      case "playback_menu":
        const play_url = `/api/pads/playback`;
        fetch(play_url, { credentials: 'same-origin' })
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

        break;

      case "edit_mode":
        const edit_url = `/api/pads/edit`;
        fetch(edit_url, { credentials: 'same-origin' })
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

        break;

      case "measure_menu":
        const meas_url = `/api/pads/measure_functions`;
        fetch(meas_url, { credentials: 'same-origin' })
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

        break;



    }
    console.log(id);
  }

  render() {
    let dur_map = new Map([[7,"1/64"],[6,"1/32"],[5,"1/16"],[4,"1/8"],[3,"1/4"],[2,"1/2"],[1,"1"]]);

    let padA = null;
    let padB = null;
    let padC = null;
    let padD = null;
    let padE = null;
    let padF = null;
    let padG = null;
    let padH = null;
    // if (this.state.loaded) {
    padA = (
      <div className="pad col-sm-3">
        <button className="button pad_a" id={this.state.pad_a.id} onClick={this.onClick}>
          {this.state.pad_a.name}
        </button>
      </div>
    );
    padB = (
      <div className="pad col-sm-3">
        <button className="button pad_b" id={this.state.pad_b.id} onClick={this.onClick}>
          {this.state.pad_b.name}
        </button>
      </div>
    );
    padC = (
      <div className="pad col-sm-3">
        <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
          {this.state.pad_c.name}
        </button>
      </div>
    );
    padD = (
      <div className="pad col-sm-3">
        <button className="button pad_d" id={this.state.pad_d.id} onClick={this.onClick}>
          {this.state.pad_d.name}
        </button>
      </div>
    );
    padE = (
      <div className="pad col-sm-3">
        <button className="button pad_e" id={this.state.pad_e.id} onClick={this.onClick}>
          {this.state.pad_e.name}
        </button>
      </div>
    );
    padF = (
      <div className="pad col-sm-3">
        <button className="button pad_f" id={this.state.pad_f.id} onClick={this.onClick}>
          {this.state.pad_f.name}
        </button>
      </div>
    );
    padG = (
      <div className="pad col-sm-3">
        <button className="button pad_g" id={this.state.pad_g.id} onClick={this.onClick}>
          {this.state.pad_g.name}
        </button>
      </div>
    );
    padH = (
      <div className="pad col-sm-3">
        <button className="button pad_h" id={this.state.pad_h.id} onClick={this.onClick}>
          {this.state.pad_h.name}
        </button>
      </div>
    );

    if(this.state.pad_c.id == "decr_note_duration"){
      padC = (
        <div className="pad col-sm-3">
          <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name} - ({dur_map.get(this.state.noteDuration + 1)})
          </button>
        </div>
      );
    }

    if(this.state.pad_d.id == "incr_note_duration"){
      padD = (
        <div className="pad col-sm-3">
          <button className="button pad_d" id={this.state.pad_d.id} onClick={this.onClick}>
            {this.state.pad_d.name} - ({dur_map.get(this.state.noteDuration - 1)})
          </button>
        </div>
      );
    }

    if(this.state.pad_h.id == "set_note_duration"){
      padH= (
        <div className="pad col-sm-3">
          <button className="button pad_h" id={this.state.pad_h.id} onClick={this.onClick}>
            {this.state.pad_h.name} - ({dur_map.get(this.state.noteDuration)})
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
