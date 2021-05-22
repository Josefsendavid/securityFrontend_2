import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import facade from './apiFacade'

function ProtectedRoute({loggedIn: loggedIn, component: Component, ...rest}) { //Variabel der fortæller om en bruger authenticated eller ej + det component vi vil have vist
   //...rest er ligesom bare den path, som man prøver at tilgå, eftersom man ikke giver den en specifik path med i componenten
    return (
        <Route {...rest} render={(props)=> {
            if (loggedIn && !facade.validateToken()) {
                return <Component />
            } else {
               return <Redirect to={{pathname: '/', state: {from: props.location}}}/> //state finder bare den lokation, som vi vil redirecte fra - pathname fortæller at vi vil redirecte til home page hvis man ikke er logget ind
            }
        }} />
    )
}


export default ProtectedRoute