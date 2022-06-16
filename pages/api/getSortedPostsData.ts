import { NextApiRequest, NextApiResponse } from 'next';
const base64 = require('js-base64').Base64;
import matter from 'gray-matter';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const repoUrl = "https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts";
    type FetchFiles = () => Promise<[] | null>;
    const fetchFiles: FetchFiles = async () => {
        const response = await fetch(repoUrl)
            // fetch成功ならそのまま返す
            .then((response) => response)
            .catch((error) => {
                return null
            });
        // responseがnull
        if (!response) {
            return null
        };
        const files = await response.json()
            .then((files: []) => files)
            .catch((error) => {
                return null
            });
        // レスポンスBodyの読み取りに失敗(filesがnull)
        if (!files) {
            return null
        }
        return files
    }
    fetchFiles().then(async (files: [] | null) => {
        if (files) {
            try {
                const fileNames = files.map((file: { name: string; }) => file.name);
                const allPostsData = await Promise.all(fileNames.map(async (fileName: string) => {
                    const id = fileName.replace(/\.md$/, '');
                    const repoUrl = `https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts/${id}.md`;
                    const response = await fetch(repoUrl)
                    const file = await response.json()
                    const fileContents = base64.decode(file.content);

                    // Use gray-matter to parse the post metadata section
                    const matterResult = matter(fileContents);

                    // Combine the data with the id
                    return {
                        id,
                        ...(matterResult.data as {
                            date: string,
                            title: string,
                        })
                    };
                }));
                // Sort posts by date
                allPostsData.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1
                    } else {
                        return -1
                    }
                });
                res.status(200).json(allPostsData);
            } catch (error) {
                console.log('error')
                res.status(200).json('error')
            }
        }
    })
}