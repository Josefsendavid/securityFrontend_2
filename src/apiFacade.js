//const URL = "http://localhost:8080/eksamen";
const URL = "https://www.josefsendavid.dk/sem4eksamen"
 
function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() })
  }
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
    var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?"
    for (var i = 0; i < user.length; i++) {
      if (iChars.indexOf(user.charAt(i)) != -1) {
        alert("no special signs")
        return;
      }
    }
    for (var j = 0; j < password.length; j++) {
      if (iChars.indexOf(password.charAt(i)) != -1) {
        alert("no special signs")
        return;
      }
    }
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
  const fetchDeleteUser = (user) => {
    const options = makeOptions("DELETE", true);
    return fetch(URL + "/api/info/deleteuser/" + user, options).then(handleHttpErrors);
  }

  const validateToken = () => {
    if (getToken() == null) {
      Promise.reject(console.log("rejected"));
      //history.push('/');
      alert("Session expired. \nRedirecting to login.")
      localStorage.clear();
      window.location.pathname = '/'
    }
  }

  const makeOptions = (method, addToken, body) => {

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
    signup,
    fetchDeleteUser,
    validateToken

  }
}

const facade = apiFacade();
export default facade;
