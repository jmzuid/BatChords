var container = document.getElementById('embed-container');
var embed = new Flat.Embed(container, {
    score: '5a87d33f265c44553918dd0a',
    embedParams: {
      appId: '5a8e18e1a2f0e03339907c31',
      mode: 'edit'
      // appId: 'localhost'
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