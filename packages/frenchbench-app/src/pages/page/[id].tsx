import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Date from '../../components/DateTag';
import { getAllPageIds, getPageData } from '../../pageContent';
import utilStyles from '../../styles/utils.module.css';

export default function PageById({ pageData }) {
  const { date, title, contentHtml } = pageData;
  return (
    <Layout home={false}>
      <Head>
        <title>{title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllPageIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const pageData = await getPageData(params.id)
  return {
    props: {
      pageData
    }
  }
}
