import React, { useState, useEffect } from "react"
import facade from "./apiFacade";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './other.css'
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'


const url = "http://localhost:8080/eksamen/api/"
 

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
 
  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }
 
  return (
    <div>
      <div id="formContent">
      <h2>Login</h2>
      
      <form class="fadeIn second" onChange={onChange} >
        <input placeholder="User Name" class="form-control" id="username" />
        <br></br>
        <div class="fadeIn third"><input placeholder="Password" class="form-control" id="password" /></div>
        <br></br>
        
        <br></br>

        <div id="formFooter">
        <a class="underlineHover" href="#"><div class="fadeIn fourth"><button class="btn btn-default" onClick={performLogin}>Login</button></div></a>
        </div>
      </form>

    </div></div>
  )
 
}
function LoggedIn(props) {

    
    return (
      <div>
      <Header logout={props.logout} loggedIn = {props.loggedIn} adminToken={props.adminToken}/>
      <Switch>
        <Route exact path="/">
          <Home adminToken = {props.adminToken} login = {props.login} loggedIn = {props.loggedIn} errorMessage = {props.errorMessage}/>
        </Route>
        <ProtectedRoute path="/searchpages" component={Pages} loggedIn={props.loggedIn}>
        </ProtectedRoute>
        <ProtectedRoute path="/myprofile" component={MyProfile} loggedIn={props.loggedIn}>
        </ProtectedRoute>
        <ProtectedRoute path="/admin" component={Admin} loggedIn={props.loggedIn}>         
        </ProtectedRoute>
      </Switch>
    </div>
    );
}

const Header = (props) => {
  
  console.log(props)
  console.log(props.adminToken)
  return (
<div ><ul class="nav nav-pills" style={{ textAlign: "center"}}>
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  {props.loggedIn && <li><NavLink activeClassName="active" to="/searchpages">Pages</NavLink></li>}
  {props.loggedIn && <li><NavLink activeClassName="active" to="/myprofile">My Profile</NavLink></li> }
  {props.loggedIn && props.adminToken &&  <li><NavLink activeClassName="active" to="/admin">Admin</NavLink></li>}
  {props.loggedIn && <li><NavLink activeClassName="active" style={{color: "red"}} to="/" onClick={props.logout}>Logout</NavLink></li>}
</ul>
<hr />
</div>
  );
}

const Action = (props) => {
  
  let dat;
  localStorage.setItem('type', "GET")
   facade.fetchFromServer(url + props.middleId + props.id).then(data=>{
    dat = data;
  })
  return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
}

function Home(props) {

  return (
    <div style={{ textAlign: "center"}}>
      <br></br>
      {!props.loggedIn ? <div><LogIn login = {props.login}/> <br/><br/><br/><br/>{props.errorMessage}</div> : <div>{props.data}</div>}
    </div>
  );
}

function Pages(props) {

  return (
      <div></div>
  );
}

function MyProfile(props) {

  return (
    <div></div>
  );
}
function Admin(props) {
  
  return(
    <div><h1>ADMIN PAGE</h1></div>
  )
  }
 

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [adminToken, setAdminToken] = useState(false)
  const logout = () => {  
    facade.logout()
    setLoggedIn(false)
    setAdminToken(false)
    sessionStorage.clear();
 } 
  const login = (user, pass) => { 
    if(user == "admin") {
      setAdminToken(true)
      console.log(adminToken)
    }
    facade.login(user,pass)
    .then(res => {
      setLoggedIn(true)
    })
    .catch((error) => {
      error.fullError.then((err) => {
        setErrorMessage(err.message)
      })
    })

    

  }

  

    return (
        <div style={{ textAlign: "center"}} class="wrapper fadeInDown">      
        <br>
        </br>
        <br></br>
          <Router>
          <LoggedIn logout={logout} login={login} loggedIn = {loggedIn} errorMessage = {errorMessage} adminToken = {adminToken}/>
          </Router><br></br>
        </div>
     
    );
 
}
export default App;
