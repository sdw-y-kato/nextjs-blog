import { NextApiRequest, NextApiResponse } from 'next';
const base64 = require('js-base64').Base64;
import matter from 'gray-matter';

export default async function getSortedPostsData(req: NextApiRequest, res: NextApiResponse) {
    const repoUrl = "https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts?&client_id=cf25e6a086d39c4eed8f&client_secret=59566d3ac3f94873f4debd9b7880be0fe176263a/";
    const response = await fetch(repoUrl);
    const files = await response.json();
    if (files instanceof Object) {
        const fileNames = files.map((file: { name: any; }) => file.name);

        const allPostsData = await Promise.all(fileNames.map(async (fileName: string) => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            // const fullPath = path.join(postsDirectory, fileName);
            // const fileContents = fs.readFileSync(fullPath, 'utf8');


            const repoUrl = `https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts/${id}.md`;
            const response = await fetch(repoUrl);
            const file = await response.json();
            // if (file instanceof Object) {
                const fileContents = base64.decode(file.content);

                // Use gray-matter to parse the post metadata section
                const matterResult = matter(fileContents);

                // Combine the data with the id
                return {
                    id,
                    ...(matterResult.data as {
                        date: string
                    })
                };
            // }
        }));

        // Sort posts by date
        allPostsData.sort(({ date: a }: any, { date: b }: any) => {
            if (a < b) {
                return 1;
            } else if (a > b) {
                return -1;
            } else {
                return 0;
            }
        });

        res.status(200).json({ allPostsData });
    }
}