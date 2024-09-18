import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})
async function getAllSpent(){
  const res = await api.expenses.$get()
  if (!res.ok){
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

function Expenses() {
  // Queries
  
  const {isPending, error, data}= useQuery({ queryKey: ['get-all-expenses'], queryFn: getAllSpent })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occured: ' + error.message

  
  return <div className="p-2">
     <Table>
      <TableCaption>A list of your recent Expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
  {isPending 
    ? Array(3).fill(0).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="font-medium"><Skeleton className="h-4 " /></TableCell>
          <TableCell><Skeleton className="h-4 " /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 " /></TableCell>
        </TableRow>
      ))
    : data?.expenses.map((expense) => (
        <TableRow key={expense.id}>
          <TableCell className="font-medium">{expense.id}</TableCell>
          <TableCell>{expense.title}</TableCell>
          <TableCell className="text-right">{expense.amount}</TableCell>
        </TableRow>
      ))
  }
</TableBody>
    </Table>
    </div>
}




