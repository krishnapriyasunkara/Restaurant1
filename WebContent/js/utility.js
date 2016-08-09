//This file stores all the common/utility function

//this function invokes an ajax request and returns the xhr instance
function sendGamoogaEvent( event, data) { 
    if(typeof _taq !== 'undefined') {
        _taq.events.push([event, data]);
    }
}

function call_ajax_and_return_xhr(call_param) {
	var sUrl = call_param['url'];
	var success_call_back = call_param['success_function'];
	var dt = call_param['data'];
	var arr_legacy = call_param['arr_legacy'];


	//if the show loading is undefined that means the loading div is to be showed less not
	if(arr_legacy != undefined)
	{


		if(arr_legacy.show_loading == undefined )
		{
			show_loading_div  = true;

		}
		else
		{
			show_loading_div = arr_legacy.show_loading
		}
	}
	else
	{
		show_loading_div  = true;
	}
	var method1 = (call_param['method'] != undefined) ? call_param['method'] : 'Post';
	return jQuery.ajax({
		dataType : 'json',
		method : method1,
		url : sUrl,
		data : dt,

		beforeSend : function() {
			//we will show loading div before initiating ajax call
			if(show_loading_div)
			{
				show_loading();
			}
		},
		success : function(resp) {

			if (resp.status == true) 
			{
				success_call_back(resp.output_params,arr_legacy);
			} 
			else
			{
				alert(resp.error_msg);

			}
			hide_loading();
		}

	});
}

/**
 * This function used for making ajax call 
 * 
 * @param call_param
 */
function call_ajax(call_param) 
{
	var sUrl = call_param['url'];
	var success_call_back = call_param['success_function'];
	var dt = call_param['data'];
	var arr_legacy = call_param['arr_legacy'];


	//if the show loading is undefined that means the loading div is to be showed less not
	if (arr_legacy != undefined)
	{


		if (arr_legacy.show_loading == undefined)
		{
			show_loading_div = true;

		}
		else
		{
			show_loading_div = arr_legacy.show_loading
		}
	}
	else
	{
		show_loading_div = true;
	}
        
	var method1 = (call_param['method'] != undefined) ? call_param['method'] : 'Post';
	jQuery.ajax({
		dataType: 'json',
		method: method1,
		url: sUrl,
		data: dt,
		beforeSend: function () {
			//we will show loading div before initiating ajax call
			if (show_loading_div)
			{
				show_loading();
			}
		},
		success: function (resp) {

			if (resp.status == true)
			{ 
				success_call_back(resp.output_params, arr_legacy);
			}
			else
			{
				alert(resp.error_msg);

			}
			hide_loading();
		}
	});
}


function show_loading() 
{
	console.log("Show loading called...");

	$('#loading_div').show();

	//blanket hide for the 'fetching your location' div on mobile listing
	$('#fetching_div').hide();
}
function hide_loading() 
{
	console.log("Hide loading called...");

	$('#loading_div').hide();

	//blanket hide for the 'fetching your location' div on mobile listing
	$('#fetching_div').hide();
}



/**
 * this function checks weather 'small' is substr of 'big'.. and returns
 * true/false
 */

function is_substr(small, big) 
{
	small = small.toLowerCase();
	big = big.toLowerCase();
	if (big.indexOf(small) == -1) 
	{
		return false;
	}
	else 
	{
		return true;
	}

}

/**
 * This function oepns up the popup url
 * 
 * @input: url
 * @param url
 */

function open_popup(url)
{
	window.open( url ,"text","location=1,status=1,scrollbars=1, width=1000,height=600,top=100,left=400");

}


function open_popup_full_size(url)
{
	window.open( url ,"text",'height='+screen.height+', width='+screen.width);
}


/**
 * This function will generate an outgoing call
 * @param data
 */
function outgoing_call(data)
{   
  
	var sUrl= base_url+'admin/telephony/outgoing_api';

	var flag=confirm("Call to "+data['to_no']);

	if (flag == true)
	{
		//append the from no,call provider,admin id to the data array
		data['from_no'] = agent_phone_no;
		data['call_provider'] = 'drishti';
		data['admin_id'] = admin_id;


		//fill the call param array with the neccesary values
		call_param = {};
		call_param['url'] = sUrl;
		call_param['data'] = data;
		call_param['method'] = method_get;
		call_param['success_function'] = outgoing_call_success;
		//call the ajax function
		call_ajax(call_param);		
	}
	else
	{
		alert('call cancelled');
	}
}



function outgoing_call_success(output)
{
	console.log(output.ci_id);
}


/**
 * This function loads the datepicker on the specified element_id
 * @param element_id
 */
function load_datepicker(element_id)
{
	//console.log('datepicker loaded');

	$( "#" + element_id ).datepicker({ dateFormat: 'yy-mm-dd' });


}

//Toggle all the check boxes
function check_all()
{

	if($('#select_all').is(':checked')) 
	{
		// Iterate each checkbox
		$(':checkbox').each(function() {
			this.checked = true;
		});
	}
	else {
		$(':checkbox').each(function() {
			this.checked = false;
		});
	}

}


//Prompt if the user is sure and want to continue
function prompt_user(confirm_str)
{

	if(confirm_str == undefined || confirm_str == "")
	{
		confirm_str = "Are you sure you want to continue??";
	}

	if (confirm(confirm_str) == true) 
	{
		return true;
	} 
	else 
	{
		return false;
	}

}




