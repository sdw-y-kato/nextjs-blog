import { NextApiRequest, NextApiResponse } from 'next';
const base64 = require('js-base64').Base64;
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';


export default async function getSortedPostsData(req: NextApiRequest, res: NextApiResponse) {
    const repoUrl = "https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts?&client_id=cf25e6a086d39c4eed8f&client_secret=59566d3ac3f94873f4debd9b7880be0fe176263a/";
    const response = await fetch(repoUrl);
    const files = await response.json();
    const fileNames = files.map((file: { name: any; }) => file.name);
    const allPostsData = await Promise.all(fileNames.map(async (fileName: string) => {
        const id = fileName.replace(/\.md$/, '');

        const repoUrl = `https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts/${id}.md?&client_id=cf25e6a086d39c4eed8f&client_secret=59566d3ac3f94873f4debd9b7880be0fe176263a/`;
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

        // Combine the data with the id
        return {
            id,
            contentHtml,
            ...matterResult.data
        };
    }));

    res.status(200).json({ allPostsData });
}