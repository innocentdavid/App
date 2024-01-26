import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero';

import './index.css'
import Dropdown from './components/Dropdown';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <Hero/>
   
    </>
  )
}

export default App
