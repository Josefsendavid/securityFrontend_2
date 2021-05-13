const URL = "http://localhost:8080/eksamen";
 
function handleHttpErrors(res) {
 if (!res.ok) {
   return Promise.reject({ status: res.status, fullError: res.json() })
 }
 console.log(res)
 return res.json();
}
 
function apiFacade() {
 /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/

const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
  }
const getToken = () => {
  return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
  const loggedIn = getToken() != null;
  return loggedIn;
}
const logout = () => {
  localStorage.removeItem("jwtToken");
} 

const login = (user, password) => {
  const options = makeOptions("POST", true, {
    username: user,
    password: password,
  });
  return fetch(URL + "/api/login", options)
    .then(handleHttpErrors)
    .then((res) => {
      setToken(res.token);
    });
};

const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
}

const fetchFromServer = (props) => {
    let type = localStorage.getItem('type')
    const options = makeOptions(type, true);
    return fetch(props, options).then(handleHttpErrors);
}

const sendToServer = (props) => {
  let type = localStorage.getItem('type')
  let body = JSON.parse(localStorage.getItem('body'))
  
  const options = makeOptions(type, true, body);
  return fetch(props, options).then(handleHttpErrors);
}

const signup = (user, password) => {
  const options = makeOptions("POST", true, {
    userName: user,
    userPass: password,
  });
  return fetch(URL + "/api/info/createuser/", options)
  .then(handleHttpErrors)
  .then((res) => {
    setToken(res.token);
  });
    
};

const makeOptions= (method,addToken,body) =>{
  
   var opts = {
     method: method,
     headers: {
       "Content-type": "application/json",
       'Accept': 'application/json',
     }
   }
   if (addToken && loggedIn()) {
     opts.headers["x-access-token"] = getToken();
   }
   
   if (body) {
     opts.body = JSON.stringify(body);
   }
   return opts;
 }
 return {
     makeOptions,
     setToken,
     getToken,
     loggedIn,
     login,
     logout,
     fetchData,
     sendToServer,
     fetchFromServer,
     signup

 }
}

const facade = apiFacade();
export default facade;
