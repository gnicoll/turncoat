import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Card from './components/card/'
import Test from './components/test/'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Card north={1} south={2} east={3} west={4} />
    </>
  )
}

export default App
