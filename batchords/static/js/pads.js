var container = document.getElementById('embed-container');
var embed = new Flat.Embed(container, {
    score: '5a87d33f265c44553918dd0a',
    // score: '5a28284ea812902e84a42727',
    // mode: 'edit',
    allow: 'midi',
    height: '400px',
    embedParams: {
      appId: '5a8e18e1a2f0e03339907c31',
      controlsFloating: false,
      jsapi: true,
      controlsDisplay: false,
      mode: 'edit',
      // appId: 'localhost'
      // layout: 'track',
      branding: false,
      controlsMetronome: false
    }
});

// var embed = new Flat.Embed('embed-container', {
//   embedParams: {
//     appId: '5a8e18e1a2f0e03339907c31',
//     branding: false,
//     controlsFloating: false,
//     themeControlsBackground: '#B71C1C',
//     themeIconsPrimary: '#E53935',
//     themeCursorV0: '#E53935',
//     themeSlider: '#E53935',
//     mode: 'edit'
//   }
// });

// fetch('https://api.flat.io/v2/scores/56ae21579a127715a02901a6/revisions/last/mxl')
// .then(function (response) {
//   return response.arrayBuffer();
// })
// .then(function (mxl) {
//   return embed.loadMusicXML(mxl);
// })
// .then(function () {
//   return embed.play();
// })
// .catch(function (error) {
//   // Unable to load the score
//   console.warn(error);
// });

// play_score.onclick = function(){
//     embed.play().then(function () {
//         // The score is playing
//     });
// };

embed.on('edit', function (inp) {
  console.log('edit');
  console.log(inp);
});

embed.on('playbackPosition', function (position) {
  console.log(position);
});

embed.on('enable_edit', function (inp) {
  console.log('enable_edit');
  console.log(inp);
});

embed.on('Edit', function (inp) {
  console.log('Edit');
  console.log(inp);
});



monitorEvents(document.body, 'edit');

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


document.onkeyup=function(e){
    if (e.which == 65) {
        // call your function to do the thing
        pause_score.click();
        console.log("left pedal triggered")
    }
    else if (e.which == 83) {
        // call your function to do the thing
        play_score.click();
        console.log("middle pedal triggered")
    }
    else if (e.which == 68) {
        // call your function to do the thing
        stop_score.click();
        console.log("right pedal triggered")
    }
}



