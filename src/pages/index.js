import Head from 'next/head';
import { AppBar } from '../app/components/AppBar';
import en from '../app/i18n/en';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>FrenchBench App</title>
      </Head>

      <main>
        <AppBar title={en.app_title} />
      </main>

    </div>
  )
}
