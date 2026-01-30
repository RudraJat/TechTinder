#Pagination
 - /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

 - /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
 
 - /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
 
 - /feed?page=4&limit=10 => 31-40 => .skip(30) & .limit(10)

 skip = (page-1)*limit


 #Future 
 - When user logout it should ask again that you want to logout or not

FRONTEND

#TechTinder-web

- Create a vite+react application
- Remove uneccessary code 
- Install Tailwind CSS
- Install Daisy UI
- Add NavBar component to App.jsx
- Install react-router-dom




BODY
    NavBar
    Route = / => Feed
    Route = /login => Login
    Route = /connections => Connections
    Route = /profile => Profile

