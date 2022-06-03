import Head from 'next/head';
import { type } from 'node:os';
import Date from '../../components/date';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';

type Props = {
    postData: {
        id: string,
        title: string,
        date: string,
        contentHtml: string,
    }
};

export default function Post({ postData }: Props) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let params = Object[0];
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}

