'use client';

import { useEffect, useMemo, useState } from 'react';

const emptyHero = { image: '', link: '#', title: '', alt: '', sort_order: 10, active: true };
const emptyBanner = { image: '', link: '#', title: '', placement: 'double_small', sort_order: 10, active: true };

function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-gray-700 font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function CmsPage() {
  const [heroes, setHeroes] = useState([]);
  const [banners, setBanners] = useState([]);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [bannerForm, setBannerForm] = useState(emptyBanner);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sortedHeroes = useMemo(
    () => [...heroes].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)),
    [heroes]
  );
  const sortedBanners = useMemo(
    () => [...banners].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)),
    [banners]
  );

  async function loadAll() {
    setLoading(true);
    setMessage('');
    try {
      const [heroRes, bannerRes] = await Promise.all([fetch('/api/cms/hero'), fetch('/api/cms/banner')]);
      const heroJson = await heroRes.json();
      const bannerJson = await bannerRes.json();
      setHeroes(Array.isArray(heroJson.items) ? heroJson.items : []);
      setBanners(Array.isArray(bannerJson.items) ? bannerJson.items : []);
    } catch (e) {
      setMessage(`Yukleme hatasi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createHero(e) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/cms/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroForm),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(`Hero kaydi basarisiz: ${json.error || 'Bilinmeyen hata'}`);
      return;
    }
    setHeroForm(emptyHero);
    setMessage('Hero slide eklendi.');
    loadAll();
  }

  async function createBanner(e) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/cms/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerForm),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(`Banner kaydi basarisiz: ${json.error || 'Bilinmeyen hata'}`);
      return;
    }
    setBannerForm(emptyBanner);
    setMessage('Banner eklendi.');
    loadAll();
  }

  async function removeHero(id) {
    if (!confirm('Bu hero slide silinsin mi?')) return;
    const res = await fetch('/api/cms/hero', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(`Silme hatasi: ${json.error || 'Bilinmeyen hata'}`);
      return;
    }
    setMessage('Hero slide silindi.');
    loadAll();
  }

  async function removeBanner(id) {
    if (!confirm('Bu banner silinsin mi?')) return;
    const res = await fetch('/api/cms/banner', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(`Silme hatasi: ${json.error || 'Bilinmeyen hata'}`);
      return;
    }
    setMessage('Banner silindi.');
    loadAll();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">VampireVape Headless CMS</h1>
            <p className="text-sm text-gray-600">Hero slider ve banner iceriklerini buradan yonetin.</p>
          </div>
          <button
            type="button"
            onClick={loadAll}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90"
          >
            Yenile
          </button>
        </header>

        {message ? <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm">{message}</div> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Hero Slider - Yeni Slide">
            <form className="space-y-3" onSubmit={createHero}>
              <Field label="Gorsel URL">
                <input
                  required
                  className="border rounded-lg px-3 py-2"
                  value={heroForm.image}
                  onChange={(e) => setHeroForm((s) => ({ ...s, image: e.target.value }))}
                />
              </Field>
              <Field label="Link">
                <input className="border rounded-lg px-3 py-2" value={heroForm.link} onChange={(e) => setHeroForm((s) => ({ ...s, link: e.target.value }))} />
              </Field>
              <Field label="Baslik (opsiyonel)">
                <input className="border rounded-lg px-3 py-2" value={heroForm.title} onChange={(e) => setHeroForm((s) => ({ ...s, title: e.target.value }))} />
              </Field>
              <Field label="Alt (opsiyonel)">
                <input className="border rounded-lg px-3 py-2" value={heroForm.alt} onChange={(e) => setHeroForm((s) => ({ ...s, alt: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sira">
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-2"
                    value={heroForm.sort_order}
                    onChange={(e) => setHeroForm((s) => ({ ...s, sort_order: Number(e.target.value || 0) }))}
                  />
                </Field>
                <Field label="Aktif">
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={heroForm.active ? 'true' : 'false'}
                    onChange={(e) => setHeroForm((s) => ({ ...s, active: e.target.value === 'true' }))}
                  >
                    <option value="true">Evet</option>
                    <option value="false">Hayir</option>
                  </select>
                </Field>
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary text-white px-4 py-2">
                Hero slide ekle
              </button>
            </form>
          </SectionCard>

          <SectionCard title="Hero Alt Banner - Yeni Banner">
            <form className="space-y-3" onSubmit={createBanner}>
              <Field label="Gorsel URL">
                <input
                  required
                  className="border rounded-lg px-3 py-2"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm((s) => ({ ...s, image: e.target.value }))}
                />
              </Field>
              <Field label="Link">
                <input className="border rounded-lg px-3 py-2" value={bannerForm.link} onChange={(e) => setBannerForm((s) => ({ ...s, link: e.target.value }))} />
              </Field>
              <Field label="Baslik (opsiyonel)">
                <input className="border rounded-lg px-3 py-2" value={bannerForm.title} onChange={(e) => setBannerForm((s) => ({ ...s, title: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Placement">
                  <select
                    className="border rounded-lg px-3 py-2"
                    value={bannerForm.placement}
                    onChange={(e) => setBannerForm((s) => ({ ...s, placement: e.target.value }))}
                  >
                    <option value="double_small">double_small</option>
                    <option value="double_large">double_large</option>
                  </select>
                </Field>
                <Field label="Sira">
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-2"
                    value={bannerForm.sort_order}
                    onChange={(e) => setBannerForm((s) => ({ ...s, sort_order: Number(e.target.value || 0) }))}
                  />
                </Field>
              </div>
              <Field label="Aktif">
                <select
                  className="border rounded-lg px-3 py-2"
                  value={bannerForm.active ? 'true' : 'false'}
                  onChange={(e) => setBannerForm((s) => ({ ...s, active: e.target.value === 'true' }))}
                >
                  <option value="true">Evet</option>
                  <option value="false">Hayir</option>
                </select>
              </Field>
              <button type="submit" className="w-full rounded-lg bg-primary text-white px-4 py-2">
                Banner ekle
              </button>
            </form>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title={`Mevcut Hero Slide'lar (${sortedHeroes.length})`}>
            <div className="space-y-3">
              {loading ? <p className="text-sm text-gray-500">Yukleniyor...</p> : null}
              {!loading && sortedHeroes.length === 0 ? <p className="text-sm text-gray-500">Kayit yok.</p> : null}
              {sortedHeroes.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 flex gap-3">
                  {item.image ? <img src={item.image} alt="" className="w-28 h-16 object-cover rounded" /> : null}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.title || 'Basliksiz slide'}</p>
                    <p className="text-xs text-gray-500 truncate">Link: {item.link}</p>
                    <p className="text-xs text-gray-500">Sira: {item.sort_order} | Aktif: {item.active ? 'Evet' : 'Hayir'}</p>
                  </div>
                  <button className="text-red-600 text-sm" onClick={() => removeHero(item.id)} type="button">
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={`Mevcut Banner'lar (${sortedBanners.length})`}>
            <div className="space-y-3">
              {loading ? <p className="text-sm text-gray-500">Yukleniyor...</p> : null}
              {!loading && sortedBanners.length === 0 ? <p className="text-sm text-gray-500">Kayit yok.</p> : null}
              {sortedBanners.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 flex gap-3">
                  {item.image ? <img src={item.image} alt="" className="w-28 h-16 object-cover rounded" /> : null}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.title || 'Basliksiz banner'}</p>
                    <p className="text-xs text-gray-500 truncate">Link: {item.link}</p>
                    <p className="text-xs text-gray-500">Placement: {item.placement} | Sira: {item.sort_order} | Aktif: {item.active ? 'Evet' : 'Hayir'}</p>
                  </div>
                  <button className="text-red-600 text-sm" onClick={() => removeBanner(item.id)} type="button">
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}

