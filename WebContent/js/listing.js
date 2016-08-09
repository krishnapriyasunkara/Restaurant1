/**
 * This function will get the restaurant list based on the filters selected via ajax
 */
var infinite_scroll_call    =   0;
function get_restaurant_list(empty_rest_div)
{	
	
	//show selected filter count
	show_selected_filter_count();
	
	var arr_legacy = {};
	
	var data_param = {}; //contains the value which will be going to send in ajax call
	
	data_param['city_name'] = current_city_name;
	
	data_param['f'] = 1;
	
	/*
	if(window.rating_slab != undefined)
	{
		data_param['rating_slab'] = window.rating_slab;
	}
	*/
	
	if(window.price_range != undefined)
	{
		data_param['price_range'] = window.price_range;
	}
	
	if(window.order != undefined)
	{	
		data_param['sortby'] = window.order;
	}
	
	if(window.area_name != undefined) 
	{
		data_param['arr_area'] = get_arr_from_string('area');
	}
	if(window.loc_name != undefined) 
	{
                if(parseInt(window.norecord) === 1) {
                    data_param['lat'] = window.latitude;
                    data_param['long'] = window.longitude;
                    data_param['radius'] = window.radius;
                }else {
                    data_param['arr_locality'] = get_arr_from_string('locality');
                }

	}
	
        if(window.loc_name != undefined && parseInt(window.norecord) === 0) 
	{
		data_param['arr_locarea'] = get_arr_from_string('locality');
	}
	
	//check the selected area and locality and see if we need to add the hidden areas and hidden localities in the request
	check_and_add_hidden_area_loc();
	
	if(window.hidden_area_name != undefined) 
	{
		data_param['hidden_arr_area'] = get_arr_from_string('hidden_area');
	}
	
	if(window.hidden_loc_name != undefined) 
	{
		data_param['hidden_arr_locality'] = get_arr_from_string('hidden_locality');
	}
	
	
	if(window.cui_name != undefined)
	{
		data_param['arr_cuisine'] = get_arr_from_string('cuisine');
	}	
	
	if(window.start != undefined)
	{
		data_param['start'] = window.start;
	}
	
	if(window.limit != undefined)
	{
		data_param['limit'] = window.limit;
	}
	
	if(window.rest_name != undefined)
	{
		data_param['search_needle'] = window.rest_name;
	}
	
	if(window.search_str != undefined && window.search_str != '')
	{
		data_param['search_needle'] = window.search_str;
	}
	
	if(window.tag != undefined) 
	{
		data_param['arr_tag'] = get_arr_from_string('tag');
	}
        if(window.feature != undefined) 
	{
		data_param['arr_feature'] = get_arr_from_string('feature');
	}
        if(window.hotel != undefined) 
	{
		data_param['arr_hotel'] = get_arr_from_string('hotel');
	}
        if(window.chain != undefined) 
	{
		data_param['arr_chain'] = get_arr_from_string('chain');
	}
	
	
	//that means that filter is clicked, and user has not scrolled down 
	if(empty_rest_div != 1)
	{
		//empty the restaurant container div
		$('#rest_list').empty();
		
		window.change_result_found = 1;
		
		arr_legacy['scroll_result'] = false;
	}
	//that means that user has scrolled down to load new list
	else
	{
		
		if(window.no_result ==  1)
		{
			$('#show_more').hide();
			
			return ;
		}
		
		arr_legacy['show_loading'] = false;
		
		arr_legacy['scroll_result'] = true;
		
		$('#small_loading').show();
		
	}

	
	data_param['source'] = 'www';


	
	var param = new Array();

	param['url'] = base_url+'app_api/mobile_app_api_v2/solr_search_full';
	param['success_function'] = populate_rest_list;
	param['data'] = data_param;
	param['method'] = method_get;
	param['arr_legacy'] = arr_legacy;
	
	
	call_ajax(param);
	
}

/**
 * This function will populate the restaurant list
 * @param resp
 */
