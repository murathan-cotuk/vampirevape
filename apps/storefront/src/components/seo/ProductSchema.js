import { generateProductSchema } from '@/utils/seo';

export default function ProductSchema({ product }) {
  const schema = generateProductSchema(product);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

