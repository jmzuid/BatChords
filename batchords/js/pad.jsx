import React from 'react';
import PropTypes from 'prop-types';

class Pad extends React.Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    // this.handlePadClick = this.handlePadClick.bind(this);
    this._loadPads = this._loadPads.bind(this);
    this.onClick = this.handleClick.bind(this);
    this.state = { pad_a: {}, pad_b: {}, pad_c: {}, pad_d: {}, pad_e: {}, pad_f: {}, pad_g: {}, pad_h: {}, 
                   noteDuration: 3, measure_btype: 2, measure_beats: 4, ts_measures: 0,
                   tempo_measures: 0, tempo: 120, tutorial_section: 1};
  }

  componentDidMount() {
    this._loadPads(this.props.api_url);
  }

  handleClick(event) {
    const {id} = event.target;
    try {
      var embed = new Flat.Embed('embed-container');
    }
    catch(error) {
      console.log("No Flat embeded object on this page.");
    }

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

      case "set_note_flat":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.RemoveCourtesyAccidentals', 
              opts: { 
                  accidental: "flat",
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
          embed.edit([
            { name: 'action.AddAccidentals', 
              opts: { 
                  accidental: "flat",
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

      case "set_note_sharp":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.RemoveCourtesyAccidentals', 
              opts: { 
                  accidental: "sharp",
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
          embed.edit([
            { name: 'action.AddAccidentals', 
              opts: { 
                  accidental: "sharp",
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

      case "remove_accidentals":
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.RemoveAccidentals', 
              opts: { 
                  actionOrigin: "local.do",
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
        //Temp variable is to fix error where JavaScript cannot read the state variable when input into edit
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

      case "set_note_duration_dotted":
        //Temp variable is to fix error where JavaScript cannot read the state variable when input into edit
        let temp_dur_dot = this.state.noteDuration;
        console.log(temp_dur_dot);
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.ChangeDurationCrossMeasure', 
              opts: { 
                  actionOrigin:"local.do",
                  durationType: temp_dur_dot,
                  formatRests: true,
                  insertMode: "replace",
                  line:position.line,
                  measureIdx:position.measureIdx,
                  nbDots:1,
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


      case "incr_ts_measures":
        this.setState({ts_measures: this.state.ts_measures + 1});
        console.log(this.state.ts_measures); 
        break;

      case "decr_ts_measures":
        if(this.state.ts_measures == 0){
          return;
        }
        this.setState({ts_measures: this.state.ts_measures - 1});
        console.log(this.state.ts_measures); 
        break;

      case "incr_beats":
        if(this.state.measure_beats == 64){
          return;
        }
        this.setState({measure_beats: this.state.measure_beats + 1});
        console.log(this.state.measure_beats); 
        break;

      case "decr_beats":
        if(this.state.measure_beats == 1){
          return;
        }
        this.setState({measure_beats: this.state.measure_beats - 1});
        console.log(this.state.measure_beats); 
        break;

      case "incr_btype":
        if(this.state.measure_btype == 6){
          return;
        }
        this.setState({measure_btype: this.state.measure_btype + 1});
        console.log(this.state.measure_btype); 
        break;

      case "decr_btype":
        if(this.state.measure_btype == 0){
          return;
        }
        this.setState({measure_btype: this.state.measure_btype - 1});
        console.log(this.state.measure_btype); 
        break;

      case "set_time_signature":
        let temp_beats = this.state.measure_beats;
        let temp_btype = this.state.measure_btype;
        let temp_ts_meas = this.state.ts_measures;
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.SetTimeSignature', 
              opts: { 
                  actionOrigin:"local.do",
                  displayedTime: {"beats": temp_beats, "beat-type": Math.pow(2,temp_btype)},
                  line:position.line,
                  startMeasureIdx:position.measureIdx,
                  stopMeasureIdx:position.measureIdx+temp_ts_meas,
                  noteIdx:position.noteIdx,
                  partIdx:position.partIdx,
                  staffIdx:position.staffIdx,
                  timeSignature: {"beats": temp_beats, "beat-type": Math.pow(2,temp_btype)},
                  voiceIdx:position.voiceIdx
              } }
          ]).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
          });
        });
        break;

      case "incr_tempo_measures":
        this.setState({tempo_measures: this.state.tempo_measures + 1});
        console.log(this.state.tempo_measures); 
        break;

      case "decr_tempo_measures":
        if(this.state.tempo_measures == 0){
          return;
        }
        this.setState({tempo_measures: this.state.tempo_measures - 1});
        console.log(this.state.tempo_measures); 
        break;

      case "incr_tempo":
        if(this.state.tempo == 208){
          return;
        }
        this.setState({tempo: this.state.tempo + 1});
        console.log(this.state.tempo); 
        break;

      case "decr_tempo":
        if(this.state.tempo == 40){
          return;
        }
        this.setState({tempo: this.state.tempo - 1});
        console.log(this.state.tempo); 
        break;

      case "set_tempo":
        let tempo_meas = this.state.tempo_measures;
        let tempo_bpm = this.state.tempo;
        embed.getCursorPosition().then(function (position) {
          embed.edit([
            { name: 'action.SetTempo', 
              opts: { 
                  actionOrigin:"local.do",
                  startMeasureIdx:position.measureIdx,
                  stopMeasureIdx:position.measureIdx+tempo_meas,
                  tempo: {"bpm": tempo_bpm, "durationType": 3, "nbDots": 0, "qpm": tempo_bpm}
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

      case "up":
        let ts_temp_up = this.state.tutorial_section;
        if(ts_temp_up == 1){
          return;
        }
        let cur_sec_up = document.getElementById('tut' + ts_temp_up);
        let next_sec_up = document.getElementById('tut' + (ts_temp_up - 1));
        
        this.setState({tutorial_section: ts_temp_up - 1});

        console.log(ts_temp_up);
        console.log(this.state.tutorial_section);

        cur_sec_up.style.backgroundColor = "#1C1E1f";
        next_sec_up.style.backgroundColor = "green";
        break;

      case "down":
        let ts_temp = this.state.tutorial_section;
        if(ts_temp == 5){
          return;
        }
        let cur_sec = document.getElementById('tut' + ts_temp);
        let next_sec = document.getElementById('tut' + (ts_temp + 1));
        
        this.setState({tutorial_section: ts_temp + 1});

        console.log(ts_temp);
        console.log(this.state.tutorial_section);

        cur_sec.style.backgroundColor = "#1C1E1f";
        next_sec.style.backgroundColor = "green";
        break;

      case "tutorial":
        window.location.replace("http://localhost:8000/tutorial");
        break;

      case "ret_score":
        window.location.replace("http://localhost:8000/");
        break;

      case "file_menu":
      case "login":
        window.location.replace("http://localhost:8000/home");
        break;

      case "main_menu":
      case "not_implemented":
        this._loadPads('main_menu');
        break;

      // case "file_menu":
      //   this._loadPads('file_operations');
      //   break;

      case "playback_menu":
        this._loadPads('playback_menu');
        break;

      case "edit_menu":
        this._loadPads('edit_menu');
        break;

      case "misc_menu":
        this._loadPads('misc_menu');
        break;

      case "time_signature_menu":
        this._loadPads('time_signature_menu');
        break;

      case "duration_menu":
        this._loadPads('duration_menu');
        break;

      case "accidentals_menu":
        this._loadPads('accidentals_menu');
        break;

      case "tempo_menu":
        this._loadPads('tempo_menu');
        break;

      case "tutorial_pads":
        this._loadPads('tutorial_pads');
        break;
    }
    console.log(id);
  }

  _loadPads(inp_url){
    const set_url = `/api/pads/` + inp_url;
        fetch(set_url, { credentials: 'same-origin' })
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
    let tut_check = null;
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

    if(this.state.pad_a.id == "decr_ts_measures"){
      padA = (
        <div className="pad col-sm-3">
          <button className="button pad_a" id={this.state.pad_a.id} onClick={this.onClick}>
            {this.state.pad_a.name} - ({this.state.ts_measures})
          </button>
        </div>
      );
    }
    else if(this.state.pad_a.id == "set_tempo"){
      padA = (
        <div className="pad col-sm-3">
          <button className="button pad_a" id={this.state.pad_a.id} onClick={this.onClick}>
            {this.state.pad_a.name} - {this.state.tempo} - {this.state.tempo_measures + 1} measures
          </button>
        </div>
      );
    }

    if(this.state.pad_b.id == "incr_ts_measures"){
      padB = (
        <div className="pad col-sm-3">
          <button className="button pad_b" id={this.state.pad_b.id} onClick={this.onClick}>
            {this.state.pad_b.name} - ({this.state.ts_measures + 2})
          </button>
        </div>
      );
    }
    else if(this.state.pad_b.id == "decr_tempo"){
      padB = (
        <div className="pad col-sm-3">
          <button className="button pad_b" id={this.state.pad_b.id} onClick={this.onClick}>
            {this.state.pad_b.name} - {this.state.tempo - 1} bpm
          </button>
        </div>
      );
    }


    if(this.state.pad_b.id == "decr_note_duration"){
      padB = (
        <div className="pad col-sm-3">
          <button className="button pad_b" id={this.state.pad_b.id} onClick={this.onClick}>
            {this.state.pad_b.name} - ({dur_map.get(this.state.noteDuration + 1)})
          </button>
        </div>
      );
    }

    if(this.state.pad_c.id == "incr_note_duration"){
      padC = (
        <div className="pad col-sm-3">
          <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name} - ({dur_map.get(this.state.noteDuration - 1)})
          </button>
        </div>
      );
    }
    else if(this.state.pad_c.id == "decr_beats"){
      padC = (
        <div className="pad col-sm-3">
          <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name} - ({this.state.measure_beats - 1})
          </button>
        </div>
      );
    }
    else if(this.state.pad_c.id == "incr_tempo"){
      padC = (
        <div className="pad col-sm-3">
          <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name} - {this.state.tempo + 1} bpm
          </button>
        </div>
      );
    }
    
    if(this.state.pad_d.id == "incr_beats"){
      padD = (
        <div className="pad col-sm-3">
          <button className="button pad_d" id={this.state.pad_d.id} onClick={this.onClick}>
            {this.state.pad_d.name} - ({this.state.measure_beats + 1})
          </button>
        </div>
      );
    }

    if(this.state.pad_f.id == "set_time_signature"){
      padF = (
        <div className="pad col-sm-3">
          <button className="button pad_f" id={this.state.pad_f.id} onClick={this.onClick}>
            {this.state.pad_f.name} - ({this.state.measure_beats}/{Math.pow(2,this.state.measure_btype)}) - {this.state.ts_measures + 1} measures
          </button>
        </div>
      );
    }
    else if(this.state.pad_f.id == "set_note_duration"){
      padF= (
        <div className="pad col-sm-3">
          <button className="button pad_f" id={this.state.pad_f.id} onClick={this.onClick}>
            {this.state.pad_f.name} - ({dur_map.get(this.state.noteDuration)})
          </button>
        </div>
      );
    }
    else if(this.state.pad_f.id == "decr_tempo_measures"){
      padF = (
        <div className="pad col-sm-3">
          <button className="button pad_f" id={this.state.pad_f.id} onClick={this.onClick}>
            {this.state.pad_f.name} - ({this.state.tempo_measures})
          </button>
        </div>
      );
    }

    if(this.state.pad_g.id == "decr_btype"){
      padG = (
        <div className="pad col-sm-3">
          <button className="button pad_g" id={this.state.pad_g.id} onClick={this.onClick}>
            {this.state.pad_g.name} - ({Math.pow(2,this.state.measure_btype - 1)})
          </button>
        </div>
      );
    }
    else if(this.state.pad_g.id == "set_note_duration_dotted"){
      padG= (
        <div className="pad col-sm-3">
          <button className="button pad_g" id={this.state.pad_g.id} onClick={this.onClick}>
            {this.state.pad_g.name} - ({dur_map.get(this.state.noteDuration)}-Dotted)
          </button>
        </div>
      );
    }
    else if(this.state.pad_g.id == "incr_tempo_measures"){
      padG = (
        <div className="pad col-sm-3">
          <button className="button pad_g" id={this.state.pad_g.id} onClick={this.onClick}>
            {this.state.pad_g.name} - ({this.state.tempo_measures + 2})
          </button>
        </div>
      );
    }

    if(this.state.pad_h.id == "incr_btype"){
      padH = (
        <div className="pad col-sm-3">
          <button className="button pad_h" id={this.state.pad_h.id} onClick={this.onClick}>
            {this.state.pad_h.name} - ({Math.pow(2,this.state.measure_btype + 1)})
          </button>
        </div>
      );
    }


    if(this.state.pad_d.id == "tutorial_check"){
      if(this.state.tutorial_section == 1){
        tut_check = (
            <div id="tutorial_sec1">
              <h1> Section 1 </h1>
              <p> aslkdfasdfkjasdflkjsdflkjasdf 
              asldkfjaslkdfjlaskjdflakjsdflkjasdf

              asldfkjasldkfjalsfjdlaskjfdlsa
              alskdflaskjfd
              alskdjflaskjfdj
              </p>
              <h1> ya </h1>
              <h1> ya </h1>
              <h1> ya </h1>
              <h1> ya </h1>
            </div>
        );
      }
    }


    return (
      <div className="all_content">
        <div className="tutorial_content">
          {tut_check}
        </div>
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
      </div>
    );
  }
}

// Likes.propTypes = {
//   postid: PropTypes.number.isRequired,
// };

export default Pad;
