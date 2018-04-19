var midi, data;

/* map of keys for our ketyboard */
/* valid note values are 0 - 83 */
/* 84 is a bug. */
var notes = new Map();
var notes_active = {};
/* initialize notes map from 12 - 95 */
for (i = 12; i < 96; i++){
  //console.log("init notes["+i+"]");
  notes[i] = new Array();
  //console.log(Array.isArray(notes[i]));
  notes_active[i] = false ;
}

//check to see which chords this note is a member of.
function noteUnused(noteValue){
  console.log("noteUnused["+noteValue+"] length: " + noteValue.length);
  return notes[noteValue].length == 0 || ((typeof notes[noteValue]) == "undefined");
}

// Takes in a two-element array
// and converts it to a 3-digit numrerical ID.
// First two digits are the numverical value
// of the root.
// The last is the distance between the two notes.
// second refers to the second note in the mapping,
// not the second note in the musical chord.
function chordID(root, second){
  //var root = chord_in[0] ;
  //var other = chord_in[1] ;
  var diff = second - root ;
  //console.log("chordID: root " + root);
  //console.log("chordID: other " + other);
  var rootStr = root.toString(10);
  var diffStr = diff.toString(10);
  var id = rootStr + diffStr ;
  //console.log("test");
  //console.log(id);
  //console.log("test");
  console.log("chordID returned: " + id);
  return id;
}


// a global map for steps
var m_step = new Map([[0,"C"],[1,"CD"],[2,"D"],[3,"DE"],[4,"E"],[5,"F"],[6,"FG"],[7,"G"],[8,"GA"],[9,"A"],[10,"AB"],[11,"B"]]);
// var m_button = new Map([100,"pad_a"])

var chord_mode = true ;
var chord_locked = false ;
var note_sentinel = 85 ;
var chords_playing = new Array();

//Converts a pitch to a note frequency.
//function frequencyFromNote( note ) {
//  var ret = 440 * Math.pow(2,(note-69)/12);
//  //console.log("note:" + note + "converts to frequency: " + ret);
//  return ret;






// return the soundID html identifier.
function soundId(id) {
    return 'sound-' + id;
  };

function sound(id) {
    var it = document.getElementById(id);
    return it;
  };

//convert the raw midi value
// to a note value.
function Convert_note_to_sound(noteValue){
  var step = m_step.get(noteValue % 12);
  var octave = Math.floor(noteValue / 12);
  var note = step.concat(octave);
  var note2 = soundId(note);
  //console.log("Convert_note_to_sound : " + note2);
  return sound(note2);
};



var audioCtx = new (AudioContext || webkitAudioContext)();
var osc = audioCtx.createOscillator();

osc.type = "triangle" ; // the type of oscillator we want to use.
osc.connect(audioCtx.destination); //connect to the speakers.

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

/* a sleep function. */
function sleep(dur){
  var waitUntil = new Date().getTime() + dur*1000;
  while(new Date().getTime() < waitUntil) true;
}


//inputs a two-note array, outputs a chord.
//FIXME: does not handle single-note input.
function buildChord(c){
  // Maj7 = dist 7
  // C7 = dist 4
  // Cm7 = dist 10
  // CmM7 = dist 3
  // Cm7-5  = dist 8
  // Cdim7 = dist 9
  // Csus7 = dist 5
  var chord = new Object() ;
  var root = c[0];
  chord.root = root;
  switch (c[1] - root){
    case 3:   // m7-5
      console.log("buildChord case 3.");
      chord.second = root + 3;
      chord.third = root + 7;
      chord.fourth = root + 11;
      break;
    case 4:   // m7
      console.log("buildChord case 4.");
      chord.second = root + 4;
      chord.third = root + 7;
      chord.fourth = root + 11;
      break;
    case 5:  // sus7
      console.log("buildChord case 5.");
      chord.second = root + 5;
      chord.third = root + 7;
      chord.fourth = root + 10;
      break;
    case 6: // m7-5
      console.log("buildChord case 6.");
      chord.second = root + 3;
      chord.third = root + 6;
      chord.fourth = root + 10;
      break;
    case 7: // Maj7
      console.log("buildChord case 7.");
      chord.second = root + 4;
      chord.third = root + 7;
      chord.fourth = root + 11;
      break;
    case 9:  // dim7
      console.log("buildChord case 9.");
      chord.second = root + 3;
      chord.third = root + 6;
      chord.fourth = root + 9;
      break;
    case 10:  // m7
      console.log("buildChord case 10.");
      chord.second = root + 3;
      chord.third = root + 7;
      chord.foruth = root + 10;
      break;
    default:
      console.log("do nothing");
      return ;
  }
  return chord;
};

