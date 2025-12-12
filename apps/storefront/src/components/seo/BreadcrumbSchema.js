import { generateBreadcrumbSchema } from '@/utils/seo';

export default function BreadcrumbSchema({ items }) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

