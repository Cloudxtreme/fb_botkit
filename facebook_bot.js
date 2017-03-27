var Botkit = require('./lib/Botkit.js')
var os = require('os')
var localtunnel = require('localtunnel')
var opn = require('opn')
var request = require('request');

var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

controller.setupWebserver(process.env.PORT || process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('ONLINE!');
    });
});

controller.api.thread_settings.greeting('Welcome to ATUNE Event.');
controller.api.thread_settings.get_started('Get Started');
controller.api.thread_settings.menu([
    {
        "type":"postback",
        "title":"Conference Details",
        "payload":"Conference Details"
    },
    {
        "type":"postback",
        "title":"Location Details",
        "payload":"Location Details"
    },
    {
      "type":"postback",
      "title":"Event Organizers",
      "payload":"Event Organizers"
    },
]);

var Utterances = {
    yes: new RegExp(/^(yes|yea|yup|yep|ya|sure|ok|y|yeah|yah|sounds good)/i),
    no: new RegExp(/^(no|nah|nope|n|never|not a chance)/i),
    quit: new RegExp(/^(quit|cancel|end|stop|nevermind|never mind)/i),
    greetings: new RegExp(/^(hi|hello|greetings|hi there|yo|was up|whats up)/)
}

var bot = controller.spawn({});

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
                            'title': 'ATUNE 2017 Conference',
                            'image_url': 'http://www.safety4sea.com/wp-content/uploads/2015/11/Conference.jpg',
                            'subtitle': '',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Agenda of the Conference',
                                    'payload': 'Agenda'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Schedule and Duration',
                                    'payload': 'Schedule Duration'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Swon Details',
                                    'payload': 'Swon Details'
                                }
                            ]
                        },
                        {
                            'title': 'Location Details',
                            'image_url': 'http://www.aids2016.org/portals/0/Image/Thumb/pic_venue_outdoor.jpg?ver=2015-11-04-120531-493',
                            'subtitle': '',
                            'buttons': [
                               {
                                    'type': 'postback',
                                    'title': 'Weather Forecast View',
                                    'payload': 'Weather'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Venue',
                                    'payload': 'Venue'
                                },
                                 {
                                    'type': 'postback',
                                    'title': 'Sight view',
                                    'payload': 'Sight view'
                                }
                            ]
                        },
                        {
                            'title': 'Event Organizers',
                            'image_url': 'http://globalassets.starbucks.com/assets/ba003714b7494e948af043d5f0664669.png',
                            'subtitle': '',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Travel Organizers ',
                                    'payload': 'Travel Organizers'
                                },
                                 {
                                    'type': 'postback',
                                    'title': 'Accomodation Organizers',
                                    'payload': 'Accomodation Organizers'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Tourist Agents',
                                    'payload': 'Tourist Agents'
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
});


