import Head from 'next/head';
import { AppBar } from '../components/AppBar';
import en from '../i18n/en';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>FrenchBench App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AppBar title={en.app_title} />
      </main>

    </div>
  )
}
