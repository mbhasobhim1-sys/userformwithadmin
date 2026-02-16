import { auth } from '@/auth'
import { updateUserRole, findUserById } from '@/lib/users-db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden - admin access required' }), { status: 403 })
  }

  const id = params.id
  const body = await req.json().catch(() => ({}))
  const role = body?.role
  if (!id || (role !== 'admin' && role !== 'user')) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
  }

  // Prevent self-demotion (safety)
  if (session.user.id === id && role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Cannot remove your own admin role' }), { status: 400 })
  }

  const target = findUserById(id)
  if (!target) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }

  const updated = updateUserRole(id, role)
  return new Response(JSON.stringify(updated), { status: 200 })
}
