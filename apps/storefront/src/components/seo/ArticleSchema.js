import { generateArticleSchema } from '@/utils/seo';

export default function ArticleSchema({ article }) {
  const schema = generateArticleSchema(article);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

