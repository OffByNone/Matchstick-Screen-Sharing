"use strict";
(function() {
    var appid = "~screensharing"; //Unique id of your application, must start with a ~
    var matchstickIPAddress = "192.168.1.13"; //IP address of the matchstick
    var receiverAppUrl = "//offbynone.github.io/MatchStick-Screen-Sharing/Receiver/Receiver.html"; //Url of the page to load on the receiver
    var timeout = -1; //after not communicating with the sender for this many milliseconds return to the default matchstick screen. -1 means don't timeout
    var useInterprocessCommunication = true; //not sure what this means for my application
    var isRunning = false;
    var isPlaying = false;
    
    var senderDaemon = new SenderDaemon(matchstickIPAddress, appid); //comes from the sender api, is the object which will be used to communicate with the matchstick    
    
    var shareScreen = document.getElementById("shareScreen");
    var playPause = document.getElementById("playPause");
    var shareType = document.getElementById("shareType");
    //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;    

    
    var peer = senderManager.createPeer();
    // data connection
    senderManager.connectReceiverPeer(options);
    // stream call
    //senderManager.callReceiverPeer(stream, options);
    
    senderDaemon.on("appopened", function () {        
        socket.onopen = function() {
            alert("connection has been opened.");
        };
        
        socket.onclose = function() {
            alert("connection has been closed.");
        };
        
        socket.onerror = function(error) {
            alert(error);
            throw error;
        };
        
        socket.onmessage = function(message) {
            console.log(message);
        };
    });

    document.getElementById("toggleAppStatus").onclick  = function(){
        if(isRunning)
        {
            shareScreen.className = "disabled";
            playPause.className = "disabled";            
            this.innerHTML = "Launch App";
            senderDaemon.closeApp();
        }
        else 
        {
            shareScreen.className = "";
            playPause.className = "";
            this.innerHTML = "Close App";
            senderDaemon.openApp(receiverAppUrl, timeout, useInterprocessCommunication);
        }
        
        isRunning = !isRunning;
    };
    shareScreen.onclick = function(){     
        if(this.className.indexOf("disabled") >= 0) return alert("App must be running on receiver before you can share your screen.\nPlease click launch app, then try again");        
        if(!navigator.getUserMedia) return alert("navigator.getUserMedia is null, screen sharing does not appear to be supported on your platform.");
            
        var constraints = { video: { mediaSource: shareType.value } };//can also do audio here, from the microphone

        function callback(localMediaStream) {
            var message = {
                type:"video",
                properties: { mozSrcObject: localMediaStream },
                commands: [ "play" ]
            };
            messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
        }
        function errorCallback(err) { console.log(err); }

        navigator.getUserMedia (constraints, callback, errorCallback);
    };
    playPause.onclick = function(){
        if(this.className.indexOf("disabled") >= 0)
            return alert("App must be running on receiver before you can send a message.\nPlease click launch app, then try again");

        playPause.innerHTML = isPlaying ? "Play" : "Pause";
        
        var message = {
            type:"video",
            commands : [isPlaying ? "pause" : "play"]
        };
        
        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
        isPlaying = !isPlaying;
    };    
    
})();