function populate_rest_list(resp,legacy)
{	
    flag_Rest   =   true;	
    if(resp.data.body.numFound == 0)
    {
        
        //blind hide the listing loading
	$('#small_loading').hide();
        $('#no_result').show();
        return false;
    }
	
	//blind hide the no result div
	$('#no_result').hide();
	
	
	//blind hide the listing loading
	$('#small_loading').hide();
	
	
	
	var restaurant = resp.data.body.searchresult.RESTAURANT.docs;
	
	var img_bs_url = resp.app_img_url;
        var loc_title = '';
	if(parseInt(window.norecord) === 1) {
            var locArr = window.loc_name.split(",");
            loc_title = 'Best Restaurants Nearby '+ locArr[0];
        }
	var rest_heading = (parseInt(window.norecord) === 1) ? loc_title : resp.stitle;
	show_rest_heading(rest_heading);
	
	//var img_bs_url = "http://www.dineout.co.in/assets/images/uploads/restaurant/250x175/";
	
	
	if(! check_and_display_no_result(restaurant,legacy) )
	{
		return ;
	}
	
	//shuffle and populate the area-loc and cuisine list
	var facet = resp.data.body.searchresult.RESTAURANT.facet.facetMap;
	
	shuffle_area_loc_list(facet,0);
	
	shuffle_cui_list(facet,0);
	
	//populate the cost of 2 list based on the facets
	var facet_cost = resp.data.body.searchresult.RESTAURANT.facet.facetQueries;
	
	populate_cost_filter(facet_cost);
	
	$('#rest_list').show();
	
	//loop through the restaurant array and append restaurant card one by one in the div
	for(i=0;i<restaurant.length;i++)
    {
	    var offer_text = '';
		var offer_div = '';
		var rating;
		var cuisine_names;
		
		
		//check if overall rating is greater than 0 if yes print the rating else print '--'
		
		rating = restaurant[i]['avg_rating'] == 0.0 || restaurant[i]['avg_rating'] == undefined  ? '--' : restaurant[i]['avg_rating'];
		
		
		if(restaurant[i]['n_offers'] > 0)
		{
			offer_text = '<span class="offer_icon mrgn_right5"></span> <span class="dflt_color"><a href="javascript:void();" class="dflt_color" onclick="load_offer(\''+restaurant[i]['r_id']+'\');"  data-toggle="modal" >'+restaurant[i]['n_offers']+' offer(s) available</a></span>';
			
		}
		else
		{
			offer_text = '<span class="mrgn_right5"></span> <span class="dflt_color"></span>';
		}
		
		
		rest_cuisine = restaurant[i]['cuisine'];
		
		rest_cuisine_str = '';
		
		if(rest_cuisine != undefined)
		{
			for(j=0;j<rest_cuisine.length;j++)
			{
				rest_cuisine_str += '<a>'+rest_cuisine[j]+'</a>, ';
			}
			
			rest_cuisine_str = rest_cuisine_str.substring(0, rest_cuisine_str.length - 2);
		}
		
		
		var url = global_base_url+restaurant[i]['url']; 
		
		var reserve_button = '';
		
		if(restaurant[i]['fullfillment'] == "true") 
		{
			reserve_button = '<a href="'+url+'"><button onclick="window.location=\''+url+'\';" type="button" class="btn btn-default dflt_btn_big pull-right" data-toggle="dropdown" aria-expanded="false" style="curson: pointer;">RESERVE NOW</button></a>';
		}
		else
		{
			offer_text = '<span class="mrgn_right5"></span> <span class="dflt_color"></span>';
		}
		
		var img_url = '';
		
		if(restaurant[i]['img'] != undefined)
		{
			img_url = img_bs_url+restaurant[i]['img'][0];
		}
		
		/*
		var rest = $('<div class="clearfix list_box" onclick="window.location=\''+url+'\';">'+
        '<div class="clearfix row1">'+
			'<div class="clearfix relative pd_bot10">'+
				'<span class="pull_left list_title bold">'+restaurant[i]['profile_name']+'</span>'+
				'<span class="list_rate" id="rating'+restaurant[i]['r_id']+'">'+rating+'</span>'+
			'</div>'+
            '<div class="col1 img_box"><img src="'+img_url+'"></div>'+
            '<div class="col2">'+
                '<ul class="list_dtl">'+
                    '<!--<li class="list_title clearfix bold">'+restaurant[i]['profile_name']+'</li>-->'+
                    '<li class="clearfix pd_bot5">'+restaurant[i]['locality_name']+'</li>'+
                    '<li class="clearfix pd_bot5 cuisine">'+rest_cuisine_str+'</li>'+
                    '<li class="clearfix">Cost for 2 - Rs.'+restaurant[i]['costFor2']+'/-</li>'+
                    offer_text+
                '</ul>'+
                
            '</div>'+
        '</div>'+
        '<div class="clearfix row2 bg_grey">'+
            '<a href="'+url+'?show=photo" class="pull_left icon_btn mrgn_right5"><span class="photo_icon"></span>PHOTOS</a>'+
            '<a href="'+url+'?show=menu" class="pull_left icon_btn"><span class="menu_icon"></span>MENU</a>'+
            reserve_button+
        '</div>'+
    '</div>');
		*/
		
                var carlsberg = '';
                var tag_image = '';
                if(restaurant[i]['tags'] !== undefined)
                {
                    var tag_name = restaurant[i]['tags'];
                	if(tag_name.indexOf(DOPLUS_TAG) >= 0)
	                {
	                    tag_image += '<div class="absolute event_tag">';
	                    tag_image += '<img src="'+base_url+'/assets/images/images/new_web_img/listing_dineoutplus.png" width="104" height="40" alt="Dineout" title="Dineout">';
	                    tag_image += '</div>';
	                }
	                else if(tag_name.indexOf('Carlsberg') >= 0)
	                {
	                    tag_image += '<div class="absolute event_tag">';
	                    tag_image += '<img src="'+base_url+'/assets/images/images/new_web_img/carlsberg_list.png" width="104" height="40" alt="Dineout" title="Dineout">';
	                    tag_image += '</div>';
	                }
                        
                        if(tag_name.indexOf(AMEX_TAG_NAME) >= 0)
	                {
	                    offer_text += '<div class="clearfix mrgn_btm8"><span class="amex_icon mrgn_right5"></span> <span class="gry_txt_drk font12">';
	                    offer_text += AMEX_OFFER_TITLE;
	                    offer_text += '</span></div>';
	                }
                }
                var ratingtxt = '';
                if(restaurant[i]['recency'] !== undefined && restaurant[i]['recency'] !== '1') { 
                     ratingtxt = '<div class="rate_crcle_abslt" id="rating'+restaurant[i]['r_id']+'">'+rating+'</div>';
                } else {
                    if(restaurant[i]['tags'] !== undefined && (tag_name.indexOf(DOPLUS_TAG) >= 0 || tag_name.indexOf('Carlsberg') >= 0 )) {
                       ratingtxt = '<div class="rate_crcle_abslt" id="rating'+restaurant[i]['r_id']+'">'+rating+'</div>'; 
                    } else {
                        ratingtxt = '<div class="recently_added">New on Dineout</div>'; 
                    }
                }
                
                
		if(flag_Rest === true)
                {
                    infinite_scroll_call++;
                    rest_div_scroll_count   =   'id = "infinite_scroll_call'+infinite_scroll_call+'"'
                    flag_Rest   =   false;
                }
                else
                {
                    rest_div_scroll_count   =   '';
                }
		var rest = $('<div class="clearfix list_box" '+rest_div_scroll_count+' >'+
            	'<div class="col-lg-12 col-md-12 col-sm-12">'+
            	'<div class="row">'+
                	'<div class="col-lg-12 col-md-12 col-sm-12 relative mrgn_btm10">'+

                    	'<h2 class="font24" style="curson: pointer;"><a href="'+url+'">'+restaurant[i]['profile_name']+'</a></h2>'+

                        '<a class="green">'+restaurant[i]['locality_name']+'</a>'+ratingtxt+
                        tag_image +
                    '</div>'+
                    '<div class="col-lg-2 col-md-3 col-sm-3 img_box pd_right0">'+
                        '<a href="'+url+'"><img src="'+img_url+'?h=125" width="" height="" alt="Dineout" title="Dineout"></a>'+
                   '</div>'+
                    '<div class="col-lg-10 col-md-9 col-sm-9">'+
                        '<div class="clearfix mrgn_btm8 cuisines">'+
                        rest_cuisine_str+
                        '</div>'+
                        '<div class="clearfix mrgn_btm8 bold">'+
                        	'<span class="rupee_icon"></span> '+restaurant[i]['costFor2']+' For 2'+
                        '</div>'+
                        '<div class="clearfix mrgn_btm8">'+
                        offer_text+
                        '</div>'+
                        '<div class="clearfix">'+
                            '<a href="javascript:void();" class="btn btn-default white_btn mrgn_right15 loadimagemodal" data-toggle="modal" onclick="loadimagemodal(\'profile\',\''+restaurant[i]['r_id']+'\');"  ><span class="photo_icon"></span>PHOTOS</a>'+
                            '<a href="javascript:void();" class="btn btn-default white_btn mrgn_right15 loadimagemodal" data-toggle="modal" onclick="loadimagemodal(\'menu\',\''+restaurant[i]['r_id']+'\');" ><span class="photo_icon"></span>MENU</a>'+

                            reserve_button+
                        '</div>'+
                        

                    '</div>'+
                '</div>'+
            '</div>'+
		'</div>');
		
		
		
		//append in the div
        rest.appendTo('#rest_list');
        
        rating_class = get_rating_div_class(rating);
		$('#rating'+restaurant[i]['r_id']).addClass(rating_class);
                
        processing  =   false;
    }
	
        /* Seo friendy for infinte scroll */
        var page_url = window.location.pathname; // Returns path only
        page_number    =   $('#rest_list').data( "page" );
        page_number++;
        $('#rest_list').data( "page",page_number);
        var current_url =   page_url+"?page="+page_number;
        //history.replaceState(null, null, current_url);
       
        /* Go for rest div */
        rest_div_scroll_count   =   '#infinite_scroll_call'+infinite_scroll_call
        /*$('html, body').animate({
            scrollTop: $(rest_div_scroll_count).offset().top
        }, 200);*/
        
        
	result_found_header(resp.data.body.searchresult.RESTAURANT.matches);
		
}

