//defines general utils methods to be used by the www pages
function wrap_general_diner_auth()
{
	//picks up the user credentials from the login popup hosted by the www header
	//packs them in an array and sends them to the diner_auth method, thereby initiating the auth process

	//fetching the credentials
	diner_signin_email = $('#diner_signin_email').val();
	diner_signin_password = $('#diner_signin_password').val();

	//creating the parameter array
	arr_auth_params = new Array();
	arr_auth_params['auth_diner_email_id'] = diner_signin_email;
	arr_auth_params['auth_diner_password'] = diner_signin_password;

	//initating the auth!!
	diner_auth(arr_auth_params);

	//preventing the form's submit action!
	return false;
}


function diner_auth(arr_params)
{
	//takes as an input an array containing the email id and password of the diner, plus the call back function
	//if the callback function is not provided, uses the default callback
	//invokes an ajax comm to log the diner in
	//gets the response and relays it to the callback function

	//defaults and initialization...
	auth_diner_email_id = '';
	auth_diner_password = '';
	window.auth_diner_callback_fn = default_diner_auth_callback_final;

	//extracting the input params
	if(arr_params['auth_diner_email_id'] != undefined)
	{
		auth_diner_email_id = arr_params['auth_diner_email_id'];
	}

	if(arr_params['auth_diner_password'] != undefined)
	{
		auth_diner_password = arr_params['auth_diner_password'];
	}

	if(arr_params['auth_diner_callback_fn'] != undefined)
	{
		window.auth_diner_callback_fn = arr_params['auth_diner_callback_fn'];
	}

	//invoking the ajax...
	
	var data_param = {}; //contains the values which will be going to send in ajax call
	data_param['email'] = auth_diner_email_id;
	data_param['password'] = auth_diner_password;
	
	
	var param = new Array();
	param['url'] = www_api_url + 'login/';
	param['success_function'] = diner_auth_callback;
	param['data'] = data_param;
	param['method'] = method_post;
	
	call_ajax(param);
	return true;

}

function diner_auth_callback(res_diner_auth)
{
	//callback function to the login ajax

	//this function gets invoked only if the auth succeeds... so let's just refresh the page!	
	if(get_login_ajax())
	{
		var func = get_login_callback();
		func(res_diner_auth);
	}	
	else
	{
		location.reload(true);
	}
	
}

function set_login_ajax(bool)
{
	window.login_ajax = bool;
	return true;
}


function get_login_ajax()
{
	return window.login_ajax;
}


function set_login_callback(func)
{
	window.login_callback_function = func;
	return true;
}


function get_login_callback()
{
	return window.login_callback_function;
}


function default_diner_auth_callback_final(arr_res)
{
	//blank function...as of now!

}

function show_login_popup()
{
	//shows open the login popup

	$('#div_login_popup').show();

}

function hide_login_popup()
{
	//hides the login popup

	$('#div_login_popup').hide();
}

function toggle_city_dropdown_list()
{
	//toggles the display of the city selection list

	if(window.is_city_selection_list_open == undefined || window.is_city_selection_list_open == false)
	{
		//the city list is hidden...show it!
		show_city_dropdown_list();
	}
	else
	{
		//the city list is visible...hide it!
		hide_city_dropdown_list();
	}

}

function show_city_dropdown_list()
{
	//shows open the city dropdown
	$('#city_selection_dropdown_list').show();
	window.is_city_selection_list_open = true;
}

function hide_city_dropdown_list()
{
	//hides open the city dropdown
	$('#city_selection_dropdown_list').hide();
	window.is_city_selection_list_open = false;
}

function redirect_custom(r_url)
{
	//redirects to the given url
	location.href = r_url;	
}

function show_auth_dropdown()
{
	//shows the auth dropdown (containing the my accounts and logout options) in the header
	$('#div_sign_list').show();	
}

function hide_auth_dropdown()
{
	//hides the auth dropdown (containing the my accounts and logout options) in the header
	$('#div_sign_list').hide();	
}

function header_submit_login()
{
	//triggers the submit login action
	
	//initiate the auth...
	wrap_general_diner_auth();
	return false;
	

}

function show_search_background_bg()
{
	//shows the black background to cover the entire page except search
	$('#div_search_black_bg').show();

}

function hide_search_background_bg()
{
	//hides the black background that covers the entire page except search
	$('#div_search_black_bg').hide();

	//let's hide the search div as well
	$('#search_div').empty();
	$('#search_div').hide();
}
