import type { NextApiRequest, NextApiResponse } from 'next';

// Secret token for on-demand revalidation
// Set this in your Vercel environment variables
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

interface RevalidateRequest {
    secret?: string;
    paths?: string[];
    type?: 'venue' | 'list' | 'all';
    slug?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { secret, paths, type, slug } = req.body as RevalidateRequest;

    // Validate secret token
    if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const revalidatedPaths: string[] = [];

        // Revalidate specific paths
        if (paths && Array.isArray(paths)) {
            for (const path of paths) {
                await res.revalidate(path);
                revalidatedPaths.push(path);
            }
        }

        // Revalidate by type
        if (type === 'venue' && slug) {
            await res.revalidate(`/${slug}`);
            await res.revalidate('/');
            revalidatedPaths.push(`/${slug}`, '/');
        }

        if (type === 'list' && slug) {
            await res.revalidate(`/${slug}`);
            await res.revalidate('/lists');
            revalidatedPaths.push(`/${slug}`, '/lists');
        }

        if (type === 'all') {
            await res.revalidate('/');
            revalidatedPaths.push('/');
        }

        // Always revalidate home if nothing specific
        if (revalidatedPaths.length === 0) {
            await res.revalidate('/');
            revalidatedPaths.push('/');
        }

        return res.json({
            revalidated: true,
            paths: revalidatedPaths,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Revalidation error:', err);
        return res.status(500).json({ message: 'Error revalidating', error: String(err) });
    }
}