function get_arr_from_string(type)
{
	if(type == 'area')
	{
		var str = window.area_name;	
	}
	
	if(type == 'locality')
	{
		var arr = new Array();
		
		var str = window.loc_name;
		
		if(str != '' && str != undefined)
		{
			arr = str.split(';');
		}
		
		return arr;
		
	}
	
	if(type == 'cuisine')
	{
		var str = window.cui_name;
	}
	
	if(type == 'tag')
	{
		var str = window.tag;	
	}
        if(type == 'feature')
	{
		var str = window.feature;	
	}
        if(type == 'hotel')
	{
		var str = window.hotel;	
	}
        if(type == 'chain')
	{
		var str = window.chain;	
	}
	
	if(type == 'hidden_area')
	{
		var str = window.hidden_area_name;	
	}
	
	if(type == 'hidden_locality')
	{
		var str = window.hidden_loc_name;
	}
	
	var arr = new Array();
	
	if(str != '' && str != undefined)
	{
		arr = str.split(',');
	}
	
	return arr;
}


/**
 * This function will load the initial locality list
 */
function inital_populate_area_loc_list()
{
	//deleting the previous checkboxes
    $('#area_loc_skel').empty();
    
    arr_area_loc = window.area_loc_super ;

    //loc_len = loc_cui_len <= arr_area_loc.length ? loc_cui_len : arr_area_loc.length;
    
    //adding new checkboxes
    for(i=0;i<arr_area_loc.length;i++)
    {
    	style = '';
    	
    	if(i > loc_cui_len)
    	{
    		style='style="display:none"';
    	}
    	
    	
        var check_box = $('<li '+style+'><input type="checkbox" name="area_loc[]" aria-label="..." id="'+arr_area_loc[i]['type']+arr_area_loc[i]['id']+'" value="'+arr_area_loc[i]['id']+'" data-text="'+arr_area_loc[i]['name']+'" data-type="'+arr_area_loc[i]['type']+'" onchange="select_filter(\'area_loc\');">'+arr_area_loc[i]['f_name']+'</li>');
        //var check_box = $('<li class="gry_txt '+area_loc_class+'" id="'+arr_area_loc[i]['type']+arr_area_loc[i]['id']+'" value="'+arr_area_loc[i]['id']+'" data-text="'+arr_area_loc[i]['f_name']+'" data-type="'+arr_area_loc[i]['type']+'" onclick="set_value_location(\''+arr_area_loc[i]['f_name']+'\',\''+arr_area_loc[i]['type']+'\');" >'+arr_area_loc[i]['f_name']+'</li>'); 
      
        check_box.appendTo('#area_loc_skel');
    }
}

/**
 * This function will refresh the locality list
 */
function populate_area_loc_list(arr_area_loc)
{
	//deleting the previous checkboxes
    $('#area_loc_skel').empty();

    loc_len = loc_cui_len <= arr_area_loc.length ? loc_cui_len : arr_area_loc.length;
    
    area_loc_super = window.area_loc_super;
    
    pos = 0;

	//get the selected area
	sel_area = get_arr_from_string('area');
	
	//get the selected loc
	sel_loc = get_arr_from_string('locality');
	
	var sel_loc_id_arr = new Array();
	
	if(window.locality != undefined && window.locality != '')
	{
		//get the selected loc id arr
		var sel_loc_id = window.locality;
		
		sel_loc_id_arr = sel_loc_id.split(',');
	}
    
    //adding new checkboxes
    for(i=0;i<area_loc_super.length;i++)
    {
    	
    	checked = '';
    	
    	//if area is selected, mark them checked
    	if(area_loc_super[i]['type'] == 'area')
    	{
	    	if($.inArray( area_loc_super[i]['name'], sel_area ) != -1)
	    	{
	    		checked = 'checked="checked"';
	    	}
    	}//loc is selected
    	else
    	{
    		if( ($.inArray( area_loc_super[i]['name'], sel_loc ) != -1) && ($.inArray( area_loc_super[i]['id'], sel_loc_id_arr)  != -1) ) 
	    	{
	    		checked = 'checked="checked"';
	    	}
    		else if( ($.inArray( area_loc_super[i]['f_name'], sel_loc ) != -1) && ($.inArray( area_loc_super[i]['id'], sel_loc_id_arr)  != -1) )
	    	{
	    		checked = 'checked="checked"';
	    	}
    	}
    	
    	if( pos < loc_len && (area_loc_super[i]['id'] == arr_area_loc[pos]['id']) )
    	{
	        var check_box = $('<li><input type="checkbox" name="area_loc[]" '+checked+' aria-label="..." id="'+area_loc_super[i]['type']+area_loc_super[i]['id']+'" value="'+area_loc_super[i]['id']+'" data-text="'+area_loc_super[i]['name']+'" data-type="'+area_loc_super[i]['type']+'" onchange="select_filter(\'area_loc\');">'+area_loc_super[i]['f_name']+'</li>');
	        //var check_box = $('<li class="gry_txt '+area_loc_class+'" id="'+arr_area_loc[i]['type']+arr_area_loc[i]['id']+'" value="'+arr_area_loc[i]['id']+'" data-text="'+arr_area_loc[i]['f_name']+'" data-type="'+arr_area_loc[i]['type']+'" onclick="set_value_location(\''+arr_area_loc[i]['f_name']+'\',\''+arr_area_loc[i]['type']+'\');" >'+arr_area_loc[i]['f_name']+'</li>'); 
	      
	        check_box.appendTo('#area_loc_skel');
	        
	        pos++;
    	}
    	else
    	{
    		var check_box = $('<li style="display:none"><input type="checkbox" '+checked+' name="area_loc[]" aria-label="..." id="'+area_loc_super[i]['type']+area_loc_super[i]['id']+'" value="'+area_loc_super[i]['id']+'" data-text="'+area_loc_super[i]['name']+'" data-type="'+area_loc_super[i]['type']+'" onchange="select_filter(\'area_loc\');">'+area_loc_super[i]['f_name']+'</li>');
	        //var check_box = $('<li class="gry_txt '+area_loc_class+'" id="'+arr_area_loc[i]['type']+arr_area_loc[i]['id']+'" value="'+arr_area_loc[i]['id']+'" data-text="'+arr_area_loc[i]['f_name']+'" data-type="'+arr_area_loc[i]['type']+'" onclick="set_value_location(\''+arr_area_loc[i]['f_name']+'\',\''+arr_area_loc[i]['type']+'\');" >'+arr_area_loc[i]['f_name']+'</li>'); 
	      
	        check_box.appendTo('#area_loc_skel');
    		
    	}
    	
    }
}






/**
 * This function will refresh the cuisine list used for searching
 */
