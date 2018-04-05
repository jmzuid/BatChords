var midi, data;

/* map of keys for our ketyboard */
/* valid note values are 0 - 83 */
/* 84 is a bug. */
var notes = new Map();
var chord_mappings = new Map();
//populate_mappings(chord_mappings);
// FIXME: MAYBE try to map to intervals.


var chord_mode = true ;
var chord_locked = false ;
var note_sentinel = 85;

//Converts a pitch to a note frequency.
function frequencyFromNote( note ) {
  var ret = 440 * Math.pow(2,(note-69)/12);
  //console.log("note:" + note + "converts to frequency: " + ret);
  return ret;
};

console.log("test");


var audioCtx = new (AudioContext || webkitAudioContext)();
var osc = audioCtx.createOscillator();

osc.type = "triangle" ; // the type of oscillator we want to use.
osc.connect(audioCtx.destination); //connect to the speakers.

/* create all of the pitches for our keyboard. */
/*
for (i = 48; i < 73; i++){
  var pitch = audioCtx.createOscillator();
  pitch.type = "triangle" ;
  var freq = frequencyFromNote(i) ;
  pitch.frequency.setValueAtTime(freq, audioCtx.currentTime);
  pitch.connect(audioCtx.destination);
  notes[i] = pitch; /* place the pitch inside our map.
} */

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

// var a3_snd = new Audio("../piano-sound-kit/a3.mp3");
// a3_snd.play();

//inputs a two-note array, outputs a chord.
//FIXME: does not handle single-note input.
function playChord(chord){
  // Maj7 = dist 7
  // C7 = dist 4
  // Cm7 = dist 10
  // CmM7 = dist 3
  // Cm7-5  = dist 8
  // Cdim7 = dist 9
  // Csus7 = dist 5
  var root = chord[0];
  var second, third, fourth;
  switch (chord[1] - chord[0]){
    case 0:   // Maj7
      second = root + 4;
      third = root + 7;
      fourth = root + 11;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 3:   // m7-5
      second = root + 3;
      third = root + 7;
      fourth = root + 11;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 4:   // m7
      second = root + 4;
      third = root + 7;
      fourth = root + 11;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 5:  // sus7
      second = root + 5;
      third = root + 7;
      fourth = root + 10;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 6: // m7-5
      second = root + 3;
      third = root + 6;
      fourth = root + 10;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 7: // Maj7
      second = root + 4;
      third = root + 7;
      fourth = root + 11;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
    break;
    case 9:  // dim7
      second = root + 3;
      third = root + 6;
      fourth = root + 9;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    case 10:  // m7
      second = root + 3;
      third = root + 7;
      foruth = root + 10;
      beginNote(root);
      beginNote(second);
      beginNote(third);
      beginNote(fourth);
      //sleep for a duration.
      sleep(2); //FIXME: JUST FOR TESTING.
      endNote(root);
      endNote(second);
      endNote(third);
      endNote(fourth);
      break;
    default:
      console.log("do nothing");
  }
  console.log("reset values");
  chord[0] = note_sentinel;
  chord[1] = note_sentinel;
}

//
function beginNote(noteValue){
  var pitch = audioCtx.createOscillator();
  pitch.type = "triangle";
  freq = frequencyFromNote(noteValue);
  pitch.frequency.setValueAtTime(freq, audioCtx.currentTime);
  //console.log("in beginNote");
  //console.log(pitch.frequency);
  pitch.connect(audioCtx.destination);
  pitch.start(0);  //we can put a delay here if we want. (Think about multiple note values.)
  notes[noteValue] = pitch ;
};


function endNote(noteValue){
  //console.log("end note");
  notes[noteValue].stop();
};



// generates the Oscillator for the MIDI sound
//function Sound(frequency){
//  this.osc = audioCtx.createOscillator() ; //create and oscillator
//  this.pressed = false;
//  this.osc.frequency.value = frequency;
//  this.osc.type = "triangle";
//  this.osc.start(0);
//};

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

console.log("new array of size: " + chord.length);

// push one note onto sheet, do not attempt to move on
// embedEdit("C", 4)
// arguments[0] is step: C
// arguments[1] is octave: 4
function embedEdit(){
    let step_inp = String(arguments[0]);
    console.log(step_inp);
    let octave_inp = Number(arguments[1]);
    console.log(octave_inp);

		embed.getCursorPosition().then(function (position) {
            embed.edit([
              { name: 'action.AddNoteCrossMeasure',
                opts: {
                    accidental:null,
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
                console.log("embedEdit error: " + error)
            });
        });
}

// a global map for steps
var m_step = new Map([[0,"C"],[1,"CD"],[2,"D"],[3,"DE"],[4,"E"],[5,"F"],[6,"FG"],[7,"G"],[8,"GA"],[9,"A"],[10,"AB"],[11,"B"]]);
var m_button = new Map([100,"pad_a"]) ;

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log(data)
    console.log("test")
    //If not in chord mode,
    //simply output notes.
    if (chord_mode && (data[0] == 144) ){
      if (chord[0] == note_sentinel) { // check first element in chord not sentinel.
        console.log("data[1] < chord[1]");
        console.log("adding " + data[1] + " to chord.")
        chord[0] = data[1];
      } else {
        chord_locked = true;
        chord[1] = data[1];
        console.log("sorting chord.");
        chord.sort();
        playChord(chord);
        chodr_locked = false;
      }
    } else if (chord_mode && (data[0] == 128) ){
      console.log("Removing " + data[1] + " from index " + chord.indexOf(data[1]) );
      chord[chord.indexOf(data[1])] = note_sentinel; //revert value to sentinel.
    } else {
      switch (data[0]){
        case 144:
          beginNote(data[1]);
          break ;
        case 128:
          endNote(data[1]);
          break ;
        default:
      }
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
        }
        else { // Programming Piano keyboards
        	var step = m_step.get(data[1] % 12); // C
	    	var octave = Math.round(data[1] / 12); // 4
	    	arr.push(step + octave); // push("C4")
	        embedEdit(step, octave); // add notation C4 at current cursor
	        document.getElementById(step + octave).style.background = "rgb(100,140,190)"; // visualize keyboard
        }


    }
    else { // this is the stop signal

        //Programming for the pads
        if (data[1] == 100) {
            padA.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 101) {
            padB.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 102) {
            padC.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 103) {
            padD.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 104) {
            padE.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 105) {
            padF.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 106) {
            padG.style.backgroundColor = "#4CAF50";
        }
        else if (data[1] == 107) {
            padH.style.backgroundColor = "#4CAF50";
        }
        else { // Programming Piano keyboards
        	var step = m_step.get(data[1] % 12); // C
	    	var octave = Math.round(data[1] / 12); // 4
	    	var index = arr.indexOf(step + octave); // locate released key
	    	arr.splice(index, 1); // remove released key
	    	if (step.length == 1) { // white key
		        document.getElementById(step + octave).style.background = "white";
		    }
		    else if (step.length == 2) { // black/half key
		    	document.getElementById(step + octave).style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
		    }
        }
    }
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

