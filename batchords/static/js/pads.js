var container = document.getElementById('embed-container');
var embed = new Flat.Embed(container, {
    score: '5a88bca1deb7e53deddac504',
    embedParams: {
      appId: '5a8cec39dcfa9b10925941a0'
      // appId: 'localhost'
    }
});

play_score.onclick = function(){
    embed.play().then(function () {
        // The score is playing
    });
    console.log("Playing Score");
};

stop_score.onclick = function(){
    embed.stop().then(function () {
        // The score is not playing
    });
    console.log("Stopping score");
};

seek_right.onclick = function() {
    embed.getCursorPosition().then(function (position) {
  // position: {
  //     "partIdx": 0,
  //     "staffIdx": 1,
  //     "voiceIdx": 0,
  //     "measureIdx": 2,
  //     "noteIdx": 1
  // }
        console.log(position.staffIdx);
        embed.setCursorPosition({
          partIdx: position.partIdx,
          staffIdx: position.staffIdx+1,
          voiceIdx: position.voiceIdx,
          measureIdx: position.measureIdx,
          noteIdx: position.noteIdx
        }).then(function (position) {
          console.log("Position set")
        });



  });

};