/**
 * This function closes the current window..
 */
function close_window()
{
	window.close();
}


/**
 * This function scrolls the div to the particular div by id
 * @param aid
 */
function scroll_to_id(aid)
{
	var target = $("#"+aid);
	$('html,body').animate({scrollTop: target.offset().top},'slow');
	// target.parentNode.scrollTop = target.offsetTop;  
}

function scroll_to_id_ele(aid, fixele)
{
	//alert(aid);
	var target = $("#"+aid);
        var sub = $('#'+fixele);
	$('html,body').animate({scrollTop: (target.offset().top - 2*sub.outerHeight() )},'slow');
	// target.parentNode.scrollTop = target.offsetTop;  
}

/**
 * This function scrolls the div to the particular div by class
 * @param acl
 */

function scroll_to_class(acl)
{aler('class');
	var target = $("."+acl);
	$('html,body').animate({scrollTop: target.offset().top},'slow');
	// target.parentNode.scrollTop = target.offsetTop;  
}

/**
 * THis funciton query to the search controller and pass the result to the search display div
 * @param needle
 * view_type is either www or mobile
 */
function gen_search(needle,view_type)
{

	//abort the existing search ajax request, if any
	if(window.search_xhr != undefined)
	{
		window.search_xhr.abort();
	}

	//check that the needle is not undefined
	if(needle == undefined)
	{
		//default value...
		needle = '';
	}

	if(needle != '')
	{
		//check if needle length is greater than 2
		if(needle.length > 2)
		{
			var data_param = {}; //contains the value which will be going to send in ajax call

			data_param['needle'] = needle;
			data_param['view_type'] = view_type;


			var arr_legacy = {};
			arr_legacy['data'] = view_type; 
			arr_legacy['show_loading'] = false;


			var param = new Array();
			param['url'] = www_api_url+'gen_search';
			param['success_function'] = display_search_div;
			param['data'] = data_param;
			param['method'] = method_get;
			param['arr_legacy'] = arr_legacy;

			//invoking the ajax and storing its handel in a window variable (to abort it for a fresh request)
			window.search_xhr = call_ajax_and_return_xhr(param);
		}

	}
	else
	{
		$('#search_div').empty();
		$('#search_div').hide();
	}
}

/**
 * This function will display the search div
 * @param resp
 */
function display_search_div(resp,legacy)
{
	//get the view type
	view_type = legacy.view_type;

	//check the view type if it is mobile then select the mobile controller and if it is web then select the web controller
	if(view_type == 'mobile')
	{
		var controller = mobile_controller; 
	}
	else
	{
		var controller = www_controller;
	}

	var result = resp.data;

	$('#search_div').empty();


	//let's traverse through the result array, render each result node (as an <li>) under the corresponding key (which is the leading <li> for the current obj_type group)
	str_list = '';
	for (obj_type in result) 
	{
		//found the obj_type... let's add it to the list first
		str_list += '<ul><li class="search_li_head">'+ obj_type + '</li>';

		//now lets traverse through the chindren nodes of this obj type
		arr_group = result[obj_type];
		for(cnt=0; cnt<arr_group.length; cnt++)
		{
			//let's add the current obj instance as an li..
			//obj_id = arr_group['obj_id'];
			obj_title = arr_group[cnt]['obj_title'];
			//append the main controller here www or mobile
			obj_url = arr_group[cnt]['url'];

			str_list += '<li onclick="window.location.href=\''+obj_url+'\';">'+obj_title+'</li>';

		}

		//bingo...we're done adding all the obj instances to the list..let's close this obj type group
		str_list += '</ul>';
	} 

	//if the list is empty..let's show 'No matches found
	if(str_list == '')
	{
		str_list = get_suggested_search_popup_div_www();
	}	

	$('#search_div').html(str_list);

	$('#search_div').show();

}



/**
 * THis function will get the suggested search div the popup
 */
function get_suggested_search_popup_div_www()
{


	//get the suggested suggested search list from the window variable
	arr_suggested = window.suggested;


	var str = '<ul><li class="search_li_head">Suggested Search</li>';

	//loop through the list to make the string
	for(i=0;i<arr_suggested.length;i++)
	{
		str  +=  '<li onclick="window.location.href=\''+arr_suggested[i]['url']+'\';">'+arr_suggested[i]['string']+'</li>';
	}

	str += '</ul>';


	return str;

}


/**
 * This function will display the suggested search div
 */
function display_suggested_search_popup_div_www()
{

	var str = get_suggested_search_popup_div_www();

	$('#search_div').html(str);

	$('#search_div').show();

}


function validate_mobile_no(phone)
{
	//validates a 10 digit mobile no.

	phone = phone.replace(/[^0-9]/g, '');
	if(phone.length != 10)
	{ 
		return false;
	}
	else
	{
		return true;
	} 

}

/**
 * This function will start the lazy load process
 */
function start_lazy_load()
{
	$("div.lazy").lazyload({ 
		effect: "fadeIn" 
	}).removeClass("lazy");
	//this part is for lazy after a ajax call is made
	$(document).ajaxStop(function(){
		$("div.lazy").lazyload({ 
			effect: "fadeIn" 
		}).removeClass("lazy");
	});
}