function populate_cuisine_list(cuisine)
{
	//deleting the previous checkboxes
    $('#cuisine_skel').empty();
    
    //display at the most 5 list
    cui_len = loc_cui_len <= cuisine.length ? loc_cui_len : cuisine.length;
    
	cuisine_super = window.cuisine_super;
	
	pos = 0;

	//get the selected cuisines
	sel_cui = get_arr_from_string('cuisine');
	
	
	//loop through the cuisine master list and show only the selected cuisine array from the search, all other are display none
    //adding new checkboxes
    for(i=0;i<cuisine_super.length;i++)
    {
    	checked = '';
    	
    	//if cuisine is selected, mark them checked
    	if($.inArray( cuisine_super[i]['cuisine_name'], sel_cui ) != -1)
    	{
    		checked = 'checked="checked"';
    	}
    	
    	
    	if( pos <  (cui_len) && (cuisine_super[i]['cuisine_id'] == cuisine[pos]['cuisine_id']) )
    	{
    		//var check_box = $('<div class="element_single"><input type="checkbox" onchange="get_restaurant_list(\'cuisine\');" name="cuisine[]" value="'+cuisine[i]['cuisine_id']+'" data-text="'+cuisine[i]['cuisine_name']+'">'+cuisine[i]['cuisine_name']+'</div>');
    		var check_box = $('<li><input type="checkbox" '+checked+' id="cuisine'+cuisine_super[i]['cuisine_id']+'" name="cuisine[]" aria-label="..." value="'+cuisine_super[i]['cuisine_id']+'" data-text="'+cuisine_super[i]['cuisine_name']+'" onchange="select_filter(\'cuisine\');">'+cuisine_super[i]['cuisine_name']+'</li>');
        
    		check_box.appendTo('#cuisine_skel');
    		
    		pos++;
    	}//display none on all the others
    	else
    	{
    		//var check_box = $('<div class="element_single"><input type="checkbox" onchange="get_restaurant_list(\'cuisine\');" name="cuisine[]" value="'+cuisine[i]['cuisine_id']+'" data-text="'+cuisine[i]['cuisine_name']+'">'+cuisine[i]['cuisine_name']+'</div>');
    		var check_box = $('<li style="display:none"><input type="checkbox" '+checked+' id="cuisine'+cuisine_super[i]['cuisine_id']+'" name="cuisine[]" aria-label="..." value="'+cuisine_super[i]['cuisine_id']+'" data-text="'+cuisine_super[i]['cuisine_name']+'" onchange="select_filter(\'cuisine\');">'+cuisine_super[i]['cuisine_name']+'</li>');
        
    		check_box.appendTo('#cuisine_skel');
    	}
    }
    
}

/**
 * This function will load the initial cuisine list
 */
function inital_populate_cuisine_list()
{
	//deleting the previous checkboxes
    $('#cuisine_skel').empty();
    
    cuisine = window.cuisine_super;
    
    //cui_len = loc_cui_len <= cuisine.length ? loc_cui_len : cuisine.length;
    
    //adding new checkboxes
    for(i=0;i<cuisine.length;i++)
    {
    	style = '';
    	
    	if(i > loc_cui_len)
    	{
    		style='style="display:none"';
    	}
    	
    	
        //var check_box = $('<div class="element_single"><input type="checkbox" onchange="get_restaurant_list(\'cuisine\');" name="cuisine[]" value="'+cuisine[i]['cuisine_id']+'" data-text="'+cuisine[i]['cuisine_name']+'">'+cuisine[i]['cuisine_name']+'</div>');
        var check_box = $('<li '+style+'><input type="checkbox" name="cuisine[]" id="cuisine'+cuisine[i]['cuisine_id']+'" aria-label="..." value="'+cuisine[i]['cuisine_id']+'" data-text="'+cuisine[i]['cuisine_name']+'" onchange="select_filter(\'cuisine\');">'+cuisine[i]['cuisine_name']+'</li>');
        
        check_box.appendTo('#cuisine_skel');
    }
    
}



/**
 * This function will search list the area,cuisine,locality and search through list 
 */
function search_list(type,needle)
{
	//change the needle to lowercase
	needle = needle.toLowerCase();
	
    pos = 0;
    //this is the final arr
    var final_arr = new Array();
	
	if(type == 'area_loc')
	{   
		//get the haystack
		haystack = window.area_loc_super;
		
		//loop through the haystack and match the substring of haystack to the needle
		for(i=0;i<haystack.length;i++)
		{
		  //convert the string in lower case
		  var str = haystack[i]['name'].toLowerCase();
		  
		  //search for the needle
		  var flag = str.search(needle);
		  
		  //if needle is found add the current element in the final array
		  if(flag != -1)
		  {
			  final_arr[pos] = haystack[i];
			  
			  pos++;
		  }
		  
		}
		
		//populate the list
		populate_area_loc_list(final_arr);
	}
	if(type == 'cuisine')
	{
		
		//deleting the previous checkboxes
	    jQuery('#cuisine_skel').empty();
		
		//get the haystack
		haystack = window.cuisine_super;
		
		//loop through the haystack and match the substring of haystack to the needle
		for(i=0;i<haystack.length;i++)
		{
		  //convert the string in lower case
		  var str = haystack[i]['cuisine_name'].toLowerCase();
		  
		  //search for the needle
		  var flag = str.search(needle);
		  
		  //if needle is found add the current element in the final array
		  if(flag != -1)
		  {
			  final_arr[pos] = haystack[i];
			  
			  pos++;
		  }
		  
		}
		
		//populate the list
		populate_cuisine_list(final_arr);
	}
	
}

function select_filter(type)
{
	switch (type)
	{
		case 'area_loc' :  select_area_loc_filter();
						break;
		case 'cuisine' : select_cuisine_filter();
						break;
		case 'price'   : select_price_range();
						break;
	}
	
	add_filters();
	
	reset_rest_list_limit();
	
	get_restaurant_list();
	
	$(window).scrollTop(0);
}


/**
 * Cuisine selector function
 * @param name
 */
function select_cuisine_filter(name)
{
	
	var cuisine_str = "";
	
	var cuisine_name = '';
	
	window.cuisine = '';

	window.cui_name = '';
	
	//loop through the check cuisines and store them
	$('input[name="cuisine[]"]:checked').each(function() {

		//console.log($(this).data('text'));

		cuisine_str += this.value+",";

		cuisine_name +=  $(this).data('text')+',';
				
	});
	
	
	cuisine_str = cuisine_str.slice(0,-1);
	
	cuisine_name = cuisine_name.slice(0,-1);
	
	window.cuisine = cuisine_str;
	
	window.cui_name = cuisine_name;
	
	$('#cui_search').val('');
		
}

/**
 * area/loc selector function
 */
function select_area_loc_filter(name)
{
	
	var area_str = "";
	var locality_str = "";
	
	var area_name = "";
	var loc_name = "";
	
	window.area = '';
	window.locality = '';
	
	window.area_name = '';
	window.loc_name = '';
	
	
	
	$('input[name="area_loc[]"]:checked').each(function() {

		if($(this).data('type') == 'area')
		{
			area_str += this.value+",";

			area_name +=  $(this).data('text')+',';
		}
		else
		{
			locality_str += this.value+",";

			loc_name +=  $(this).data('text')+';';
		}
	});
	
	area_str = area_str.slice(0,-1);
	
	area_name = area_name.slice(0,-1);
	
	loc_name = loc_name.slice(0,-1);
	
	locality_str = locality_str.slice(0,-1);
	
	window.area = area_str;
	
	window.area_name = area_name;
	
	window.locality = locality_str;
	
	window.loc_name = loc_name;
	
	$('#loc_search').val('');

		
}


function reset_filter(type)
{
	switch (type)
	{
		case 'area_loc' :  clear_area_loc_filter();
						break;
		case 'cuisine' : clear_cuisine_filter();
						break;
		case 'price' : clear_price_filter();
						break;
		case 'sort': clear_sort_filter();
					 break;
	}
	
	$('#no_result').hide();
	
	add_filters();
	
	reset_rest_list_limit();
	
	get_restaurant_list();
	
	$(window).scrollTop(0);
	
}

/**
 * Clear area loc filter
 */
function clear_area_loc_filter()
{
	window.area_name = '';
	window.area = '';
	
	window.locality = '';
	window.loc_name = '';
	
	$('#loc_search').val('');
	
	inital_populate_area_loc_list();
}

/**
 * Clear sort filters
 */
function clear_sort_filter()
{
	window.order = '';
	window.sort = '';
	
	$('input[name="sort_filter"]').each(function() {
		$(this).prop('checked', false);
	});
}

/**
 * Clear cuisine filter
 */
