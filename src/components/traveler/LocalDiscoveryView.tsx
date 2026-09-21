import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import {
  ShoppingBag,
  Building2,
  Tag,
  MapPin,
  Phone,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const LocalDiscoveryView: React.FC = () => {
  const { umkmList, umkmProfiles, destinations, logAnalyticsEvent } = useTakonoStore();
  const rawList = (umkmList && umkmList.length > 0) ? umkmList : (umkmProfiles || []);
  const approvedUmkms = rawList.filter((u) => u.approvalStatus === 'approved' || !u.approvalStatus);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');

  const categories = ['all', 'culinary', 'craft', 'souvenir'];

  const categoryLabels: Record<string, string> = {
    all: 'Semua Kategori',
    culinary: 'Kuliner Tradisi',
    craft: 'Kerajinan Kriya',
    souvenir: 'Oleh-Oleh Khas',
  };

  const filteredUmkms = approvedUmkms.filter((u) => {
    const matchCat = selectedCategory === 'all' || u.category === selectedCategory;
    const matchDest =
      selectedDestinationFilter === 'all' ||
      (u.associatedDestinationIds && u.associatedDestinationIds.includes(selectedDestinationFilter));
    return matchCat && matchDest;
  });

  const handleTrackUMKMView = (umkmId: string) => {
    if (logAnalyticsEvent) {
      logAnalyticsEvent('umkm_view', umkmId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4" />
          <span>Local Discovery & UMKM Mitra</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Eksplorasi UMKM & Produk Lokal
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5 font-normal">
          Dukung perekonomian warga lokal di sekitar destinasi wisata dengan berbelanja karya dan kuliner otentik.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Destinasi:</span>
          <select
            value={selectedDestinationFilter}
            onChange={(e) => setSelectedDestinationFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-semibold outline-none focus:border-blue-500"
          >
            <option value="all">Semua Destinasi</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* UMKM List Cards */}
      <div className="space-y-5">
        {filteredUmkms.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-2">
            <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-700">Belum ada UMKM untuk filter ini</h3>
            <p className="text-xs text-neutral-400">Silakan pilih kategori atau destinasi lain.</p>
          </div>
        ) : (
          filteredUmkms.map((umkm) => {
            const associatedDests = destinations.filter((d) =>
              (umkm.associatedDestinationIds || []).includes(d.id)
            );

            return (
              <div
                key={umkm.id}
                onClick={() => handleTrackUMKMView(umkm.id)}
                className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden p-6 space-y-5 hover:border-blue-300 hover:shadow-md transition"
              >
                {/* Business Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={umkm.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                      alt={umkm.businessName}
                      className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shrink-0 shadow-2xs"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-neutral-900">{umkm.businessName}</h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Terverifikasi Takono
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed max-w-xl font-normal">
                        {umkm.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {umkm.address}
                        </span>
                        {umkm.phone && (
                          <span className="flex items-center gap-1 font-mono text-neutral-600">
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            {umkm.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destinations tag */}
                  {associatedDests.length > 0 && (
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[11px] text-neutral-400 block font-mono">MITRA LOKAL:</span>
                      <span className="text-xs font-extrabold text-neutral-800">
                        {associatedDests.map((d) => d.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Active Promotions */}
                {umkm.promotions && umkm.promotions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <strong className="text-amber-950 font-bold">
                          {umkm.promotions[0].title}
                        </strong>
                        <p className="text-amber-800 text-[11px]">
                          {umkm.promotions[0].description}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-mono font-black text-amber-900 text-[11px] shrink-0 shadow-2xs">
                      KODE: {umkm.promotions[0].promoCode}
                    </span>
                  </div>
                )}

                {/* Products Grid */}
                {umkm.products && umkm.products.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-neutral-700 uppercase tracking-wider font-mono">
                      Produk Unggulan:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {umkm.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 flex items-center gap-3"
                        >
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-neutral-900 truncate">
                              {prod.name}
                            </h5>
                            <span className="font-mono text-xs font-bold text-blue-600">
                              Rp {prod.priceIdr.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
