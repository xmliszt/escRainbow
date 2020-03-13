
const express = require('express');
const path = require('path');
const routes = require('./routes/index');

const stafflogin = express();

stafflogin.set('views', path.join(__dirname, 'views'));
stafflogin.set('view engine', 'pug');

stafflogin.use('/stafflogin', routes);

module.exports = stafflogin;


function field_focus(field, email)
  {
    if(field.value == email)
    {
      field.value = '';
    }
  }

  function field_blur(field, email)
  {
    if(field.value == '')
    {
      field.value = email;
    }
  }

//Fade in dashboard box
$(document).ready(function(){
    $('.box').hide().fadeIn(1000);
    });

//Stop click event
$('a').click(function(event){
    event.preventDefault(); 
	});