function clear_cuisine_filter()
{
	window.cuisine = '';
	window.cui_name = '';
	
	$('#cui_search').val('');

	inital_populate_cuisine_list();
}

/**
 * Clear price filter
 */
function clear_price_filter()
{
	window.price_range = '';
	
	$("input:radio[name='price']").each(function(i) {
	       this.checked = false;
	});
	
}


/**
 * Show no of filters selected 
 */
function show_selected_filter_count()
{
	show_area_loc_selected_count();
	
	show_cuisine_selected_count();

}


function show_area_loc_selected_count()
{
	arr_loc_sel = get_arr_from_string('locality');
	
	arr_area_sel = get_arr_from_string('area');
	
	area_loc_sel = arr_loc_sel.length + arr_area_sel.length;
	
	if(area_loc_sel == 0)
	{
		$('#area_loc_count').hide();
	}
	else
	{
		$('#area_loc_count').html('('+area_loc_sel+')');
		
		$('#area_loc_count').show();
	}
}


function show_cuisine_selected_count()
{
	arr_cui_sel = get_arr_from_string('cuisine');
	
	if(arr_cui_sel.length == 0)
	{
		$('#cuisine_count').hide();
	}
	else
	{
		$('#cuisine_count').html('('+arr_cui_sel.length+')');
		
		$('#cuisine_count').show();
	}
}


function select_price_range()
{
	window.price_range = $("input[name=price]:checked").val();
}




function sort_by_cost(order)
{
	if(window.sort == 'price')
	{
		if(window.order == 'cft_asc')
		{
			/*
			$('#price_asc').removeClass('grn_txt');
			$('#price_desc').addClass('grn_txt');
			
			add_netural_filter_icons();
			$('#cost_icon_desc').addClass('desc_ico');
			*/
			
			$('#price_asc').hide();
			$('#price_desc').show();
			
		}
		else if( window.order == 'cft_desc')
		{
			/*
			$('#price_asc').addClass('grn_txt');
			$('#price_desc').removeClass('grn_txt');
			
			add_netural_filter_icons();
			$('#cost_icon').addClass('asc_ico');
			*/
			$('#price_asc').show();
			$('#price_desc').hide();
		}
		else
		{
			/*
			$('#price_asc').addClass('grn_txt');
			$('#price_desc').removeClass('grn_txt');
			
			add_netural_filter_icons();
			$('#cost_icon').addClass('asc_ico');
			*/
			$('#price_asc').show();
			$('#price_desc').hide();
		}
		
	}
	else
	{
		/*
		$('#price_asc').addClass('grn_txt');
		$('#price_desc').removeClass('grn_txt');
		
		add_netural_filter_icons();
		$('#cost_icon').addClass('asc_ico');
		*/
		
		$('#price_asc').show();
		$('#price_desc').hide();
		
		order = 'cft_asc';
	}
	
	
	window.sort = 'price';
	window.order = order;
	
	
	/*
	$('#distance').removeClass('grn_txt');
	$('#rating_asc').removeClass('grn_txt');
	$('#rating_desc').removeClass('grn_txt');
	*/
}


function sort_by_rating(order)
{
	if(window.sort == 'rating')
	{
		//show descending icons
		if(window.order == 'rating_asc')
		{
			/*
			$('#rating_asc').removeClass('grn_txt');
			$('#rating_desc').addClass('grn_txt');
			
			add_netural_filter_icons();
			$('#rating_icon_desc').addClass('desc_ico');
			*/
			$('#rating_asc').hide();
			$('#rating_desc').show();
			
		}
		else if( window.order == 'rating_desc')
		{
			/*
			$('#rating_asc').addClass('grn_txt');
			$('#rating_desc').removeClass('grn_txt');
			
			
			add_netural_filter_icons();
			$('#rating_icon').addClass('asc_ico');
			*/
			
			$('#rating_asc').show();
			$('#rating_desc').hide();
		}
		else
		{
			/*
			$('#rating_asc').addClass('grn_txt');
			$('#rating_desc').removeClass('grn_txt');
			*/
			
			$('#rating_asc').show();
			$('#rating_desc').hide();
		}
		
	}
	else
	{
		/*
		$('#rating_asc').addClass('grn_txt');
		$('#rating_desc').removeClass('grn_txt');
		
		add_netural_filter_icons();
		$('#rating_icon').addClass('asc_ico');
		*/
		$('#rating_asc').show();
		$('#rating_desc').hide();
		
		order = 'rating_asc';
	}
	
	
	window.sort = 'rating';
	window.order = order;
	
	
	/*
	$('#distance').removeClass('grn_txt');
	$('#price_asc').removeClass('grn_txt');
	$('#price_desc').removeClass('grn_txt');
	*/
	
}

function sort_by_filter(type,order)
{

	//making all the 4 sort buttons inactive
		
	make_button_inactive_sel('btn_sort_pricing_l2h');
	make_button_inactive_sel('btn_sort_pricing_h2l');
	make_button_inactive_sel('btn_sort_rating_l2h');
	make_button_inactive_sel('btn_sort_rating_h2l');
	

	if(type == 'price')
	{
		
		sort_by_cost(order);
		//making the price buttons selected
		
		make_button_active_sel('btn_sort_pricing_l2h');
		make_button_active_sel('btn_sort_pricing_h2l');
		
	}
	
	if(type == 'rating')
	{
		
		sort_by_rating(order);
		//making the rating buttons selected
		
		make_button_active_sel('btn_sort_rating_l2h');
		make_button_active_sel('btn_sort_rating_h2l');
		
	}
	
	reset_rest_list_limit();
	
	get_restaurant_list();

}


/**
 *  - restaurants availabe
 * @param result
 */
function result_found_header(result)
{
	/*
	if(result < 10)
	{
		$('#show_more').hide();
	}
	else
	{
		$('#show_more').show();
	}
	*/
	
	if(window.change_result_found == 1)
	{
		$('#result_found').html(result+' Restaurants found');
		
		window.change_result_found = 0;
	}
}

function check_and_display_no_result(restaurant,legacy)
{
	if(restaurant == undefined || restaurant.length == 0 || restaurant == null)
	{
		
		if( ! legacy.scroll_result )
		{
			$('#no_result').show();
			
			$('#rest_list').empty();
			
			//toggle_filter_div('hide');
			
			result_found_header(0);
						
		}
		//$('#show_more').hide();
		
		window.no_result = 1;
		
		return false;
	}
	
	//$('#show_more').show();
	
	window.no_result = 0;
	
	return true;
}

function reset_rest_list_limit()
{
	window.start = 0;
}


/**
 * Show the preselected values on the filter screen and get the restaurant list
 */
