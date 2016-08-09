//this variable checkes for the login context.
var login_context = 0;

function get_login_context() 
{
	return login_context;
}


function set_login_context(flag) {
	login_context = flag;
}

function set_global_diner_id(diner_id)
{
	global_diner_id = diner_id;
	return true;
}

function get_global_diner_id()
{
	return global_diner_id ;
}


function set_current_city_id(curr_city_id)
{
	//sets the city id for use by search and other utils on the frontend

	current_city_id = curr_city_id;
}

function set_current_city_name(curr_city_name)
{
	//sets the city name for use by search and other utils on the frontend

	current_city_name = curr_city_name;
}

function get_current_city_id()
{
	//returns the city id for use by search and other utils on the frontend

	return current_city_id;
}

function get_current_city_name()
{
	//returns the city name for use by search and other utils on the frontend

	return current_city_name;
}
