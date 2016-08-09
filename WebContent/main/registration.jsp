<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<html>
<head><title>USER REGISTRATION</title>
</head>
<body>
<%
Class.forName("oracle.jdbc.driver.OracleDriver");
Connection con =
DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe","SYSTEM","krishna");
Statement st = con.createStatement();
String uname=request.getParameter("username");
String name=request.getParameter("name");
String pword=request.getParameter("password");
String dateb=request.getParameter("dob");
String email=request.getParameter("mail");
String addre=request.getParameter("addr");
String phone=request.getParameter("mobile");
int i = st.executeUpdate("insert into users values('"+uname+"','"+name+"','"+pword+"','"+dateb+"','"+email+"','"+addre+"','"+phone+"')");
if(i>0)
{
session.setAttribute("user",uname);
response.sendRedirect("hyderabad-restaurants/allhotels.html");
}
else {
response.sendRedirect("registration.html");
}
%>
</body>
</html>