var Botkit = require('./lib/Botkit.js')
var os = require('os')
var localtunnel = require('localtunnel')
var opn = require('opn')
var request = require('request');

// controller bot definition
var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true 
});
var bot = controller.spawn({});

// create webhook server
controller.setupWebserver(process.env.PORT || process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('ONLINE!');
    });
});

// thread settings
controller.api.thread_settings.greeting('Welcome to ATUNE Event. I am ATUNE Bot to provide event details');
controller.api.thread_settings.get_started('start_payload');

// default main menu for the facebook menu button
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


// utterance declaration
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

// default main menu display
function main_menu(convo) {
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
}
// starting with hi and start_payload
controller.hears(['hi','start_payload','hello'], 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Hi.. I am ATUNE-Bot. I will be happy to guide you with event details ☺')
        main_menu(convo);
    });
});


// again_payload on go back menu option
controller.hears(['again_payload'], 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        main_menu(convo);
    });
});


// ====================================== Main Menu  1. Event================================
controller.hears(['Conference Details','Event','conference'], 'message_received,facebook_postback', function(bot, message) {
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

// event_callback_menu
function event_callback_menu(convo){
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
                "payload":"again_payload"
              }
            ]
          }
        }
    });
}

// ====================================== 1. Event Menu 1.1 AGENDA================================
controller.hears(['Agenda','agenda'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
          convo.say('Day 0 : 22-Apr-2017: 5:00 PM onwards to 9:30 PM'); 
          convo.say('Day 1 : 23-Apr-2017: 5:00 PM onwards to 9:30 PM');
          convo.say('Day 2 : 24-Apr-2017: 5:00 PM onwards to 9:30 PM');  
          convo.say('I can share further details once I get them. The Organizers are finalising as we speak');
          event_callback_menu(convo);
    }); 
});
// ====================================== 1. Event Menu 1.1 AGENDA***********================================


// ====================================== 1. Event Menu 1.2 SCHEDULE================================
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
       event_callback_menu(convo);
    });
});

// ====================================== 1. Event Menu 1.3 OTHER DETAILS==================================================
controller.hears(['Other Details'], 'message_received,facebook_postback', function (bot, message) {
      var  attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Other Details',
                            'image_url': 'http://www.spring.org.uk/images/helping_hand4.jpg',
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

function other_details_callback_menu(convo){
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
                "payload":"again_payload"
              }
            ]
          }
        }
    });
}

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.1 DRESS CODE================================
controller.hears(['dress_code'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Dress code for the event would be Business Casuals.');
        other_details_callback_menu(convo)
    });
});

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.1 DRESS CODE**************===================


// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.2 SWON DETAILS===================
controller.hears(['swon_details'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('SWON Number for Travel is 1042816');
        other_details_callback_menu(convo)
    });
});

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.2 SWON DETAILS**************===================

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.3 ORGANIZING TEAM===================
controller.hears(['organising_team'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('For Travel Details you can contact Mr.XYZABCD , Ph no: 9999955555');
        convo.say('For Accomodation related queries and details you can contact Mr.ABCDEFG , Ph no: 9999944444');
        convo.say('For Tourist Guidance you can contact Ms.ASDFGHJK , Ph no: 9999911111');
        other_details_callback_menu(convo)
    });
});
// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.3 ORGANIZING TEAM===================

// ====================================== 1. Event Menu 1.3 OTHER DETAILS**************==========================

//============================================END OF EVENT========================================================

// ====================================== Main Menu  2. Location==================================

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

// callback main_menu_location
function location_callback_menu(convo) {
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
                "payload":"again_payload"
                }
                ]
                }
                }
    });
}

