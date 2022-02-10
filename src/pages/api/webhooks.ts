import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from 'stream'

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const buf = await buffer(req)

    res.status(200).json({ ok: true })
}