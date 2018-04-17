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
                   noteDuration: 3, measure_btype: 2, measure_beats: 4, ts_measures: 0, score_index: 0, score_id: "", img_url: ""};
  }

  componentDidMount() {
    const url = `/api/pads/` + this.props.api_url;
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
      case "new_score":
        console.log("Go to http://localhost:8000/createScore")
        window.location.replace("http://localhost:8000/createScore");
        break;

      case "logout":
        console.log("Go to http://localhost:8000/logout")
        window.location.replace("http://localhost:8000/logout");
        break;

      case "tutorial":
        window.location.replace("http://localhost:8000/tutorial");
        break;

      case "login":
        window.location.replace("https://flat.io/auth/oauth?client_id=6b910a07-aeaa-49ff-9770-5f3c452a350a&response_type=code&scope=account.public_profile+scores+scores.social+scores.readonly+account.public_profile&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin");
        break;

      case "save": //TODOOOOOO
        console.log("Saving score to Flat")
         // Turn embed into XML
        embed.getMusicXML().then(function (xml) {
          console.log("XML: ",xml); // Plain XML file (string)

          // Send "New Version" request with the XML to Flat's REST API
          const url = "/save?title=HOPE&xml=" + xml;
          //data = {data: xml, autosave: false, description:"New Revision from BatChords"} //moved this to server side
          //access_token = "0c73df1879c52f87555fe3bed875a5d95656ba67b8c20e0ee1318f81c4d699977fc9f689f1c5de739bba4fadafe9d0cd17fb3526c7b6b9b0766a7d272ee7e976" //TODO
          fetch(url,{ credentials: 'same-origin'}).then((response) => {
              console.log("save request response: ",response);
              if (!response.ok) throw Error(response.statusText);
            })
        }).catch(function (error) {
            // Error while executing the actions
              console.log("embedEdit error: " + error)
        });
        break;

      case "next_score":
        console.log("NEXT SCORE")
        fetch("/api/v1/user", { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log("next_score: Trying to set score state")
            console.log("next_score: current score_index and score_id", this.state.score_index, this.state.score_id)
          let numScores = (data["scores"]).length()
          this.setState({
            score_index: (this.state.score_index + 1),
            score_id: data["scores"][((this.state.score_index + 1)%numScores)].id
          });
         console.log("next_score: Trying to set score state")
         console.log("next_score: current score_index and score_id", this.state.score_index, this.state.score_id)

        })
        .catch(error => console.log(error));
        break;
      case "open":
        console.log("score.id",this.state.score_id)
        let score_id_temp = this.state.score_id
        let score_url = "/chooseScore?scoreid=" + score_id_temp
        console.log("DEBUG","score_url",score_url)
        window.location.replace(score_url);
        break;

      case "main_menu":
      case "not_implemented":
        this._loadPads('main');
        break;

      case "file_menu":
        this._loadPads('file_operations');
        break;

      case "playback_menu":
        this._loadPads('playback');
        break;

      case "edit_mode":
        this._loadPads('edit');
        break;

      case "measure_menu":
        this._loadPads('measure_functions');
        break;

      case "time_signature_menu":
        this._loadPads('time_signature');
        break;

      case "note_functions":
        this._loadPads('note_functions');
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
    <img src={this.state.img_url}>
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

    if(this.state.pad_b.id == "incr_ts_measures"){
      padB = (
        <div className="pad col-sm-3">
          <button className="button pad_b" id={this.state.pad_b.id} onClick={this.onClick}>
            {this.state.pad_b.name} - ({this.state.ts_measures + 2})
          </button>
        </div>
      );
    }


    if(this.state.pad_c.id == "decr_note_duration"){
      padC = (
        <div className="pad col-sm-3">
          <button className="button pad_c" id={this.state.pad_c.id} onClick={this.onClick}>
            {this.state.pad_c.name} - ({dur_map.get(this.state.noteDuration + 1)})
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

    if(this.state.pad_d.id == "incr_note_duration"){
      padD = (
        <div className="pad col-sm-3">
          <button className="button pad_d" id={this.state.pad_d.id} onClick={this.onClick}>
            {this.state.pad_d.name} - ({dur_map.get(this.state.noteDuration - 1)})
          </button>
        </div>
      );
    }
    else if(this.state.pad_d.id == "incr_beats"){
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

    if(this.state.pad_g.id == "decr_btype"){
      padG = (
        <div className="pad col-sm-3">
          <button className="button pad_g" id={this.state.pad_g.id} onClick={this.onClick}>
            {this.state.pad_g.name} - ({Math.pow(2,this.state.measure_btype - 1)})
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
    else if(this.state.pad_h.id == "incr_btype"){
      padH = (
        <div className="pad col-sm-3">
          <button className="button pad_h" id={this.state.pad_h.id} onClick={this.onClick}>
            {this.state.pad_h.name} - ({Math.pow(2,this.state.measure_btype + 1)})
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
