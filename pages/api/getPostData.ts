import { NextApiRequest, NextApiResponse } from 'next';
const base64 = require('js-base64').Base64;
import html from 'remark-html';
import matter from 'gray-matter';
import { remark } from 'remark';
import { useRouter } from 'next/router';

const ID = () => {
    const router = useRouter()
    const { id } = router.query

    return { id }
}

export default async function getPostData(req: NextApiRequest, res: NextApiResponse) {
    // const router = useRouter();
    // const query = router.query;
    // const id = req.query.id;
    // console.log(id)
    let id = 'ssg-ssr';
    const repoUrl = `https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts/${id}.md??&client_id=cf25e6a086d39c4eed8f&client_secret=59566d3ac3f94873f4debd9b7880be0fe176263a/`;
    const response = await fetch(repoUrl);
    const file = await response.json();
    const fileContents = base64.decode(file.content);

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // // Combine the data with the id
    // return {
    //     id,
    //     contentHtml,
    //     ...matterResult.data
    // };

    res.status(200).json({ id, contentHtml, ...matterResult.data });
}