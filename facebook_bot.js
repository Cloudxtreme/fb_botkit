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
    convo.say('OK. What would you like to know about?')
    convo.ask({
        attachment: {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [
                    {
                        'title': 'ATUNE 2017',
                        'image_url': 'https://bhubabot.blob.core.windows.net/images/conference_1.png',
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
var welcome_message = ['^hi$','^start_payload$','^hello$','^start$','^hey$','^whatsup$','^howsu$']

controller.hears(welcome_message, 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        

//     // get user name
//     var user_name;
//     getUserName = function(response, convo) {
//     var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + response.user + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.page_token;
//     request({
//         url: usersPublicProfile,
//         json: true // parse
//     }, function (error, response, body) {
//             if (!error && response.statusCode === 200) {
//                  botkit.debug('NAME', body.first_name);
//                  botkit.debug('NAME', body.last_name);
//                 user_name = body.first_name;
//             }
//         });
//     };
        
        
        convo.say('Hi Geek, I am BhubaBot. Nice to meet you ☺ ')
        convo.say('Did you know, I am from Planet Mars - Elon Musk pulled me back in a SpaceX Falcon Rocket  ');
        convo.say('You know why? To give you Geeks some valuable info  and also, to savor the lovely Bhubaneshwar delicacies- Especially the Rosgollas. OK. ');
        convo.say('Now that I know a little about Bhubaneshwar and also have managed to grasp a little bit of English, I might be able to help you.');
        main_menu(convo);
    });
});

var again_payload = ["again_payload","^main menu$","^index$","^menu$","^content$"]
// again_payload on go back menu option
controller.hears(again_payload, 'message_received,facebook_postback', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        main_menu(convo);
    });
});


// ====================================== Main Menu  1. Event================================
var event = ['^Conference Details$','^Event$','^conference$']
controller.hears(event, 'message_received,facebook_postback', function(bot, message) {
    bot.reply(message, 'As you might already be knowing ATUNE is the ATU units annual networking event.');
    bot.reply(message, 'Three days of professional networking with associates across multiple functions.'); 
    bot.reply(message, 'This is going to be a great place to be for you to catapult your professional capabilities.');
    bot.reply(message, 'So yeah, what is it you would like to know about?');
        var attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Event',
                            'image_url': 'https://bhubabot.blob.core.windows.net/images/conference.jpg',
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
var agenda = ['^Agenda$','^about$']
controller.hears(agenda, 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
         convo.say('OK, The organizers have told me that this is ONLY for TCSers, so I would\'nt know much. But hey, dont worrry, Just go to Knome to get the full details');
         event_callback_menu(convo);
    }); 
});
// ====================================== 1. Event Menu 1.1 AGENDA***********================================


// ====================================== 1. Event Menu 1.2 SCHEDULE================================
var schedule = ['^Schedule duration$','^schedule$','^plan$',"^event timing$","^duration$"]
controller.hears(schedule, 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function(err, convo) {
       convo.say('The event spans across three days. I am sure, you are going to have FRUITful Time. I am not talking about fruits ☺ ');
       convo.say('The THREE days will fly like THREE minutes as you are going to Soak yourself in the Nectar of Networking')
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
controller.hears(['^Other Details$',"^others$","^other$"], 'message_received,facebook_postback', function (bot, message) {
    bot.reply(message,'Well, do you want to know more about')
      var  attachment = {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Other Details',
                            'image_url': 'https://bhubabot.blob.core.windows.net/images/other.png',
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
controller.hears(['^dress_code$','^dress code$','^dress$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Did you notice that I have two lovely Big Eyes?');
        convo.say('You know why?'); 
            convo.say('All the more to admire you :) '); 
            convo.say('OK..OK.. Now back to the question. '); 
            convo.say('Come dressed in your Business Casual attire. BTW, there is a photo session on 24-Apr-17 (Sun).');  
            convo.say('I am planning to teleport one version of your pictures o Planet Mars and surprise my civilization.');  
            convo.say('So be in your BEST EST business casual outfit.'); 
        other_details_callback_menu(convo)
    });
});

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.1 DRESS CODE**************===================


// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.2 SWON DETAILS===================
controller.hears(['^swon_details$','^swon$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Hmmm, now you are asking me about some number. ');
        convo.say('I don’t really know about this hush-hush number and what it means, but I can tell you the number ☺');
        convo.say('SWON Number for Travel is 1042816');
        other_details_callback_menu(convo)
    });
});

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.2 SWON DETAILS**************===================

// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.3 ORGANIZING TEAM===================
controller.hears(['organising_team','^organizer$','^organiser$','^team$','^volunteer$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('You know, they are LOVELY and most approachable tribe in the universe.');
        convo.say('I am planning to take them along with me when humans begin to colonize Planet Mars.');
        convo.say({
                      "attachment":{
                      "type":"image",
                      "payload":{
                        "url":"https://damascus-kindergarten.wikispaces.com/file/view/scholar.gif/535415128/179x179/scholar.gif"
                      }
                    }
                });
        convo.say('They will spurt out answers to any queries even when they are in their deep sleep. They are SO good.');
        convo.say('So, just don’t bother to disturb them anytime. They probably will not answer your calls immediately, but they will not bite and eat you.');
        other_details_callback_menu(convo)
    });
});
// ====================================== 1. Event Menu 1.3 OTHER DETAILS 1.3.3 ORGANIZING TEAM===================

// ====================================== 1. Event Menu 1.3 OTHER DETAILS**************==========================

//============================================END OF EVENT========================================================

// ====================================== Main Menu  2. Location==================================

controller.hears(['^Location Details$','^Location$'], 'message_received,facebook_postback', function(bot, message) {
    bot.reply(message,'Bhubaneshwar is one of the most historical places. I have been here a few decades back. ')
    bot.reply(message,'Does the sentence "Home, Home Sweet Home" ring a bell? ');
    bot.reply(message,'Yeah you are right. The movie ET.'); 
    bot.reply(message,'Yeah that was me. Steven Spielberg had earlier introduced me to the world as ET.  Had been to Bhubaneshwar in that Avatar. The place has changed a lot. Lots of great places to go around.');
    bot.reply(message,'Sorry, I keep talking a lot. Maybe I am fit to be a Manager in an IT firm ');
    bot.reply(message,'OK, Let me know what you would like to know more about');
     var attachment =  {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Location Details',
                            'image_url': 'https://bhubabot.blob.core.windows.net/images/outdoor_conference.jpg',
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
controller.hears(['^venue$'], 'message_received,facebook_postback', function(bot, message) {
     bot.startConversation(message, function(err, convo) {
                convo.say('The event will be held at the Mayfair hotels. It is about 20 minutes from the airport.'); 
                convo.say('Lovely Place that has held great events in the past.');
                convo.say('Just Check this : http://www.mayfairhotels.com/ for more details');
                convo.say('Let me take you to the Gallery');
                convo.ask({
                        attachment: {
                            'type': 'template',
                            'payload': {
                                'template_type': 'generic',
                                'elements': [
                                    {
                                        'title': 'Aerial View of Cottages with Lagoon',
                                        'image_url': 'https://bhubabot.blob.core.windows.net/images/hotel_1.png'
                                    },{
                                        "title": "Evening View of Lagoon",
                                        "image_url": "https://bhubabot.blob.core.windows.net/images/hotel_2.png"
                                    }, {
                                        "title": "Lobby Mayfair Lagoon",
                                        "image_url": "https://bhubabot.blob.core.windows.net/images/hotel_3.png"
                                    },
                                    {
                                        "title": "Evening View MAYFAIR Lagoon",
                                        "image_url": "https://bhubabot.blob.core.windows.net/images/hotel_4.png"
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
controller.hears(['^Accomodation$','^stay$','^rooms$','^room details$','^acomodation$','^accommodation$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
    convo.say('The Mayfair hotel is a 5 Star Delux hotel. It offers world class facilities. ');
        convo.say('And by the way, did you know, it has a well-equipped gymnasium and a lovely pool? ');
        convo.say('Oh yeah, forgot to mention, it is very vibrant at night :)  ');
        convo.say('It is so vibrant that I could spot this hotel from Planet Mars! ');
        convo.say('Would you believe it? Well you don’t, I know. ');
        convo.say('Was just kidding');
        convo.say('But trust me, it’s a great place');
    location_callback_menu(convo);
    convo.next();
    });
});
// ====================================== Main Menu  2. Location 2.2 ACCOMODATION************======================

// ====================================== Main Menu  2. Location 2.3 BHUBANESHWAR==================================
controller.hears(['^Bhubaneshwar$','^bhubaneswar$','^bubaneswar$'], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {
         convo.say('Bhubaneshwar has really lovely places to go around, out-of-the world food, and awesome weather. ')
         convo.say('What would you like to know about?')
        convo.ask({
            "attachment":{
                "type":"template",
                "payload":{
                    'template_type': 'generic',
                    'elements': [
                    {
                        'title': 'Location Details',
                        'image_url': 'https://bhubabot.blob.core.windows.net/images/bhubaneshwar_1.png',
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
var attraction = ['^local_attraction$',"^Location Attraction$","^sight seeing$","^tourist$","^place to visit$","^place to travel$","^refreshment$","^place to see$","^tourist spot$","^list of places$","^attractions$",'^tourist place$']

controller.hears(attraction, 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('I am still awestruck at the marvelous creations in this part of the Universe.')
        convo.say('I am running multiple advanced algorithms across multiple cloud vendors in trying to figure out “The Master Algorithm” used by the Creator. Hopefully the algorithm will help me understand time travel and destiny. ');
        convo.say('I am still not done. However I wisely recommend to Visit Lingaraja Temple and suggest me a cue.')
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
controller.hears(['^lingaraja$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Dont miss the Lingaraja Temple - Amazing architecture')
        convo.say('Its the most prominant mark of the city. Do take selfies and post it on Whatsapp.')
        convo.say('Else you will not be considered Human anymore ')
         convo.ask({
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Lingaraja temple',
                            'image_url': 'https://bhubabot.blob.core.windows.net/images/bhubaneshwar_1.png',
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
controller.hears(['^nandankanan$'], 'message_received,facebook_postback', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('You dont get to see amazing life forms as you see here. ')
        convo.say('It has a botanical garden and has been declared a sanctuary.')
        convo.say('The purpose of your life will be fullfilled only if you step into this Park. So please plan accordingly')
         convo.ask({
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                       {
                            'title': 'Nandankanan Zoological park',
                            'image_url': 'https://bhubabot.blob.core.windows.net/images/nandankanan_1.png',
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
controller.hears(['^udaygiri$'], 'message_received,facebook_postback', function (bot, message) {
   bot.startConversation(message, function (err, convo) {
       convo.say('I learnt natural caves were created without hand or shaping tools.')
       convo.say('Many Saintly embodiments takes shelter here to realize true nature with the undeterred self. ')
        convo.say('Even your earthly being Alibaba prospered by snooping into the cave with magical word where the treasures robbed by folly Thieves were stored.')      
         convo.say('You can also snoop out a secret code and in Udayagiri and Khandhagiri caves and share it to me..')      
         convo.say('Not to forget, this is a mind boggling place. It is an archeological gem. ')        
         convo.say('Its partly natural and partly artificial ')     
         convo.say('Hmmm, should I say "Hybrid" so that you Techie creatures understand better :) Well go see it to figure it yourself')        
          convo.ask({       
            'attachment': {     
                 'type': 'template',        
                 'payload': {       
                     'template_type': 'generic',        
                     'elements': [      
                         {      
                             'title': 'Udayagiri and Khandagiri caves',     
                             'image_url': 'https://bhubabot.blob.core.windows.net/images/udayagiri_1.png',      
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
        
 controller.hears(['^food$',"^trending foods$","^dishes$","^dish$","^food$"], 'message_received,facebook_postback', function (bot, message) {       
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
         convo.say('Did you know how to calculate the Volume of a Sphere? Well it is (Pie * Radius /3). ')      
         convo.say('Yeah, you will see a lot of white spheres in Bhubaneshwar dipped in sugary syrup. ')        
        convo.say('When you see \'em dont sit and calculate the volume. Also, you are welcome to invoke selective amnesia about your weight or what the Blood Sugar reading says. ')        
         convo.say('Just Pick-it and Gobble it.Thats it… ')     
         convo.say('These white spheres soaked with ambrosia take you directly to a place called Heaven. It is unbelievable. ')     
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
 controller.hears(['^Weather$','^climate$',"^temperature$","^weather condition$"], 'message_received,facebook_postback', function (bot, message) {      
     bot.startConversation(message, function (err, convo) {     
         request('http://apidev.accuweather.com/currentconditions/v1/1-189781_1_AL.json?language=en&apikey=hoArfRosT1215', function (error, response, body) {       
         if (!error && response.statusCode == 200) {        
             var  forecast = JSON.stringify(JSON.parse(body)[0].WeatherText).replace( /"/g, "" );       
             var  temp     = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Value);      
             var degree    = JSON.stringify(JSON.parse(body)[0].Temperature.Metric.Unit).replace( /"/g, "" );       
             convo.say('Do you know the temperature in Mars? ');        
             convo.say('It is not too bad for human occupation, though a bit unpredictable weather sometimes. Don’t be scared, you are welcome to colonize .');        
            convo.say('We will sure enjoy your company. Btw, the weather in Bhubaneshwar is next to perfect.');         
             convo.say('My Machine Learning Forecasting algorithm says that the temperature is going to hover around  27C - Sunny for all three days.');        
             convo.say('Night seems to be cooler at <20*>, and with cool breeze smearing aside, sets out to be perfect weather for a cozy walk.');      
             convo.say('So yeah, its not even next to perfect. Its perfect weather condition')      
         }      
         });        
         bhubaneshwar_callback_menu(convo);     
         convo.next();      
      });       
 });        
 // ============================ Main Menu  2. Location 2.1 BHUBANESHWAR 2.1.1.WEATHER****=================     
        
 // ============================ Main Menu  2. Location 2.1 BHUBANESHWAR *************==========        
    
 //============================================END OF LOCATION================================================      
        
 // ====================================== Main Menu 3. Travel================================      
        
 controller.hears(['^Travel$','^journey$','^travel guide$','^journey guide$'], 'message_received,facebook_postback', function(bot, message) {       
     bot.reply(message,'Just imagine that I was able to Land in Bhubaneshwar from Planet-Mars.');       
     bot.reply(message,'It only goes on to say that the city is so well connected.');       
     bot.reply(message,'Bhubaneshwar attracts more than a million tourists in a year from all over the universe and Flights and Flying Saucers reach this city at all times.');     
     bot.reply(message,'OK OK. Someone please stop me from chatting.....');     
     bot.reply(message,'What would you like to know');      
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
 controller.hears(['tips','^tour tip$','^guide$','^trip guide$'], 'message_received,facebook_postback', function (bot, message) {       
     bot.startConversation(message, function (err, convo) {     
     convo.say('Well, here is my piece of wisdom for all those who are travelling from outside of India - Do carry an international or intergalactic power adaptor - Also, check out on the electronic ban on many major airlines.');       
     convo.say('Do remember to carry your identifications cards.  ');      
     travel_callback_menu(convo);       
     });        
 });        
        
 // ====================================== Main Menu 3. Travel 3.1 Flight Tips********========================      
        
        
 // ====================================== Main Menu 3. Travel 3.2 Flight Timings================================       
 controller.hears(['^flight_timings$',"^flight$","^flight time$","^plane timings$","^flight schedule$"], 'message_received,facebook_postback', function (bot, message) {        
     bot.startConversation(message, function (err, convo) {     
    convo.say('You must have realized by now that I am such a nice person. ')       
         convo.say('Yes, to make things easier for you, I have grabbed all the timing information on all the flights arriving and leaving Bhubaneshwar. ')      
         convo.say('I am sure you are feeling so good about me right now and are wondering how you could reciprocate my hospitality.')      
         convo.say('Dont worry, I accept bitcoins. Feel free to shower me with as many bitcoins as you can, btw did you know, Bitcoin is going to be currency that will be used when humans colonize Planet Mars')      
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
        
 controller.hears(['^flight_status$',"^flight status$","^flight stats$"], 'message_received,facebook_postback', function (bot, message) {
     bot.startConversation(message, function (err, convo) {     
            convo.say('I am working on it - will let you know once it is done');
//          convo.say('You want to know the real-time status of your flights - Dont worry - My Machine Learning, API fied, AI based, Microserviced, Hybrid cloud facilited, Augmented Reality Mobile app will give you the status :)) ');      
//          convo.say('So you think I am fit to defend techie proposals? ')        
//          convo.say('Yes, I can read your mind using my Vision Analysis Algorithms and I know you agree with me ')       
//          convo.ask({        
//              "attachment":{     
//              "type":"template",     
//              "payload":{        
//                  "buttons":[        
//                      {      
//                      "type":"web_url",      
//                      "url":"http://www.flightstats.com/go/FlightStatus/flightStatusByAirport.do?airportCode=BBI&airportQueryType=1",        
//                      "title":"Click the link below to know the flight status",      
//                      "webview_height_ratio": "compact"      
//                      }      
//                  ]      
//                  }      
//              }      
//            });      
     travel_callback_menu(convo);       
     });        
 });        
        
 // ====================================== Main Menu 3. Travel 3.3 Flight Status******========================      
        
 // ====================================== Main Menu  3. Travel===============================================      
        
 //============================================END OF Travel===================================================     
        
        
 // COMMON MATCHES      
 // ATUNE MATCH     
 controller.hears(['^atune$','^atune 2017$','^atune-2017$'], 'message_received,facebook_postback', function (bot, message) {        
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
        
 // general

controller.hears(['^who are you$',"^tell me about yourself$","^what do you know$","^why are you created$","^what are you doing$"],'message_received,facebook_postback', function(bot, message) {        
     bot.startConversation(message, function(err, convo) {
     convo.say('I am BhubaBot.');       
     convo.say('I am here');
     convo.say('You know why?');
     convo.say('To give you Geeks some valuable info ☺ and also, to savor the lovely Bhubaneshwar delicacies- Especially the Rosgollas.');
//         convo.say({
//               "attachment":{
//               "type":"image",
//               "payload":{
//                 "url":"http://www.funnyjunk.com/funny_gifs/1492423/Charmander#bff569_1491979"
//               }
//             }
//         });
     });
 });        
        
controller.hears(["^who created you$","^who is your father$"],'message_received,facebook_postback', function(bot, message) {        
    bot.startConversation(message, function(err, convo) {
     convo.say('I have been created by');       
     convo.say('Pandu Balraj');
     convo.say('Neetu Mishra');
    });
 });        

controller.hears(["^what do you know about me$","^do you know me$"],'message_received,facebook_postback', function(bot, message) {      
    bot.reply(message, "Right now I am learning about you!!!");
});

controller.hears(["^what else$","^what else do you know$"],'message_received,facebook_postback', function(bot, message) {       
    bot.reply(message, "I hope you might be looking among these");
    bot.startConversation(message, function(err, convo) {
             main_menu(convo);
         });
});
 // ===============================TRIAL=================================================       
        
        
 // Default error message       
 controller.on('message_received,facebook_postback', function(bot, message) {       
     bot.reply(message, 'I am not sure what you are looking for. May be you can choose one of these');
         bot.startConversation(message, function(err, convo) {
             main_menu(convo);
         });
     return false;      
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
