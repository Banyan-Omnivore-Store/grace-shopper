import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import './app.css'
import 'semantic-ui-css/semantic.min.css'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
