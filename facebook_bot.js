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

controller.hears(['hi','start_payload','hello'], 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Hi.. I am ATUNE-Bot. I will be happy to guide you with event details ☺')
        convo.say('What would you like to know more about...')
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
                                    'title': 'Agenda',
                                    'payload': 'Agenda'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Schedule',
                                    'payload': 'Schedule Duration'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Other Details',
                                    'payload': 'Other Details'
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
        var attachment = {
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
                                    'title': 'Agenda',
                                    'payload': 'Agenda'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Schedule',
                                    'payload': 'Schedule Duration'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Other Details',
                                    'payload': 'Other Details'
                                }
                            ]
                        }
                    ]
                }
            };
            bot.reply(message, {
               attachment: attachment
            });
});


controller.hears(['Location Details','location','Location'], 'message_received,facebook_postback', function(bot, message) {
     var attachment =  {
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
                                },{
                                    'type': 'postback',
                                    'title': 'Weather Forecast',
                                    'payload': 'Weather'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Sight Seeing',
                                    'payload': 'Sight Seeing'
                                },
                            ]
                        }
                    ]
                }
            };
            bot.reply(message, {
            attachment: attachment
            });  
});

controller.hears(['Weather','weather'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
     request('http://apidev.accuweather.com/currentconditions/v1/1-189781_1_AL.json?language=en&apikey=hoArfRosT1215', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var  forecast = JSON.stringify(JSON.parse(body)[0].WeatherText).replace( /"/g, "" );
        var  temp     = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Value);
        var degree    = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Unit).replace( /"/g, "" );
        convo.say('As you know, I am a nice person');
        convo.say('I collected the weather information for you upfront, so that you can plan better and have a lovely time ☺ ');
        convo.say('The forecasted weather for Bhubaneshwar on 23rd April is'+ forecast+temp+degree); 
        convo.say('The forecasted weather for Bhubaneshwar on 23rd April is'+ forecast+temp+degree); 
        convo.say('I bet you will enjoy the weather ☼');
             convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Location Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }                
                ]
              }
            }
        });
        }
     });
    convo.next();
     });
});

controller.hears(['Event Organizers','organizer','Organizer'], 'message_received,facebook_postback', function(bot, message) {
    var  attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Event Organizers',
                            'image_url': 'http://manchestershambhala.org/wordpress/wp-content/uploads/2013/03/Who-am-I.jpg',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Travel',
                                    'payload': 'Travel'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Accomodation',
                                    'payload': 'Accomodation'
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
            } ;
            bot.reply(message, {
            attachment: attachment
            });    
});


controller.hears(['Schedule duration','schedule','Schedule'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function(err, convo) {
       convo.say('Conference is scheduled on 23-Apr-17 (Sunday) & 24-Apr-17(Monday)');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Conference Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
     });
});

controller.hears(['Other Details'], 'message_received,facebook_postback', function (bot, message) {
      var  attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Other Details',
                            'image_url': 'https://cdn.pixabay.com/photo/2015/05/09/22/35/air-760325_960_720.jpg',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Travel',
                                    'payload': 'other_travel'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Dress Code',
                                    'payload': 'dress_code'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'SWON Details',
                                    'payload': 'swon_details'
                                }
                            ]                
                        }
                    ]
                }
            } ;
            bot.reply(message, {
            attachment: attachment
            });        
});

controller.hears(['other_travel'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('For associates travelling from outside India, if you are carrying laptop/tablet PC etc. suggest to carry an international power adapter. Also please refer to Ultimatix: Advisory: Electronics Ban on flights.');
        convo.say('Please carry your original Government issued Photo ID (Passport, Driver license etc.) to produce at the Venue during check-in.');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Conference Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
        convo.next();
    });
});

controller.hears(['dress_code'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Dress code for the event would be Business Casuals.');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Conference Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
        convo.next();
    });
});

controller.hears(['swon_details'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('SWON Number for Travel is 1042816');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Conference Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
        convo.next();
    });
});