function fb_share_booking(rest_url, rest_name, offer_str)
{
	//accepts as an input the restaurant name, restaurant_url and offer_str (optional)
	//shares the booking message on fb

	//building the fb request url...

	url_fb_share = "http://www.facebook.com/dialog/feed?app_id="+fb_app_id;   //fb_app_id is global fb app id

	url_fb_share += "&link=" + encodeURIComponent(rest_url);

	url_fb_share += "&name=Dineout";

	url_fb_share += "&caption=Amazing restaurant deals";

	//building the share string, including the offer string (if applicable)

	str_desc = "I booked a table at " + rest_name;

	if(offer_str != '' && offer_str != undefined && offer_str != 'No offer')
	{
		str_desc += " and got " + offer_str;
	}

	str_desc += "!"; 

	url_fb_share += "&description=" + str_desc;

	url_fb_share += "&message=" + str_desc;

	url_fb_share += "&redirect_uri=" + encodeURIComponent(window.location.href);

	//so, we have the url to redirect to...
	//let's redirect the user...

	window.location = url_fb_share;



}

function get_child_city(cityid,selec){
    
	var data_param = {}; //contains the value which will be going to send in ajax call
	data_param['city_id'] = cityid;
        if(typeof selec === undefined)
        {
            data_param['selec'] = '';
        } 
        else 
        {
            data_param['selec'] = selec;
        }

	var param = new Array();
	param['url'] = admin_api_controller+'get_child_city';
	param['success_function'] = success_get_child_city_admin;
	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}
function get_promo_list_admin(promo_id)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	data_param['promo_id'] = promo_id;


	var param = new Array();
	param['url'] = admin_api_controller+'get_promo_list';
	param['success_function'] = success_get_promo_list_admin;
	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}
function get_area_list_admin(city_id)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	data_param['city_id'] = city_id;


	var param = new Array();
	param['url'] = admin_api_controller+'get_area_list';
	param['success_function'] = success_get_area_list_admin;
	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}


function getAreaList(city_id,selec)
{
	var data_param = {}; //contains the value which will be going to send in ajax call
	data_param['city_id'] = city_id;
	data_param['selec'] = selec;

	var param = new Array();
	param['url'] = admin_api_controller+'area_list';
	param['success_function'] = sucess_getAreaList;
	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}


function sucess_getAreaList(data)
{

	$('.area_select_div').html('');

	var str = '<option value="">Select Area</option>';
	var area_data = data.data;
	var selec       =   data.selec;
	$.each(area_data, function(index,val){
		if(val.a_id==selec){
			selectedOption  =   'selected="selected"';
		} else {
			selectedOption  =   '';
		}
		str += '<option value="'+val.a_id+'" '+selectedOption+'>'+val.name+'</option>';

	});

	$('.area_select_div').html(str);
}



/**
 * This function loads the area list on create area list 
 * @param rest_data
 */
function success_get_area_list_admin(data)
{

	$('.area_select_div').html('');

	var str = '<option value="">Select Area</option>';
	var area_data = data.data;

	$.each(area_data, function(index,val){

		str += '<option value="'+val.a_id+'">'+val.name+'</option>';

	});

	$('.area_select_div').html(str);
}

function success_get_child_city_admin(data){
	$('#getchildcity').html('');
        console.log(data);
        
        var str =   "Select Sub City (optional)"
	str += '<select name="sub_city_id" onchange="getCityStdCode(this.value)"  >\n\
		<option value="">Select City</option>';
	var area_data = data.data;
        var selc    =   area_data.selec;
        
	$.each(area_data, function(index,val){
                if(val.c_id >0){
                    
                if(val.c_id==selc)
                {
                    var selected    =   'selected="selected"';
                }
                else
                {
                    var selected    =   '';
                }
		str += '<option '+selected+' value="'+val.c_id+'">'+val.name+'</option>';
            }
	});
	str += '</select>';
	$('#getchildcity').html(str);
}

function get_locality_list_admin(area_id,city_id,selec)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	if(city_id != undefined)
	{
		data_param['city_id'] = city_id;
	}
	if(area_id != undefined)
	{
		data_param['area_id'] = area_id;
	}
	data_param['selec']     =   selec;

	var param = new Array();
	param['url'] = admin_api_controller+'get_locality_list';
	param['success_function'] = success_get_locality_list_admin;
	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}



/**
 * This function loads the locality list on create area list 
 * @param rest_data
 */
function success_get_locality_list_admin(data)
{

	$('.locality_select_div').html('');

	var str = '<option value="">Select Locality</option>';
	var locality_data = data.data;
	var selec       =   data.selec;
	var selected    =   '';
	$.each(locality_data, function(index,val){
		if(selec===val.l_id){
			selected='selected';
		}else{
			selected='';
		}
		str += '<option value="'+val.l_id+'" '+selected+'>'+val.name+'</option>';


	});

	$('.locality_select_div').html(str);
	$(".chosen-select").trigger("chosen:updated");
}



function get_restaurant_list_admin(city_id,area_id,locality_id,class_name)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	if(city_id != undefined)
	{
		data_param['city_id'] = city_id;
	}
	if(area_id != undefined)
	{
		data_param['area_id'] = area_id;
	}
	if(locality_id != undefined)
	{
		data_param['locality_id'] = locality_id;
	}


	var param = new Array();
	param['url'] = admin_api_controller+'get_restaurant_list';
	param['success_function'] = success_get_restaurant_list_admin;
	param['data'] = data_param;
	param['method'] = method_get;
	param['arr_legacy'] = class_name;
	call_ajax(param);


}



