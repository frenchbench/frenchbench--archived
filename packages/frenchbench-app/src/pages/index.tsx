import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPageList } from '../pageContent';
import DateTag from '../components/DateTag';
import { AppBar } from '../components/AppBar';
import en from '../i18n/en';

export default function Home({ allPageData }) {
  return (
    <Layout home>
      <Head>
        <title>{en.app_title}</title>
      </Head>

      <main>
        <AppBar title={en.app_title} />
      </main>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPageData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/page/[id]" as={`/page/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <DateTag dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPageData = getSortedPageList()
  return {
    props: {
      allPageData
    }
  }
}
