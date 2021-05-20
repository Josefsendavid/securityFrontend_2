import React, { useState,useEffect } from "react";
import facade from "./apiFacade";
import './other.css'

function AdminFacade() {

    const DeleteUser = () => {
        const [user, setUser] = useState(null);
        const [writeValue, setWriteValue] = useState();
        const [errorMessage, setErrorMessage] = useState();
        function handleClick(e) {
            setWriteValue(e)
            setUser(null)
            facade.fetchDeleteUser(writeValue)
                .then(data => {
                    console.log(data)
                    setUser(data.userName)
                    
                      }).catch((error) => {
                          error.fullError.then((err) => {
                              setErrorMessage(err.message)
                          })
                      }) 
            }
                
                    if (user !== null) {
                    return (
                        <div>
                            <input type="text" id="myInput" placeholder="Insert name of user" value={writeValue} onChange={(event) => setWriteValue(event.target.value)} />
                            <button class="btn btn-default" onClick={() => handleClick(writeValue)}>Delete User</button>
                            <ul>
                                <h4>User with name: "{user}" was deleted </h4>
                            </ul>
                        </div>
                        
                    
                    )
                    } else if (user == null) {
                    return <div>
                        <input type="text" id="myInput" placeholder="Insert name of user" value={writeValue} onChange={(event) => setWriteValue(event.target.value)} />
                        <button class="btn btn-default"  onClick={() => handleClick(writeValue)}>Delete User</button>
                        <p>Can't find user in system</p>
                    </div>
                    }
                
            }

            return {
                DeleteUser
            }



}

let adminFacade = AdminFacade();

    export default adminFacade;