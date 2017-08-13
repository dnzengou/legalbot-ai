/*************************************************************************************************

  Define global variables for NPM packages and Cloud Foundry environment

*************************************************************************************************/
"use strict";

var express = require('express'),
    cfenv = require("cfenv"),
    appEnv = cfenv.getAppEnv(),
    app = express(),
    bodyParser = require('body-parser'),
    watson = require('watson-developer-cloud');

/*************************************************************************************************

  Start the server

*************************************************************************************************/
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

/*************************************************************************************************

 Watson Conversation

*************************************************************************************************/
var conversation = watson.conversation({
    url: 'https://gateway.watsonplatform.net/conversation/api',
    username: '5c8c7332-e18b-42d7-ab65-4994a75c24ee', // Set to your conversation username
    password: 'oauvJ5KIn8X3', // Set to your conversation password
    version_date: '2016-07-11',
    version: 'v1'
});

// Allow clients to interact with the bot
app.post('/api/bot', function(req, res) {

    console.log("Got request for Le Bot");
    console.log("Request is: ", req);

    var workspace = '800d684b-b222-4713-8886-7cd913f71ded'; // Set to your Conversation workspace ID

    if (!workspace) {
        console.log("No workspace detected. Cannot run the Watson Conversation service.");
    }

    var params = {
        workspace_id: workspace,
        context: {}, // Null context indicates new conversation
        input: {} // Holder for message
    };

    // Update options to send to conversation service with the user input and a context if one exists
    if (req.body) {
        if (req.body.input) {
            params.input = req.body.input;
        }

        if (req.body.context) {
            params.context = req.body.context;
        }
    }

    // Send message to the conversation service with the current context
    conversation.message(params, function(err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            return res.status(err.code || 500).json(err);
        }

        console.log("Response: ", data);

        return res.json(data);
    });

});
pubnub = new PubNub({
    publishKey: "pub-c-86f59ed9-0ffe-49ec-9b3f-72c7b09e783d",
    subscribeKey: "sub-c-21814390-8016-11e7-9034-1e9edc6dd7f6"
});

var publishConfig = {
    channel: "pubnub_onboarding_channel",
    message: "Hellloo From JavaScript SDK"
}

pubnub.publish(publishConfig, function(status, response) {
    console.log(status, response);
}); // End app.post '/api/bot'