// Take a chord ID and return a chord.
// Splut the chordID into two parts,
// the root and the second note (which is 1 or 2 digits).
// call buildChord to construct the rest of the chord.
function chordfromID(chordID){
  var label = chordID.toString();
  console.log("test chordfromID");
  console.log(label);
  console.log("test chordfromID");
  var rootLabel = Number(label.substr(0,2));
  var diff = Number(label.substr(2));
  //var chordString = [rootLabel,diff];
  var chordPair = [rootLabel, (rootLabel + diff)];
  //chordPair[0] = Number(chordString[0])
  //chordPair[1] = chordPair[0] + Number(chordString[1]);
  console.log("chordPair:");
  console.log(chordPair[0]);
  console.log(chordPair[1]);
  console.log("chordPair.");
  var chord = buildChord(chordPair);
  console.log(chord.root);
  console.log(chord.second);
  console.log(chord.third);
  console.log(chord.fourth);
  return chord;
}


//Check to see if chord contains midi note value val
function chordStartwithValue(chord, val) {
  console.log("Checking chordContainsValue: " + val);
  return chord.root == val ;
};

//play a prebuilt chord
function playChord(chord_label, chord){
  //mark notes as active
  //var chord_label = chordID( [chord.root, chord.second] );
  console.log("Pushing label: " + chord_label);
  chords_playing.push(chord);
  notes[chord.root].push(chord_label);
  notes[chord.second].push(chord_label);
  notes[chord.third].push(chord_label);
  notes[chord.fourth].push(chord_label);

  console.log(notes[chord.root].indexOf(chord_label) != -1);
  console.log(notes[chord.second].indexOf(chord_label) != -1);
  console.log(notes[chord.third].indexOf(chord_label) != -1);
  console.log(notes[chord.fourth].indexOf(chord_label) != -1);
  //console.log(chord_label);
  beginNoteSingle(chord.root);
  beginNoteSingle(chord.second);
  beginNoteSingle(chord.third);
  beginNoteSingle(chord.fourth);
  return;
};

//Returns a list of possible chords with the
// noteValue as root.
function chordsFromRoot(noteValue) {
  var chordList = new Array();
  //chordList.push(chordID(noteValue));
  chordList.push(chordID(noteValue, (noteValue + 3)));
  chordList.push(chordID(noteValue, (noteValue + 4)));
  chordList.push(chordID(noteValue, (noteValue + 5)));
  chordList.push(chordID(noteValue, (noteValue + 6)));
  chordList.push(chordID(noteValue, (noteValue + 7)));
  chordList.push(chordID(noteValue, (noteValue + 9)));
  chordList.push(chordID(noteValue, (noteValue + 10)));
  return chordList;
};

//Inputs the chord array, and a value no longer played
//Iterates over chord_list and stops any chord
// which has a note matching that value. Then, it splices
// the array to remove that chord.
function stopChordswithNote(note){
  //console.log("stopChordswithNote: note: " + note);
  var chord_list = chordsFromRoot(note);
  for(i = 0; i < chord_list.length; i++){
    //console.log("testing chord label: " + chord_list[i] );
    //console.log(Array.isArray(notes[note]));
    if(notes[note].indexOf(chord_list[i]) != -1 ){
      //build a chord from the chord ID and stop
      // and tell each note to stop.
      console.log("Calling stop for label " + chord_list[i]);
      var chord = chordfromID(chord_list[i]);
      stopChord(chord_list[i], chord);
    }
  }
};

// takes a single value and a chord_label.
// Removes the association between the chord and note.
function removeChordfromNotes(chord_label, noteValue){
  console.log("removeChordfromNotes: noteValue: "+ noteValue);
  //console.log("removeChordfromNotes: isArray: " + Array.isArray(notes));
  var i = notes[noteValue].indexOf(chord_label);
  if (i != -1){
    notes[noteValue] = notes[noteValue].splice(i,0);
    //console.log("removed "+chord_label+" from "+noteValue);
    //console.log("after splice, lenght: " + notes[noteValue].length);
    //console.log(noteUnused(noteValue));
    if(noteUnused(noteValue)){
        notes_active[noteValue] = false;
        console.log("endNoteSingle: " + noteValue);
        endNoteSingle(noteValue);
    }
  }

}

