var Botkit = require('./lib/Botkit.js')
var os = require('os')
var localtunnel = require('localtunnel')
var opn = require('opn')

var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

controller.setupWebserver(process.env.PORT || process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('ONLINE!');
    });
});

controller.api.thread_settings.greeting('Hello! welcome to our First Conference Meet!');
controller.api.thread_settings.get_started('Let\'s get started');
// controller.api.thread_settings.menu([
//     {
//         "type":"postback",
//         "title":"Hello",
//         "payload":"hello"
//     },
//     {
//         "type":"postback",
//         "title":"Help",
//         "payload":"help"
//     },
//     {
//       "type":"web_url",
//       "title":"Botkit Docs",
//       "url":"https://github.com/howdyai/botkit/blob/master/readme-facebook.md"
//     },
// ]);


// var controller = Botkit.consolebot({
//     debug: true,
//     log: true,
// })

var Utterances = {
    yes: new RegExp(/^(yes|yea|yup|yep|ya|sure|ok|y|yeah|yah|sounds good)/i),
    no: new RegExp(/^(no|nah|nope|n|never|not a chance)/i),
    quit: new RegExp(/^(quit|cancel|end|stop|nevermind|never mind)/i),
    greetings: new RegExp(/^(hi|hello|greetings|hi there|yo|was up|whats up)/)
}

var bot = controller.spawn({});


controller.hears(['map'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [{
                        'title': 'Classic White T-Shirt',
                        'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                    }]
                }
            }
        }, function (response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next()
        })
    })
})


// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Welcome To My Chatbot Thanks Alot!')
})

controller.hears(['hi','hello','^hi','^hello'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Conference Details',
                            'image_url': 'http://globalassets.starbucks.com/assets/a8de3ec0005a4d21b9282c0527160100.jpg',
                            'subtitle': 'Cultivated in Karnataka in harmony with nature, the lush and layered coffee captivates from first sip.',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/medium/india-estates-blend/whole-bean',
                                    'title': 'View Coffee'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/medium/india-estates-blend/whole-bean',
                                    'title': 'Buy Coffee'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Find in near by store',
                                    'payload': 'India Estates Blend'
                                }
                            ]
                        },
                        {
                            'title': 'Location/Venue',
                            'image_url': 'http://globalassets.starbucks.com/assets/7a6c6ffc62ee4e17a992cee3898918ba.png',
                            'subtitle': 'And big – awash with a full-bodied juiciness that makes it instantly recognizable to its many, many fans. These qualities are all true of our Kenya coffee. ',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/medium/kenya/whole-bean',
                                    'title': 'View Coffee'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/medium/kenya/whole-bean',
                                    'title': 'Order Coffee'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Find in near by store',
                                    'payload': 'Kenya'
                                }
                            ]
                        },
                        {
                            'title': 'About Location',
                            'image_url': 'http://globalassets.starbucks.com/assets/ba003714b7494e948af043d5f0664669.png',
                            'subtitle': 'This coffee gets its distinctive sweetness from the way it is roasted: dark, and darker still. Somewhere beyond the caramel notes of our Espresso Roast but short of the smokiness that identifies our French Roast – that is the sweet spot held by Italian Roast.',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/dark/fair-trade-certified-italian-roast/whole-bean',
                                    'title': 'View Coffee'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/dark/fair-trade-certified-italian-roast/whole-bean',
                                    'title': 'Order Coffee'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Find in near by store',
                                    'payload': 'Fair Trade Certified™ Italian Roast'
                                }
                            ]
                        },{
                            'title': 'others',
                            'image_url': 'http://globalassets.starbucks.com/assets/ba003714b7494e948af043d5f0664669.png',
                            'subtitle': 'This coffee gets its distinctive sweetness from the way it is roasted: dark, and darker still. Somewhere beyond the caramel notes of our Espresso Roast but short of the smokiness that identifies our French Roast – that is the sweet spot held by Italian Roast.',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/dark/fair-trade-certified-italian-roast/whole-bean',
                                    'title': 'View Coffee'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'http://www.starbucks.in/coffee/dark/fair-trade-certified-italian-roast/whole-bean',
                                    'title': 'Order Coffee'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Find in near by store',
                                    'payload': 'Fair Trade Certified™ Italian Roast'
                                }
                            ]
                        }

                    ]
                }
            }
        }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        });
    });
})

