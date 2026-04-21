import { adminGraphql } from '../_admin';

const TYPE = 'hero_slide';

function normalizePayload(body = {}) {
  return {
    id: body.id || null,
    image: body.image || '',
    link: body.link || '#',
    title: body.title || '',
    alt: body.alt || '',
    active: body.active === false ? 'false' : 'true',
    sort_order: String(Number(body.sort_order || 0) || 0),
  };
}

function toFields(payload) {
  return [
    { key: 'image', value: payload.image },
    { key: 'link', value: payload.link },
    { key: 'title', value: payload.title },
    { key: 'alt', value: payload.alt },
    { key: 'active', value: payload.active },
    { key: 'sort_order', value: payload.sort_order },
  ];
}

function mapNode(node) {
  const map = new Map((node.fields || []).map((f) => [f.key, f.value || '']));
  return {
    id: node.id,
    image: map.get('image') || '',
    link: map.get('link') || '#',
    title: map.get('title') || '',
    alt: map.get('alt') || '',
    active: (map.get('active') || 'true') !== 'false',
    sort_order: Number(map.get('sort_order') || 0),
    updatedAt: node.updatedAt,
  };
}

export async function GET() {
  try {
    const query = `
      query GetHeroSlides {
        metaobjects(type: "${TYPE}", first: 100) {
          edges {
            node {
              id
              updatedAt
              fields { key value }
            }
          }
        }
      }
    `;
    const data = await adminGraphql(query);
    const items = (data?.metaobjects?.edges || []).map((e) => mapNode(e.node));
    items.sort((a, b) => a.sort_order - b.sort_order);
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = normalizePayload(await request.json());
    const mutation = `
      mutation CreateHeroSlide($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message }
        }
      }
    `;
    const data = await adminGraphql(mutation, {
      metaobject: { type: TYPE, fields: toFields(payload) },
    });
    const errs = data?.metaobjectCreate?.userErrors || [];
    if (errs.length) return Response.json({ error: errs[0].message }, { status: 400 });
    return Response.json({ ok: true, id: data?.metaobjectCreate?.metaobject?.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = normalizePayload(await request.json());
    if (!payload.id) return Response.json({ error: 'id is required' }, { status: 400 });
    const mutation = `
      mutation UpdateHeroSlide($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message }
        }
      }
    `;
    const data = await adminGraphql(mutation, {
      id: payload.id,
      metaobject: { fields: toFields(payload) },
    });
    const errs = data?.metaobjectUpdate?.userErrors || [];
    if (errs.length) return Response.json({ error: errs[0].message }, { status: 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
    const mutation = `
      mutation DeleteHeroSlide($id: ID!) {
        metaobjectDelete(id: $id) {
          deletedId
          userErrors { field message }
        }
      }
    `;
    const data = await adminGraphql(mutation, { id });
    const errs = data?.metaobjectDelete?.userErrors || [];
    if (errs.length) return Response.json({ error: errs[0].message }, { status: 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

