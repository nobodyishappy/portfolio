import { posts } from '../blogposts.js';

export function load({params}) {
    const post = posts.find((post) => post.slug === params.slug);

    return {
        post
    };
}