function fill_pre_selected_values()
{
	var pre_selected = window.pre_select;
	
	
	if(pre_selected == undefined)
	{
		return;
	}
	
	if(pre_selected['cuisine'] != undefined)
	{
		var pre_cui_id = get_cuisine_id_from_cuisine_name(pre_selected['cuisine']);
		
		if(pre_cui_id != undefined)
		{
			/*
			cuisine_filter_click('cuisine',pre_selected['cuisine'],pre_cui_id,pre_selected['cuisine']);
			
			set_cuisine_filter();
			*/
			
			window.cui_name = pre_selected['cuisine'];
			window.cuisine = pre_cui_id;
			
			$('#cuisine'+pre_cui_id).prop('checked', true);
			
		}
	}
	
	if(pre_selected['area'] != undefined)
	{
		var pre_area_id = get_area_id_from_area_name(pre_selected['area']);

		if(pre_area_id != undefined)
		{
			/*
			area_loc_filter_click('area',pre_selected['area'],pre_area_id,pre_selected['area']);

			set_area_loc_filter();
			*/
			
			window.area_name = pre_selected['area'];
			window.area = pre_area_id;
			
			$('#area'+pre_area_id).prop('checked', true);
		}

	}
	
	if(pre_selected['locality'] != undefined)
	{
		var pre_loc_id = get_locality_id_from_locality_name(pre_selected['locality'],pre_selected['area']);

		if(pre_loc_id != undefined)
		{
			/*
			area_loc_filter_click('locality',pre_selected['locality'],pre_loc_id,pre_selected['locality']);

			set_area_loc_filter();
			*/
			
			window.loc_name = pre_selected['locality'];
			window.locality = pre_loc_id;
			
			$('#locality'+pre_loc_id).prop('checked', true);
		}
	}
	
	if(pre_selected['rest'] != undefined)
	{
		window.rest_name = pre_selected['rest']; 
	}
	
	if(pre_selected['tag'] != undefined)
	{
		window.tag = pre_selected['tag'];
	}
        if(pre_selected['feature'] != undefined)
	{
		window.feature = pre_selected['feature'];
	}
        if(pre_selected['hotel'] != undefined)
	{
		window.hotel = pre_selected['hotel'];
	}
	if(pre_selected['chain'] != undefined)
	{
		window.chain = pre_selected['chain'];
	}
	if(pre_selected['search_str'] != undefined )
	{
		window.search_str = pre_selected['search_str'];
	}
	
	
	
	//show selected filter count
	show_selected_filter_count();
	
	
}

function get_cuisine_id_from_cuisine_name(cuisine_name)
{
	
	var cuis_id;
	
	//change the needle to lowercase
	needle = cuisine_name.toLowerCase();

	//get the haystack
	haystack = window.cuisine_super;

	//loop through the haystack and match the substring of haystack to the needle
	for(i=0;i<haystack.length;i++)
	{
		//convert the string in lower case
		var str = haystack[i]['cuisine_name'].toLowerCase();

		//if needle is found get the id and return the id
		if(str == needle)
		{
			cuis_id = haystack[i]['cuisine_id'];
			
			break;
		}

	}
	
	return cuis_id;
		
		
	
}



function get_area_id_from_area_name(area_name)
{
	
	var area_id;
	
	//change the needle to lowercase
	needle = area_name.toLowerCase();

	//get the haystack
	haystack = window.area_loc_super;

	//loop through the haystack and match the substring of haystack to the needle
	for(i=0;i<haystack.length;i++)
	{
		//convert the string in lower case
		var str = haystack[i]['name'].toLowerCase();

		//if needle is found get the id and return the id
		if(str == needle && haystack[i]['type'] == 'area')
		{
			area_id = haystack[i]['id'];
			
			break;
		}

	}
	
	return area_id;
		
}

function get_locality_id_from_locality_name(locality_name,area_name)
{
	
	var loc_id;
	
	//change the needle to lowercase
	needle = locality_name.toLowerCase();

	//get the haystack
	haystack = window.area_loc_super;

	//loop through the haystack and match the substring of haystack to the needle
	for(i=0;i<haystack.length;i++)
	{
		//convert the string in lower case
		var str = haystack[i]['f_name'].toLowerCase();

		str = $.trim(str);
		
		//if needle is found get the id and return the id
		if(str == needle && haystack[i]['type'] == "locality")
		{
			if(area_name != undefined)
			{
				
				var flag = haystack[i]['f_name'].search(area_name);

				//if needle is found add the current element in the final array
				if(flag != -1)
				{
					loc_id = haystack[i]['id'];
					
					break;
				}

				
			}
			else
			{
				loc_id = haystack[i]['id'];
				
				break;
			}
		}

	}
	
	return loc_id;
		
		
	
} 

function make_button_active_sel(id_btn)
{
	//sets the background colour of the specified button to grey...to make it appear 'selected'

	$('#'+id_btn).addClass('bg_btn_active');
}

function make_button_inactive_sel(id_btn)
{
	//unsets the background colour of the specified button to grey...to make it appear 'not selected'

	$('#'+id_btn).removeClass('bg_btn_active');
}

function show_rest_heading(rest_heading)
{
	$('#rest_header').html(rest_heading);
}


/**
 * THis function will get the facet map and shuffle the area-loc list based on the current filters selected
 * @param facet
 */
function shuffle_area_loc_list(facet,intial_load)
{
	
	loc_facet = facet['locality_name_ft'];
	
	area_facet = facet['area_name_ft'];
	
	area_loc_arr = window.area_loc_super;
	
	
	if( loc_facet == undefined || loc_facet.length == 0 )
	{
		if(intial_load == 1)
		{
			inital_populate_area_loc_list();
		}
		else
		{
			populate_area_loc_list(window.area_loc_super);
		}
		
		return ;
	}
	
	var new_area_loc_arr = new Array(); // this will be the new cuisine array
	
	var area_loc_fac_id_arr = new Array(); //index array containing the cuisine id of all the cuisines in the facet
	
	var pos = 0;
	
	
	//lopp through the cuisine facet array, find it in the main cuisine array, then add in new cuisine array and add the id in the cuisine id array
	for( var loc_name in loc_facet )
	{
		for(j=0;j<area_loc_arr.length;j++)
		{
			if(area_loc_arr[j]['name'] == loc_name)
			{
				new_area_loc_arr[pos] = area_loc_arr[j];
				
				area_loc_fac_id_arr[pos] = area_loc_arr[j]['id'];
				
				pos++;
			}
		}
	}
	
	//loop through the main cuisine array check if it is not present in the new cuisine arry based on the id in the cuisine id array then add it in the end.
	for(i=0;i<area_loc_arr.length;i++)
	{
		if ( $.inArray( area_loc_arr[i]['id'], area_loc_fac_id_arr)  == -1 )
		{
			new_area_loc_arr[pos] = area_loc_arr[i];
			pos++;
		}
		
	}
	
	//make this the new cuisine array
	window.area_loc_super = new_area_loc_arr;
	
	//populate the cusine list
	if(intial_load == 1)
	{
		inital_populate_area_loc_list();
	}
	else
	{
		populate_area_loc_list(window.area_loc_super);
	}
	

}


/**
 * THis function will get the facet map and shuffle the cui list based on the current filters selected
 * @param facet
 */
