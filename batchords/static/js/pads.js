var container = document.getElementById('embed-container');
var embed = new Flat.Embed(container, {
    // score: '5a87d33f265c44553918dd0a',
    score: '5a28284ea812902e84a42727',
    // mode: 'edit',
    height: '300px',
    embedParams: {
      appId: '5a8e18e1a2f0e03339907c31',
      controlsFloating: false,
      jsapi: true,
      controlsDisplay: false,
      // appId: 'localhost'
      // layout: 'track'
      branding: false,
      controlsMetronome: false
    }
});

play_score.onclick = function(){
    embed.play().then(function () {
        // The score is playing
    });
};

stop_score.onclick = function(){
    embed.stop().then(function () {
        // The score is playing
    });
};

pause_score.onclick = function(){
    embed.pause().then(function () {
      // The playback is paused
    });
};

seek_note_right.onclick = function(){
    embed.getCursorPosition().then(function (position) {
      // position: {
      //     "partIdx": 0,
      //     "staffIdx": 1,
      //     "voiceIdx": 0,
      //     "measureIdx": 2,
      //     "noteIdx": 1
      // }

      embed.setCursorPosition({
      partIdx: position.partIdx,
      staffIdx: position.staffIdx,
      voiceIdx: position.voiceIdx,
      measureIdx: position.measureIdx,
      noteIdx: position.noteIdx + 1
        }).then(function (position) {
          // position: {
          //     "partIdx": 0,
          //     "staffIdx": 1,
          //     "voiceIdx": 0,
          //     "measureIdx": 2,
          //     "noteIdx": 1
          // }
          console.log(position)
        });

    });
}

seek_note_left.onclick = function(){
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
}

seek_m_left.onclick = function(){
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
}

seek_m_right.onclick = function(){
    embed.getCursorPosition().then(function (position) {
      embed.setCursorPosition({
      partIdx: position.partIdx,
      staffIdx: position.staffIdx,
      voiceIdx: position.voiceIdx,
      measureIdx: position.measureIdx + 1,
      noteIdx: 0
        }).then(function (position) {
          console.log(position)
        });

    });
}

enable_edit.onclick = function(){
    console.log("changing tempo")
    embed.edit([
      { name: 'action.SetTempo', opts: { "startMeasureIdx": 0,
            "stopMeasureIdx": 1,
            "tempo": {
                "bpm": 142,
                "qpm": 142,
                "durationType": 3,
                "nbDots": 0
            }} }
    ]).then(function () {
      // The actions have been executed
      console.log("done")
    }).catch(function (error) {
      // Error while executing the actions
        console.log(error)
        console.log("error")
    });
    console.log("changed tempo")
};