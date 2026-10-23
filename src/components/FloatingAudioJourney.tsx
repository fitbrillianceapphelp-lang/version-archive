import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Disc,
  FastForward,
  ChevronUp,
  ChevronDown,
  SkipBack,
  SkipForward,
  Sparkles,
  ListMusic,
  Headphones,
  CheckCircle2,
} from "lucide-react";

export type TrackId =
  | "rihla"
  | "mesh-dayman"
  | "mt3-a-peace-lyrics"
  | "mt3-a-peace-beat"
  | "mt3-raspo"
  | "mt3-rashad-wa7d"
  | "presence-control"
  | "dont-tell-your-dreams"
  | "i-remember"
  | string;

export interface TrackInfo {
  id: TrackId;
  title_ar: string;
  title_en: string;
  artist: string;
  desc_ar: string;
  src: string;
  year: string;
  verseQuote?: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: "rihla",
    title_ar: "أغنية: في رحلة (حرف مني يهد جمل)",
    title_en: "Official: In a Journey (Rihla)",
    artist: "كوتش سراج — نشيد العرش والريادة",
    desc_ar: "المقطوعة الرسمية للرحلة والكفاح والريادة منذ 2011. نشيد العرش الرسمي لكوتش سراج — استمع إليها كخلفية سينمائية أثناء استعراض المنظومة.",
    src: "/assets/rihla.mp3",
    year: "2011 - 2026",
    verseQuote: "«حرف مني يهد ليهم جمل.. ثابت على مبدأي والهدف قدامي»",
  },
  {
    id: "mesh-dayman",
    title_ar: "أغنية: مش دايماً (طالعة الشمس عادي تغيم)",
    title_en: "Official: Mesh Dayman (MT3 × Rashad Combal)",
    artist: "MT3 × Rashad Combal — Prod. Wa7d",
    desc_ar: "مقطوعة السكينة والتوازن — «مش دايما طالعة الشمس عادي تغيم.. فبحمد الله على كل حال أنا بحمد الله». مهداة لشركاء رحلة الكفاح والريادة.",
    src: "/assets/mesh-dayman.mp3",
    year: "الإصدار الرسمي",
    verseQuote: "«مش دايما طالعة الشمس عادي تغيم.. فبحمد الله على كل حال أنا بحمد الله»",
  },
  {
    id: "mt3-a-peace-lyrics",
    title_ar: "أغنية: كفاح وعزيمة (Official Lyrics)",
    title_en: "Official: Struggle & Will (MT3 x A-Peace)",
    artist: "MT3 × A-Peace — إصدار الريادة",
    desc_ar: "إصدار الفيديو الغنائي الرسمي — عزيمة وإصرار وثبات على الهدف حتى تحقيق السيادة الكاملة.",
    src: "/assets/aistudio/MT3_x_A-Peace_____________Official_lyrics_video___-hCd-6nu8lk__cf4be6ab.mp3",
    year: "إصدار رسمي",
    verseQuote: "«الهدف واضح والخطوات محسوبة بالمللي نحو القمة»",
  },
  {
    id: "mt3-a-peace-beat",
    title_ar: "مقطوعة: التحول والسيادة (Prod. A-Peace)",
    title_en: "Transformation & Sovereignty Beat",
    artist: "MT3 — هندسة الإيقاع (Prod. A-Peace)",
    desc_ar: "هندسة إيقاعية سينمائية تحفيزية لجلسات العمل العميق وقيادة استراتيجية الـ 90 يوماً.",
    src: "/assets/aistudio/MT3_-________Prod._A-Peace___GclfEopjhag__686b0d48.mp3",
    year: "إيقاع الريادة",
    verseQuote: "«إيقاع العمل المركز.. لا تراجع ولا استسلام حتى اكتمال الهدف»",
  },
  {
    id: "mt3-raspo",
    title_ar: "مقطوعة: إرادة الفولاذ (Prod. Raspo)",
    title_en: "Steel Will Soundscape (Prod. Raspo)",
    artist: "MT3 — وتريات العزيمة (Prod. Raspo)",
    desc_ar: "مقطوعة شحذ الهمم وقوة التحمل البدني والذهني لكبار الرواد والمديرين التنفيذيين.",
    src: "/assets/aistudio/MT3_-_______Prod._Raspo___HiIQzqn1iGg__8cb23f09.mp3",
    year: "إنتاج سينمائي",
    verseQuote: "«قوة الروح تتغلب على كل العقبات والضغوط»",
  },
  {
    id: "mt3-rashad-wa7d",
    title_ar: "مقطوعة: الصبر والإتقان (Prod. Wa7d)",
    title_en: "Patience & Mastery (Prod. Wa7d)",
    artist: "MT3 × Rashad Combal — Prod. Wa7d",
    desc_ar: "لحن الحكمة والهدوء الاستراتيجي لاتخاذ القرارات الاستثمارية والتشغيلية الحاسمة.",
    src: "/assets/aistudio/MT3_x__rashadcombal_-____________Prod._Wa7d___ozZB9yu69o4___1__3dee668f.mp3",
    year: "الإصدار الأصيل",
    verseQuote: "«الصبر مفتاح السيادة والاحتراف»",
  },
  {
    id: "presence-control",
    title_ar: "مقطوعة: التحكم بالحضور الذهني (Presence Control)",
    title_en: "Presence Control (SNX 256K)",
    artist: "SNX Soundscapes — هندسة الترددات",
    desc_ar: "ترددات التوازن الذهني العميق وضبط الإيقاع العصبي أثناء تنفيذ استراتيجية الـ 90 يوماً.",
    src: "/assets/aistudio/vidssave.com_Presence_Control_l_SNX_256KBPS_ddcb8dcf.mp3",
    year: "Hi-Fi 256K",
    verseQuote: "«الهدوء الداخلي هو سر السيطرة الكاملة على الواقع»",
  },
  {
    id: "dont-tell-your-dreams",
    title_ar: "Don't Tell Your Dreams (حقق بصمت)",
    title_en: "Don't Tell Your Dreams (LOVIXX & STOSLIV)",
    artist: "LOVIXX × STOSLIV — كلمات وريادة",
    desc_ar: "«لا تبح بأهدافك الكبرى.. دع الأفعال والنتائج القياسية هي من تعلن عن نفسها أمام العالم».",
    src: "/assets/aistudio/vidssave.com_LOVIXX__STOSLIV_-_Don_t_tell_your_dreams__Lyrics__256KBPS_2b241d37.mp3",
    year: "Master Mix",
    verseQuote: "«Don't tell your dreams, show them the results»",
  },
  {
    id: "i-remember",
    title_ar: "مقطوعة: السكينة والتأمل (I Remember)",
    title_en: "I Remember (SNX Ambience)",
    artist: "SNX Ambient Master — وتريات السكينة",
    desc_ar: "مقطوعة صفاء ذهني واسترجاع لمسار التطور منذ الانطلاقة الأولى حتى مرحلة التتويج المؤسسي.",
    src: "/assets/aistudio/vidssave.com_I_Remember_l_SNX_48KBPS_dc0a1f22.mp3",
    year: "تأمل وسكينة",
    verseQuote: "«تذكر كيف بدأت الرحلة.. واشكر الله على ما وصلت إليه»",
  },
];

