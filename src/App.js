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
  const [dataFromServer, setDataFromServer] = useState("")
  const [adminToken, setAdminToken] = useState("")

  useEffect(() => { facade.fetchData().then(data=> setDataFromServer(data.msg)
    )
    let tokenTemp = dataFromServer.search("admin")
    setAdminToken(tokenTemp);
    }, [])
 
    return (
      <div>
      <Header logout={props.logout} loggedIn = {props.loggedIn} token={adminToken}/>
      <Switch>
        <Route exact path="/">
          <Home data = {dataFromServer} login = {props.login} loggedIn = {props.loggedIn} errorMessage = {props.errorMessage}/>
        </Route>
        <Route path="/yourdogs" >
          <YourDogs />
        </Route>
        <Route path="/breeds" >
          <Breeds />
        </Route>
        <Route path="/admin" >
          <Admin />
        </Route>
      </Switch>
    </div>
    );
}

const Header = (props) => {
  return (
<div ><ul class="nav nav-pills" style={{ textAlign: "center"}}>
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  {props.loggedIn && <li><NavLink activeClassName="active" to="/yourdogs">Pages</NavLink></li>}
  {/* <li><NavLink activeClassName="active" to="/breeds">Breeds</NavLink></li> */}
  {props.loggedIn && props.adminToken != -1 && <li><NavLink activeClassName="active" to="/admin">Admin</NavLink></li>}
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

function Admin(props) {
  const [searches, setSearches] = useState("")

  if(searches.searches){
  return (<div>
  <Action id={"searches"} middleId="info/" methodType="GET" buttonText ="Get searches" setItem={(item) => setSearches(item)} />
  {searches.searches && <div class="wrapper fadeIn">{searches.searches.map((data ) => (<div>{data.date}, {data.breed}<br/><br/></div>))}</div>} </div>)}
  return (<div><Action id={"searches"} middleId="info/" methodType="GET" buttonText ="Get searches" setItem={(item) => setSearches(item)} /></div>)
  }
 

function Breeds() {
  const [breeds, setBreeds] = useState(0)
  const [specificBreed, setSpecificBreed] = useState({breed: ""})
  const [breedToSearch, setBreedToSearch] = useState("boxer")

  useEffect(() => {
  }, []);

  return(<div>
    
    <input type="text" id="myInput" placeholder="Insert ID" value={breedToSearch} onChange={(event) => setBreedToSearch(event.target.value)} /><br/>
    <Action id={breedToSearch} middleId="info/breedInfo/" buttonText ="Find breed" setItem={(item) => setSpecificBreed(item)} /><br/>

    {specificBreed.breed != "" ? <div>
      
      {specificBreed.breed != "" && <div class="wrapper fadeIn">
      Breed: {specificBreed.breed && specificBreed.breed}<br />
      Wikipedia: {specificBreed.wikipedia && specificBreed.wikipedia}<br/><br/>
      <img src={specificBreed.image}></img><br/>
      {specificBreed.facts && specificBreed.facts}<br/></div>} </div> 
    
    : <div></div>}

    <Action id={"breeds"} middleId="info/" methodType="GET" buttonText ="Show all breeds" setItem={(item) => setBreeds(item)} />
    {breeds.dogs && <div class="wrapper fadeIn">{breeds.dogs.map((data ) => (<div>{data.breed}<br/><br/></div>))}</div>} 
  </div>)
}

class AddDog extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: "", info: "", dateOfBirth: ""};
  
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleInfoChange = this.handleInfoChange.bind(this);
      this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleNameChange(event) {
      this.setState({name: event.target.value});
    }

    handleInfoChange(event) {
      this.setState({info: event.target.value});
    }

    handleDateOfBirthChange(event) {
      this.setState({dateOfBirth: event.target.value});
    }
  
    handleSubmit(event) {
    event.preventDefault()
   
    let dog = {
     name: this.state.name,
     info: this.state.info,
     dateOfBirth: this.state.dateOfBirth
    } 

      localStorage.setItem('type', "POST")
      if(dog){
      localStorage.setItem('body', JSON.stringify(dog)
      )}
      facade.sendToServer("http://localhost:8080/eksamen/api/info/addDog/2")
    }
  
    render() {
      return (
        <div>
         
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:<br/>
            <input type="text" value={this.state.name} onChange={this.handleNameChange} /><br/><br/>
          </label>
          <label>
            Info:<br/>
            <input type="text" value={this.state.info} onChange={this.handleInfoChange} /><br/><br/>
          </label>
          <label>
            DD/MM/YY:<br/>
            <input type="text" value={this.state.dateOfBirth} onChange={this.handleDateOfBirthChange} /><br/><br/>
          </label>
          <br/><input type="submit" value="Add dog" />
        </form></div>
      );
    }
  }

  class EditDog extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: "", info: "", dateOfBirth: "", id: 0};
  
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleInfoChange = this.handleInfoChange.bind(this);
      this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
      this.handleIdChange = this.handleIdChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleNameChange(event) {
      this.setState({name: event.target.value});
    }

    handleInfoChange(event) {
      this.setState({info: event.target.value});
    }

    handleDateOfBirthChange(event) {
      this.setState({dateOfBirth: event.target.value});
    }

    handleIdChange(event) {
      this.setState({id: event.target.value});
    }
  
    handleSubmit(event) {
    event.preventDefault()
   
    let dog = {
     name: this.state.name,
     info: this.state.info,
     dateOfBirth: this.state.dateOfBirth
    } 

      localStorage.setItem('type', "PUT")
      if(dog){
      localStorage.setItem('body', JSON.stringify(dog)
      )}
      facade.sendToServer("http://localhost:8080/eksamen/api/info/editDog/" + this.state.id)
    }
  
    render() {
      return (
        <div>
         
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:<br/>
            <input type="text" value={this.state.name} onChange={this.handleNameChange} /><br/><br/>
          </label>
          <label>
            Info:<br/>
            <input type="text" value={this.state.info} onChange={this.handleInfoChange} /><br/><br/>
          </label>
          <label>
            DD/MM/YY:<br/>
            <input type="text" value={this.state.dateOfBirth} onChange={this.handleDateOfBirthChange} /><br/><br/>
          </label>
          <label>
            Id:<br/>
            <input type="text" value={this.state.id} onChange={this.handleIdChange} /><br/><br/>
          </label>
          <br/><input type="submit" value="Edit dog" />
        </form></div>
      );
    }
  }


