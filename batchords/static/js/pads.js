var container = document.getElementById('embed-container');
var embed = new Flat.Embed(container, {
    score: '5a87d33f265c44553918dd0a',
    embedParams: {
      appId: '5a8e18e1a2f0e03339907c31'
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