export const FloatingAudioJourney: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activeTrack, setActiveTrack] = useState<TrackId>("rihla");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrackIndex = TRACKS.findIndex((t) => t.id === activeTrack);
  const currentTrackInfo = TRACKS[currentTrackIndex >= 0 ? currentTrackIndex : 0];

  // Eager Autoplay & gesture unlocker
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked by browser policy until first interaction
        });
    }

    const handleFirstGesture = () => {
      const el = audioRef.current;
      if (el && !isPlaying) {
        el.volume = volume;
        el.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      cleanupListeners();
    };
  }, []);

  // Sync track change
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const wasPlaying = isPlaying;
      audio.src = currentTrackInfo.src;
      audio.currentTime = 0;
      setCurrentTime(0);
      if (wasPlaying) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [activeTrack]);

  // Listen to external triggers
  useEffect(() => {
    const handleToggle = () => setIsDrawerOpen((prev) => !prev);
    const handleOpen = () => setIsDrawerOpen(true);

    const handleRemoteSwitch = (e: any) => {
      if (e.detail?.trackId) {
        switchTrack(e.detail.trackId);
      }
    };
    const handleRemoteToggle = () => {
      togglePlay();
    };
    const handleRemoteVerse = () => {
      jumpToVerse32();
    };

    window.addEventListener("toggle-audio-journey", handleToggle);
    window.addEventListener("open-audio-journey", handleOpen);
    window.addEventListener("fitbrilliance:switch-track", handleRemoteSwitch);
    window.addEventListener("fitbrilliance:toggle-play", handleRemoteToggle);
    window.addEventListener("fitbrilliance:jump-verse", handleRemoteVerse);

    return () => {
      window.removeEventListener("toggle-audio-journey", handleToggle);
      window.removeEventListener("open-audio-journey", handleOpen);
      window.removeEventListener("fitbrilliance:switch-track", handleRemoteSwitch);
      window.removeEventListener("fitbrilliance:toggle-play", handleRemoteToggle);
      window.removeEventListener("fitbrilliance:jump-verse", handleRemoteVerse);
    };
  }, [isPlaying]);

  // Dispatch track-changed event to sync with Botpress chat
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("fitbrilliance:track-changed", {
        detail: {
          track: currentTrackInfo,
          isPlaying: isPlaying,
        },
      })
    );
  }, [currentTrackInfo, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = isMuted ? 0 : volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const switchTrack = (trackId: TrackId) => {
    if (trackId === activeTrack) {
      togglePlay();
      return;
    }
    setActiveTrack(trackId);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    switchTrack(TRACKS[nextIdx].id);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    switchTrack(TRACKS[prevIdx].id);
  };

  const jumpToVerse32 = () => {
    if (activeTrack !== "rihla") {
      setActiveTrack("rihla");
    }
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 32;
      setCurrentTime(32);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Master Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrackInfo.src}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={handleNextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* FLOATING AUDIO ISLAND — Clearly elevated with visible margin all around */}
      <div
        id="audio-dock"
        className="fixed bottom-5 sm:bottom-6 md:bottom-7 left-1/2 -translate-x-1/2 w-[94%] sm:w-[88%] max-w-4xl z-40 select-none font-sans transition-all duration-300"
      >
        {/* Expandable Playlist & Story Drawer (Opens upwards) */}
        {isDrawerOpen && (
          <div className="mb-3 bg-[#070b0e]/98 border-2 border-red-500/40 rounded-3xl p-4 sm:p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(220,38,38,0.3)] max-h-[65vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-red-500" />
                <h3 className="text-sm sm:text-base font-black text-white">
                  قائمة الرحلة الموسيقية والسكينة الذهنية ({TRACKS.length} مقطوعات متكاملة)
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
              >
                إغلاق القائمة
              </button>
            </div>

            {/* Grid of All 9 Tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {TRACKS.map((track, idx) => {
                const isSelected = track.id === activeTrack;
                return (
                  <div
                    key={track.id}
                    onClick={() => switchTrack(track.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-red-950/70 via-slate-900 to-black border-red-500/80 shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.7)]"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <Disc className={`w-5 h-5 ${isSelected && isPlaying ? "animate-spin" : ""}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-red-400">
                              #{idx + 1}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {track.title_ar}
                            </h4>
                          </div>
                          <p className="text-[10px] text-red-400/90 font-mono line-clamp-1">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-red-950/60 text-red-300 px-2 py-0.5 rounded-full border border-red-800/40 font-mono shrink-0">
                        {track.year}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {track.desc_ar}
                    </p>

                    {track.verseQuote && (
                      <div className="mt-2 text-[10px] font-medium text-amber-300/90 italic bg-amber-950/20 p-2 rounded-xl border border-amber-800/30 line-clamp-2">
                        {track.verseQuote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Special Shortcut for Verse 32 in Rihla */}
            {activeTrack === "rihla" && (
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">مقطع العزيمة الصامد:</span>
                <button
                  onClick={jumpToVerse32}
                  className="text-xs text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>القفز للمقطع: «حرف مني يهد ليهم جمل» (00:32)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* FLOATING MAIN BAR — Clearly floating pill with rounded corners & margin */}
        <div className="bg-[#070b0e]/95 border-2 border-red-500/40 rounded-2xl sm:rounded-3xl backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(220,38,38,0.25)] px-3 sm:px-6 py-2 sm:py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Section 1: Track Meta & Vinyl Disc Graphic */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 max-w-[48%] sm:max-w-none">
              {/* Spinning Vinyl Record Disc */}
              <div
                onClick={togglePlay}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-slate-800 p-0.5 border-2 border-red-500/60 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.4)] group shrink-0"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center bg-black border border-zinc-700 transition-all ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "5s" }}
                >
                  <Disc className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current" />
                  )}
                </div>
              </div>

              {/* Title & Artist & Quick Switcher */}
              <div className="text-right truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono bg-red-950/70 text-red-300 px-1.5 py-0.2 rounded border border-red-800/40 shrink-0">
                    {currentTrackIndex + 1}/{TRACKS.length}
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-white truncate max-w-[120px] sm:max-w-[210px]">
                    {currentTrackInfo.title_ar}
                  </span>
                  {/* Waveform Equalizer Animation */}
                  {isPlaying && (
                    <div className="hidden sm:flex items-end gap-0.5 h-3">
                      {[4, 10, 14, 8, 12, 6, 11].map((h, i) => (
                        <span
                          key={i}
                          className="w-0.5 bg-red-500 rounded-full animate-pulse"
                          style={{
                            height: `${h * volume}px`,
                            animationDuration: `${0.3 + (i % 3) * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[9px] sm:text-[10px] text-red-400 font-mono truncate">
                  {currentTrackInfo.artist}
                </p>
              </div>
            </div>

            {/* Section 2: Audio Scrubber & Main Playback Controls */}
            <div className="flex-1 max-w-xl mx-2 sm:mx-6 flex flex-col items-center justify-center">
              {/* Play / Pause & Skip Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevTrack}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title="المقطوعة السابقة"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_18px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95"
                  title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title="المقطوعة التالية"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {activeTrack === "rihla" && (
                  <button
                    onClick={jumpToVerse32}
                    className="hidden md:flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-800/40 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                    title="القفز للمقطع: حرف مني يهد ليهم جمل"
                  >
                    <FastForward className="w-3 h-3 text-red-500" />
                    <span>00:32 (حرف مني)</span>
                  </button>
                )}
              </div>

              {/* Progress Bar & Timestamps */}
              <div className="w-full flex items-center gap-2 mt-1">
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.5"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-red-600 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  aria-label="شريط تقدم المقطوعة"
                />
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Section 3: Volume & Details Drawer Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-18 accent-red-600 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  aria-label="مستوى الصوت"
                />
              </div>

              {/* Drawer Toggle Button (All 9 tracks) */}
              <button
                onClick={() => setIsDrawerOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDrawerOpen
                    ? "bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
                }`}
                title="قائمة الـ 9 مقطوعات والكلمات"
              >
                <Music className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">
                  {isDrawerOpen ? "إغلاق" : `المقطوعات (${TRACKS.length})`}
                </span>
                {isDrawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
