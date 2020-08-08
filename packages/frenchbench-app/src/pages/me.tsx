import React from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { newApiClient } from '../lib/apiClient';

export default function MePage(props) {
  console.log('UserPage', props);
  const router = useRouter();
  const { username } = router.query;
  const { userDetails } = props;
  const { id, created_at } = userDetails;
  return (
    <div>
      <div>My profile page</div>
      <div>{id}</div>
      <div>{username}</div>
      <div>{created_at}</div>
    </div>
  )
}

// SSR: Server-side Rendering
MePage.getInitialProps = async (ctx: NextPageContext) => {
  // pathname - Current route. That is the path of the page in /pages
  // query - Query string section of URL parsed as an object
  // asPath - String of the actual path (including the query) shown in the browser
  // req - HTTP request object (server only)
  // res - HTTP response object (server only)
  // err - Error object if any error is encountered during the rendering
  const { username } = ctx.query;
  const api = newApiClient();
  const response = await api.userDetails({ username });
  const userDetails = response.data;
  return { userDetails };
}
