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

var bot = controller.spawn({});

controller.setupWebserver(process.env.PORT || process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('ONLINE!');
    });
});


controller.api.thread_settings.greeting('Welcome to ATUNE Event. I am ATUNE Bot to provide event details');
controller.api.thread_settings.get_started('start_payload');


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

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
    bot.reply(message, 'Welcome To My Chatbot Thanks Alot!')
})

controller.hears(['start_payload'], 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Welcome to ATUNE Event.')
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'ATUNE-2017 Conference',
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
                                    'title': 'SWON Details',
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
                                    'title': 'Venue',
                                    'payload': 'Venue'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Weather Forecast',
                                    'payload': 'Weather'
                                },
                                 {
                                    'type': 'postback',
                                    'title': 'Sight Seeing',
                                    'payload': 'Sight Seeing'
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
                                    'title': 'Travel ',
                                    'payload': 'Travel Organizers'
                                },
                                 {
                                    'type': 'postback',
                                    'title': 'Accomodation',
                                    'payload': 'Accomodation Organizers'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Tourist',
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
                                    'title': 'Schedule & Duration ',
                                    'type': 'postback',
                                    'payload': 'Schedule duration'                       
                                }
                            ]                
                        }, {
                            "title": "SWON Details",
                            "image_url": "http://www.cardabeachhotel.gr/wp-content/uploads/kos-carda-beach-hotel-1680x1050.jpg",
                            "buttons": [
                                {   
                                    'title': 'SWON Details',
                                    'type': 'postback',
                                    'payload': 'Swon Details'                       
                                }
                            ]                
                        }
                    ]
                }
            }    
   }, function(response, convo) {           
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
                            'title': 'Location Details',
                            'image_url': 'http://www.aids2016.org/portals/0/Image/Thumb/pic_venue_outdoor.jpg?ver=2015-11-04-120531-493',
                            'subtitle': '',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Venue',
                                    'payload': 'Venue'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Sight Seeing',
                                    'payload': 'Sight Seeing'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Weather Forecast',
                                    'payload': 'Weather'
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

controller.hears(['Weather'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
     request('http://apidev.accuweather.com/currentconditions/v1/1-189781_1_AL.json?language=en&apikey=hoArfRosT1215', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var  forecast = JSON.stringify(JSON.parse(body)[0].WeatherText).replace( /"/g, "" );
        var  temp     = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Value);
        var degree    = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Unit).replace( /"/g, "" );

        convo.say('Bhubaneshwar weather forecast  on 23rd April '+ forecast+temp+degree); 
        convo.say('Bhubaneshwar weather forecast  on 24th April'+ forecast+temp+degree); 
        convo.say('Average Temperature 29C (Day) / 22C (Night)');
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
                            'title': 'Travel',
                            'image_url': 'http://manchestershambhala.org/wordpress/wp-content/uploads/2013/03/Who-am-I.jpg',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'know more >',
                                    'payload': 'Travel Organizers'
                                }
                            ]
                        },{
                            "title": "Accomodation",
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

controller.hears(['Schedule duration'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'Conference is scheduled on 23-Apr-17 (Sunday) & 24-Apr-17(Monday)');
});

controller.hears(['Swon Details'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'SWON Number for Travel is 1042816 ');
});

controller.hears(['Agenda'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('Agenda');
    convo.ask({
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"button",
            "text":"Well do you know about ATUNE",
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
        bot.reply(message, 'Agenda is actually to introduce new technologies and have networking among employees');
});

controller.hears(['user donno ATUNE'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('ATUNE is ATU networking program that arranges conference yearly twice.this is the second one.');
    convo.say('So agenda is actually to introduce new technologies and have networking among employees');
    convo.next();
    });
});

controller.on('message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {

        convo.ask('Do you need any further information?', [{
                pattern: bot.utterances.yes,
                default: true,
                callback: function (response, convo) {
                   bot.startConversation(message, function(err, convo) {
                            convo.say('Welcome to ATUNE Event.')
                            convo.ask({
                                attachment: {
                                    'type': 'template',
                                    'payload': {
                                        'template_type': 'generic',
                                        'elements': [
                                            {
                                                'title': 'ATUNE-2017 Conference',
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
                                                        'title': 'Weather Forecast',
                                                        'payload': 'Weather'
                                                    },
                                                    {
                                                        'type': 'postback',
                                                        'title': 'Venue',
                                                        'payload': 'Venue'
                                                    },
                                                    {
                                                        'type': 'postback',
                                                        'title': 'Sight Seeing',
                                                        'payload': 'Sight Seeing'
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
                                                        'title': 'Travel ',
                                                        'payload': 'Travel Organizers'
                                                    },
                                                    {
                                                        'type': 'postback',
                                                        'title': 'Accomodation',
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
    
controller.hears(['Venue'], 'message_received,facebook_postback', function(bot, message) {
     bot.startConversation(message, function(err, convo) {
                convo.say('Hotel address is:');
                convo.say('facilities are:');
                convo.say('gallery');
                convo.ask({
                        attachment: {
                            'type': 'template',
                            'payload': {
                                'template_type': 'generic',
                                'elements': [
                                    {
                                        'title': 'Room',
                                        'image_url': 'https://en.wikipedia.org/wiki/Lingaraja_Temple#/media/File:Beauty_of_LingrajTemple.jpg'
                                    },{
                                        "title": "reception",
                                        "image_url": "https://en.wikipedia.org/wiki/Nandankanan_Zoological_Park#/media/File:Nandankanan,Bhubaneswar,Odisha.JPG"
                                    }, {
                                        "title": "around view",
                                        "image_url": "http://www.cardabeachhotel.gr/wp-content/uploads/kos-carda-beach-hotel-1680x1050.jpg"
                                    }
                                ]
                            }
                        }    
            }, function(response, convo) {           
                        convo.next();
                    });
    });
});

controller.hears(['Sight Seeing'], 'message_received,facebook_postback', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
             attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Lingaraj Temple',
                            'image_url': 'https://en.wikipedia.org/wiki/Lingaraja_Temple#/media/File:Beauty_of_LingrajTemple.jpg'
                        },{
                            "title": "Nandankanan zoological Park",
                            "image_url": "https://en.wikipedia.org/wiki/Nandankanan_Zoological_Park#/media/File:Nandankanan,Bhubaneswar,Odisha.JPG"
                        }, {
                            "title": "Dhauli Giri Hills",
                            "image_url": "http://www.cardabeachhotel.gr/wp-content/uploads/kos-carda-beach-hotel-1680x1050.jpg"
                        }
                    ]
                }
            }    
   }, function(response, convo) {           
            convo.next();
        });
    });
})    

controller.hears(['Travel Organizers'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'travel organizers.......... ');
});
controller.hears(['Accomodation Organizers'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'Accomodation Organizers.......... ');
});
controller.hears(['Tourist Agents'], 'message_received,facebook_postback', function (bot, message) {
        bot.reply(message, 'Tourist Agents.......... ');
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
