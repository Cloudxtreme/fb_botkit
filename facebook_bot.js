if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}

if (!process.env.app_secret) {
    console.log('Error: Specify app_secret in environment');
    process.exit(1);
}

var Botkit = require('botkit');


var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

var bot = controller.spawn({
});

controller.hears(['quick'], 'message_received', function(bot, message) {

    bot.reply(message, {
        text: 'Hey! This message has some quick replies attached.',
        quick_replies: [
            {
                "content_type": "text",
                "title": "Yes",
                "payload": "yes",
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "no",
            }
        ]
    });

});

controller.hears(['^hello', '^hi'], 'message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Hello iam bot.');
});
