// app/sign-in/page.tsx
'use client';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
}


