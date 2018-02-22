var midi, data;
// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

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

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log(data)

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
        }
        if (data[1] == 49) {
            C1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 50) {
            D1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 51) {
            DE1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 52) {
            E1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 53) {
            F1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 54) {
            FG1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 55) {
            G1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 56) {
            GA1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 57) {
            A1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 58) {
            AB1.style.backgroundColor = "rgb(100, 140, 190)";
        }
        if (data[1] == 59) {
            B1.style.backgroundColor = "rgb(100, 140, 190)";
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
            C1.style.backgroundColor = "white";
        }
        if (data[1] == 50) {
            D1.style.backgroundColor = "white";
        }
        if (data[1] == 51) {
            DE1.style.backgroundColor = "white";
        }
        if (data[1] == 52) {
            E1.style.backgroundColor = "white";
        }
        if (data[1] == 53) {
            F1.style.backgroundColor = "white";
        }
        if (data[1] == 54) {
            FG1.style.backgroundColor = "white";
        }
        if (data[1] == 55) {
            G1.style.backgroundColor = "white";
        }
        if (data[1] == 56) {
            GA1.style.backgroundColor = "white";
        }
        if (data[1] == 57) {
            A1.style.backgroundColor = "white";
        }
        if (data[1] == 58) {
            AB1.style.backgroundColor = "white";
        }
        if (data[1] == 59) {
            B1.style.backgroundColor = "white";
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