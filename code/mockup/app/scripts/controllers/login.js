'use strict';

/**
 * @ngdoc function
 * @name initProjApp.controller:loginCtrl
 * @description
 * # login
 * Controller of the initProjApp
 */
angular.module('initProjApp')
  .controller('loginCtrl', function pasuser(form) 
  {
	if (form.id.value=="administrator") 
	{ 
		if (form.pass.value=="administrator") 
		{              
			location="main.html" 
		} 
		else 
		{
		alert("Invalid Password")
		}
	} 
	else 
	{  
	alert("Invalid UserID")
	}
}
//-->
</script>

<center>
<table bgcolor="white" cellpadding="12" border="1">
<tr><td colspan="2"><center><h1><i><b>Login
Area</b></i></h1></center></td></tr>
<tr><td><h1><i><b>UserID:</b></i></h1></td><td><form name="login"><input
name="id" type="text"></td></tr>
<tr><td><h1><i><b>Password:</b></i></h1></td><td><input name="pass"
type="password"></td></tr>
<tr><td><center><input type="button" value="Login"
onClick="pasuser(this.form)"></center></td><td><center><br><input
type="Reset"></form></td></tr></table></center> 
