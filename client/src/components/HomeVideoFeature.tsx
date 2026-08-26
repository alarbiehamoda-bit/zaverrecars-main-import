import { Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { brand } from "@/config/brand";
import type { ManagedHomeVideo } from "@/hooks/useCmsContent";
import "./HomeVideoFeature.css";

export function HomeVideoFeature({ content }: { content: ManagedHomeVideo }) {
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const videoUrl = content.videoUrl.trim();
  const posterUrl = content.posterUrl.trim() || brand.heroTexture;
  const hasVideo = Boolean(videoUrl) && !videoUnavailable;

  return <section id="film" className="home-video-feature" aria-labelledby="home-video-title">
    <div className="home-video-feature__frame">
      <div className="home-video-feature__media">
        {hasVideo ? <video controls preload="metadata" poster={posterUrl} onError={() => setVideoUnavailable(true)} aria-label={`${content.title} video`}><source src={videoUrl} /></video> : <div className="home-video-feature__poster" style={{ backgroundImage: `url(${posterUrl})` }} role="img" aria-label="ZAVERRE arrival film preview"><span className="home-video-feature__play" aria-hidden="true"><Play size={18} fill="currentColor" /></span><span className="home-video-feature__preview">FILM PREVIEW</span></div>}
      </div>
      <div className="home-video-feature__copy">
        <span className="home-video-feature__edition">PRIVATE PREVIEW · DUBAI</span>
        <p className="home-video-feature__eyebrow"><Sparkles size={14} aria-hidden="true" />{content.eyebrow}</p>
        <h2 id="home-video-title">{content.title}</h2>
        <p>{content.description}</p>
        <span className="home-video-feature__note">A filmic first look at the collection.</span>
      </div>
    </div>
  </section>;
}
