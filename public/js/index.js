$( document ).ready(function() {
   $('#login').css('display','none');
   $('#register').css('display','none');
});

$( '#toggle-login' ).mouseover(function()  {

  //$('#login').toggle();
   $('#login').css('display','block');
    $('#register').css('display','none');
});


$( '#toggle-register' ).mouseover(function(){
   $('#login').css('display','none');
   $('#register').css('display','block');
});

/**

( '#register' ).mouseover(function(){
   $('#login').css('display','none');
   $('#register').css('display','block');
});


( '#login' ).mouseover(function(){
   $('#login').css('display','none');
   $('#register').css('display','block');
});





$(  '#toggle-register' ).mouseout(function()
{
$('#register').delay(400).fadeOut();
});

$(  '#toggle-login' ).mouseout(function()
{
$('#login').delay(400).fadeOut();
});
**/
/**
$("body").click
(
  function(e)
  {
    if((e.target.className !== "login") || (e.target.className !== "register") )
    {
	$('#toggle-login').css('display','none');
    $('#toogle-register').css('display','none');
    }
  }
);

**/
var count = 0;
		
		// Validating Name
		$('#name').focusout('input', function () {

		name();
		});
		
		function name() {
		var nameValue = $('#name');
		var isName = nameValue.val();
		if(isName !== "")
		{
		count += 1;
		return;
		}
		else{
		$('#name').css("border", "1px solid red");
		return;
		}
		}
		
		
		// Validating Address
		$('#address11').focusout('input', function() {
		address();
		});
		
		function address() {
		var nameValue = $('#address11');
		var is_address= nameValue.val();
		if(is_address !== "")
		{
		count += 1;
		return;
		}
		else{
		$('#address11').css("border", "1px solid red");
		return;
		}}
		
		
		//Validating Email
		$('#email1').focusout('input', function ()  {
		email();
		});
		
		function email() {
		var nameValue = $('#email1');
		var re = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		var is_email=re.test(nameValue.val());
		if(is_email)
		{
		count += 1;
		return true;
		}
		else
		{
		$('#email1').css("border", "1px solid red");
		return true;
		}}

		$('#password1').focusout('input', function() {
		password();
		});

		
		function password() {
		var nameValue = $('#password1');
		var is_address= nameValue.val();
		if(is_address !== "")
		{
		count += 1;
		return;
		}
		else{
		$('#password1').css("border", "1px solid red");
		return;
		}}

		$('#form-email').focusout('input', function ()  {
		formemail();
		});

		function formemail() {
		var nameValue = $('#form-email');
		var re = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		var is_email=re.test(nameValue.val());
		if(is_email)
		{
		count += 1;
		return true;
		}
		else
		{
		$('#form-email').css("border", "1px solid red");
		return true;
		}}

		$('#form-email').focusout('input', function() {
		formpassword();
		});
		
		function formpassword() {
		var nameValue = $('#form-password');
		var is_address= nameValue.val();
		if(is_address !== "")
		{
		count += 1;
		return;
		}
		else{
		$('#form-password').css("border", "1px solid red");
		return;
		}}