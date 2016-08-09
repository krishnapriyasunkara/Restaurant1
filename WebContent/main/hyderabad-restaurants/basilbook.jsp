<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<html lang="en">
<head>    
<link href='http://fonts.googleapis.com/css?family=Roboto:300,%20400,700,400italic,700italic' rel='stylesheet' type='text/css'> 
<title>Book your table</title>
   
     <link href="../../css/bootstrap.css" rel="stylesheet">

         
    <link rel="stylesheet" type="text/css" media="screen" href="../../css/jquery-ui.css">
	<link rel="stylesheet" type="text/css" media="screen" href="../../css/owl.carousel.css">
	<link rel="stylesheet" type="text/css" media="screen" href="../../css/owl.theme.default.min.css">
	<link rel="stylesheet" type="text/css" media="screen" href="../../css/style_web_new.css">    
	
    
    
   <script>
    (function(i,s,o,g,r,a,m){
    	i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
    
    ga('create', 'UA-32580312-1', 'auto');
    ga('require', 'displayfeatures');
    ga('send', 'pageview');
    if(global_diner_id && global_diner_id > 0) {
        ga('set', 'userId', global_diner_id);
    }
    
    </script>
<script type="text/javascript"  src="../../js/jquery-1.9.1.min.js"></script>
<script type="text/javascript"  src="../../js/jquery.bxslider.js"></script>
<script type="text/javascript"  src="../../js/global_config_public.js"></script>
<script type="text/javascript"  src="../../js/utility.js"></script>
<script type="text/javascript"  src="../../js/public_utils.js"></script>
<script type="text/javascript"  src="../../js/loginregisterv2.js"></script>
<script type="text/javascript"  src="../../js/fb_login.js"></script>
<script type="text/javascript"  src="../../js/google_login.js"></script>
<script type="text/javascript"  src="../../js/config.js"></script>
<script type="text/javascript"  src="../../js/utility.js"></script>
<script type="text/javascript"  src="../../js/jquery-ui.min.js"></script>
<script type="text/javascript"  src="../../js/header.js"></script>
<script type="text/javascript"  src="../../js/home_search.js"></script>
<!-- globals from the backend -->

<script>

	//initializing the js global city id for use by the search and other utils
	var current_city_id = '';
	var current_city_name = '';
	set_current_city_id('4');
	set_current_city_name('Hyderabad');

	//setting the global fb login url
	var gen_fb_login_url = 'http://www.dineout.co.in/fb_login_diner';

	//caching the user session here
	var arr_diner_session_info = {"__ci_last_regenerate":1464784329,"city_id":"4","city_name":"Hyderabad","fb_568956213159751_state":"1bb2c8049e35ba5f27005f0d3e64a759","diner_logged_in":false};
	diner_id = '-1';
</script>

	
	
	
    <!-- Bootstrap -->
<!--  
    <link href="http://www.dineout.co.in/assets/css/global/owl.carousel.css" rel="stylesheet">
    <link href="http://www.dineout.co.in/assets/css/global/owl.theme.default.min.css" rel="stylesheet">
    <link href="http://www.dineout.co.in/assets/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="http://www.dineout.co.in/assets/css/global/style_web_new.css" rel="stylesheet"> -->
    

 <script>

ini_fb_login();
</script>

<script src='https://www.google.com/recaptcha/api.js'></script>

<link rel="shortcut icon" href="http://www.dineout.co.in/favicon.ico?v=2" />

<!--<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">-->
<link href="http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
  </head>
     <body >
    <div class="container-fluid">
    	<header>
            	<div class="row header">
                	<div class="col-lg-12 col-md-12 col-sm-12">
                    	<div class="clearfix">
                        <div class="pull-left">
                            <a class="navbar-brand dineout_logo pull-left" href="../index.html"><img src="" width="100" alt="Dineout" title="Dineout"></a>
                        </div>
                        <div class="pull-left header_dd hdr_lft_btn">
                            <!--START | City Selector-->
                            <div class="dropdown">
                            
                              <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
                                <span class="location_icon mrgn_right5"></span>
                                <span class="dd_txt mrgn_right5">Hyderabad</span>
                                 </button>
                            </div>
                            <!--END | City Selector-->
                        </div>
                        
                        <div class="pull-left header_search">
                                	<div class="input-group">
                                      
                                    </div>
                            </div>
                        
                        <div class="pull-right">
                        
                        <div class="pull-right">
                        
                            <div class="pull-left font14 hire_head">BEST WAY TO BOOK YOUR TABLE!</div >
                        
                        	 <div class="pull-left party_btn"><a href="">Party Bookings</a></div >
                        	
                            <div class="pull-left login_sec loged_btn">
                            
                               
                                
                                                             </div>
                           
                            
                            
                            <div class="pull-left header_contact">
                                For reservations call
                                <div class="clearfix contct_no dflt_color">+91 9212340202</div>
                            </div>
                        </div>
                        </div>
	                </div>
                </div>
        </header>
        


<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog login_pop clearfix">
    <div class="modal-content pop_bg">
      <div class="modal-header bdr0">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="modal-body clearfix">
	
      </div>
    </div>
  </div>
</div>


<style>
    
	
		
</style>

<section>
<%
Class.forName("oracle.jdbc.driver.OracleDriver");
Connection con =
DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","SYSTEM","krishna");
Statement st = con.createStatement();
int id=Integer.parseInt(request.getParameter("box"));
ResultSet rs = st.executeQuery("select imgid,booked from basildb12 where imgid="+id );
if(rs.next())
{
int book = rs.getInt(2);
if(book==0)
{
ResultSet rs1 = st.executeQuery("UPDATE basildb12 SET booked=1 WHERE imgid="+id);
response.sendRedirect("basilorder.html");
}
else
{
response.sendRedirect("basilbook.html");
}
}
else
{
response.sendRedirect("basilbook.html");
}
%>


</section>

<section class="web_footer">
<footer>
    <div class="footer row" style="background:#000">
    	
            	<div class="col-lg-2 col-md-2 col-sm-2 white mrgn_btm20">
                	<a class="dineout_logo block" href=""><img src="" width="100" alt="Dineout" title="Dineout"></a>
                    
                </div>
                           
                 
                
                <div class="col-lg-4 col-md-4 col-sm-4 text-right">
                	<div class="clearfix mrgn_btm10 font14">For reservations call</div>
                    <div class="footer_cntct mrgn_btm20">+91-9212340202</div>
                                   </div>
                
          </div>
</footer>
</section>

</div><!--EDN | main fluid container --- start is in header-->


</html>
    
