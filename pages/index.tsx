import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Date from '../components/date';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

import { getSortedPostsData } from '../lib/posts';
import { type } from 'node:os';
import useSWR from 'swr'

// export const getServerSideProps: GetServerSideProps = async() => {
//   const allPostsData = await getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     },
//   };
// }

// type Props = {
//   allPostsData: {
//     id: string,
//     title: string,
//     date: string,
//   }[]
// };

const fetcher = (url: string) => fetch(url)
  .then(res => res.json());

export default function Home() {
  const { data, error } = useSWR(
    'api/getSortedPostsData',
    fetcher
  );

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  console.log(data.allPostsDataSort);
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog test#1</h2>
        <ul className={utilStyles.list}>
          {data.allPostsDataSort.map(({ id, date, title }: {id: string, date: string, title: string}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}