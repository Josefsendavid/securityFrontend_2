import React, { useState, useEffect, useRef } from "react"
import { useForm, useFormMeta, Form } from 'react-hooks-form';
import facade from "./apiFacade";
import adminFacade from "./adminFacade";
import EdiText from 'react-editext'
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
  useLocation,
  Redirect
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute'
import ReCAPTCHA from 'react-google-recaptcha';
import { render } from "@testing-library/react";
import history from './history';
require("dotenv").config();

const url = "http://localhost:8080/eksamen/api/"
//const url = "https://www.josefsendavid.dk/sem4eksamen/api/"

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
    //login(loginCredentials.username, loginCredentials.password);

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptcha_secret}&token=${token}`, {
      method: "post",
      token,
      mode: 'no-cors'
    }).then(resp => {
      //alert("Login success")
      login(loginCredentials.username, loginCredentials.password);
    })
      .catch(({ response }) => {
        setError(response);
      }).finally(() => {
        if (reCaptcha.current != null) {
          reCaptcha.current.reset();
        }
        setToken("");
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
          <div class="fadeIn third"><input placeholder="Password" class="form-control" id="password" type="password" /></div>
          <br></br>

          <br></br>
          <div className="form-group">
            <ReCAPTCHA
              ref={reCaptcha}
              sitekey={"6LdnItMaAAAAAOWgXrVnVFJR7tBl3qtKUBj8qY9Y"}
              render="explicit"
              style={{ transform: "scale(0.65)" }}
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
      <Header refresh={refresh} logout={props.logout} loggedIn={props.loggedIn} adminToken={props.adminToken} />
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
        <ProtectedRoute path="/addPage" component={AddPage} loggedIn={props.loggedIn}>
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
      {!props.loggedIn ? <div><LogIn login={props.login} signup={props.signup} captcha={props.onChangeCaptcha} /> <br /><br /><br /><br />{props.errorMessage}</div> 
      : <div>{props.data}
      </div>}
    </div>
  );
}

const Pages = (props) => {
  const [data, setData] = useState();

  useEffect(() => {
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + "page/pages").then(data => {
      setData(data)
    })
  }, []);

  return (
    <>
      <Link to="/addPage" class="btn btn-outline-info"  >Add a new page</Link><br /><br />
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
  const [data, setData] = useState();
  const [editPage, setEditPage] = useState(false);
  const [editRights, setEditRights] = useState(false);
  const [page, setPage] = useState("");
  const [adminRights, setAdminRights] = useState("");
  const [writeRights, setWriteRights] = useState("");
  const [deleteRights, setDeleteRights] = useState("");
  const [loggedInAs, setLoggedInAs] = useState("");
  const [userToAdd, setUserToAdd] = useState("");

  useEffect(() => {
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + `page/page/${pageId}`, {}).then(data => {
      setData(data)
      if (data.writeRights) { setWriteRights(data.writeRights.replace(/\s+/g, '').split(',')) }
      if (data.deleteRights) { setDeleteRights(data.deleteRights.replace(/\s+/g, '').split(',')) }
      if (data.adminRights) { setAdminRights(data.adminRights.replace(/\s+/g, '').split(',')) }
      console.log(data.adminRights)
    })
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + "info/loggedInAs").then(data => {
      setLoggedInAs(data)
    })
  }, []);

  function EditPage() {
    setEditPage(true)
    setPage(data)
  }

  function EditRights(){
    setEditRights(true)
  }

  function DeletePage() {
    localStorage.setItem('type', "DELETE")
    facade.sendToServer(url + "page/deletePage/" + pageId)
  }

  const onChange = (evt) => {
    setPage({ ...page, [evt.target.id]: evt.target.value })
  }

  const onRightsChange = (evt) => {
    setUserToAdd(evt.target.value)
  }

  const changePage = (evt) => {
    evt.preventDefault();
    let editedPage = {
      title: page.title,
      text: page.text
    }
    localStorage.setItem('type', "PUT")
    if (editedPage) {
      localStorage.setItem('body', JSON.stringify(editedPage)
      )
    }
    facade.sendToServer(url + "page/editPage/" + pageId)
  }

  const updateWriteRights = (evt) => {{
    evt.preventDefault();
    let userBody = {
      addUser: userToAdd
    }
    console.log(userBody)
    localStorage.setItem('type', "PUT")
    if(userBody){
    localStorage.setItem('body', JSON.stringify(userBody))
    facade.sendToServer(url + "page/editWriteRights/" + pageId)
    }
  }
  }

  const updateDeleteRights = (evt) => {{
    evt.preventDefault();
    let userBody = {
      addUser: userToAdd
    }
    console.log(userBody)
    localStorage.setItem('type', "PUT")
    if(userBody){
    localStorage.setItem('body', JSON.stringify(userBody))
    facade.sendToServer(url + "page/editDeleteRights/" + pageId)
    }
  }
  }

  return (
    <>
      {data ? (
        <>
          <h2>{data.title}</h2><br />
          {data.text}<br /><br />
          <br /><Link to="/searchpages">Return</Link><br /><br />

         

          {deleteRights.includes(loggedInAs) || adminRights.includes(loggedInAs) || data.mainAuthor == loggedInAs ? <div>
            <button class="btn btn-outline-info" onClick={() => DeletePage()}>Delete page</button></div>
            : <div></div>}

          {writeRights.includes(loggedInAs) || adminRights.includes(loggedInAs) || data.mainAuthor == loggedInAs ? <div>
            <button class="btn btn-outline-info" onClick={() => EditPage()}>Edit page</button><br /><br />
            {editPage ?

              <div>
                <form onChange={onChange} >
                  <label><input value={page.title} class="form-control" id="title" /></label><br />
                  <label><input value={page.text} class="form-control" id="text" /></label><br /><br />

                  <div >
                    <a href="#"><div ><button class="btn btn-outline-info" onClick={changePage}>Confirm changes</button></div></a>
                  </div>
                </form>
              </div>
              : <div></div>
              //VIS INGENTING
            }   </div>
            : <div></div>}

            {adminRights.includes(loggedInAs) || data.mainAuthor == loggedInAs ? <div>
            <button class="btn btn-outline-info" onClick={() => EditRights()}>Edit rights</button><br /><br />
            {editRights ?

              <div>
                <form onChange={onRightsChange} >
                  <label><input value={userToAdd.userToAdd} class="form-control" id="title" /></label><br />

                  <div >
                    <a href="#"><div ><button class="btn btn-outline-info" onClick={updateWriteRights}>Add write permissions</button></div></a>
                  </div>
                </form>

                <form onChange={onRightsChange} >
                  <label><input value={userToAdd.userToAdd} class="form-control" id="title" /></label><br />

                  <div >
                    <a href="#"><div ><button class="btn btn-outline-info" onClick={updateDeleteRights}>Add delete permissions</button></div></a>
                  </div>
                </form>

              </div>

              : <div></div>
            }   </div>
            : <div></div>}
            


        </>
      ) : <div></div>}
    </>

  );
};


function AddPage(props) {
  return (
    <div>
      <PageCreator />
    </div>

  )
}

function PageCreator() {
  const init = { title: "", text: "" };
  const [pageToAdd, setPageToAdd] = useState(init);
  const [mainAuthor, setMainAuthor] = useState("");
  var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?"
   
  useEffect(() => {
    localStorage.setItem('type', "GET")
    facade.fetchFromServer(url + "info/loggedInAs").then(data => {
      setMainAuthor(data)
    })
  }, []);

  const addPage = (evt) => {
    evt.preventDefault();

    for (var i = 0; i < pageToAdd.title.length; i++) {
      if (iChars.indexOf(pageToAdd.title.charAt(i)) != -1) {
        alert("No special signs")
        return;
      }
    }

    let page = {
      title: pageToAdd.title,
      text: pageToAdd.text,
      mainAuthor: mainAuthor
    } 
    localStorage.setItem('type', "POST")
    if (page) {
      localStorage.setItem('body', JSON.stringify(page)
      )
    }
    facade.sendToServer(url + "page/insertPage")
  }

  const onChange = (evt) => {
    setPageToAdd({ ...pageToAdd, [evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <div >
        <h3>Add page</h3>

        <form onChange={onChange} >
          <label><input placeholder="Title" class="form-control" id="title" /></label><br />
          <label><input placeholder="Text" class="form-control" id="text" /></label><br /><br />

          <div >
            <a href="#"><div ><button class="btn btn-default" onClick={addPage}>Add Page</button></div></a>
          </div>
        </form>
      </div></div>
  )
}

function MyProfile(props) {
  return (
    <div></div>
  );
}
function Admin(props) {
  let adminData = adminFacade.DeleteUser();
  return (
    <div>{adminData}</div>
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

const refresh = () => {
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    localStorage.clear();
  }
}
refresh()


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

  return (
    <div style={{ textAlign: "center" }} class="wrapper fadeInDown">
      <br>
      </br>
      <br></br>
      <Router history={history}>
        <LoggedIn logout={logout} login={login} signup={signup} loggedIn={loggedIn} errorMessage={errorMessage} adminToken={adminToken} />
      </Router><br></br>
    </div>

  );

}

export default App;
