var client = require('twilio')(  //Calling Twillion API to use their messaging service
  '',//please don't steal my account...I have to pay for it...
  ''
);
var express = require('express');  



const translate = require('google-translate-api');

/* 
Express is an addon that allows Node.js to run web application on the server.
Web Applications cab be run through the pm2 commands.
There should be a list of pm2 commands in  your home directory.
*/
var AssistantV1 = require('watson-developer-cloud/assistant/v1');
/* 
Watson conversation links Watson API to our program. 
This segment is required to connect the program to the IBM's API.
*/
var app = express();
/*
Creating new exress application process.
*/
var contexts = [];  //variable array that holds our data in.
app.get('/inc_message', function (req, res) 

{
  var message = req.query.Body;    
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var intent_checker = false;
  var context = null;  //variable for the context
  var index = 0;  //Variable to track users
  var contextIndex = 0;
  var a;
  var language_holder='';

  function getTranslation_Back(new_text,language_select)
  {
      var language_select_x = (language_select)
    translate(new_text, {to: language_select_x}).then(res => {
      console.log(res.text);
      console.log(res.from.language.iso);
      a =res.text;
      send_message(a);
  }).catch(err => {
      console.error(err);
  });
  }

  function getTranslation(inc_text)
  {
    translate(inc_text, {to: 'en'}).then(res => {
      console.log(res.text);
      console.log(res.from.language.iso);
  }).catch(err => {
      console.error(err);
  });
  }



  

function get_Language(inc_text,callback)
{
    translate(inc_text, {to: 'en'}).then(res => {
        var test_string = JSON.stringify(res.from.language.iso);
        console.log('This is the In-Func Output',test_string)
       return callback(test_string)
        //console.log(n)
       
    }).catch(err => {
        console.error(err);
    });
    
}





  function send_message(argument)
  {
    client.messages.create({ //sending a response back to the user
      from: twilioNumber, //out twillio number
      to: number,//to user
      body: argument
      })
  }
  contexts.forEach(function(value) {  //similar to PHP, for each function does the function for every new request
    //console.log(value.from);
    if (value.from == number) 
    {  //if the user has texted before in this session
      context = value.context;
      contextIndex = index;
    }
    index = index + 1; //making sure that every user gets a unique session
  });//end of the user checking loop
  console.log('Recieved message from ' + number + ' saying \'' + message  + '\''); 
  
  






get_Language(message,function(response){
    // Here you have access to your variable
    console.log(response);
    var hope = (response);
    console.log('Hope var inside: ',hope);
});

//console.log(test1);






  
  
  
  var assistant = new AssistantV1({   //API Call to Watson conversation
    url: '',
    username: "",
    password: "",
    version: ''
//this is important, because it won't work if it's outdated (I tried...)
  });//end of Watson Conversation API Code
  if (context != null)
  {
    console.log(JSON.stringify(context)); //used for debugging
  }

 












 //console.log('User Language Detected: ')



  
 assistant.message(
    {  //Conversation is a new variable created  by us and a function assigned by Watson Conversation
    input: 
    { 
        text: message 
    }, //text is a type, message is a variable previously binded to the inout of a user
    workspace_id: '', //our project ID aka Foodpall (will most likely change really soon)
    context: context //context is gonna allow us to see who sent it
   }, function(err, response) 
   { //if there is an issue, print error
       if (err) 
       {
         console.error(err);
       } 
       else 
       { //if there is no issue - output what was sent
        getTranslation_Back(response.output.text[0],'en')
        //send_message(response.output.text[0]);
         console.log("Server Response: ",response.output.text[0]);
         if (context == null) 
         {//if user is new - output the message and number
           contexts.push({'from': number, 'context': response.context});
         } else 
         {
           contexts[contextIndex].context = response.context;
         }
       }
  });
  res.send('');
});
app.listen('port#', function () { //waiting for the call on that port
  console.log(''); // when it boots up, this message will appear to indicate that the program is running
});