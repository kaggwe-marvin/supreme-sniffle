import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ReloadIcon } from "@radix-ui/react-icons"
import { api } from '@/lib/api'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpenses
})
 function CreateExpenses(){

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {

      await new Promise(r => setTimeout(r, 3000))
      // Do something with form data
      const res = await api.expenses.$post({json: value})
      if (!res.ok){
        throw new Error("Server Error")
      }
      navigate({to: '/expenses'})
    },
  })

  return <div className="p-2">
    <h1>create Expense!</h1>
    <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className='max-w-xl m-auto'
        >
          
          <form.Field
              name="title"
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label htmlFor={field.name}>Title:</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                     {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
                  </>
                )
              }}
            /> 
            <form.Field
              name="amount"
             
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label htmlFor={field.name}>Amount:</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type='number'
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                     {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
                  </>
                )
              }}
            /> 
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className='mt-4'>
                {isSubmitting ? 
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
    : 'Submit'}
              </Button>
            )}
          />
      </form>
    
    </div>
}