/**
 * This function gets the active_restaurant only
 * @param city_id
 * @param area_id
 * @param locality_id
 */
function get_active_restaurant_list_admin(city_id,area_id,locality_id,class_name)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	if(city_id != undefined)
	{
		data_param['city_id'] = city_id;
	}
	if(area_id != undefined)
	{
		data_param['area_id'] = area_id;
	}
	if(locality_id != undefined)
	{
		data_param['locality_id'] = locality_id;
	}

	data_param['status'] = 1;

	var param = new Array();
	param['url'] = admin_api_controller+'get_restaurant_list';
	param['success_function'] = success_get_restaurant_list_admin;
	param['data'] = data_param;
	param['method'] = method_get;
	param['arr_legacy'] = class_name;

	call_ajax(param);


}




/**
 * This function loads the restaurant list on create area list 
 * @param rest_data
 */
function success_get_restaurant_list_admin(data,arr_legacy)
{
	if(arr_legacy == '' || arr_legacy == undefined)
	{
		var class_name = 'restaurant_select_div';
	}
	else
	{
		var class_name = arr_legacy;
	}
	$('.'+class_name).html('');

	var str = '<option value="">Select restaurant</option>';
	var restaurant_data = data.data;

	$.each(restaurant_data, function(index,val){
		str += '<option value="'+val.r_id+'">'+val.profile_name+', '+val.locality_name+' ( Restaurant ID -'+val.r_id+' )'+'</option>';


	});

	$('.'+class_name).html(str);
}
function success_get_promo_list_admin(data,arr_legacy)
{
	if(arr_legacy == '' || arr_legacy == undefined)
	{
		var class_name = 'promo_select_div';
	}
	else
	{
		var class_name = arr_legacy;
	}
	$('.'+class_name).html('');

	var str = '<option value="">Select promocodes</option>';
	var promo_data = data.data;

	$.each(promo_data, function(index,val){

		str += '<option value="'+val.pc_id+'">'+val.code+'</option>';


	});

	$('.'+class_name).html(str);
}


function highlight_admin_menu_btn(btn_id)
{
	//highlights the btn id passed

	$('#'+btn_id).addClass('btn_active');
}





function get_offer_list_by_rest_id(rest_id)
{

	var data_param = {}; //contains the value which will be going to send in ajax call
	if(rest_id == undefined)
	{
		alert('Invalid restaurant id');
		return;
	}

	data_param['rest_id'] = rest_id;
	var param = new Array();
	param['url'] = admin_api_controller+'get_offers_by_restid';
	param['success_function'] = success_get_offers_by_restid;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);


}

/**
 * this function will insert comments in admin area
 * @param obj_type
 * @param obj_id
 */
function insert_admin_comment(obj_type,obj_id)
{
	var comment = prompt("Please enter your comment "+obj_type+"-"+obj_id,"");

	//console.log(comment);

	var data_param = {}; //contains the value which will be going to send in ajax call

	if(obj_id != undefined)
	{
		data_param['obj_id'] = obj_id;
	}
	if(obj_type != undefined)
	{
		data_param['obj_type'] = obj_type;
	}
	if (comment != null) {

		data_param['cm_text'] = comment;
	}
	else
	{
		return;
	}

	var param = new Array();
	param['url'] = admin_api_controller+'insert_admin_comment';
	param['success_function'] = success_insert_admin_comment;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);



}


function success_get_offers_by_restid(data)
{
	//console.log(data);
	$('.offer_select_div').html('');

	var str = '<option value="">Select Offer</option>';
	var offer_data = data.data;

	$.each(offer_data, function(index,value){

		$.each(value, function(ind,val){

			str += '<option value="'+val.offer_id+'">'+val.title+'</option>';

		});
	});

	$('.offer_select_div').html(str);

}


function success_insert_admin_comment()
{
	alert('Updated');
}



/**
 * this function will insert comments in r_admin area
 * @param obj_type
 * @param obj_id
 */
function insert_r_admin_comment(obj_type,obj_id)
{
	var comment = prompt("Please enter your comment "+obj_type+"-"+obj_id,"");

	//console.log(comment);

	var data_param = {}; //contains the value which will be going to send in ajax call

	if(obj_id != undefined)
	{
		data_param['obj_id'] = obj_id;
	}
	if(obj_type != undefined)
	{
		data_param['obj_type'] = obj_type;
	}
	if (comment != null) {

		data_param['cm_text'] = comment;
	}
	else
	{
		return;
	}

	var param = new Array();
	param['url'] = r_admin_api_controller+'insert_r_admin_comment';
	param['success_function'] = success_insert_r_admin_comment;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);



}

function success_insert_r_admin_comment()
{
	alert('Updated');
}









function get_default_email(phone_no)
{

	//accepts as an input the phone no.
	//prefixes it with the global default email prefix and returns the mail id hence derived
	//eg.: get_default_email('9988998899') >> 'default_email_9988998899@gmail.com'

//	DEFAULT_EMAIL_PREFIX
	default_email = shokuji_default_email_prefix + phone_no + '@dineout.co.in';
	return default_email;


}