// Call endNote for all elements in the chord.
function stopChord(label, chord) {
  //var label = chordID([chord.second, chord.third]);
  removeChordfromNotes(label, chord.root);
  console.log("removeChordfromNotes: note: " + chord.root);
  removeChordfromNotes(label, chord.second);
  console.log("removeChordfromNotes: note: " + chord.second);
  removeChordfromNotes(label, chord.third);
  console.log("removeChordfromNotes: note: " + chord.third);
  removeChordfromNotes(label, chord.fourth);
  console.log("removeChordfromNotes: note: " + chord.fourth);
  endNoteSingle(chord.root);
  endNoteSingle(chord.second);
  endNoteSingle(chord.third);
  endNoteSingle(chord.fourth);
};

//begins a single note not in the chord.
function beginNoteChord(noteValue) {
  //var pitch = audioCtx.createOscillator();
  //pitch.type = "triangle";
  //freq = frequencyFromNote(noteValue);
  //pitch.frequency.setValueAtTime(freq, audioCtx.currentTime);
  //pitch.connect(audioCtx.destination);
  //pitch.start(0);
  //return pitch ;

};

//begins single notes in the notes array.
function beginNoteSingle(noteValue){
  audio = Convert_note_to_sound(noteValue);
  audio.currentTime = .8; // remove some of the time delay.
  notes_active[noteValue] = true;
  highlightKey(noteValue);
  audio.play();
  //return pitch ;
};


// End the note in the notes array of value noteValue
function endNoteSingle(noteValue){

  console.log("endNoteSingle: note value " + noteValue);
  var audio = Convert_note_to_sound(noteValue);
  audio.pause();
  unhighlightKey(noteValue);
  audio.currentTime = .75 ;
  notes_active[noteValue] = false ;
};


// midi functions
function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
    var inputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

// global array used ONLY in chord mode
var arr = []
var chord = new Array(2);
chord.fill(note_sentinel); //maximum values for keyboard input.

//console.log("new array of size: " + chord.length);

// push one note onto sheet, do not attempt to move on
// embedEdit("C", 4)
// arguments[0] is step: C
// arguments[1] is octave: 4
function embedEdit(){
    let step_inp = String(arguments[0]);
    //console.log(step_inp);
    let octave_inp = Number(arguments[1]);
    //console.log(octave_inp);
    var acc = null;
    if (step_inp.length == 2) {
        acc = "sharp";
        step_inp = step_inp[0];
    }
		embed.getCursorPosition().then(function (position) {
            embed.edit([
              { name: 'action.AddNoteCrossMeasure',
                opts: {
                    accidental:acc,
                    actionOrigin:"local.do",
                    durationType:3,
                    insertMode:"replace",
                    isConcertPitch:false,
                    measureIdx:position.measureIdx,
                    nbDots:0,
                    noteIdx:position.noteIdx,
                    partIdx:position.partIdx,
                    // pitch:{step: arguments[0], octave: arguments[1]},
                    pitch:{step: step_inp, octave: octave_inp},
                    staffIdx:position.staffIdx,
                    voiceIdx:position.voiceIdx
                } }
            ]).catch(function (error) {
              // Error while executing the actions
                //console.log("embedEdit error: " + error)
            });
        });
}



