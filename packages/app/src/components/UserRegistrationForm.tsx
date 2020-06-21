import React from 'react';
import Link from 'next/link';

export function UserRegistrationForm({ onSubmit }) {
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
      <label>
        <span>Repeat password</span>
        <input type="password" name="confirm_password" required />
      </label>
      { /*
      <label>
        <span>Name</span>
        <input type="text" name="name" required />
      </label>
      */ }
      <div className="submit">
        <button type="submit">Sign up</button>
        <Link href="/auth/frenchbench/login">
          <a>I already have an account</a>
        </Link>
      </div>
    </form>
  )
}
