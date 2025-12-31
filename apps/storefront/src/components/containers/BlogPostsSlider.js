'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BlogPostsSlider() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // TODO: Fetch from Shopify Blog Posts
    setPosts([
      { id: 1, title: 'Blog Post 1', excerpt: 'Kurze Beschreibung...', slug: 'blog-post-1' },
      { id: 2, title: 'Blog Post 2', excerpt: 'Kurze Beschreibung...', slug: 'blog-post-2' },
      { id: 3, title: 'Blog Post 3', excerpt: 'Kurze Beschreibung...', slug: 'blog-post-3' },
    ]);
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">Aus unserem Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Blog Bild
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

