var midi, data;
// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// var a3_snd = new Audio("../piano-sound-kit/a3.mp3");
// a3_snd.play();


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
var arr = [];

// push one note onto sheet, do not attempt to move on
// embedEdit("C", 4)
// arguments[0] is step: C
// arguments[1] is octave: 4
function embedEdit(){
    let step_inp = String(arguments[0]);
    console.log(step_inp);
    let octave_inp = Number(arguments[1]);
    console.log(octave_inp);
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
                console.log("embedEdit error: " + error)
            });
        });
}

// a global map for steps
var m_step = new Map([[0,"C"],[1,"CD"],[2,"D"],[3,"DE"],[4,"E"],[5,"F"],[6,"FG"],[7,"G"],[8,"GA"],[9,"A"],[10,"AB"],[11,"B"]]);
// var m_button = new Map([100,"pad_a"])

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log(data)

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
	    	var octave = Math.floor(data[1] / 12); // 4
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
	    	var octave = Math.floor(data[1] / 12); // 4
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