function YourDogs(){
  
  const [yourDogs, setYourDogs] = useState(0)
  
  return (<div>
    
    <AddDog />
    <br/>
    <EditDog />
    <Action id={"dogs"} middleId="info/" methodType="GET" buttonText ="Show your dogs" setItem={(item) => setYourDogs(item)} />
    
    {yourDogs.dogsDTO ? <div class="wrapper fadeIn">{yourDogs.dogsDTO.map((data ) => (<div><b>{data.name}</b><br/> Id: {data.id} <br/>Born {data.dateOfBirth} <br/>{data.info}<br/><br/></div>))}</div>
    : <div></div>}

  </div>);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

 
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
 
  const logout = () => {  
    facade.logout()
    setLoggedIn(false)
    localStorage.setItem('jwtToken', "remove")
 } 
  const login = (user, pass) => { 
    facade.login(user,pass)
    .then(res => {
      setLoggedIn(true)
    })
    .catch((error) => {
      error.fullError.then((err) => {
        setErrorMessage(err.message)
      })
    })
    ;} 

    return (
      <ErrorBoundary
        fallbackRender =  {({error, resetErrorBoundary, componentStack}) => (
            <div>
            <h1>An error occurred: {error.message}</h1>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )}
      >
        <div style={{ textAlign: "center"}} class="wrapper fadeInDown">      
        <br>
        </br>
        <br></br>
          <Router>
          <LoggedIn logout={logout} login={login} loggedIn = {loggedIn} errorMessage = {errorMessage}/>
          </Router><br></br>
        </div>
      </ErrorBoundary>
    );
 
}
export default App;