function shuffle_cui_list(facet,intial_load)
{
	cui_facet = facet['cuisine_ft']; //get the array of cuisine facet key => value
	
	cuis_arr = window.cuisine_super; //get the cuisine main array
	
	//check if the facet is empty then populate the list on the basis of the database
	if( cui_facet == undefined || cui_facet.length == 0 )
	{	
		if(intial_load == 1)
		{
			inital_populate_cuisine_list();
		}
		else
		{
			populate_cuisine_list(window.cuisine_super);
		}
		
		return ;
	}
	
	
	var new_cuis_arr = new Array(); // this will be the new cuisine array
	
	var cuis_fac_id_arr = new Array(); //index array containing the cuisine id of all the cuisines in the facet
	
	var pos = 0;
	
	//lopp through the cuisine facet array, find it in the main cuisine array, then add in new cuisine array and add the id in the cuisine id array
	for( var cui_name in cui_facet )
	{
		for(j=0;j<cuis_arr.length;j++)
		{
			if(cuis_arr[j]['cuisine_name'] == cui_name)
			{
				new_cuis_arr[pos] = cuis_arr[j];
				
				cuis_fac_id_arr[pos] = cuis_arr[j]['cuisine_id'];
				
				pos++;
			}
		}
	}
	
	//loop through the main cuisine array check if it is not present in the new cuisine arry based on the id in the cuisine id array then add it in the end.
	for(i=0;i<cuis_arr.length;i++)
	{
		if ( $.inArray( cuis_arr[i]['cuisine_id'], cuis_fac_id_arr)  == -1 )
		{
			new_cuis_arr[pos] = cuis_arr[i];
		}
		
	}
	
	//make this the new cuisine array
	window.cuisine_super = new_cuis_arr;
	
	
	//populate the cusine list
	if(intial_load == 1)
	{
		inital_populate_cuisine_list();
	}
	else
	{
		populate_cuisine_list(window.cuisine_super);
	}

	
}


/**
 * This function will check if both area and locality are selected then determine based on the selected area and loc whether to add hidden areas and/or localities to the request
 */
function check_and_add_hidden_area_loc()
{
	window.hidden_area_name = '';
	window.hidden_loc_name = '';
	
	
	//if no area is selected no need to add anything
	if(window.area_name == '' || window.area_name == undefined)
	{
		return ;
	}
	
	//if no locality is selected no need to add anything
	if(window.loc_name == '' || window.loc_name == undefined)
	{
		return ;
	}
	
	//get the area and locality array
	var selected_area = get_arr_from_string('area');

	var selected_loc = get_arr_from_string('locality');

	var pos = 0;
	
	var present_area = new Array();
	
	var i = 0;
	
	//loop through the localities check if the locality parent is in the selected area if not then add it to the hidden area
	for(i=0;i<selected_loc.length;i++)
	{
		//get the parent area name
		var area = get_locality_parent_name(selected_loc[i]);
		
		//check if it is in the selected area
		if ( $.inArray( area, selected_area)  == -1 )
		{
			window.hidden_area_name += area+','; 
		}
		else
		{
			present_area[pos] = area;
			pos++; 
		}
	}
	
	var i = 0;
	
	//loop through the selected area list check if the any of the localities is in the localities list if not then add all the localities in the hidden locality list
	for(i=0;i<selected_area.length;i++)
	{
		var area = selected_area[i];
		
		if ( $.inArray( area, present_area)  == -1 )
		{
			//get all the localities of a area
			window.hidden_loc_name += get_locality_name_str_by_area(area)+','; 
		}
	}
	
	window.hidden_loc_name = window.hidden_loc_name.slice(0,-1);
	
	window.hidden_area_name = window.hidden_area_name.slice(0,-1);
	
}


/**
 * This function will return the locality parent name
 */
function get_locality_parent_name(locality_name)
{
	var loc_tree = window.loc_tree;
	
	for(i=0;i<loc_tree.length;i++)
	{
		var a_name = loc_tree[i]['a_name'];
		
		var l_list = loc_tree[i]['l_list'];
		
		for(j=0;j<l_list.length;j++)
		{
			if(l_list[j]['l_name'] == locality_name)
			{
				return a_name;
			}
		}
		
	}
}


/**
 * this function will return a string of all the localities in a area
 * @param selected_area_name
 * @returns {String}
 */
function get_locality_name_str_by_area(selected_area_name)
{
	var loc_tree = window.loc_tree;
	
	var loc_str = '';
	
	for(i=0;i<loc_tree.length;i++)
	{
		var a_name = loc_tree[i]['a_name'];
		
		if(selected_area_name == a_name)
		{
		
			var l_list = loc_tree[i]['l_list'];
			
			for(j=0;j<l_list.length;j++)
			{
				loc_str += l_list[j]['l_name']+',';
			}
		
			loc_str = loc_str.slice(0,-1);
			
			return loc_str;
			
		}
		
	}
}


/**
 * THis function is the new function for sorting
 */
function sort_by_filter_new()
{
	window.order = '';
	window.sort = '';
	
	$('input[name="sort_filter"]').each(function() {

		if( $(this).is(':checked') ) 
		{ 
			window.order = this.value;
			window.sort = $(this).data('type');
		}
				
	});
	
	reset_rest_list_limit();
	
	get_restaurant_list();
	
}



/**
 * This function will add the filters in the top section of the page
 */
function add_filters()
{
   
	
	
   $('#filter_skel').empty();

   //jQuery('#filter_skel').html('No filters Added');
   
   //iterate through all the filters and add the text of the checked checkboxes on top

    jQuery('input[name="area_loc[]"]:checked').each(function() {
            
            var text =  jQuery(this).data('text');

            var type = jQuery(this).data('type');
            
            var value = this.value;

           /* 
            <div class="label label-white font14">
            +text+ <span class="glyphicon glyphicon-remove" onclick="remove_filter(\'+type+\','+value+');"></span>
        </div>
        */
            
            var append = jQuery('<div class="label label-white font14">'+
                    text+ '<span class="glyphicon glyphicon-remove" onclick="remove_filter(\''+type+'\','+value+');"></span>'+
                    '</div>');

            append.appendTo('#filter_skel');
            
        $('#filter_main').show();    
    });

    jQuery('input[name="cuisine[]"]:checked').each(function() {
            
            var text =  jQuery(this).data('text');

            var value = this.value;
            
            var type = 'cuisine';

            var append = jQuery('<div class="label label-white font14">'+
                    text+ '<span class="glyphicon glyphicon-remove" onclick="remove_filter(\''+type+'\','+value+');"></span>'+
                    '</div>');

            append.appendTo('#filter_skel');
            
            $('#filter_main').show();
    });


    /*
   if(window.tag != undefined)
   {
	   if(window.tag != "")
	   {
		   var text  = window.tag;
		   
		   var append = jQuery('<div class="filters_added">'+
		           '<div class="filter_name">'+text+'</div>'+
		           '<div class="filter_close">'+
		               '<img width="15px" height="15px" alt="close" onclick="remove_filter(\'tag\',\''+text+'\');" src="'+image_base_url+'images/cross_grey.png">'+
		           '</div>'+
		       '</div>');
		
		   append.appendTo('#filter_skel');
	   }	
   }
   */
   

}

/**
 * Remove the filters from the filter bar
 * @param type
 * @param value
 */
function remove_filter(type,value)
{    //alert("in funct");
    
    if(type == 'cuisine')
    {
        jQuery('input[name="cuisine[]"]:checked').each(function() {
                
                var cur_value = this.value;

                if(value == cur_value)
                {
                    jQuery(this).prop('checked', false); 
                }
                
        });
        
        select_filter('cuisine');
    }

    if(type == 'area')
    {
        jQuery('input[name="area_loc[]"]:checked').each(function() {
                
                var cur_value = this.value;
                
                var cur_type = jQuery(this).data('type');

                if(value == cur_value && cur_type == type)
                {
                    jQuery(this).prop('checked', false); 
                }
                
        });
        
        select_filter('area_loc');
    }

    if(type == 'locality')
    {
        jQuery('input[name="area_loc[]"]:checked').each(function() {
                
                var cur_value = this.value;

                if(value == cur_value)
                {
                    jQuery(this).prop('checked', false); 
                }
                
        });
        
        select_filter('area_loc');
    }
    
    check_filter_div_show();
    
    /*
    if(type == 'tag')
    {
    	window.tag = "";
    }
    
    get_restaurant_list(type);
    
    make_h1_str();
    */
}


