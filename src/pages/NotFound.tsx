import { Compass } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../components/shared/Button'
import { EmptyState } from '../components/shared/EmptyState'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="grid flex-1 place-items-center">
      <EmptyState
        icon={<Compass className="size-7" />}
        title="This page isn't part of the demo"
        description="Head back to the customer app or the business dashboard."
        action={<Button onClick={() => navigate('/customer/home')}>Back to Brandora</Button>}
      />
    </div>
  )
}
