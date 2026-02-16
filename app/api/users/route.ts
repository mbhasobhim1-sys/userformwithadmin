import { auth } from '@/auth'
import { getAllUsers } from '@/lib/users-db'

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden - admin access required' }), { status: 403 })
  }

  const users = getAllUsers()
  return new Response(JSON.stringify(users), { status: 200 })
}
