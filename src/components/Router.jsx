import React, {useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Auth from './Auth';
import Tasks from './Tasks';

function Router() {
    const [ loggedIn, setLoggedIn ] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        // console.log('in here')
        let user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
        if(!user){
            // console.log('in here')
            navigate("/")
        }
        else{
            navigate("/tasks")
        }

        // window.location.reload()
        setLoggedIn(user?.isLoggedIn)
    }, [])
    return (
        <Routes>
            {/* {
                loggedIn ? (
                    <Route path="/tasks" element={<Tasks/>}/>
                ) : (
                    <Route path="/" element={<Auth/>}/>
                )
            } */}
            <Route path="/tasks" element={<Tasks/>}/>
            <Route path="/" element={<Auth/>}/>
        </Routes>
    )
}

export default Router
