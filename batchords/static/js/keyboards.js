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

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.

    C1 = document.getElementById("C1");
    CD1 = document.getElementById("CD1");
    D1 = document.getElementById("D1");
    DE1 = document.getElementById("DE1");
    E1 = document.getElementById("E1");
    F1 = document.getElementById("F1");
    FG1 = document.getElementById("FG1");
    G1 = document.getElementById("G1");
    GA1 = document.getElementById("GA1");
    A1 = document.getElementById("A1");
    AB1 = document.getElementById("AB1");
    B1 = document.getElementById("B1");

    C2 = document.getElementById("C2");
    CD2 = document.getElementById("CD2");
    D2 = document.getElementById("D2");
    DE2 = document.getElementById("DE2");
    E2 = document.getElementById("E2");
    F2 = document.getElementById("F2");
    FG2 = document.getElementById("FG2");
    G2 = document.getElementById("G2");
    GA2 = document.getElementById("GA2");
    A2 = document.getElementById("A2");
    AB2 = document.getElementById("AB2");
    B2 = document.getElementById("B2");

    play_s = document.getElementById("play_score");
    stop_s = document.getElementById("stop_score");
    seek_ml = document.getElementById("seek_m_left");
    seek_mr = document.getElementById("seek_m_right");
    pause_s = document.getElementById("pause_score");
    edit_s = document.getElementById("edit_score");
    seek_nl = document.getElementById("seek_note_left");
    seek_nr = document.getElementById("seek_note_right");

    if (data[2] != 0) { // this is the start signal
        if (data[1] == 48) {
            C1.style.backgroundColor = "rgb(100, 140, 190)";
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
                        pitch:{step: "C", octave: 4},
                        staffIdx:position.staffIdx,
                        voiceIdx:position.voiceIdx
                    } }
                ]).then(function () {
                    // The actions have been executed
                    // var nextButton = document.getElementsByClassName('controls-bottom');
                    // triggerEvent(nextButton, 'keydown', 39); // simulate mouse/enter key press
                    // jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(39) });
                    // var e = $.Event('keydown');
                    // e.which = 39; // A
                    // $('#input').focus();
                    // $('#input').trigger(e);
                    // var e = $.Event("keydown", {keyCode: 39});
                    // var press = jQuery.Event("keypress");
                    // press.ctrlKey = false;
                    // press.which = 39;
                    // $("svg.page").trigger(press);
                    var iframe = document.getElementById('embed-container');
                    var evt = new Event('keypress');
                    evt.keyCode = '39';
                    iframe.contentDocument.body.dispatchEvent(evt);
                    console.log("donezo")
                }).catch(function (error) {
                  // Error while executing the actions
                    console.log(error)
                    console.log("error")
                });
            });

        }
        if (data[1] == 49) {
            //var output = midi.outputs.get(1);
            //console.log('outputting to port 1');
            //var note_on_message = data ;
            //output.send(note_on_message) ;
            //output.send(note_on_message, window.performance.now() + 1000.0);
            CD1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 50) {
            D1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 51) {
            DE1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 52) {
            E1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 53) {
            F1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 54) {
            FG1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 55) {
            G1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 56) {
            GA1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 57) {
            A1.style.backgroundColor = "rgb(100, 140, 190)";
            // a3_snd.play();
        }
        if (data[1] == 58) {
            AB1.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 59) {
            B1.style.backgroundColor = "rgb(100, 140, 190)";
        }

        if (data[1] == 60) {
            C2.style.backgroundColor = "rgb(100, 140, 190)";
            embed.edit([
              { name: 'action.AddNoteCrossMeasure',
                opts: {
                    accidental:null,
                    actionOrigin:"local.do",
                    durationType:3,
                    insertMode:"replace",
                    isConcertPitch:false,
                    measureIdx:0,
                    nbDots:0,
                    noteIdx:0,
                    partIdx:0,
                    pitch:{step: "C", octave: 5},
                    staffIdx:0,
                    voiceIdx:0
                } }
            ]).then(function () {
              // The actions have been executed
              console.log("done")
            }).catch(function (error) {
              // Error while executing the actions
                console.log(error)
                console.log("error")
            });
        }
        if (data[1] == 61) {
            CD2.style.background = "rgb(100, 140, 190)";
            console.log('please work');
            embed.edit([
              { name: 'action.AddChord',
                opts: {
                    actionOrigin:"local.do",
                } }
            ]).then(function () {
              // The actions have been executed
              console.log("done")
            }).catch(function (error) {
              // Error while executing the actions
                console.log(error)
                console.log("error")
            });
        }
        if (data[1] == 62) {
            D2.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 63) {
            DE2.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 64) {
            E2.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 65) {
            F2.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 66) {
            FG2.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 67) {
            G2.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 68) {
            GA2.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 69) {
            A2.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 70) {
            AB2.style.background = "rgb(100, 140, 190)";
        }
        if (data[1] == 71) {
            B2.style.backgroundColor = "rgb(100, 140, 190)";
        }


        //Programming for the pads
        if (data[1] == 100) {
            play_score.click();
            play_s.style.backgroundColor = "black";
        }
        if (data[1] == 101) {
            stop_score.click();
            stop_s.style.backgroundColor = "black";
        }
        if (data[1] == 102) {
            seek_m_left.click();
            seek_ml.style.backgroundColor = "black";
        }
        if (data[1] == 103) {
            seek_m_right.click();
            seek_mr.style.backgroundColor = "black";
        }
        if (data[1] == 104) {
            pause_score.click();
            pause_s.style.backgroundColor = "black";
        }
        if (data[1] == 105) {
            edit_score.click();
            edit_s.style.backgroundColor = "black";
        }
        if (data[1] == 106) {
            seek_note_left.click();
            seek_nl.style.backgroundColor = "black";
        }
        if (data[1] == 107) {
            seek_note_right.click();
            seek_nr.style.backgroundColor = "black";
        }


    }
    else { // this is the stop signal
        if (data[1] == 48) {
            C1.style.backgroundColor = "white";
        }
        if (data[1] == 49) {
            CD1.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 50) {
            D1.style.backgroundColor = "white";
        }
        if (data[1] == 51) {
            DE1.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 52) {
            E1.style.backgroundColor = "white";
        }
        if (data[1] == 53) {
            F1.style.backgroundColor = "white";
        }
        if (data[1] == 54) {
            FG1.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 55) {
            G1.style.backgroundColor = "white";
        }
        if (data[1] == 56) {
            GA1.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 57) {
            A1.style.backgroundColor = "white";
        }
        if (data[1] == 58) {
            AB1.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 59) {
            B1.style.backgroundColor = "white";
        }

        if (data[1] == 60) {
            C2.style.backgroundColor = "white";
        }
        if (data[1] == 61) {
            CD2.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 62) {
            D2.style.backgroundColor = "white";
        }
        if (data[1] == 63) {
            DE2.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 64) {
            E2.style.backgroundColor = "white";
        }
        if (data[1] == 65) {
            F2.style.backgroundColor = "white";
        }
        if (data[1] == 66) {
            FG2.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 67) {
            G2.style.backgroundColor = "white";
        }
        if (data[1] == 68) {
            GA2.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 69) {
            A2.style.backgroundColor = "white";
        }
        if (data[1] == 70) {
            AB2.style.background = "linear-gradient(45deg, #222 0%,#555 100%)";
        }
        if (data[1] == 71) {
            B2.style.backgroundColor = "white";
        }





        //Programming for the pads
        if (data[1] == 100) {
            play_s.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 101) {
            stop_s.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 102) {
            seek_ml.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 103) {
            seek_mr.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 104) {
            pause_s.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 105) {
            edit_s.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 106) {
            seek_nl.style.backgroundColor = "#4CAF50";
        }
        if (data[1] == 107) {
            seek_nr.style.backgroundColor = "#4CAF50";
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