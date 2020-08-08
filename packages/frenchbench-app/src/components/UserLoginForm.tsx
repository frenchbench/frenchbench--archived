import React from 'react';
import Link from 'next/link';

export function UserLoginForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Username</span>
        <input type="text" name="username" required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" required />
      </label>
      <div className="submit">
        <button type="submit">Login</button>
        <Link href="/auth/frenchbench/register">
          <a>I don't have an account</a>
        </Link>
      </div>
    </form>
  )
}