function check_filter_div_show()
{
        if(window.norecord == 1) {
            if(window.cui_name == '' || window.cui_name == undefined) {
                $('#filter_main').hide();
            }
        }else {
            if( (window.cui_name == '' || window.cui_name == undefined) && (window.area_name == '' || window.area_name == undefined) && (window.loc_name == '' || window.loc_name == undefined) )
            {
                    $('#filter_main').hide();
            }
        }	
}





function loadimagemodal(objtype,objid)
{

    $('#restaurant_images').html('Loading.....');
    $('#myModal1').modal('show');
    var image_type  =   objtype;
    var rest_id     =   objid;
    var data_param = {}; //contains the value which will be going to send in ajax call
    data_param['obj_id'] = rest_id;
    data_param['image_type'] = image_type;
    
    var param = new Array();
    param['url'] = base_url+'api/get_restaurant_image';
    param['success_function'] = success_get_restaurant_image;
    param['data'] = data_param;
    param['method'] = method_get;
    
    call_ajax(param);
}

/**
 * 
 * @param {type} rest_id
 * @returns {undefined}
 */
function load_offer(rest_id)
{

    $('#myModal1').modal('show');
    
    var rest_id     =   rest_id;
    var data_param = {}; //contains the value which will be going to send in ajax call
    data_param['rest_id'] = rest_id;
    
    var param = new Array();
    param['url'] = base_url+'api/get_restaurant_offer';
    param['success_function'] = success_get_restaurant_offer;
    param['data'] = data_param;
    param['method'] = method_get;

    call_ajax(param);
}

/**
 * Get Offer
 * @param {type} offerdata
 * @returns {undefined}
 */
function success_get_restaurant_offer(offerdata){
	var offer_data = offerdata.data;
        var rest_id     =   offerdata.rest_id;
        var rest_name   =   offerdata.restaurant_name;
        var str =   '';
        
        //str =   '<div class="col-lg-2 col-md-2 col-sm-2 gallery-item">'
        str =   '<div class="owl-carousel_offer" style="width:600px;text-align:center;" >';
        //str +=  '<div class="font16 dflt_color pd_left15">';  
        
        if (offer_data[rest_id].length === 0)
        {
            str += 'Coming Soon';
        }
        
	$.each(offer_data[rest_id], function(index1,val){
            
                var offer_title     =   val.title_stripped;
                console.log(val);
                var offer_des       =   val.description;
                var display_time    =   val.display_str;
                str +=  '<div class="item txt_lft brdr_offr">';
                str += '<span class="offer_ico" ></span><span class="dflt_color pd_left15">'+offer_title+'</span>';
                str += '<div class="font14 pd_left15" >'+offer_des+'</div>';
                str += '<div class="font14 bold pd_left15">Available</div>';
                str +=  '<div class="font14 pd_left15">'+display_time+'</div>';
                str += '</div>';
           
	});
        //str +=   '</div>';
        str +=   '</div>';
        $('#rest_image_title').html(rest_name+' Offer');
        $('#restaurant_images').html(str);
        //$('#restaurant_offer').html(str);
        if(offer_data[rest_id].length>1)
        {
           $('.owl-carousel_offer').owlCarousel({ items: 1,autoWidth:true, navigation : true, slideSpeed : 300,loop:true,paginationSpeed : 400,autoWidth : false,autoplay:true,singleItem:true });
        }
        $('#modal-content').css('min-height','300');
}

/**
 * success function set image on popup modal
 * @param {type} imagedata
 * @returns {undefined}
 */
function success_get_restaurant_image(imagedata){
	var image_data = imagedata.data;
        var str =   '';
        var rest_name   =   imagedata.restaurant_name;
        var orgHeight   =   'auto';
        //str =   '<div class="col-lg-2 col-md-2 col-sm-2 gallery-item">'
        str =   '<div class="owl-carousel212" style="width:600px;text-align:center;" >';
        var flag=true;
        if (image_data.length === 0)
        {
            str += 'Coming Soon';
            orgHeight   =   '100'
        }
	$.each(image_data, function(index,val){
                console.log(val);
                url     =   val.image_url;
                image_type  =   val.image_type;
                if(image_type=='profile')
                {
                    image_type  =   'Photos'
                }
                else if(image_type  =   'menu')
                {
                    image_type  =   'Menus'
                }
                
                image_url       =   url;
                //image_url   =   url.replace("dineout_ci_new.com", "dineout.co.in");
                if(flag)
                {
                    orgHeight   =   getHeight(image_url);
                    if(orgHeight>0)
                    {
                        flag    =   false;
                    }
                }
                
		//str += '<a rel="gallery-2" href="'+val.image_url+'" class="swipebox" title=""><div class="menu_img">';
                str += '<div class="item" >';
                str += '<img src="'+image_url+'" alt="'+image_type+'" title="'+image_type+'">';
                //str += '</div></a>'
                str += '</div>';

	});
        str +=   '</div>';
        
        //str +=  "<script>$('.owl-carousel212').owlCarousel({ items: 1, navigation : true, slideSpeed : 300,loop:true,paginationSpeed : 400,autoHeight : true,autoplay:true,singleItem:true});</script>";
	$('#rest_image_title').html(rest_name+'  '+image_type);
        setTimeout(function(){
            $('#restaurant_images').html(str);
            if(image_data.length>1)
            {
               $('.owl-carousel212').owlCarousel({ autoHeight : true,items: 1,autoWidth:true, navigation : true, slideSpeed : 300,loop:true,paginationSpeed : 400,autoWidth : false,autoplay:true,singleItem:true });
            }
            
            //$('.owl-carousel212').trigger('next.owl.carousel');
            //$('.owl-carousel212').trigger('prev.owl.carousel');
        }, 300);
        //resizing once to place things in visual order
        //$('#modal-content').css('min-height',orgHeight);
 
}

/**
 * get Image Height from url
 * @param {type} url
 * @returns {theImage.height|Image.height}
 */
function getHeight(url)
{
    var theImage = new Image();
    theImage.src = url;
    var imageHeight = theImage.height;
    return imageHeight;
}



function populate_cost_filter(cost_for_2)
{
	
	$("#cost_for_2_skel").empty();
	
	for(cost_el in cost_for_2)
	{
		//var cost_el = cost_for_2[i];
		
		var cost_el_count = cost_for_2[cost_el];
		
		var cost_el_arr = cost_el.split(":");
		
		
		if( (cost_el_arr[0] == 'costFor2' || cost_el_arr[0] == '{!ex=costFor2_tag}costFor2')  && cost_el_count != '0')
		{
			var cost_string = cost_el_arr[1];
			
			cost_string = cost_string.replace('[','');
			
			cost_string = cost_string.replace(']','');
			
			var cost_value = cost_string.replace(' TO ','-');
			
			if(cost_string.indexOf('*') >= 0)
			{
				cost_string = cost_string.replace(' TO *','+'); 
			}
			
			
			var checked = '';
			
			if(window.price_range == cost_value)
			{
				checked = 'checked="checked"';
			}
			
			var append = jQuery('<li><input type="radio" aria-label="..." name="price" '+checked+'  value="'+cost_value+'" onclick="select_filter(\'price\');">'+cost_string+'</li>');

            append.appendTo('#cost_for_2_skel');
		}
		
	}
	
	
	
}
