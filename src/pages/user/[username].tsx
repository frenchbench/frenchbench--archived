import React from 'react';

import { newApi } from '../../server/api';

const api = newApi(process.env);


export default function User(props) {
  console.log('User', props);
  const { userData } = props;
  const { id, username, email, created_at } = userData;
  return (
    <div>
      <div>{id}</div>
      <div>{username}</div>
      <div>{email}</div>
      <div>{created_at}</div>
    </div>
  )
}

export async function getStaticPaths() {
  const users = await api.userList({ limit: 0 });
  const paths = users.data.map(({ id, username }) => ({ params: { userId: id, username }}))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const userData = await api.userRetrieveByUsername(params.username);
  return {
    props: {
      userData
    }
  }
}
