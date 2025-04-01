import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div>
      <h1>Threat Intelligence Dashboard</h1>
      <p>Backend says: {data?.status}</p>
    </div>
  )
}

export default App