controller.hears(['Conference Details'], 'message_received,facebook_postback', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
             attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Agenda of the Conference',
                            'image_url': 'http://www.ellenhartson.com/wp-content/uploads/2011/04/agenda.gif',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Agenda',
                                    'payload': 'Agenda'
                                }
                            ]
                        },{
                            "title": "Schedule And Duration of the Meet",
                            "image_url": "http://www.gifs.net/Animation11/Words/Other_Words/schedule.gif",
                            "buttons": [
                                {
                                    'title': 'Schedule duration ',
                                    'type': 'postback',
                                    'payload': 'Schedule duration'                       
                                }
                            ]                
                        }, {
                            "title": "Venue",
                            "image_url": "http://www.cardabeachhotel.gr/wp-content/uploads/kos-carda-beach-hotel-1680x1050.jpg",
                            "buttons": [
                                {   
                                    'title': 'Venue ',
                                    'type': 'postback',
                                    'payload': 'Venue'                       
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

controller.hears(['Location Details'], 'message_received,facebook_postback', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
             attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Weather Forecast View',
                            'image_url': 'http://0.s3.envato.com/files/1616804/Preview_image.jpg',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Weather',
                                    'payload': 'Weather'
                                }
                            ]
                        },{
                            "title": "Venue Map View",
                            "image_url": "http://northamptonshireguide.co.uk/images/img_9019-medium.jpg",
                            "buttons": [
                                {
                                    'title': 'Venue',
                                    'type': 'postback',
                                    'payload': 'Venue'                       
                                }
                            ]                
                        }, {
                            "title": "Tourist View",
                            "image_url": "https://3.bp.blogspot.com/-O7bty3tTJAk/VyqO0Aca_yI/AAAAAAAABwE/7DL4kqrbAOoSAyYERjOPt8dp_M0IG1huQCLcB/w1200-h630-p-nu/Shillong_beautiful_wallpapers.jpg",
                            "buttons": [
                                {   
                                    'title': 'Tourist Guide',
                                    'type': 'postback',
                                    'payload': 'Tourist Guide'                       
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
});

controller.hears(['Weather','weather'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
     request('http://apidev.accuweather.com/currentconditions/v1/1-189781_1_AL.json?language=en&apikey=hoArfRosT1215', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var  forecast = JSON.stringify(JSON.parse(body)[0].WeatherText).replace( /"/g, "" );
        var  temp     = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Value);
        var degree    = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Unit).replace( /"/g, "" );

        convo.say('bhubaneshwar current\'s weather forecast  is '+ forecast+temp+degree); 
        convo.say('most of the time its minimum 29C in day time and around 22C at nyt time');
       /* convo.say({
                "attachment":{
                "type":"image",
                "payload":{
                    "url":"https://img.clipartfest.com/ca530423485be0b31c38cb5c1a760985_animated-sun-images-clipart-animated-sun_600-600.gif"
                    }
                }
            });*/
        }
     });
    convo.next();
     });
});

controller.hears(['Event Organizers'], 'message_received,facebook_postback', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
             attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Travel Organizers',
                            'image_url': 'http://manchestershambhala.org/wordpress/wp-content/uploads/2013/03/Who-am-I.jpg',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'know more >',
                                    'payload': 'Travel Organizers'
                                }
                            ]
                        },{
                            "title": "Accomodation Organizers",
                            "image_url": "https://www.dougsguides.com/sites/default/files/Indecision.jpg",
                            "buttons": [
                                 {
                                    'type': 'postback',
                                    'title': 'know more >',
                                    'payload': 'Accomodation Organizers'
                                }
                            ]                
                        }, {
                            "title": "Tourist Agents",
                            "image_url": "http://www.grindd.com/blog/wp-content/uploads/2013/10/sales_team_mgt.jpg",
                            "buttons": [
                                {
                                    'type': 'postback',
                                    'title': 'know more >',
                                    'payload': 'Tourist Agents'
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

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received,facebook_postback', function (bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message, ':|] I am a bot. I have been running for ' + uptime + ' on ' + hostname + '.');
});

controller.hears(['what is my name', 'who am i'], 'message_received,facebook_postback', function (bot, message) {
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

controller.hears(['Venue','where','location'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function(err, convo) {
        convo.ask({
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"The conference is at bhubaneshwar crown plaza near Kumrangar. Do you know this place ?",
            "buttons":[
              {
                "type":"postback",
                "title":"yes i know the place",
                "payload":"user know place"
              },
              {
                "type":"postback",
                "title":"nopes i donno",
                "payload":"user donno place"
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

controller.hears(['user know place'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('woooooooo');
   /*    convo.say({
                      "attachment":{
                      "type":"image",
                      "payload":{
                        "url":"https://s-media-cache-ak0.pinimg.com/originals/85/89/46/858946b7dadb1089cd6d4b00f44c416b.gif"
                      }
                    }
                });*/
    convo.say('meet u soon den !');
    convo.next();

    });
});

controller.hears(['user donno place'], 'message_received,facebook_postback', function (bot, message) {
         bot.startConversation(message, function(err, convo) {
           convo.say('oh i guess you are new to city !'); 
/*             convo.say({
                      "attachment":{
                      "type":"image",
                      "payload":{
                        "url":"https://bsbproduction.s3.amazonaws.com/portals/9755/images/faq.gif"
                      }
                    }
                });*/
           convo.say({
                "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [{
                                        "title": "Its Venue location",
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
            });
        convo.next();
       });
});

controller.hears(['Schedule duration','when'], 'message_received,facebook_postback', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        bot.reply(message, 'Conference is scheduled on 5 th of October 2016');
    });
});

controller.hears(['Agenda','about','related'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('i know little abt it!');
    convo.ask({
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"well do you know about ATUNE",
            "buttons":[
              {
                "type":"postback",
                "title":"yeah",
                "payload":"user know ATUNE"
              },
              {
                "type":"postback",
                "title":"nopes",
                "payload":"user donno ATUNE"
              }
            ]
          }
        }    
   }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        }); 
 });
});