controller.hears(['what is my name', 'who am i'], 'message_received', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function (err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function (response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [{
                                pattern: bot.utterances.no,
                                callback: function (response, convo) {
                                    convo.say('I am in what say yes!');
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            }, {
                                pattern: bot.utterances.yes,
                                callback: function (response, convo) {
                                    convo.say('I am in what say!');

                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.next();
                                }
                            }, {
                                default: true,
                                callback: function (response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ])
                        convo.next()
                    }, {
                        'key': 'nickname'
                    }) // store the results in a field called nickname

                    convo.on('end', function (convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will remember your name ...');

                            controller.storage.users.get(message.user, function (err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    }
                                }
                                user.name = convo.extractResponse('nickname')
                                controller.storage.users.save(user, function (err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.')
                                })
                            })
                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    })
                }
            })
        }
    })
})

controller.hears(['where', 'location', 'located', '^where', '^location'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.ask('The conference is at madras cafe inside gateway hotel. Do you know this place ?', [{
                pattern: bot.utterances.yes,
                callback: function (response, convo) {
                    convo.say('Oh grt!!');
                    convo.say('Then we can meet up in the event then.See you soon!');
                    convo.next();
                }
            }, {
                pattern: bot.utterances.no,
                callback: function (response, convo) {
                    convo.say('ohhhk no prblm');
                    convo.say('So i can help you with that!');
                    convo.say({
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [{
                                    "title": "Your current location",
                                    "image_url": "https://maps.googleapis.com/maps/api/staticmap?center=gateway+hotel+chennai&zoom=17&scale=false&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7Cgateway+hotel+chennai",
                                    "buttons": [{
                                            'type': 'web_url',
                                            'url': 'https://www.google.co.in/maps/dir//The+Gateway+Hotel,+309+Rajiv+Gandhi+Salai+(OMR),+Elcot+Sez,+Sholinganallur,+Chennai,+Tamil+Nadu+600119/@12.9056392,80.2256728,17z/data=!4m15!1m6!3m5!1s0x3a525b9ecc7572e7:0xe53a02455570c2df!2sThe+Gateway+Hotel!8m2!3d12.9056392!4d80.2278615!4m7!1m0!1m5!1m1!1s0x3a525b9ecc7572e7:0xe53a02455570c2df!2m2!1d80.2278615!2d12.9056392',
                                            'title': 'View directions'
                                        }
                                    ]
                                }]
                            }
                        }

                    })
                    // convo.ask('do you want to know directions', [{
                    //     pattern: bot.utterances.yes,
                    //     default: true,
                    //     callback: function (response, convo) {
                    //         convo.say('We have redirected you');
                    //         convo.say('http://www.sindresorhus.com');
                    //         opn('http://www.sindresorhus.com');
                    //         convo.next();
                    //     }
                    // }, {
                    //     pattern: bot.utterances.no,
                    //     callback: function (response, convo) {
                    //         convo.say('Okay!Bubye');
                    //         convo.next();
                    //     }
                    // }]);
                    // bot.reply(message, {
                    //     text: 'Hey! This message has some quick replies attached.',
                    //     quick_replies: [{
                    //             "content_type": "text",
                    //             "title": "Yes",
                    //             "payload": "http://www.bing.com"
                    //         },
                    //         {
                    //             "content_type": "text",
                    //             "title": "No",
                    //             "payload": "no"
                    //         }
                    //     ]
                    // })
                    convo.next();
                }
            }, {
                default: true,
                callback: function (response, convo) {
                    convo.next();
                }
            }
        ])
    })
})

controller.hears(['when', 'date', '^when', '^date'], 'message_received', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        bot.reply(message, 'Conference is scheduled on 5 th of october 2016');
    });
});

controller.hears(['agenda','about','related'], 'message_received', function (bot, message) {
    bot.reply(message, 'The main agenda of this conference meet is to have a interaction with the our senior team members and develop knowledge on the upcoming analytics and reporting technologies.');
})

controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function (bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function (err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['shutdown'], 'message_received', function (bot, message) {

    bot.startConversation(message, function (err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [{
                pattern: bot.utterances.yes,
                callback: function (response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function () {
                        process.exit();
                    }, 3000);
                }
            },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: function (response, convo) {
                    convo.say('*Phew!*');
                    convo.next();
                }
            }
        ]);
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received', function (bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message, ':|] I am a bot. I have been running for ' + uptime + ' on ' + hostname + '.');
});



controller.on('message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {

        convo.ask('Do you need any further information?', [{
                pattern: bot.utterances.yes,
                default: true,
                callback: function (response, convo) {
                    convo.say('You can proceed with your queries');
                    convo.next();
                }
            },
            {
                pattern: bot.utterances.no,
                callback: function (response, convo) {
                    convo.say('Okay!Bubye');
                    convo.next();
                    setTimeout(function () {
                        process.exit();
                    }, 3000);
                }
            }
        ]);
    });
});


function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