function set_default_email(id_phone_no, id_email)
{
	//reads the phone no. from the given input id_phone_no
	//derives the default email basis the same
	//writes the default email value into the input id_email

	val_phone_no = $('#'+id_phone_no).val();

	if(val_phone_no != "")
	{

		val_default_email = get_default_email(val_phone_no);
		$('#'+id_email).val(val_default_email);
	}
	else
	{
		alert('Please enter the phone no.');
	}


	return false;
}



/*
 * Function Get Hotel List from Locality ID
 */
function getHotelList(localityid,selec){
	data_param      =       {};
	data_param['locality']  =   localityid;
	data_param['selec']     =   selec;
	var param = new Array();
	param['url'] = admin_api_controller+'getHotelFromLocality';
	param['success_function'] = sucess_getHotelList;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);
}

function sucess_getHotelList(data){

	var str = '';
	var hotel_data = data.data;
	var selec       =   data.selec;
	var     h       =   0;
	$.each(hotel_data, function(index,val){
		if(h==0){
			str = '<option value="">Select Hotel</option>';
			h=1;
		}
		if(val.id===selec){
			selectedOption  =   'selected="selected"';
		} else {
			selectedOption  =   '';
		}
		str += '<option value="'+val.id+'" '+selectedOption+'>'+val.name+'</option>';

	});

	$('#hotel_id').html(str);
	$(".chosen-select").trigger("chosen:updated");
}


/*
 * get Chain Detail After City Selection
 */
function getChainList(cityid,selec){
	data_param      =       {};
	data_param['cityid']  =   cityid;
	data_param['selec']     =   selec;
	var param = new Array();
	param['url'] = admin_api_controller+'getChainlist';
	param['success_function'] = sucess_getchainList;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);
}

function sucess_getchainList(data){
	var str = '<option value="">Select Chain</option>';
	var chain_data = data.data;
	var selec       =   data.selec;

	$.each(chain_data, function(index,val){
		if(val.id===selec){
			selectedOption  =   'selected="selected"';
		} else {
			selectedOption  =   '';
		}
		str += '<option value="'+val.id+'" '+selectedOption+'>'+val.restaurant_name+'</option>';

	});

	$('#chain_id').html(str);
	$(".chosen-select").trigger("chosen:updated");
}

