import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Tasks from './Tasks';

function Router() {
    // const [ loggedIn, setLoggedIn ] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        async function getUser(){
            let user = await JSON.parse(localStorage.getItem('user')) || await JSON.parse(sessionStorage.getItem('user'))
            if(!user){
                navigate("/", {replace: true})
            }
            else{
                navigate("/task-manager" , {replace: true})
            }

        
            // setLoggedIn(user?.isLoggedIn)
        }
        getUser()
        
    }, [])
    return (
        <Routes>
            <Route path="/task-manager" element={<Tasks/>}/>
            <Route path="/" element={<Auth/>}/>
        </Routes>
    )
}

export default Router
