import { posts } from './blogposts.js';

export function load() {
    return {
        summaries: posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            coverImage: post.coverImage
        }))
    }
}