import React from 'react';
import '../styles/global.css';
//import { newAppConfig } from '../appConfig';

export function reportWebVitals(metric) {
  console.log('reportWebVitals', metric);

  // TODO: analytics
  // const body = JSON.stringify(metric)
  // const url = 'https://example.com/analytics'
  //
  // // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon(url, body)
  // } else {
  //   fetch(url, { body, method: 'POST', keepalive: true })
  // }
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