controller.hears(['Agenda','agenda'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
          convo.say('Day 0 : 22-Apr-2017: 5:00 PM onwards to 9:30 PM'); 
          convo.say('Day 0 : 22-Apr-2017: 5:00 PM onwards to 9:30 PM');
          convo.say('Day 0 : 22-Apr-2017: 5:00 PM onwards to 9:30 PM');  
          convo.say('I can share further details once I get them. The Organizers are finalising as we speak');
           convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What would you like to know about next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Conference Details"
                  }
                ]
              }
            }
        });
        convo.ask({
            "attachment":{
                "text":"Pick a color:",
                "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Agenda",
                    "payload":"Agenda",
                    "image_url":"http://petersfantastichats.com/img/red.png"
                },
                {
                    "content_type":"text",
                    "title":"Location Details",
                    "payload":"Location Details",
                    "image_url":"http://petersfantastichats.com/img/green.png"
                }
                ]
            }
        });
         convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What would you like to know about next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Agenda",
                    "payload":"Agenda"
                  },{
                    "type":"postback",
                    "title":"Location Details",
                    "payload":"Location Details"
                  },{
                    "type":"postback",
                    "title":"Other Details",
                    "payload":"Other Details"
                  }
                ]
              }
            }
        });
    convo.next();
    }); 
});

controller.hears(['ATUNE'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('ATUNE is ATU networking program that arranges conference yearly twice.this is the second one.');
    });
});
 
controller.hears(['Venue','venue'], 'message_received,facebook_postback', function(bot, message) {
     bot.startConversation(message, function(err, convo) {
                convo.say('Hotel address is: 8-B, Jaydev Vihar, Bhubaneshwar, Odisha 751013');
                convo.say('You can also refer to link : http://www.mayfairhotels.com/ for more details');
                convo.say('Mayfair Hotels Gallery');
                convo.ask({
                        attachment: {
                            'type': 'template',
                            'payload': {
                                'template_type': 'generic',
                                'elements': [
                                    {
                                        'title': 'Room',
                                        'image_url': 'http://media-cdn.tripadvisor.com/media/photo-o/02/83/a6/00/mon-port-hotel-spa.jpg'
                                    },{
                                        "title": "reception",
                                        "image_url": "http://www.college-hotel.com/client/cache/contenu/_500____college-hotelp1diapo1_718.jpg"
                                    }, {
                                        "title": "around view",
                                        "image_url": "http://www.cardabeachhotel.gr/wp-content/uploads/kos-carda-beach-hotel-1680x1050.jpg"
                                    }
                                ]
                            }
                        }                     
            });
         convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Location Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
    convo.next();
    });
});

controller.hears(['Sight Seeing'], 'message_received,facebook_postback', function(bot, message) {
       bot.startConversation(message, function(err, convo) {
       convo.ask({
        "attachment" : {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Lingaraj Temple',
                            'image_url': 'http://veda.wdfiles.com/local--files/info%3Alingaraja-mandir/lingaraja-temple.jpg'
                        },{
                            "title": "Nandankanan Zoological Park",
                            "image_url": "http://incredibleorissa.com/wp-content/uploads/Nandankanan-Zoological-Park.jpg"
                        }, {
                            "title": "Dhauli Giri Hills",
                            "image_url": "http://www.dhauli.net/images/excursion-dhauli-hill-1.jpg"
                        }
                    ]
                }
            }
       });    
    
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Location Details"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
        convo.next();
    });
});

controller.hears(['Travel'], 'message_received,facebook_postback', function (bot, message) {
   bot.startConversation(message, function(err, convo) {
                convo.say('For Travel Details you can contact Mr.XYZABCD , Ph no: 9999955555');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Event Organizers"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
    convo.next();
    });
});

controller.hears(['Accomodation'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('For Accomodation related queries and details you can contact Mr.ABCDEFG , Ph no: 9999944444');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Event Organizers"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
    convo.next();
    });
});

controller.hears(['Tourist Agents'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('For Tourist Guidance you can contact Ms.ASDFGHJK , Ph no: 9999911111');
        convo.ask({
              "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"What do you want to do next?",
                "buttons":[
                  {
                    "type":"postback",
                    "title":"Go Back",
                    "payload":"Event Organizers"
                  },{
                    "type":"postback",
                    "title":"Main Menu",
                    "payload":"start_payload"
                  }
                ]
              }
            }
        });
    convo.next();
    });
    
});


controller.on('message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Try: agenda` or `schedule` or `venue`');
    return false;
});
