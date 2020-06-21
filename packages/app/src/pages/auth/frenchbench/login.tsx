import { useState, useEffect } from 'react';
import Router from 'next/router';
import { useUser } from '@app/lib/hooks';
import { UserLoginForm } from '@app/components/UserLoginForm';

export default function LoginPage() {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(evt) {
    evt.preventDefault();
    const loginForm = evt.currentTarget;
    const body = {
      username: loginForm.username.value,
      password: loginForm.password.value,
    }
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 200) {
      const userObj = await res.json()
      // set user to useSWR state
      mutate(userObj)
    } else {
      setErrorMsg('Incorrect username or password. Try better!')
    }
  }

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push('/')
  }, [user])

  return (
    <>
      <h1>Login</h1>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="form-container">
        <UserLoginForm onSubmit={onSubmit} />
      </div>
    </>
  )
}
