<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<html>
<head><title>Sudent Authentication</title></head>
<body>
<%
Class.forName("oracle.jdbc.driver.OracleDriver");
Connection con =
DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","SYSTEM","krishna");
Statement st = con.createStatement();
String uname = request.getParameter("username");
String pword = request.getParameter("pwd");
//String but = request.getParameter("button2");
String n = new String();
String p = new String();
ResultSet rs = st.executeQuery("select user_name, password from users where user_name='"+uname+"'and password='"+pword+"'" );
if (rs.next())
{
	//out.println(but);
	session.setAttribute("user",uname);
	//ResultSet rs1=st.executeQuery("create table "+uname+"orders (tableid varchar2(20),orderlist varchar2(200))");
	response.sendRedirect("hyderabad-restaurants/allhotels.html");
}
else
	response.sendRedirect("login.html");
%>
</body>
</html>