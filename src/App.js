import React, { useState, useEffect, useRef } from "react"
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
  useRouteMatch,
  useLocation
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'
import ReCAPTCHA from 'react-google-recaptcha';
import { render } from "@testing-library/react";
import verify from "./verifyCaptcha";
require("dotenv").config();

const url = "http://localhost:8080/eksamen/api/"


function LogIn({ login, signup, verify }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const reCaptcha = useRef();

  const performLogin = (evt) => {
    evt.preventDefault();
    if (!token) {
      alert("You must verify the captcha.");
      return;
    }

    setError("");
    console.log(token)
    login(loginCredentials.username, loginCredentials.password);

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptcha_secret}&token=${token}`, {
      method: "post",
      token,
    }).then(resp => {
      alert("Login success")
    })
      .catch(({ response }) => {
        setError(response);
      }).finally(() => {
        if(reCaptcha.current != null){
        reCaptcha.current.reset();}
        setToken("");
        console.log(token, "Token reset")
      })
  }

  const performCreate = (evt) => {
    evt.preventDefault();
    signup(loginCredentials.username, loginCredentials.password);
    console.log(loginCredentials)
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
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
          <div className="form-group">
            <ReCAPTCHA
              ref={reCaptcha}
              sitekey={"6LdnItMaAAAAAOWgXrVnVFJR7tBl3qtKUBj8qY9Y"}
              render="explicit"
              style={{transform: "scale(0.65)"}}
              onChange={token => setToken(token)}
              onExpired={e => setToken("")} />
          </div>
          <div id="formFooter">
            <a class="underlineHover" href="#"><div class="fadeIn fourth"><button class="btn btn-default" onClick={performLogin}>Login</button></div></a>
          </div>
          <div id="formFooter">
            <a class="underlineHover" href="#"><div class="fadeIn fourth"><button class="btn btn-default" onClick={performCreate}>Sign up</button></div></a>
          </div>
        </form>

      </div></div>
  )

}
function LoggedIn(props) {
  console.log(props)

  return (
    <div>
      <Header logout={props.logout} loggedIn={props.loggedIn} adminToken={props.adminToken} />
      <Switch>
        <Route exact path="/">
          <Home adminToken={props.adminToken} signup={props.signup} login={props.login} loggedIn={props.loggedIn} errorMessage={props.errorMessage} />
        </Route>
        <ProtectedRoute path="/searchpages" component={Pages} loggedIn={props.loggedIn}>
        </ProtectedRoute>
        <ProtectedRoute path="/myprofile" component={MyProfile} loggedIn={props.loggedIn}>
        </ProtectedRoute>
        <ProtectedRoute path="/admin" component={Admin} loggedIn={props.loggedIn}>
        </ProtectedRoute>
        <Route path="/page/:pageId" component={SpecificPage} />
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}

const Header = (props) => {

  console.log(props)
  return (
    <div ><ul class="nav nav-pills" style={{ textAlign: "center" }}>
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      {props.loggedIn && <li><NavLink activeClassName="active" to="/searchpages">Pages</NavLink></li>}
      {props.loggedIn && <li><NavLink activeClassName="active" to="/myprofile">My Profile</NavLink></li>}
      {props.loggedIn && props.adminToken && <li><NavLink activeClassName="active" to="/admin">Admin</NavLink></li>}
      {props.loggedIn && <li><NavLink activeClassName="active" style={{ color: "red" }} to="/" onClick={props.logout}>Logout</NavLink></li>}
    </ul>
      <hr />
    </div>
  );
}

const Action = (props) => {
  let fetchedData;
  localStorage.setItem('type', "GET")
  facade.fetchFromServer(url + props.middleId + props.id).then(data => {
    fetchedData = data;
  })
  return (<button class="btn btn-outline-info" onClick={() => props.setItem(fetchedData)}>{props.buttonText}</button>)
}

function Home(props) {

  return (
    <div style={{ textAlign: "center" }}>
      <br></br>
      {!props.loggedIn ? <div><LogIn login={props.login} signup={props.signup} captcha={props.onChangeCaptcha} /> <br /><br /><br /><br />{props.errorMessage}</div> : <div>{props.data}</div>}
    </div>
  );
}

// function Pages(props) {
//   const [allPages, setAllPages] = useState(0)
//   return (
   
//      <div><Action id={"pages"} middleId="page/" methodType="GET" buttonText="Show all pages" setItem={(item) => setAllPages(item)} />
//      {allPages.pagesDTO ? <div class="wrapper fadeIn">{allPages.pagesDTO.map((data) =>
//          (<div><b>{data.title}</b><br /> Id: {data.id} <br /></div>))}</div> 
//          : <div></div>}

//    <div className="container center-block vlsection1">
//       <div>
//         {allPages.pagesDTO ? allPages.pagesDTO.map(data => (
//           <div key={data} className="container">
//             <div class="text-center"><Link to={data.title}>{data.title.toString()}</Link></div> 
//           </div> 
//         )): <div></div>}
//       </div>
//     </div></div>
//   );
// }

// function Pages(props){

//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState();

//   function handleClick() {
//       let fetchedData;
//       localStorage.setItem('type', "GET")
//       facade.fetchFromServer(url + "page/pages").then(data => {
//       fetchedData = data;
//       setData(fetchedData)
//   })
//   }

//   return (
//     <>
//     <button class="btn btn-outline-info" onClick={() => handleClick()}>See all pages</button>
//       {data &&
//         data.pagesDTO.map((data, index) => {
//           return <h5 key={index}>{data.title}</h5>;
//         })}
//     </>
//   );
// }

const Pages = () => {
  const [data, setData] = useState();

  useEffect(() => {
    let fetchedData
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + "page/pages").then(data => {
             fetchedData = data;
             setData(fetchedData)
         })
  }, []);

  return (
    <>
       {data ?
        data.pagesDTO.map((page, index) => {
          return (
            <h5 key={index}>
              <Link to={`/page/${page.id}`}>{page.title}</Link>
            </h5>
          );
        }) : <div></div>} 
    </>
  );
};

const SpecificPage = ({ match }) => {
  const {
    params: { pageId },
  } = match;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    let fetchedData
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + `page/page/${pageId}`, {}).then(data => {
             fetchedData = data;
             setData(fetchedData)
         })
  }, []);

  return (
    <>
      {data ? (
        <>
          <h2>{data.title}</h2><br/>
          {data.text}<br/><br/>
          <Link to="/searchpages">Return</Link>
        </>
      ) : <div></div>}
    </>
  );
};


function MyProfile(props) {

  return (
    <div></div>
  );
}
function Admin(props) {

  return (
    <div><h1>ADMIN PAGE</h1></div>
  )
}
const NoMatch = () => {
  let location = useLocation();
  return (
    <div>
      <h3>
        No match for location  <code>{location.pathname}</code>
      </h3>
    </div>
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
    localStorage.clear();
  }
  const login = (user, pass) => {
    if (user == "admin") {
      setAdminToken(true)
    }
    facade.login(user, pass)
      .then(res => {
        setLoggedIn(true)
      })
      .catch((error) => {
        error.fullError.then((err) => {
          setErrorMessage(err.message)
        })
      })
  }
  const signup = (user, pass) => {
    facade.signup(user, pass)
      .then(res => {
        setLoggedIn(false)
        setAdminToken(false)
        setErrorMessage("")
        console.log(user + pass)
      }).catch((error) => {
        error.fullError.then((err) => {
          setErrorMessage(err.message)
        })
      })
  }

  function onChangeCaptcha(value) {
    console.log(value);
  }

  return (
    <div style={{ textAlign: "center" }} class="wrapper fadeInDown">
      <br>
      </br>
      <br></br>
      <Router>
        <LoggedIn logout={logout} login={login} signup={signup} loggedIn={loggedIn} errorMessage={errorMessage} adminToken={adminToken} />
      </Router><br></br>
    </div>

  );

}

export default App;
