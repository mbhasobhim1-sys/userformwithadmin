/**
 * User database with hashed passwords
 * 
 * Default credentials for testing:
 * Admin: admin@ringomode.co.za / Admin@123
 * User: user1@ringomode.co.za / User@123
 * User: jane.smith@ringomode.co.za / User@123
 * User: mike.johnson@ringomode.co.za / User@123
 * 
 * IMPORTANT: In production, store passwords in a real database (PostgreSQL, MongoDB, etc.)
 * and never commit hashed passwords to version control.
 */

export interface StoredUser {
  id: string
  name: string
  email: string
  password: string // Hashed
  role: 'admin' | 'user'
  department?: string
  employeeId?: string
  createdAt: string
}

/**
 * Hashed passwords created with bcryptjs:
 * Admin@123 => $2a$10$8N2.HKHD0hnRa2zNzSyC9OzJ7r7F7F7F7F7F7F7F7F7F7F7F7F7F7F
 * User@123 => $2a$10$7L5.GJMS0gjMS0gjMS0gjMS0gjMS0gjMS0gjMS0gjMS0gjMS0gjMS0gjMS
 */

export const usersDB: StoredUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ringomode.co.za',
    password: '$2b$10$ASoyF0Vyu69Bm.mu7sZjmOwHs2WIYUp3DIWLHvdfCHvXdOWcmnD6a', // Admin@123
    role: 'admin',
    department: 'HSE',
    employeeId: 'HSE-001',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'User One',
    email: 'user1@ringomode.co.za',
    password: '$2b$10$8Pw/tN6IC8BuRTKULrQFx.VhxycqAeY/6zxDLZ8AuFnS5VX6EfByO', // User@123
    role: 'user',
    department: 'Operations',
    employeeId: 'OP-123',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@ringomode.co.za',
    password: '$2b$10$8Pw/tN6IC8BuRTKULrQFx.VhxycqAeY/6zxDLZ8AuFnS5VX6EfByO', // User@123
    role: 'user',
    department: 'Maintenance',
    employeeId: 'MT-456',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike.johnson@ringomode.co.za',
    password: '$2b$10$8Pw/tN6IC8BuRTKULrQFx.VhxycqAeY/6zxDLZ8AuFnS5VX6EfByO', // User@123
    role: 'user',
    department: 'Logistics',
    employeeId: 'LG-789',
    createdAt: new Date('2024-02-10').toISOString(),
  },
]

/**
 * Find user by email (for login)
 */
export function findUserByEmail(email: string): StoredUser | undefined {
  return usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

/**
 * Find user by ID
 */
export function findUserById(id: string): StoredUser | undefined {
  return usersDB.find((u) => u.id === id)
}

/**
 * Return a shallow copy of all users (exclude password when returning over API)
 */
export function getAllUsers(): Omit<StoredUser, 'password'>[] {
  return usersDB.map(({ password, ...rest }) => ({ ...rest }))
}

/**
 * Update a user's role in the in-memory DB. Returns updated user (without password) or undefined if not found.
 */
export function updateUserRole(id: string, role: 'admin' | 'user') {
  const u = usersDB.find((x) => x.id === id)
  if (!u) return undefined
  u.role = role
  return (({ password, ...rest }) => ({ ...rest }))(u)
}