/*
    Range: 12 - 95
*/
function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.


    //console.log("Receiving note: " + data[1]);

    //Always turn on the note.
    switch (data[0]){
      //turn on the note
      case 144:
        beginNoteSingle(data[1]);
        break;
      //turn off the note
      case 128:
        endNoteSingle(data[1]);
        break;
      default:
    };

    //If not in chord mode,
    //simply output notes.
    if (chord_mode && (data[0] == 144) ){
      if (chord[0] == note_sentinel) { // check first element in chord not sentinel.
        chord[0] = data[1];
      } else { //chord fill chord 2.
        chord[1] = data[1];
        chord.sort();
        //beginNoteSingle(data[1]);
        //sleep(.4);
        //if(chord[1] != note_sentinel){
        //console.log("chord[0]: " + chord[0]);
        //console.log("chord[1]: " + chord[1]);
        var chord_in = chord.slice();
        var newChord = buildChord(chord_in);
        console.log("newChord.root: "   + newChord.root);
        console.log("newChord.second: " + newChord.second);
        console.log("newChord.third: "  + newChord.third);
        console.log("newChord.fourth: " + newChord.fourth);
        console.log(chord[0]);
        console.log(chord[1]);
        var label = chordID(chord[0],chord[1]);
        playChord(label, newChord);
        chord[0] = note_sentinel;
        chord[1] = note_sentinel;
      //}
      }
    } else if (chord_mode && (data[0] == 128) ){
      //console.log("Removing " + data[1] + " from index " + chord.indexOf(data[1]) );
      chord[chord.indexOf(data[1])] = note_sentinel; //revert value to sentinel.
      //console.log("onMIDIMessage: chords_playing.length: " + chords_playing.length);
      //console.log("calling stopChords on : " + data[1]);
      stopChordswithNote(data[1]);
    }


    // C1 = document.getElementById("C1");
    // CD1 = document.getElementById("CD1");
    // D1 = document.getElementById("D1");
    // DE1 = document.getElementById("DE1");
    // E1 = document.getElementById("E1");
    // F1 = document.getElementById("F1");
    // FG1 = document.getElementById("FG1");
    // G1 = document.getElementById("G1");
    // GA1 = document.getElementById("GA1");
    // A1 = document.getElementById("A1");
    // AB1 = document.getElementById("AB1");
    // B1 = document.getElementById("B1");

    // play_s = document.getElementById("play_score");
    // stop_s = document.getElementById("stop_score");
    // seek_ml = document.getElementById("seek_m_left");
    // seek_mr = document.getElementById("seek_m_right");
    // pause_s = document.getElementById("pause_score");
    // edit_s = document.getElementById("edit_score");
    // seek_nl = document.getElementById("seek_note_left");
    // seek_nr = document.getElementById("seek_note_right");

    let padA = document.getElementsByClassName("pad_a")[0];
    let padB = document.getElementsByClassName("pad_b")[0];
    let padC = document.getElementsByClassName("pad_c")[0];
    let padD = document.getElementsByClassName("pad_d")[0];
    let padE = document.getElementsByClassName("pad_e")[0];
    let padF = document.getElementsByClassName("pad_f")[0];
    let padG = document.getElementsByClassName("pad_g")[0];
    let padH = document.getElementsByClassName("pad_h")[0];

    //Programming for the knob
    if(data[0] == 176){
        // If data 1 is 0 it is the x-axis of the knob which we want to ignore
        if(data[1] == 0){
          return;
        }
        // This is the data value indicating the knob y-axis
        else if(data[1] == 1){
          console.log("knob " + data[2]);
          document.getElementById('pls_work').scrollBy(0, -(data[2]-64)/6);
          // document.getElementsByClassName("controls-bottom")[0].scrollBy(0, data[2]);
          return;
        }
    }

    if (data[2] != 0) { // this is the start signal
        // if (data[1] == 48) {
        //     C1.style.backgroundColor = "rgb(100, 140, 190)";
        //     embed.getCursorPosition().then(function (position) {
        //         embed.edit([
        //           { name: 'action.AddNoteCrossMeasure',
        //             opts: {
        //                 accidental:null,
        //                 actionOrigin:"local.do",
        //                 durationType:3,
        //                 insertMode:"replace",
        //                 isConcertPitch:false,
        //                 measureIdx:position.measureIdx,
        //                 nbDots:0,
        //                 noteIdx:position.noteIdx,
        //                 partIdx:position.partIdx,
        //                 pitch:{step: "C", octave: 4},
        //                 staffIdx:position.staffIdx,
        //                 voiceIdx:position.voiceIdx
        //             } }
        //         ]).then(function () {
        //             // The actions have been executed
        //             // var nextButton = document.getElementsByClassName('controls-bottom');
        //             // triggerEvent(nextButton, 'keydown', 39); // simulate mouse/enter key press
        //             // jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(39) });
        //             // var e = $.Event('keydown');
        //             // e.which = 39; // A
        //             // $('#input').focus();
        //             // $('#input').trigger(e);
        //             // var e = $.Event("keydown", {keyCode: 39});
        //             // var press = jQuery.Event("keypress");
        //             // press.ctrlKey = false;
        //             // press.which = 39;
        //             // $("svg.page").trigger(press);
        //             var iframe = document.getElementById('embed-container');
        //             var evt = new Event('keypress');
        //             evt.keyCode = '39';
        //             iframe.contentDocument.body.dispatchEvent(evt);
        //             console.log("donezo")
        //         }).catch(function (error) {
        //           // Error while executing the actions
        //             console.log(error)
        //             console.log("error")
        //         });
        //     });
        // }

        //Programming for the pads
        if (data[1] == 100) {
            padA.style.backgroundColor = "black";
            padA.click();
            // play_score.click();
            // play_s.style.backgroundColor = "black";
        }
        else if (data[1] == 101) {
            padB.style.backgroundColor = "black";
            padB.click();
            // stop_score.click();
            // stop_s.style.backgroundColor = "black";
        }
        else if (data[1] == 102) {
            padC.style.backgroundColor = "black";
            padC.click();
            // seek_m_left.click();
            // seek_ml.style.backgroundColor = "black";
        }
        else if (data[1] == 103) {
            padD.style.backgroundColor = "black";
            padD.click();
            // seek_m_right.click();
            // seek_mr.style.backgroundColor = "black";
        }
        else if (data[1] == 104) {
            padE.style.backgroundColor = "black";
            padE.click();
            // pause_score.click();
            // pause_s.style.backgroundColor = "black";
        }
        else if (data[1] == 105) {
            padF.style.backgroundColor = "black";
            padF.click();
            // edit_score.click();
            // edit_s.style.backgroundColor = "black";
        }
        else if (data[1] == 106) {
            padG.style.backgroundColor = "black";
            padG.click();
            // seek_note_left.click();
            // seek_nl.style.backgroundColor = "black";
        }
        else if (data[1] == 107) {
            padH.style.backgroundColor = "black";
            padH.click();
            // seek_note_right.click();
            // seek_nr.style.backgroundColor = "black";
        } else {
            /// NOTE: Maybe call HighlightKey?
        }


    }
    else { // this is the stop signal

        //Programming for the pads
        if (data[1] == 100) {
            padA.style.backgroundColor = "#001860";
        }
        else if (data[1] == 101) {
            padB.style.backgroundColor = "#001860";
        }
        else if (data[1] == 102) {
            padC.style.backgroundColor = "#001860";
        }
        else if (data[1] == 103) {
            padD.style.backgroundColor = "#001860";
        }
        else if (data[1] == 104) {
            padE.style.backgroundColor = "#001860";
        }
        else if (data[1] == 105) {
            padF.style.backgroundColor = "#001860";
        }
        else if (data[1] == 106) {
            padG.style.backgroundColor = "#001860";
        }
        else if (data[1] == 107) {
            padH.style.backgroundColor = "#001860";
        }
        else { // Programming Piano keyboards
          //NOTE: Maybe unhighlightKey
        }
    }
}

