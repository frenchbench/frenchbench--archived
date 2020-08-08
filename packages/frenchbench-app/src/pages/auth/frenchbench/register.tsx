import { useState, useEffect } from 'react';
import Router from 'next/router';
import { useUser } from '@app/lib/hooks';
import { UserRegistrationForm } from '@app/components/UserRegistrationForm';
import { newApiClient } from '@app/lib/apiClient';

export default function RegisterPage() {
  const [user, { mutate }] = useUser();
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(evt) {
    evt.preventDefault()

    const userData = {
      username: evt.currentTarget.username.value,
      password: evt.currentTarget.password.value,
      confirm_password: evt.currentTarget.confirm_password.value,
      //name: evt.currentTarget.name.value,
    }

    if (userData.password !== evt.currentTarget.confirm_password.value) {
      setErrorMsg(`The passwords don't match`)
      return
    }
    const api = newApiClient();
    const res = await api.register(userData);
    const userObj = res.data;
    if (userObj.id) {
      // set user to useSWR state
      mutate(userObj);
    } else {
      setErrorMsg('error');
    }
  }

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push('/')
  }, [user])

  return (
    <>
      <h1>Registration</h1>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="form-container">
        <UserRegistrationForm onSubmit={onSubmit} />
      </div>
    </>
  )
}
