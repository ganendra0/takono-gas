import React, { useState } from 'react';
import { useTakonoStore } from '../../services/store';
import { calculateSmartGuideRecommendation } from '../../services/smartGuideEngine';
import { InteractivePointModal } from './InteractivePointModal';
import { ExplorePoint } from '../../types/destination';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  BookOpen,
  Award,
  ChevronRight,
  QrCode,
  Layers,
  Footprints,
} from 'lucide-react';

export const SmartGuideView: React.FC = () => {
  const {
    destinations,
    explorePoints,
    activeJourney,
    startOrResumeJourney,
    navigateTo,
    setQrModalOpen,
  } = useTakonoStore();

  const activeDestId = activeJourney?.destinationId;
  const selectedDestination = destinations.find((d) => d.id === activeDestId);
  const destinationPoints = explorePoints.filter((p) => p.destinationId === activeDestId);

  const [selectedPointForModal, setSelectedPointForModal] = useState<ExplorePoint | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const recommendation = calculateSmartGuideRecommendation(
    destinationPoints,
    activeJourney || undefined
  );

  const handleOpenPoint = (point: ExplorePoint) => {
    setSelectedPointForModal(point);
    setModalOpen(true);
  };

  if (!activeJourney || !selectedDestination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in font-sans">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-sm">
            <Compass className="w-8 h-8 text-blue-600 animate-spin-slow" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Panduan Rute Cerdas Budaya
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Pilih destinasi di bawah ini atau pindai plakat gerbang masuk untuk mengaktifkan urutan rute jelajah budaya terarah.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-sm inline-flex items-center gap-2 transition"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Pindai Plakat Gerbang Masuk QR</span>
            </button>
          </div>
        </div>

        {/* Quick Dest Selection */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 text-center">
            Atau Pilih Destinasi untuk Memulai:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {destinations.map((dest) => {
              const pts = explorePoints.filter((p) => p.destinationId === dest.id);
              return (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {dest.province || 'INDONESIA'}
                    </span>
                    <h4 className="font-extrabold text-sm text-neutral-900">{dest.name}</h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{dest.description}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-400 font-bold">{pts.length} Titik</span>
                    <button
                      type="button"
                      onClick={() => {
                        startOrResumeJourney(dest.id);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      <span>Mulai</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Panduan Rute Jelajah Budaya</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Mau ke mana selanjutnya?
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Rekomendasi titik warisan budaya berurutan agar perjalanan Anda lebih bermakna dan terarah.
          </p>
        </div>

        {/* Current Active Location Badge */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-2xl text-xs">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-blue-600 block leading-tight">Lokasi Aktif:</span>
            <span className="font-extrabold text-neutral-900">{selectedDestination.name}</span>
          </div>
        </div>
      </div>

      {selectedDestination && (
        <>
          {/* Progress Overview Card */}
          <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">
                  Progres Rute di {selectedDestination.name}
                </h3>
                <p className="text-xs text-neutral-500">
                  {recommendation.totalPoints - recommendation.unvisitedCount} dari {recommendation.totalPoints} titik warisan terselesaikan
                </p>
              </div>
              <span className="text-lg font-black font-mono text-blue-600">
                {recommendation.completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${recommendation.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Featured Recommendation Card */}
          {recommendation.recommendedPoint ? (
            <div className="rounded-3xl border border-neutral-900 bg-neutral-900 text-white shadow-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm font-mono">
                    {recommendation.badge}
                  </span>
                  <span className="text-xs text-neutral-300 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Est. {recommendation.recommendedPoint.estimatedMinutes || 15} menit
                  </span>
                </div>
                <span className="text-xs text-neutral-300 font-mono">
                  Titik #{recommendation.recommendedPoint.sequenceOrder || 1} dari {recommendation.totalPoints}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {recommendation.recommendedPoint.name || (recommendation.recommendedPoint as any).title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed font-normal">
                  {recommendation.recommendedPoint.shortDescription || (recommendation.recommendedPoint as any).description}
                </p>
              </div>

              {/* Rationale box */}
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs text-neutral-200 font-normal">
                <strong className="text-blue-300 font-bold">Alasan Panduan: </strong>
                {recommendation.reason}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{recommendation.recommendedPoint.locationName || selectedDestination.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPoint(recommendation.recommendedPoint!)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <span>Buka Panduan & Kuis (+{recommendation.recommendedPoint.completionPoints || 5} Pts)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-blue-50 border border-blue-200 rounded-3xl text-center space-y-3 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="text-base font-black text-neutral-900">Semua Titik Selesai Dijelajahi! 🎉</h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Luar biasa! Anda telah menyelesaikan seluruh titik warisan budaya di {selectedDestination.name}. Periksa koleksi stempel Anda di Album Jelajah atau tukarkan Jejak Points Anda.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/album')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  Buka Album Stempel
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/traveler/points')}
                  className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold text-xs hover:bg-neutral-50 transition cursor-pointer"
                >
                  Tukar Jejak Points
                </button>
              </div>
            </div>
          )}

          {/* Sequential Route Timeline List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-blue-600" />
              <span>Daftar Urutan Rute Kunjungan ({destinationPoints.length} Titik)</span>
            </h3>

            <div className="space-y-3">
              {destinationPoints
                .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
                .map((pt, idx) => {
                  const visitedRecord = activeJourney.visitedPoints?.find(
                    (vp) => vp.explorePointId === pt.id
                  );
                  const isCompleted = !!visitedRecord?.completedAt;
                  const isTarget = recommendation.recommendedPoint?.id === pt.id;
                  const pointTitle = pt.name || (pt as any).title;
                  const pointSummary = pt.storySummary || pt.shortDescription || (pt as any).description;

                  return (
                    <div
                      key={pt.id}
                      onClick={() => handleOpenPoint(pt)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-blue-50/20 border-neutral-200 text-neutral-600'
                          : isTarget
                          ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600/30'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isTarget
                              ? 'bg-blue-600 text-white font-black'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {isCompleted ? '✓' : `#${pt.sequenceOrder || idx + 1}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-neutral-900">{pointTitle}</h4>
                            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                              {pt.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-1">{pointSummary}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 text-xs">
                        <span className="text-neutral-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{pt.estimatedMinutes || 15} mnt
                        </span>

                        {isCompleted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Selesai
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            <span>Pelajari</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* Unified Interactive Point Modal */}
      <InteractivePointModal
        point={selectedPointForModal}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPointForModal(null);
        }}
        onNavigateToNextPoint={(nextPointId) => {
          const nextPt = destinationPoints.find((p) => p.id === nextPointId);
          if (nextPt) {
            setSelectedPointForModal(nextPt);
          } else {
            setModalOpen(false);
          }
        }}
      />
    </div>
  );
};
