import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ShieldCheck, UserCheck, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, Field, inputClass, PageHeader, StatCard, Table } from '../../../components/business/DashboardUI'
import { Button } from '../../../components/shared/Button'
import { Modal } from '../../../components/shared/Modal'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { useBusiness } from '../../../context/BusinessContext'
import { useToast } from '../../../context/ToastContext'
import { ROLE_PERMISSIONS, STAFF_ROLES } from '../../../data/staff'
import type { StaffMember } from '../../../data/types'
import { useRouteIntent } from '../../../lib/useRouteIntent'
import { cn, initials } from '../../../lib/utils'

function AddStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addStaff } = useBusiness()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<StaffMember['role']>('Sales')
  const valid = name.trim() && /\S+@\S+\.\S+/.test(email)

  const submit = () => {
    addStaff({ name: name.trim(), email: email.trim(), role, status: 'Invited' })
    toast({ title: 'Invitation sent', description: `${name.trim()} was invited as ${role}.` })
    setName('')
    setEmail('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add staff member"
      description="They'll receive an email invitation to join your store."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit} icon={<Mail className="size-4" />}>
            Send invite
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Maya Haddad" autoFocus />
        </Field>
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="maya@example.com" type="email" />
        </Field>
        <Field label="Role">
          <div className="grid grid-cols-2 gap-2">
            {STAFF_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-left transition-colors',
                  role === r ? 'border-gold bg-gold/8' : 'border-line hover:border-line-strong',
                )}
              >
                <div className={cn('text-[13px] font-semibold', role === r ? 'text-gold' : 'text-fg')}>{r}</div>
                <div className="text-[11px] text-muted">{ROLE_PERMISSIONS[r]}</div>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

export function StaffPage() {
  const intent = useRouteIntent<{ add: boolean }>()
  const { staff } = useBusiness()
  const [adding, setAdding] = useState(!!intent.add)

  useEffect(() => {
    if (intent.add) setAdding(true)
  }, [intent])

  return (
    <>
      <PageHeader
        title="Staff Management"
        description="Invite your team and control what each person can access."
        actions={
          <Button icon={<UserPlus className="size-4" />} onClick={() => setAdding(true)}>
            Add staff
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Team members" value={staff.length} icon={<Users className="size-4" />} hint="including owner" />
        <StatCard label="Active" value={staff.filter((s) => s.status === 'Active').length} icon={<UserCheck className="size-4" />} hint="signed in this week" delay={0.05} />
        <StatCard label="Pending invites" value={staff.filter((s) => s.status === 'Invited').length} icon={<Mail className="size-4" />} hint="awaiting acceptance" delay={0.1} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden" delay={0.1}>
          <Table
            head={
              <>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last active</th>
              </>
            }
          >
            <AnimatePresence initial={false}>
              {staff.map((m) => (
                <motion.tr key={m.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hover:bg-surface-2/50">
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full text-xs font-bold text-ink" style={{ background: m.color }}>
                        {initials(m.name)}
                      </span>
                      <div>
                        <div className="font-semibold text-fg">{m.name}</div>
                        <div className="text-xs text-muted">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold',
                        m.role === 'Owner' ? 'bg-gold/15 text-gold' : 'bg-surface-3 text-fg',
                      )}
                    >
                      {m.role === 'Owner' && <ShieldCheck className="size-3.5" />}
                      {m.role}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="text-muted">{m.lastActive}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </Table>
        </Card>

        <Card className="h-fit p-5" delay={0.15}>
          <h2 className="text-[15px] font-semibold text-fg">Roles & permissions</h2>
          <ul className="mt-4 space-y-3">
            {(Object.keys(ROLE_PERMISSIONS) as StaffMember['role'][]).map((r) => (
              <li key={r} className="rounded-2xl border border-line p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-fg">{r}</span>
                  <span className="text-xs text-dim">{staff.filter((s) => s.role === r).length} people</span>
                </div>
                <div className="mt-1 text-xs text-muted">{ROLE_PERMISSIONS[r]}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AddStaffModal open={adding} onClose={() => setAdding(false)} />
    </>
  )
}