$(document).ready(function () {
	/* Auto fill Screen name on change restaurant name */
	$( "#profile_name" ).keyup(function() {

		$('#screen_name').val($(this).val());
	});

	/* GEt Chain List on change event on city */
	$("#city_id").change(function () {
		var selec = $(this).data("chainid");
		var areaselect = $(this).data("areaselec");
		cityid = $(this).val();
		/*Get Area Data */
		var data_param = {};
		data_param['city_id'] = cityid;
		data_param['selec'] = areaselect;
		var param = new Array();
		param['url'] = admin_api_controller + 'area_list';
		param['success_function'] = sucess_getAreaList;
		param['data'] = data_param;
		param['method'] = method_get;
		param['async'] = false;
		call_ajax_withSync(param);

		/*Get City STD Code Data */
		getCityStdCode(cityid)

		/* Get Chiain List */
		var data_param = {};
		data_param['cityid'] = cityid;
		data_param['selec'] = selec;
		var param = new Array();
		param['url'] = admin_api_controller + 'getChainList';
		param['success_function'] = sucess_getchainList;
		param['data'] = data_param;
		param['method'] = method_get;
		param['async'] = false;
		call_ajax_withSync(param);
	});
        

	/*Success Return Of Chain Data */
	function sucess_getchainList(data) {
		var str = '<option value="">Select Chain</option>';
		var chain_data = data.data;
		var selec = data.selec;

		$.each(chain_data, function (index, val) {
			if (val.id === selec) {
				selectedOption = 'selected="selected"';
			} else {
				selectedOption = '';
			}
			str += '<option value="' + val.id + '" ' + selectedOption + '>' + val.chainname + '</option>';

		});

		$('#chain_id').html(str);
		$(".chosen-select").trigger("chosen:updated");
	}

	/* Get Area List */
	$("#area_id").change(function () {
		var selec = $(this).data("locality");
		var cityoptid = $(this).data("cityid");
		var cityid = $('#' + cityoptid).val();
		var area_id = ($(this).val()) ? $(this).val() : $(this).data("selec");

		var data_param = {}; //contains the value which will be going to send in ajax call
		if (cityid != undefined)
		{
			data_param['city_id'] = cityid;
		}
		if (area_id != undefined)
		{
			data_param['area_id'] = area_id;
		}
		data_param['selec'] = selec;
		var param = new Array();
		param['url'] = admin_api_controller + 'get_locality_list';
		param['success_function'] = success_getLocalityList;
		param['data'] = data_param;
		param['method'] = method_get;
		param['async'] = false;
		call_ajax_withSync(param);
	});


	function success_getLocalityList(data)
	{
		$('.locality_select_div').html('');

		var str = '<option value="">Select Locality</option>';
		var locality_data = data.data;
		var selec = data.selec;
		var selected = '';
		$.each(locality_data, function (index, val) {
			if (selec === val.l_id) {
				selected = 'selected';
			} else {
				selected = '';
			}
			str += '<option value="' + val.l_id + '" ' + selected + '>' + val.name + '</option>';


		});

		$('.locality_select_div').html(str);
		$(".chosen-select").trigger("chosen:updated");
	}

	$("#locality_id").change(function () {
		localityid  =   $(this).data("selec");
		localityid  =   ($(this).val()) ? $(this).val() : $(this).data("selec")
				selectedhotel   =   $(this).data("hotelselec");
		getHotelList(localityid, selectedhotel);
	})

	/*
	 * Get City Chain Map Data Using Chain Id And City Id
	 * 
	 */

	$("#chain_id").change(function () {
                
                // check fo empty value
                if($(this).val() == ''){                    
                    $("#cost_for_2").attr("readonly", false);
                    $("#profile_name").attr("readonly", false);
                    $("#website").attr("readonly", false);
                    $("#primary_cuisine").attr("disabled", false).trigger("chosen:updated");
                    $("#whichtype_id").attr("disabled", false).trigger("chosen:updated");
                    return false;
                }
                
		resetRestaurantFiled();
		var cityoptid = $(this).data("cityid");
		var selec = $(this).data("selec");
		var cityid = $('#' + cityoptid).val();
		chainid = ($(this).val()) ? $(this).val() : $(this).data("selec");
		data_param = {};
		data_param['cityid'] = cityid;
		data_param['chainid'] = chainid;
		data_param['selec'] = selec;
		var param = new Array();
		param['url'] = admin_api_controller + 'getChaincitymap';
		param['success_function'] = sucess_getChainMapDetail;

		param['data'] = data_param;
		param['method'] = method_get;

		call_ajax_withSync(param);
	});

	/* When chain deselect then this function reset field */
	function resetRestaurantFiled(){
		$('#profile_name').val('');
		$('#screen_name').val('');
		$('#alias').val('');
		$('#website').val('');
		$('#cost_for_2').val('');
		$('#fb_page_url').val('');
		$('#primarycuisinehidden').html('');
		$('#whichtypehidden').html('');
		$('select#primary_cuisine option').removeAttr("selected");
		$('select#whichtype_id option').removeAttr("selected");
		$("#cost_for_2").attr("readonly", false);
		$("#profile_name").attr("readonly", false);
		$("#website").attr("readonly", false);
		$("#primary_cuisine").attr("disabled", false).trigger("chosen:updated");
		$("#whichtype_id").attr("disabled", false).trigger("chosen:updated");
	}

	/* 
	 * Sucess Return chaincitymap
	 */
	function sucess_getChainMapDetail(data) {

		var datajson = data.data;
		datajson = datajson[0];
		/*
		 * Fill Value in Text Box
		 */
		$('#profile_name').val(datajson.restaurant_name);
		$('#screen_name').val(datajson.restaurant_name);
		$('#alias').val(datajson.restaurant_name);
		$('#website').val(datajson.restaurant_website);
		$('#cost_for_2').val(datajson.restaurant_price_for_two);
		$('#fb_page_url').val(datajson.restaurant_facebook_url);

		/*
		 * make cuisine Arr
		 */
		var cuisineArr = new Array();
		var cuisineStr = datajson.restaurant_cuisine.replace(/,\s*$/, '');
		cuisineArr = (cuisineStr).split(",");
		$('#primarycuisinehidden').html('');
		for (var ci = 0; ci < cuisineArr.length; ci++) {
			$('#primary_cuisine option[value=' + cuisineArr[ci] + ']').attr('selected', 'selected');
			$('#primarycuisinehidden').append('<input type="hidden" value='+cuisineArr[ci]+' name="primary_cuisine[]"/>');
		}

		/*
		 * make Type Arr
		 */
		var typeArr = new Array();
		var typeStr = datajson.restaurant_type.replace(/,\s*$/, '');
		typeArr = (typeStr).split(",");
		$('#whichtypehidden').html('');
		for (var ci = 0; ci < typeArr.length; ci++) {

			$('#whichtype_id option[value=' + typeArr[ci] + ']').attr('selected', 'selected');
			$('#whichtypehidden').append('<input type="hidden" value='+typeArr[ci]+' name="whichtype_id"/>');
		}

		$(document).ready(function () {
			$("#primary_cuisine").trigger("chosen:updated");
			$("#whichtype_id").trigger("chosen:updated");
		});
		/*
		 * Get lock Field and Make Read Only Them
		 * First Remove All readOnly
		 */
		$("#cost_for_2").attr("readonly", false);
		$("#profile_name").attr("readonly", false);
		$("#website").attr("readonly", false);
		$("#primary_cuisine").attr("disabled", false).trigger("chosen:updated");
		$("#whichtype_id").attr("disabled", false).trigger("chosen:updated");

		var lockField = data.lockfield;
		$.each(lockField, function (index, val) {
			if (val.field_name === 'price') {
				$("#cost_for_2").attr("readonly", true);
			} 
			if (val.field_name === 'cuisine') {
				$("#primary_cuisine").attr("readonly", true);
				$("#primary_cuisine").attr("disabled", "disabled").trigger("chosen:updated");
			} 
			if (val.field_name === 'restaurant_name') {
				$("#profile_name").attr("readonly", true);
			} 
			if (val.field_name === 'website') {
				$("#website").attr("readonly", true);
			} 
			if (val.field_name === 'restaurant_type') {
				$("#whichtype_id").attr("readonly", true);
				$("#whichtype_id").attr("disabled", "disabled").trigger("chosen:updated");
			}


		});
	}

	/*
	 * Submit Restaurant Form
	 * 
	 */
	$("#submitrestaurant").click(function (event) {
		var error_free = false;
		var cityid = $("#city_id").val();
		var cityName = $('#city_id option[value=' + cityid + ']').text();

		var areaid = $("#area_id").val();
		var areaName = $('#area_id option[value=' + areaid + ']').text();

		var localityid = $("#locality_id").val();
		var localityName = $('#locality_id option[value=' + localityid + ']').text();

		$('#city_name').val(cityName);
		$('#area_name').val(areaName);
		$('#locality_name').val(localityName);

		if ($('#city_name').val() && $('#area_name').val() && $('#locality_name').val()) {
			error_free = true;
		}
		if (!error_free) {
			alert("Some Error Please Refresh Page and Try Again!")
			event.preventDefault();
		}

	});



	/* 
	 * Add More Button
	 */
	var wrapperpone = $(".phonenumber"); //Fields wrapper
	var add_buttonphone = $(".add_field_button"); //Add button ID
	$(add_buttonphone).click(function (e) { //on add input button click
		e.preventDefault();
		$(wrapperpone).append('<div class="add_rest_row"><div class="add_rest_label"></div>  <div class="add_rest_inp "><input type="text" name="phone[]" onkeypress="return validatePhoneNumber(event)" /></div><div class="add_rest_btn addmorebtn" ><input class="remove_field" type="button" name="" value="-"></div></div>'); //add input box     
	});

	$(wrapperpone).on("click", ".remove_field", function (e) { //user click on remove text
		e.preventDefault();
		$(this).parent().parent('div').remove();
	})

	/*Add Mobile*/
	var wrapper = $(".mobilenumber"); //Fields wrapper
	var add_button = $(".addmobile"); //Add button ID
	$(add_button).click(function (e) { //on add input button click
		e.preventDefault();
		$(wrapper).append('<div class="add_rest_row"><div class="add_rest_label"></div>  <div class="add_rest_inp "><input type="text" name="mobile_number[]"/></div><div class="add_rest_btn addmorebtn" ><input class="remove_field" type="button" name="" value="-"></div></div>'); //add input box     
	});
	$(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
		e.preventDefault();
		$(this).parent().parent('div').remove();
	})


	/* Hide Show Payment Methode in restaurant model */
	$('#is_ff').change(function () {
		var isff    =   $(this).val();
		if(isff==1){
			$('#pmethode').show();
		} else {
			$('#pmethode').hide();
		}
	});


	/*  eNABLE RESTAUTANT Admin Password */
	$("#chnge_rest_admin_pass").click(function (event) {
		var cnf     =   confirm("You are going to change Password , After change Password Please Confirm Restaurant Admin")
		if(cnf){
			$("#rest_user_password").attr("disabled", false);
			$("#rest_user_password").val('')
		}
	});
        
        $(document).find('._update_rc').on('click',function(){            
            var ele = $(this);
            var confirmMessage = '';
            var updateStatus = $(this).attr('data-status');            
            if(updateStatus == 1){
                confirmMessage = 'Do you want to reactivate this restaurant chain.';
            }else{
                confirmMessage = 'Do you want to delete this restaurant chain.';
            }
            var params = {id:$(this).attr('data-id'),status:updateStatus};
            if (confirm(confirmMessage)) {
                if(updateStatus == 1){
                    confirmMessage = 'Do you also want to reactivate all the cities with their restaurants in this chain otherwise only this chain will be reactivated.';                
                }else{
                    confirmMessage = 'Do you also want to remove all the cities with their restaurants in this chain otherwise only this chain will be removed.';
                }
                if(confirm(confirmMessage)){
                    params.updateChainCity = 1;
                }else{
                    if(updateStatus == 0)
                        return false;
                    params.updateChainCity = 0;
                }
            }else{
                return false;
            }
            var actionUrl = $(this).attr('data-url');            
            $.ajax({
                url: actionUrl,
                type: 'POST',
                dataType: "json",
                data: params,
                success: function (result) {
                    if (result.status == true) {                        
                        if(updateStatus == 1){
                            alert('Chain reactivated successfully');
                            ele.attr('data-status','0');
                            ele.html('Remove');
                        }else{
                            alert('Chain removed successfully');
                            ele.attr('data-status',1);
                            ele.html('Reactivate');
                        }    
                    }else if(result.status == false){
                        alert(result.error_msg);
                    }else{
                        alert('Not able to remove this chain')
                    }
                }
            });
        });        
        $(document).find('._update_rcc').on('click',function(){
            var updateStatus = $(this).attr('data-status');
            var ele = $(this);
            var confirmMessage = '';
            if(updateStatus == 1){
                confirmMessage = 'Do you want to reactivate this restaurant chain city.';                
            }else{
                confirmMessage = 'Do you want to delete this restaurant chain city.';
            }
            var actionUrl = $(this).attr('data-url');
            var params = {id:$(this).attr('data-id'),status:updateStatus};
            if (confirm(confirmMessage)) {  
                if(updateStatus == 1){
                    confirmMessage = 'All restaurants in this chain city will be reactivated otherwise only this chain will be reacativated then you can reactivate the restaurants manualy.';                
                }else{
                    confirmMessage = 'All restaurants in this chain city will be removed otherwise only this chain will be removed then you can remove the restaurants manualy.';
                }
                if(confirm(confirmMessage)){
                    params.updateRest = 1;
                }else{
                    if(updateStatus == 0)
                        return false;
                    params.updateRest = 0;
                }                
            }else{
                return false;
            }
            $.ajax({
                    url: actionUrl,
                    type: 'POST',
                    dataType: "json",
                    data: params,
                    success: function (result) {
                        if (result.status == true) {                            
                            if(updateStatus == 1){
                                alert('Chain city reactivated successfully');
                                ele.attr('data-status','0');
                                ele.html('Remove');
                            }else{
                                alert('Chain city removed successfully');
                                ele.attr('data-status',1);
                                ele.html('Reactivate');
                            }
                        }else if(result.status == false){
                            alert(result.error_msg);
                        }else{
                            alert('Not able to remove this chain city');
                        }
                    }
                });
        });
});