// ====================================== Main Menu  2. Location 2.1 VENUE==================================
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
                                        'title': 'Aerial View of Cottages with Lagoon',
                                        'image_url': 'https://dl.dropbox.com/s/9ijlj0rs0cmtgb5/hotel_1.png'
                                    },{
                                        "title": "Evening View of Lagoon",
                                        "image_url": "https://dl.dropbox.com/s/8w3q9fjx2st2gh0/hotel_2.png"
                                    }, {
                                        "title": "Lobby Mayfair Lagoon",
                                        "image_url": "https://dl.dropboxusercontent.com/s/alzatuiz50f8f39/hotel_3.png"
                                    },
                                    {
                                        "title": "Evening View MAYFAIR Lagoon",
                                        "image_url": "https://dl.dropbox.com/s/0g6tuzao3jsn5ni/hotel_4.png"
                                    }
                                ]
                            }
                        }                     
            });
    location_callback_menu(convo);
    convo.next();
    });
});
// ====================================== Main Menu  2. Location 2.1 VENUE**********========================

// ====================================== Main Menu  2. Location 2.2 ACCOMODATION==================================
controller.hears(['Accomodation'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('For Accomodation related queries and details you can contact Mr.ABCDEFG , Ph no: 9999944444');
    location_callback_menu(convo);
    convo.next();
    });
});
// ====================================== Main Menu  2. Location 2.2 ACCOMODATION************======================

// ====================================== Main Menu  2. Location 2.3 BHUBANESHWAR==================================
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

// bhubaneshwar_callback_menu
function bhubaneshwar_callback_menu(convo) {
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
                "payload":"again_payload"
                }
                ]
                }
                }
    });
}

// ====================================== Main Menu  2. Location 2.3 BHUBANESHWAR*******==============================

// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.LOCAL ATTRACTION========================
controller.hears(['local_attraction'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.ask({
              'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Location Attraction',
                            "buttons":[
                                        {
                                        "type":"postback",
                                        "title":"Lingaraja temple",
                                        "payload":"lingaraja"
                                        },
                                        {
                                        "type":"postback",
                                        "title":"Nandankanan Zoological park",
                                        "payload":"nandankanan"
                                        },
                                        {
                                        "type":"postback",
                                        "title":"Udaygiri And Khandagiri caves",
                                        "payload":"udaygiri"
                                        }
                            ]
                        }
                    ]
                }
            }
        });
    });
});


// local_attraction_callback_menu
function local_attraction_callback_menu(convo) {
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
                        "payload":"local_attraction"
                        },{
                        "type":"postback",
                        "title":"Main Menu",
                        "payload":"again_payload"
                        }                
                    ]
                }
            }
    });
}


// Location => Bhubaneshwar => Local Attraction =>Lingaraja 
controller.hears(['lingaraja'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.ask({
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Lingaraja temple',
                            'image_url': 'https://dl.dropbox.com/s/gzoncsdgbvjfct0/bhubaneshwar_1.png',
                            'subtitle': 'Temple is the most prominent mark of the city.Is the largest temple i the city..',
                            "buttons":[
                                        {
                                            "type":"web_url",
                                            "url":"https://en.wikipedia.org/wiki/Lingaraja_Temple",
                                            "title":"View More Details... "
                                        },
                            ]
                        }
                    ]
                }
                    
            }
        });
        local_attraction_callback_menu(convo);
    });
});

// Location => Bhubaneshwar => Local Attraction => Nandankanan Zoological park 
controller.hears(['nandankanan'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.ask({
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                       {
                            'title': 'Nandankanan Zoological park',
                            'image_url': 'https://dl.dropbox.com/s/mh2zyckvupkga57/nandankanan_1.png',
                            'subtitle': 'It contains a botanical garden and part of it has been declared a sanctuary. Nandankanan, literally meaning The Garden of Heavens..',
                             "buttons":[
                                        {
                                            "type":"web_url",
                                            "url":"https://en.wikipedia.org/wiki/Nandankanan_Zoological_Park",
                                            "title":"View More Details... "
                                        },
                             ]
                        }
                    ]
                }
                    
            }
        });
        local_attraction_callback_menu(convo);
    });
});

// Location => Bhubaneshwar => Local Attraction => Udayagiri and Khandagiri caves
controller.hears(['udaygiri'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.ask({
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Udayagiri and Khandagiri caves',
                            'image_url': 'https://dl.dropbox.com/s/dthpnjuvegfhnit/udayagiri_1.png',
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
        local_attraction_callback_menu(convo);
    });
});

// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.LOCAL ATTRACTION*************==========


// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.FOOD========================

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
       bhubaneshwar_callback_menu(convo);
    });
});  
// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.FOOD**************==========

// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.WEATHER=====================
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
        }
        });
        bhubaneshwar_callback_menu(convo);
        convo.next();
     });
});
// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.WEATHER****=================

// ============================ Main Menu  2. Location 2.1 BHUBANESHWAR *************==========

// ====================================== Main Menu 2.Location************===================================

//============================================END OF LOCATION================================================

// ====================================== Main Menu 3. Travel================================

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

// local_attraction_callback_menu
function travel_callback_menu(convo) {
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
                        "payload":"again_payload"
                        }                
                    ]
                }
            }
    });
}
// ====================================== Main Menu 3. Travel 3.1 Flight Tips================================
controller.hears(['tips'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('For associates travelling from outside India, if you are carrying laptop/tablet PC etc. suggest to carry an international power adapter. Also please refer to Ultimatix: Advisory: Electronics Ban on flights.');
    convo.say('Please carry your original Government issued Photo ID (Passport, Driver license etc.) to produce at the Venue during check-in.');
    travel_callback_menu(convo);
    });
});

// ====================================== Main Menu 3. Travel 3.1 Flight Tips********========================


// ====================================== Main Menu 3. Travel 3.2 Flight Timings================================
controller.hears(['flight_timings'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('Flight Timings are:');
          convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://dl.dropbox.com/s/9wztnardq8lxli4/table_1.PNG"
            }
            }
          });
         convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://dl.dropbox.com/s/an75mrsdf6gns6c/table_2.PNG"
            }
            }
          });
         convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://dl.dropbox.com/s/90hpwm8020xwzzf/table_3.PNG"
            }
            }
          });
         convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://dl.dropbox.com/s/izhkm2aoiqcmd53/table_4.PNG"
            }
            }
          });
         convo.ask({
            "attachment":{
            "type":"image",
            "payload":{
                "url":"https://dl.dropbox.com/s/nscwyene34dcp59/table_5.PNG"
            }
            }
          });
    travel_callback_menu(convo);
    });
});

// ====================================== Main Menu 3. Travel 3.2 Flight Timings********=====================

// ====================================== Main Menu 3. Travel 3.3 Flight Status==============================

controller.hears(['flight_status'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Flight Status is :');
        convo.ask({
            "attachment":{
            "type":"template",
            "payload":{
                "buttons":[
                    {
                    "type":"web_url",
                    "url":"http://www.flightstats.com/go/FlightStatus/flightStatusByAirport.do?airportCode=BBI&airportQueryType=1",
                    "title":"Click the link below to know the flight status",
                    "webview_height_ratio": "compact"
                    }
                ]
                }
            }
          });
    travel_callback_menu(convo);
    });
});

// ====================================== Main Menu 3. Travel 3.3 Flight Status******========================

// ====================================== Main Menu  3. Travel===============================================

//============================================END OF Travel===================================================


// COMMON MATCHES
// ATUNE MATCH
controller.hears(['ATUNE','atune'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('ATUNE is ATU networking program that arranges conference yearly twice.this is the second one.');
    });
});
 



// ===============================TRIAL=================================================

controller.hears(['quick'], 'message_received', function(bot, message) {
    bot.startConversation(message, function (err, convo) {
    bot.reply(message, {
        text: 'Hey! This message has some quick replies attached.',
        quick_replies: [
            {
                "content_type": "text",
                "title": "Yes",
                "payload": "who",
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "no",
            },          {
                "content_type": "text",
                "title": "True",
                "payload": "yes",
            },
            {
                "content_type": "text",
                "title": "False",
                "payload": "no",
            }
        ]
    });
  });
});

// yes check payload
controller.hears(['who'],'message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'you have clicked yes');
});

// ===============================TRIAL=================================================


// Default error message
controller.on('message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'Try: agenda` or `schedule` or `venue`');
    return false;
});