controller.hears(['user know ATUNE'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'So agenda is actually to introduce new technologies and have networking among employees');
});

controller.hears(['user donno ATUNE'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('ATUNE is ATU networking program that arranges conference yearly twice.this is the second one.');
    convo.say('So agenda is actually to introduce new technologies and have networking among employees');
    convo.next();
    });
});



controller.hears(['yeah i want more details'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.say('You can proceed with your queries');
          convo.say('here is a guide for you again');
           convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'ATUNE 2nd Conference',
                            'image_url': 'http://www.safety4sea.com/wp-content/uploads/2015/11/Conference.jpg',
                            'subtitle': 'This is the second conference of ATUNE we are having.',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Conference Details',
                                    'payload': 'Conference details'
                                }
                            ]
                        },{
                            'title': 'First time to be in bhubaneshwar',
                            'image_url': 'http://www.aids2016.org/portals/0/Image/Thumb/pic_venue_outdoor.jpg?ver=2015-11-04-120531-493',
                            'subtitle': 'And big – awash with a full-bodied juiciness that makes it instantly recognizable. ',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Location and Venue',
                                    'payload': 'Location and Venue'
                                }
                            ]
                        }, {
                            'title': 'I am here assisting you',
                            'image_url': 'http://worldartsme.com/images/i-me-clipart-1.jpg',
                            'subtitle': 'This coffee gets its distinctive sweetness from the way it is roasted: dark, and darker still.',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'About myself',
                                    'payload': 'About myself'
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
});
controller.hears(['nopes thanks i dont want further details'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {
        convo.say('Okay!Bubye then cya next time');
 /*           convo.say({
                "attachment":{
                    "type":"image",
                    "payload":{
                    "url":"https://media.giphy.com/media/7NO5hb2oAiE2Q/giphy.gif"
                    }
                }
            });*/
        convo.next();
        setTimeout(function () {
            process.exit();
        }, 3000);
    });
});

controller.on('message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {

        convo.ask('Do you need any further information?', [{
                pattern: bot.utterances.yes,
                default: true,
                callback: function (response, convo) {
        bot.startConversation(message, function(err, convo) {
        
/*        convo.say({
                      "attachment":{
                      "type":"image",
                      "payload":{
                        "url":"http://www.la-coffee-melodie-suite.com/image-files/nbs-giftut7.gif"
                      }
                    }
                });*/
        convo.say('wassup!! i have guide for you again');
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'ATUNE 2nd Conference',
                            'image_url': 'http://www.safety4sea.com/wp-content/uploads/2015/11/Conference.jpg',
                            'subtitle': 'This is the second conference of ATUNE we are having.',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Conference Details',
                                    'payload': 'Conference details'
                                }
                            ]
                        },{
                            'title': 'First time to be in bhubaneshwar',
                            'image_url': 'http://www.aids2016.org/portals/0/Image/Thumb/pic_venue_outdoor.jpg?ver=2015-11-04-120531-493',
                            'subtitle': 'And big – awash with a full-bodied juiciness that makes it instantly recognizable. ',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Location and Venue',
                                    'payload': 'Location and Venue'
                                }
                            ]
                        }, {
                            'title': 'I am here assisting you',
                            'image_url': 'http://worldartsme.com/images/i-me-clipart-1.jpg',
                            'subtitle': 'This coffee gets its distinctive sweetness from the way it is roasted: dark, and darker still.',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'About myself',
                                    'payload': 'About myself'
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
