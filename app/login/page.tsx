'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin h-8 w-8 text-gray-500" /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  // Show NextAuth error from querystring (e.g. ?error=Configuration)
  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setError(err);
      toast.error(err);
    }
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success('Login successful!');

        // Poll for session (role may not be immediately available). Wait up to 3s.
        const start = Date.now();
        let session = await getSession();
        while ((!session || !session.user?.role) && Date.now() - start < 3000) {
          await new Promise((r) => setTimeout(r, 200));
          session = await getSession();
        }

        // Default redirect
        let redirectUrl = callbackUrl || '/'

        // If role is admin, prefer admin dashboard
        if (session?.user?.role === 'admin') {
          redirectUrl = '/admin'
        }

        // Navigate and refresh so server/client session state updates across UI
        await router.push(redirectUrl)
        try {
          router.refresh()
        } catch (e) {
          /* ignore */
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section (removed Ringomode branding) */}
        <div className="flex justify-center" />

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardDescription className="text-base">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@ringomode.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-10"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              {/* Google Sign-In Button (only show when Google OAuth is configured) */}
              <Button
                type="button"
                onClick={() => signIn('google', { callbackUrl })}
                disabled={isLoading}
                variant="outline"
                className="w-full h-10 border-2 hover:bg-slate-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
              <h3 className="font-semibold text-sm text-blue-900 mb-3">
                Demo Credentials
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Admin Account:</p>
                  <p className="text-blue-600 font-mono text-xs">
                    Email: admin@ringomode.co.za
                  </p>
                  <p className="text-blue-600 font-mono text-xs">
                    Password: Admin@123
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <p className="text-blue-700 font-medium">User Account:</p>
                  <p className="text-blue-600 font-mono text-xs">
                    Email: user1@ringomode.co.za
                  </p>
                  <p className="text-blue-600 font-mono text-xs">
                    Password: User@123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p className="mt-1">Secure access only • Password protected</p>
        </div>
      </div>
    </div>
  )
}
