import useSWR from 'swr';
import { newApiClient } from '@app/lib/apiClient';

export const fetcher = (url) => newApiClient().me().then(res => res.data);

export function useUser() {
  const { data, mutate } = useSWR('/api/me', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}
