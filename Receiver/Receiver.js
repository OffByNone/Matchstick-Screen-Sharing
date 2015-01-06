"use strict";
(function() {
    //if the below two lines are not executed the matchstick will think it 
    //failed to open the app and return to the default screen after a timeout
    
    var receiverManager = new ReceiverManager("~screensharing"); //create a new ReceiverManager with the same app id used in the sender
    //var messageChannel = receiverManager.createMessageChannel("mediaPlayerDemo");  can't use this as the initial connection to the matchstick isn't ssl
    var media = {
        video : document.getElementById("video"),
        audio : document.getElementById("audio"),
        image : document.getElementById("image")
    };
    var info = document.getElementById("info");
   
    var socket = new WebSocket("ws://192.168.1.13:9431/receiver/~screensharing");

    socket.onopen = function() {
        info.innerHTML += "connection has been opened.";
    };

    socket.onclose = function() {
        info.innerHTML += "connection has been closed.";
    };

    socket.onerror = function(error) {
        info.innerHTML += error;
        throw error;
    };    
    
    socket.onmessage = function(senderId, data){
        var message = JSON.parse(data);
        
        if(message.hasOwnProperty("properties") && typeof message.properties === "object") setProperties(message.properties, message.type);
        if(message.hasOwnProperty("commands") && Array.isArray(message.commands) && message.commands.length > 0) executeCommands(message.commands, message.type);
    };        
    
    function executeCommands(commands, type){
        commands.forEach(command => media[type][command]());
    }
    
    function setProperties(properties, type){
         for (var property in properties)
            if(properties.hasOwnProperty(property))
                media[type][property] = properties[property];
    }
    
    receiverManager.open();
    
})();