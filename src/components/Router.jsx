import React, {useState, useEffect} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Tasks from './Tasks';
import Protected from './Protected'


function Router() {
    return (
        <Routes>
            <Route 
                path="/" 
                element={<Auth/>}
            />
            <Route 
                path="/task-manager" 
                element={
                    <Protected>
                      <Tasks />
                    </Protected>
                  }
            />
            
            
        </Routes>
    )
}

export default Router
