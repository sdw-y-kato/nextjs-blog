import Head from 'next/head';
import { type } from 'node:os';
import Date from '../../components/date';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import useSWR from 'swr'
import { useRouter } from 'next/router'

// type Props = {
//     postData: {
//         id: string,
//         title: string,
//         date: string,
//         contentHtml: string,
//     }
// };

function Post() {
    const router = useRouter();

    const fetcher = (url: string) => fetch(url)
        .then(res => res.json());
    const { data, error } = useSWR(
        '/api/getAllPostData',
        fetcher
    );
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    // console.log(data)

    const id = router.query.id;
    const target = data.allPostsData.find((v: any) => v.id === id);
    
    // console.log(target)
    return (
        <Layout>
            <Head>
                <title>{target.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{target.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={target.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: target.contentHtml }} />
            </article>
        </Layout>
    );
}
export default Post;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     let params = Object[0];
//     const postData = await getPostData(params.id);
//     return {
//         props: {
//             postData,
//         },
//     };
// }

