import { Hono } from "hono";

type Expense ={
    id: number,
    title: string,
    amount: number,
}

const fakeExpenses: Expense[]=[
    {id:1,title:'Groceries',amount:50},
    {id:2,title:'Utilities',amount:100},
    {id:3,title:'Rent',amount:200},
    {id:4,title:'Phone Bills',amount:30},
    
]

export const expensesRoute =  new Hono()

.get('/', async (c)=>{
    return c.json({ expenses:fakeExpenses});
})
.post('/', async (c)=>{
    const expense = await c.req.json()
    console.log ({expense})
    return c.json(expense);
});

//.delete
//.put