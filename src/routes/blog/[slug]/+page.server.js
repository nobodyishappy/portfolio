import { posts } from '../blogposts.js';

export const prerender = true;

export function load({params}) {
    const post = posts.find((post) => post.slug === params.slug);

    return {
        post
    };
}