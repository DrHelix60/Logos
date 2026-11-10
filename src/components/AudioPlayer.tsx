"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Download } from "lucide-react";

interface AudioPlayerProps {
  url: string;
  title: string;
  filename: string;
  onDownloadSingle?: (url: string, filename: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  title,
  filename,
  onDownloadSingle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="bg-[#4A6541] text-[#F7F1E5] rounded-2xl p-4 shadow-md border-2 border-[#3D5535] flex flex-col sm:flex-row items-center gap-4">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-[#749B64] hover:bg-[#5E8450] text-white flex items-center justify-center shadow-lg transition flex-shrink-0"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 w-full space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold tracking-wide flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-300" />
            {title}
          </span>
          <span className="text-[11px] font-mono text-[#C5D9BE]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-emerald-400 h-1.5 bg-[#344B2D] rounded-lg cursor-pointer"
        />
      </div>

      {onDownloadSingle && (
        <button
          onClick={() => onDownloadSingle(url, filename)}
          className="bg-[#344B2D] hover:bg-[#283C22] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition flex-shrink-0 border border-[#5A7C4F]"
          title="Download Vocalization Audio"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Audio</span>
        </button>
      )}
    </div>
  );
};