function getChainMapDetail(chainid,cityid,selec){
	data_param      =       {};
	data_param['cityid']  =   cityid;
	data_param['chainid']  =   chainid;
	data_param['selec']     =   selec;
	var param = new Array();
	param['url'] = admin_api_controller+'getChaincitymap';
	param['success_function'] = sucess_getChainMapDetail;

	param['data'] = data_param;
	param['method'] = method_get;

	call_ajax(param);
}

/**
 * This function used for making ajax call 
 * 
 * with async
 * 
 * @param call_param
 */
function call_ajax_withSync(call_param) {
	var sUrl = call_param['url'];
	var success_call_back = call_param['success_function'];
	var dt = call_param['data'];
	var arr_legacy = call_param['arr_legacy'];
	var asyncd = (call_param['async'] != '') ? call_param['async'] : true;

	//if the show loading is undefined that means the loading div is to be showed less not
	if (arr_legacy != undefined)
	{


		if (arr_legacy.show_loading == undefined)
		{
			show_loading_div = true;

		}
		else
		{
			show_loading_div = arr_legacy.show_loading
		}
	}
	else
	{
		show_loading_div = true;
	}
	var method1 = (call_param['method'] != undefined) ? call_param['method'] : 'Post';
	jQuery.ajax({
		dataType: 'json',
		method: method1,
		url: sUrl,
		data: dt,
		async: asyncd,
		beforeSend: function () {
			//we will show loading div before initiating ajax call
			if (show_loading_div)
			{
				show_loading();
			}
		},
		success: function (resp) {

			if (resp.status == true)
			{
				success_call_back(resp.output_params, arr_legacy);
			}
			else
			{
				alert(resp.error_msg);

			}
			hide_loading();
		},
	});
}


