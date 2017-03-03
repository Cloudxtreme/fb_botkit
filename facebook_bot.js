var Botkit = require('./lib/Botkit.js');


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


controller.setupWebserver(process.env.PORT || process.env.port || 5000), function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
    });
};


controller.api.thread_settings.greeting('Hello! I\'m a Botkit bot!');

controller.hears(['^hello', '^hi'], 'message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Hello iam bot.');
});