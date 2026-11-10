"use client";

import React, { useState } from "react";
import { SpeciesEntry, UserProfile } from "@/types/database";
import { AudioPlayer } from "./AudioPlayer";
import { calculateCompletionMetric } from "@/lib/metric-calculator";
import { 
  Award, 
  Download, 
  MapPin, 
  Compass, 
  FileArchive, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface SpeciesDetailProps {
  entry: SpeciesEntry;
  onBack: () => void;
  currentUser: UserProfile;
  onDownloadSingle: (url: string, filename: string) => void;
  onDownloadZip: (entry: SpeciesEntry) => void;
  onApproveEntry?: (id: string) => void;
  isDownloadingZip?: boolean;
}

export const SpeciesDetail: React.FC<SpeciesDetailProps> = ({
  entry,
  onBack,
  currentUser,
  onDownloadSingle,
  onDownloadZip,
  onApproveEntry,
  isDownloadingZip = false,
}) => {
  const data = entry.data;
  const metric = calculateCompletionMetric(data);
  const [showMetricBreakdown, setShowMetricBreakdown] = useState(false);

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Back button & Action banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Species Database</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          {entry.status === "pending_review" ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Pending Peer Validation
              {entry.isBoosted && (
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Spotlight Boosted
                </span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              Empirically Validated Canon
            </span>
          )}

          {/* Validation action for Leaders */}
          {currentUser.role === "leader" && entry.status === "pending_review" && onApproveEntry && (
            <button
              onClick={() => onApproveEntry(entry.id)}
              className="bg-[#2D4525] text-white hover:bg-[#1F301A] px-4 py-2 rounded-xl text-xs font-bold tracking-wide shadow-md transition"
            >
              Approve & Publish to Canon
            </button>
          )}

          {/* Download all files as ZIP */}
          <button
            onClick={() => onDownloadZip(entry)}
            disabled={isDownloadingZip}
            className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
            title="Download all media, audio, and maps in a ZIP archive"
          >
            <FileArchive className="w-4 h-4" />
            <span>{isDownloadingZip ? "Packaging ZIP..." : "Download All Files (ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* Top Banner & Header Card matching Figma Frame 32:2 */}
      <section className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Titles & Basic Pills */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Name Pill */}
          <div className="bg-[#6F9560] text-white p-6 rounded-3xl shadow-figma border-2 border-[#5A7C4F] relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">{entry.commonName}</h1>
              
              {/* Metric score button */}
              <button
                onClick={() => setShowMetricBreakdown(!showMetricBreakdown)}
                className="bg-[#4A6541] hover:bg-[#344B2D] text-[#F7F1E5] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow"
                title="Click to view 4-Tier Metric breakdown"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{metric.total}% Metric Score</span>
              </button>
            </div>
            
            <p className="text-lg italic font-serif text-[#DDECD8]">{entry.scientificName}</p>

            {data.nominateReference && (
              <div className="mt-3 inline-block bg-[#4A6541] text-[#E8F3E5] text-xs font-semibold px-3 py-1 rounded-full border border-[#648858]">
                ★ {data.nominateReference}
              </div>
            )}
          </div>

          {/* Metric breakdown expandable popup */}
          {showMetricBreakdown && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xl text-xs space-y-2 animate-fadeIn">
              <h4 className="font-bold text-[#344B2D] text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Core Completion Metric Breakdown (Score: {metric.total}/100)
              </h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-stone-700">
                <div className="p-2 bg-stone-50 rounded-lg">Tier 1: Basics: <strong>{metric.tier1.score} / {metric.tier1.max}%</strong></div>
                <div className="p-2 bg-stone-50 rounded-lg">Tier 2: Solidifiers: <strong>{metric.tier2.score} / {metric.tier2.max}%</strong></div>
                <div className="p-2 bg-stone-50 rounded-lg">Tier 3: Context: <strong>{metric.tier3.score} / {metric.tier3.max}%</strong></div>
                <div className="p-2 bg-stone-50 rounded-lg">Tier 4: Supplementary: <strong>{metric.tier4.score} / {metric.tier4.max}%</strong></div>
              </div>
            </div>
          )}

          {/* Size Dimensions Pill */}
          <div className="bg-[#6F9560] text-white px-5 py-3 rounded-2xl shadow-sm font-medium text-sm flex flex-wrap items-center gap-x-4 gap-y-1 border border-[#5A7C4F]">
            <span><strong>Size:</strong> {data.sizeWeight}</span>
            {data.sizeLength && <span>• Length: {data.sizeLength}</span>}
            {data.sizeHeight && <span>• Height: {data.sizeHeight}</span>}
            {data.sizeCategory && <span className="bg-[#4A6541] px-2 py-0.5 rounded-md text-xs font-bold">{data.sizeCategory}</span>}
          </div>

          {/* Diet Pill */}
          <div className="bg-[#6F9560] text-white px-5 py-3 rounded-2xl shadow-sm font-medium text-sm border border-[#5A7C4F]">
            <strong>Diet:</strong> {data.diet}
          </div>

          {/* Activity Pill */}
          <div className="bg-[#6F9560] text-white px-5 py-3 rounded-2xl shadow-sm font-medium text-sm border border-[#5A7C4F]">
            <strong>Activity:</strong> {data.activity}
          </div>

          {/* Ecology Box */}
          <div className="bg-[#6F9560] text-white p-5 rounded-2xl shadow-sm text-sm space-y-1.5 border border-[#5A7C4F]">
            <span className="font-bold block text-[#DDECD8]">Ecology & Eltonian Niche:</span>
            <p className="leading-relaxed text-xs sm:text-sm">{data.ecology.summaryText}</p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-[#4A6541] px-2.5 py-1 rounded-lg">Trophic Level: {data.ecology.trophicLevel}</span>
              <span className="bg-[#4A6541] px-2.5 py-1 rounded-lg">Niche: {data.ecology.eltonianNiche}</span>
              {data.ecology.isKeystone && (
                <span className="bg-emerald-900 text-emerald-200 px-2.5 py-1 rounded-lg font-bold">Keystone Species</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image with Download overlay */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#749B64] aspect-[4/3] bg-stone-900 group">
            <img
              src={data.media.heroImage}
              alt={entry.commonName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <button
              onClick={() => onDownloadSingle(data.media.heroImage, `${entry.commonName.toLowerCase()}_hero.jpg`)}
              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition shadow-lg"
              title="Download Hero Image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-stone-500 text-center italic">Nominate adult phenotype illustration</p>
        </div>
      </section>

      {/* Ethology Section matching Figma Group 9 (Frame 36:53) */}
      <section className="space-y-3">
        <div className="bg-[#6F9560] text-white p-6 rounded-3xl shadow-figma border-2 border-[#5A7C4F]">
          <h2 className="text-xl font-bold font-serif mb-2 text-[#F7F1E5]">Ethology</h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#EBF4E9]">
            {data.ethology.summaryText}
          </p>
        </div>
      </section>

      {/* Tracks and Identification matching Figma Group 20 (Frame 69:54) */}
      {data.tracksAndId && (
        <section className="space-y-4">
          <div className="inline-block bg-[#6F9560] text-white px-8 py-2.5 rounded-2xl shadow-sm text-lg font-bold tracking-wide border border-[#5A7C4F]">
            Tracks and Identification
          </div>

          <div className="bg-[#EFE8D8] p-6 rounded-3xl border border-[#D5CBB9] flex flex-col md:flex-row items-center gap-6 shadow-sm">
            {data.tracksAndId.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D5CBB9] bg-white p-2 max-w-sm flex-shrink-0">
                <img
                  src={data.tracksAndId.imageUrl}
                  alt="Tracks comparison"
                  className="w-full h-auto object-contain rounded-xl max-h-64"
                />
                <button
                  onClick={() => onDownloadSingle(data.tracksAndId!.imageUrl!, `${entry.commonName.toLowerCase()}_tracks.png`)}
                  className="absolute bottom-3 right-3 bg-stone-900/70 hover:bg-stone-900 text-white p-2 rounded-full transition shadow"
                  title="Download Track Asset"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="space-y-2 text-sm text-stone-800">
              <h4 className="font-bold text-[#344B2D] text-base">Morphological Field Indicators</h4>
              <p className="leading-relaxed">{data.tracksAndId.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Media Section matching Figma Group 19 (Frame 42:229) */}
      <section className="space-y-6">
        <div className="inline-block bg-[#6F9560] text-white px-8 py-2.5 rounded-2xl shadow-sm text-lg font-bold tracking-wide border border-[#5A7C4F]">
          Media
        </div>

        <div className="space-y-6">
          {/* Vocalizations Audio Player */}
          {data.media.vocalizationAudio && (
            <div className="max-w-2xl">
              <AudioPlayer
                url={data.media.vocalizationAudio.url}
                title={data.media.vocalizationAudio.title}
                filename={data.media.vocalizationAudio.filename}
                onDownloadSingle={onDownloadSingle}
              />
            </div>
          )}

          {/* YouTube or Video Embed */}
          {data.media.videoEmbedUrl && (
            <div className="bg-stone-900 p-4 rounded-3xl max-w-2xl shadow-xl space-y-2 border-2 border-[#5A7C4F]">
              <div className="text-white text-xs font-semibold px-2 flex items-center justify-between">
                <span>{data.media.videoTitle || "Video Observation"}</span>
                <a href={data.media.videoEmbedUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                  Watch on YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <iframe
                  src={data.media.videoEmbedUrl.replace("watch?v=", "embed/")}
                  title="Video display"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Photo & Skeletal Gallery */}
          {data.media.gallery && data.media.gallery.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.media.gallery.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl overflow-hidden border border-[#D5CBB9] shadow-sm group">
                  <div className="relative aspect-video bg-stone-100">
                    <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <button
                      onClick={() => onDownloadSingle(asset.url, asset.filename)}
                      className="absolute bottom-2 right-2 bg-stone-900/60 hover:bg-stone-900 text-white p-2 rounded-full transition"
                      title="Download Image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 text-xs">
                    <h5 className="font-bold text-[#344B2D] truncate">{asset.title}</h5>
                    {asset.caption && <p className="text-stone-500 text-[11px] mt-0.5">{asset.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Anatomy and Physiology matching Figma Frame 347:4 */}
      {data.anatomy && (
        <section className="space-y-3">
          <div className="bg-[#6F9560] text-white p-6 rounded-3xl shadow-figma border-2 border-[#5A7C4F]">
            <h2 className="text-xl font-bold font-serif mb-2 text-[#F7F1E5]">Anatomy & Physiology</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#EBF4E9]">
              {data.anatomy.summaryText || data.anatomy.notableStructures}
            </p>
          </div>
        </section>
      )}

      {/* Habitats & Biomes visual cards matching Figma Frame 42:214 */}
      <section className="space-y-4">
        <div className="inline-block bg-[#6F9560] text-white px-8 py-2.5 rounded-2xl shadow-sm text-lg font-bold tracking-wide border border-[#5A7C4F]">
          Habitats & Biomes
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {data.habitats.map((hab, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-3 border border-[#D5CBB9] text-center shadow-sm space-y-2">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#749B64]/20 flex items-center justify-center text-[#4A6541]">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-[#344B2D] block truncate">{hab}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution Maps matching Figma Group 18 & 16 (Frame 42:226) */}
      <section className="space-y-6">
        <div className="inline-block bg-[#6F9560] text-white px-8 py-2.5 rounded-2xl shadow-sm text-lg font-bold tracking-wide border border-[#5A7C4F]">
          Distribution
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.distribution.recognisedMapUrl && (
            <div className="bg-white p-4 rounded-3xl border border-[#D5CBB9] shadow-sm space-y-2">
              <h4 className="font-bold text-xs text-[#344B2D] text-center">Current Recognised Distribution</h4>
              <div className="relative aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden">
                <img src={data.distribution.recognisedMapUrl} alt="Recognised Distribution" className="w-full h-full object-contain" />
                <button
                  onClick={() => onDownloadSingle(data.distribution.recognisedMapUrl!, `${entry.commonName.toLowerCase()}_recognised_map.png`)}
                  className="absolute bottom-2 right-2 bg-stone-900/60 hover:bg-stone-900 text-white p-2 rounded-full transition"
                  title="Download Map"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {data.distribution.expectedMapUrl && (
            <div className="bg-white p-4 rounded-3xl border border-[#D5CBB9] shadow-sm space-y-2">
              <h4 className="font-bold text-xs text-[#344B2D] text-center">Expected Distribution</h4>
              <div className="relative aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden">
                <img src={data.distribution.expectedMapUrl} alt="Expected Distribution" className="w-full h-full object-contain" />
                <button
                  onClick={() => onDownloadSingle(data.distribution.expectedMapUrl!, `${entry.commonName.toLowerCase()}_expected_map.png`)}
                  className="absolute bottom-2 right-2 bg-stone-900/60 hover:bg-stone-900 text-white p-2 rounded-full transition"
                  title="Download Map"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {data.distribution.lgmMapUrl && (
            <div className="bg-white p-4 rounded-3xl border border-[#D5CBB9] shadow-sm space-y-2">
              <h4 className="font-bold text-xs text-[#344B2D] text-center">Last Glacial Maximum (LGM)</h4>
              <div className="relative aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden">
                <img src={data.distribution.lgmMapUrl} alt="LGM Map" className="w-full h-full object-contain" />
                <button
                  onClick={() => onDownloadSingle(data.distribution.lgmMapUrl!, `${entry.commonName.toLowerCase()}_lgm_map.png`)}
                  className="absolute bottom-2 right-2 bg-stone-900/60 hover:bg-stone-900 text-white p-2 rounded-full transition"
                  title="Download Map"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
};
