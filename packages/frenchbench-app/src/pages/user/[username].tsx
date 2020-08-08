import React from 'react';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { newApiClient } from '../../lib/apiClient';

export default function UserPage(props) {
  console.log('UserPage', props);
  const router = useRouter();
  const { username } = router.query;
  const { userDetails } = props;
  const { id, created_at } = userDetails;
  return (
    <div>
      <div>{id}</div>
      <div>{username}</div>
      <div>{created_at}</div>
    </div>
  )
}

// SSR: Server-side Rendering
UserPage.getInitialProps = async (ctx: NextPageContext) => {
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

/*
// SSG: Static Site Generation
// Statically generated pages can be cached by CDN to boost performance
export async function getStaticProps({ params }) {
  const api = newApiClient();
  const { username } = params;
  const response = await api.userDetails({ username });
  const userDetails = response.data;
  return {
    props: {
      userDetails,
    }
  }
}
// provides info for SG
export async function getStaticPaths() {
  const api   = newApiClient();
  const users = await api.userList({ limit: 0 });
  const paths = users.data.map(({ id, username }) => ({ params: { userId: id, username }}))
  return {
    paths,
    fallback: false
  }
}
*/
