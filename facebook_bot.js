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
        "title":"Event",
        "payload":"Conference Details"
    },
    {
        "type":"postback",
        "title":"Location",
        "payload":"Location Details"
    },
    {
      "type":"postback",
      "title":"Travel",
      "payload":"Travel"
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

// starting with hi and start_payload
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
                            'title': 'ATUNE 2017',
                            'image_url': 'https://dl.dropbox.com/s/6f4gqwfkng9vmjc/conference_1.png',
                            'subtitle': '',
                            'buttons': [
                                {
                                    'type': 'postback',
                                    'title': 'Event',
                                    'payload': 'Conference Details'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Location',
                                    'payload': 'Location Details'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Travel',
                                    'payload': 'Travel'
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

// Menu->Event 
controller.hears(['Conference Details'], 'message_received,facebook_postback', function(bot, message) {
        var attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Event',
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

// Menu->Location 
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
                                    'title': 'Accomodation',
                                    'payload': 'Accomodation'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bhubaneshwar',
                                    'payload': 'Bhubaneshwar'
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

// Menu->Location->Bhbaneshwar->Weather
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
                    "payload":"Bhubaneshwar"
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

// Menu->Location->Bhubaneshwar
controller.hears(['Bhubaneshwar'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {
     convo.ask({
        "attachment":{
            "type":"template",
            "payload":{
                'template_type': 'generic',
                'elements': [
                 {
                    'title': 'Location Details',
                    'image_url': 'https://dl.dropbox.com/s/gzoncsdgbvjfct0/bhubaneshwar_1.png',
                    'subtitle': '',
                    'buttons': [
                    {
                        'type': 'postback',
                        'title': 'Local Attraction',
                        'payload': 'local_attraction'
                    },{
                        'type': 'postback',
                        'title': 'Food',
                        'payload': 'food'
                    },
                    {
                        'type': 'postback',
                        'title': 'Weather',
                        'payload': 'Weather'
                    }
                    ]
                }
                ]
            }
        }
    });
    });
 }); 



// Menu->Location->Bhubaneshwar->Local Attraction 
controller.hears(['local_attraction'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.ask({
              'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Lingaraja temple',
                            'image_url': 'https://en.wikipedia.org/wiki/Lingaraja_Temple#/media/File:Beauty_of_LingrajTemple.jpg',
                            'subtitle': 'Temple is the most prominent mark of the city.Is the largest temple i the city..',
                            "buttons":[
                                        {
                                            "type":"web_url",
                                            "url":"https://en.wikipedia.org/wiki/Lingaraja_Temple",
                                            "title":"View More Details... "
                                        },
                             ]
                        },
                        {
                            'title': 'Nandankanan Zoological park',
                            'image_url': 'https://en.wikipedia.org/wiki/Nandankanan_Zoological_Park#/media/File:Nandankanan,Bhubaneswar,Odisha.JPG',
                            'subtitle': 'It contains a botanical garden and part of it has been declared a sanctuary. Nandankanan, literally meaning The Garden of Heavens..',
                             "buttons":[
                                        {
                                            "type":"web_url",
                                            "url":"https://en.wikipedia.org/wiki/Nandankanan_Zoological_Park",
                                            "title":"View More Details... "
                                        },
                             ]
                        },
                        {
                            'title': 'Udaygiri And Khandagiri caves',
                            'image_url': 'https://en.wikipedia.org/wiki/Udayagiri_and_Khandagiri_Caves#/media/File:Udayagiri_puri_-_March_2010.jpg',
                            'subtitle': 'Theses caves are partly natural and partly artificial caves of archaeological, historical and religious importance.. ',
                             "buttons":[
                                        {
                                            "type":"web_url",
                                            "url":"https://en.wikipedia.org/wiki/Udayagiri_and_Khandagiri_Caves",
                                            "title":"View More Details... "
                                        },
                             ]
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
                    "payload":"Bhubaneshwar"
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

// Menu->Location->Bhubaneshwar->Local Attraction 
controller.hears(['food'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Bhubaneshwar has the traditional Odisha delicacies as a major tourism center in India');
        convo.say('Panchana Phutana special mixture used in most of dishes,Typically Odisha Meal tastes awsome too. ');
          convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://s3-eu-west-1.amazonaws.com/sosnewbucketforlive/blog_img/strand_of_silk_-_journey_map_-_exploring_the_cuisine_of_odisha_-_lunch_thali.jpg"
            }
      }
    });
        convo.say('You cannot forget Rasgolla,Chamcham..');
        convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"http://images.mapsofindia.com/my-india/Rasgulla-665x453.jpg"
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
                    "payload":"Bhubaneshwar"
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

// Menu->Location->Bhubaneshwar->Organizers
controller.hears(['organising_team'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.next();
    });
});

// Menu->Travel
controller.hears(['Travel'], 'message_received,facebook_postback', function(bot, message) {
    var  attachment = {
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
                                    'title': 'Travel Tips',
                                    'payload': 'tips'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Flight Timings',
                                    'payload': 'flight_timings'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Flight Status',
                                    'payload': 'flight_status'
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

//
controller.hears(['flight_timings'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {
    convo.say('Flight Timings are:');
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
                    "payload":"Travel"
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

//
controller.hears(['flight_status'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {
    convo.say('Flight Status is :');
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
                    "payload":"Travel"
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

// Menu->Event->Schedule
controller.hears(['Schedule duration','schedule','Schedule'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function(err, convo) {
       convo.say('Conference schedule is marked below ');
       convo.ask({
        "attachment":{
        "type":"image",
        "payload":{
            "url":"https://dl.dropboxusercontent.com/s/6kltzw9bbgiwco2/schedule_1.gif"
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

// Menu->Event->Other
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
                                    'title': 'Dress Code',
                                    'payload': 'dress_code'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'SWON Details',
                                    'payload': 'swon_details'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Organising Team',
                                    'payload': 'organising_team'
                                },
                                
                            ]                
                        }
                    ]
                }
            } ;
            bot.reply(message, {
            attachment: attachment
            });        
});

// Menu->Event->Other->DressCode
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
                    "payload":"Other Details"
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

// Menu->Event->Other->SWON
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
                    "payload":"Other Details"
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

// Menu->Event->Agenda
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

// message recieve ATUNE
controller.hears(['ATUNE'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('ATUNE is ATU networking program that arranges conference yearly twice.this is the second one.');
    });
});

// Menu->Travel-Travel Tips
controller.hears(['tips'], 'message_received,facebook_postback', function (bot, message) {
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
                    "payload":"Travel"
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
 
// Menu->Location->Venue
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
                                        "title": "Reception",
                                        "image_url": "http://www.college-hotel.com/client/cache/contenu/_500____college-hotelp1diapo1_718.jpg"
                                    }, {
                                        "title": "Around View",
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

// Not required
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

// Menu->Location->Accomodation
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

// Menu->Event->Other->Organising Team
controller.hears(['organising_team'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('For Travel Details you can contact Mr.XYZABCD , Ph no: 9999955555');
        convo.say('For Accomodation related queries and details you can contact Mr.ABCDEFG , Ph no: 9999944444');
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
                    "payload":"Other Details"
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

// Default message
controller.on('message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Try: agenda` or `schedule` or `venue`');
    return false;
});