/**
 * THis function removes the whitespaces/trims fro  the string
 * @param str
 * @returns
 */
function trim_str(str)
{
	return $.trim(str);
}

/**
 * This function validates the email.
 * Return true if email is valid else false.
 * @param sEmail
 * @returns {Boolean}
 */
function validate_email(sEmail) 
{
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) 
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**
 * This function validates the email.
 * Return true if email is valid else false.
 * @param sEmail
 * @returns {Boolean}
 */
function validate_phone(phone) 
{
    //replacing all non digit nos with blank.
    var phoneNum = phone.replace(/[^\d]/g, '');
    if(phoneNum.length == 10) 
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**
 * This function toggles the 
 * @param btn
 */
function toggle_bs_dd(btn)
{
	setTimeout(function(){$(btn).click();},2);
}


function fb_share_referral_code(referral_code)
{
	//accepts as an input the restaurant name, restaurant_url and offer_str (optional)
	//shares the booking message on fb

	//building the fb request url...

	url_fb_share = "http://www.facebook.com/dialog/feed?app_id="+fb_app_id;   //fb_app_id is global fb app id

	url_fb_share += "&link=" + encodeURIComponent('http://www.dineout.co.in/');

	url_fb_share += "&name=Dineout";

	url_fb_share += "&caption=Amazing restaurant deals";

	//building the share string, including the offer string (if applicable)

	str_desc = "Use my referral code "+ referral_code + " and earn Rs. 50 in your dineout wallet!";

	

	str_desc += "!"; 

	url_fb_share += "&description=" + str_desc;

	url_fb_share += "&message=" + str_desc;

	url_fb_share += "&redirect_uri=" + encodeURIComponent(window.location.href);

	//so, we have the url to redirect to...
	//let's redirect the user...

	window.location = url_fb_share;





}



function show_full_critic_review(critic_id)
{
    $('#critic_'+critic_id).hide();
    $('#critic_'+critic_id+'_'+critic_id).show();
    $('#critic_full_'+critic_id).hide();
}


/**
         * 
         * @param {type} cityid
         * @returns {undefined}
         */
        function getCityStdCode(cityid)
        {
            if(cityid==''){
                cityid  =   $('#city_id').val();
            }
            var data_param = {};
		data_param['city_id'] = cityid;
		var param = new Array();
		param['url'] = admin_api_controller + 'getCityStdCode';
		param['success_function'] = sucess_getCityStdCode;
		param['data'] = data_param;
		param['method'] = method_get;
		param['async'] = false;
		call_ajax_withSync(param);
        }

	/* Sucess Return Std Code */
	function sucess_getCityStdCode(data)
        {
		stdcode =   data.data;
		$.each(stdcode, function (index, val) {
			$('#phonestd').val(val.std_code);
		});
	}
        
function validatePhoneNumber(evt){  
    if(evt.target.value.length == 10)
        return false;
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;    
    return true;
}        