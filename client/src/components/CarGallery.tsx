import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type CarGalleryImage = { src: string; alt: string };

export function CarGallery({ vehicleName, images, imageFit = "contain" }: { vehicleName: string; images: CarGalleryImage[]; imageFit?: "contain" | "cover" | "fill" }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const swipeRef = useRef({ active: false, moved: false, pointerId: -1, startX: 0 });
  const suppressMainClickRef = useRef(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailDrag = useRef({ active: false, moved: false, pointerId: -1, startX: 0, startScrollLeft: 0 });
  const gallery = images.length ? images : [];
  const navigateImage = (direction: -1 | 1) => setActiveImage((current) => (current + direction + gallery.length) % gallery.length);

  if (!gallery.length) return null;

  const endThumbnailDrag = (event: { pointerId: number }) => {
    const strip = thumbnailsRef.current;
    if (!thumbnailDrag.current.active || thumbnailDrag.current.pointerId !== event.pointerId) return;
    if (strip?.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
    thumbnailDrag.current.active = false;
  };

  const chooseThumbnail = (index: number) => {
    if (thumbnailDrag.current.moved) { thumbnailDrag.current.moved = false; return; }
    setActiveImage(index);
  };

  return <>
    <div className="detail-gallery" aria-label={`${vehicleName} photo gallery`} onPointerDown={(event) => { if (event.pointerType === "mouse" && event.button !== 0) return; swipeRef.current = { active: true, moved: false, pointerId: event.pointerId, startX: event.clientX }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const swipe = swipeRef.current; if (!swipe.active || swipe.pointerId !== event.pointerId) return; if (Math.abs(event.clientX - swipe.startX) > 12) swipe.moved = true; }} onPointerUp={(event) => { const swipe = swipeRef.current; if (!swipe.active || swipe.pointerId !== event.pointerId) return; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); swipe.active = false; const difference = event.clientX - swipe.startX; if (swipe.moved && gallery.length > 1 && Math.abs(difference) > 42) navigateImage(difference < 0 ? 1 : -1); if (swipe.moved) { suppressMainClickRef.current = true; requestAnimationFrame(() => { suppressMainClickRef.current = false; }); } }} onPointerCancel={() => { swipeRef.current.active = false; }}>
      <button type="button" className="detail-main-image-trigger" onClick={() => { if (!suppressMainClickRef.current) setLightboxOpen(true); }} aria-label={`Open ${vehicleName} photo in lightbox`}>{failedSource === gallery[activeImage]?.src ? <span className="detail-main-image-fallback"><small>VERIFIED VEHICLE IMAGE</small><strong>{vehicleName}</strong><i>IMAGE TEMPORARILY UNAVAILABLE</i></span> : <img src={gallery[activeImage]?.src} alt={gallery[activeImage]?.alt} decoding="async" fetchPriority="high" className="detail-main-image" style={{ objectFit: imageFit }} onError={() => setFailedSource(gallery[activeImage]?.src ?? null)} />}</button>
      <div className="detail-gallery-shade" />
      {gallery.length > 1 && <div className="gallery-swipe-cues" aria-hidden="true"><ChevronLeft size={22} /><ChevronRight size={22} /></div>}
      <button className="gallery-expand" onClick={() => setLightboxOpen(true)} aria-label="Enlarge gallery image"><Expand size={18} /></button>
      <span className="gallery-count">{String(activeImage + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>
    </div>
    {gallery.length > 1 && <div ref={thumbnailsRef} className="gallery-thumbnails" aria-label="Choose a vehicle photo" onPointerDown={(event) => { const strip = thumbnailsRef.current; if (!strip || (event.pointerType === "mouse" && event.button !== 0)) return; thumbnailDrag.current = { active: true, moved: false, pointerId: event.pointerId, startX: event.clientX, startScrollLeft: strip.scrollLeft }; strip.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const strip = thumbnailsRef.current; const drag = thumbnailDrag.current; if (!strip || !drag.active || drag.pointerId !== event.pointerId) return; const delta = event.clientX - drag.startX; if (Math.abs(delta) > 4) drag.moved = true; strip.scrollLeft = drag.startScrollLeft - delta; }} onPointerUp={endThumbnailDrag} onPointerCancel={endThumbnailDrag}>{gallery.map((image, index) => <button key={`${image.src}-${index}`} className={index === activeImage ? "active" : ""} onClick={() => chooseThumbnail(index)} aria-label={`Show photo ${index + 1} of ${gallery.length}`}><img src={image.src} alt="" loading="lazy" /></button>)}</div>}
    <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}><DialogContent className="detail-lightbox"><DialogTitle className="sr-only">{vehicleName} image gallery</DialogTitle><button className="detail-lightbox-close" onClick={() => setLightboxOpen(false)}><X /></button><img src={gallery[activeImage]?.src} alt={gallery[activeImage]?.alt} loading="lazy" decoding="async" style={{ objectFit: imageFit }} /></DialogContent></Dialog>
  </>;
}
