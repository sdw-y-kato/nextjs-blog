import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const repoUrl = "https://api.github.com/repos/sdw-y-kato/nextjs-blog/contents/posts";
    const response = await fetch(repoUrl);
    const files = await response.json();
    const fileNames = files.map((file: { name: any; }) => file.name);
    const fileName = fileNames.map((fileName: string) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
    
    res.status(200).json({ fileName });
}