import React from 'react'
import { RouterProvider } from 'react-router-dom'
import route from './routes/Routes'
import "./App.css"
const App = () => {
  return (
   
        
        <RouterProvider router={route}></RouterProvider>
   
  )
}

export default App