//reverts a key back to its original color.
function unhighlightKey(noteValue) {
  //console.log("unhighlight note: "+ noteValue);
  var step = m_step.get(noteValue % 12); // C
  var octave = Math.floor(noteValue / 12); // 4
  //var index = arr.indexOf(step + octave); // locate released key
  //arr.splice(index, 1); // remove released key
  if (step.length == 1) { // white key
    //console.log("getElementById-white");
    document.getElementById(step + octave).style.background = "white";
  }
  else if (step.length == 2) { // black/half key
  //console.log("getElementById-black");
  document.getElementById(step + octave).style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
  }
}

function highlightKey(noteValue){
  // Programming Piano keyboards
  var step = m_step.get(noteValue % 12); // C
  var octave = Math.floor(noteValue / 12); // 4
  arr.push(step + octave); // push("C4")
  embedEdit(step, octave); // add notation C4 at current cursor
  document.getElementById(step + octave).style.background = "rgb(100,140,190)"; // visualize keyboard
}

function triggerEvent(el, type, keyCode) {
    if ('createEvent' in document) {
            // modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.keyCode = keyCode;
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
    } else {
        // IE 8
        var e = document.createEventObject();
        e.keyCode = keyCode;
        e.eventType = type;
        el.fireEvent('on'+e.eventType, e);
    }
}

