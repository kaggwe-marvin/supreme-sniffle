import { useState, useEffect } from 'react' 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(()=>{
  async function fetchTotal() {
  const res = await fetch("/api/expenses/total-spent")
  const data = await res.json()
  setTotalSpent(data.total)
  }
  fetchTotal()
  }, [])

  return (
    <>
      <Card className='w-[350px] m-auto'>
        <CardHeader>
        <CardTitle>Total Spent</CardTitle>
         <CardDescription>The total amount you've spent</CardDescription>
         <CardContent>{totalSpent}</CardContent>
         </CardHeader>

      </Card>
    </>
  )
}

export default App
