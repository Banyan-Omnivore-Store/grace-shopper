import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import 'semantic-ui-css/semantic.min.css'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
