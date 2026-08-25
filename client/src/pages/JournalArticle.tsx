import { journalArticles } from "@/config/homeContent";
import { useCmsContent } from "@/hooks/useCmsContent";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

function JournalVisual({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  if (imageUnavailable) {
    return (
      <figure className="journal-article-image journal-article-image--fallback">
        <span>THE ZAVERRE JOURNAL</span>
        <strong>{title}</strong>
        <i>Curated roads. Considered arrivals.</i>
      </figure>
    );
  }

  return <figure className="journal-article-image"><img src={src} alt={alt} decoding="async" fetchPriority="high" onError={() => setImageUnavailable(true)} /></figure>;
}

export default function JournalArticle({ params }: { params: { slug: string } }) {
  const content = useCmsContent();
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const journalBackPressRef = useRef<number | null>(null);
  const managed = content.data?.journal.find((item) => item.slug === params.slug);
  const article = managed ? {
    slug: managed.slug,
    eyebrow: managed.eyebrow,
    title: managed.title,
    summary: managed.summary,
    image: managed.imageUrl,
    imageAlt: managed.imageAlt,
    paragraphs: (() => { try { return JSON.parse(managed.paragraphsJson) as string[]; } catch { return []; } })(),
  } : journalArticles.find((item) => item.slug === params.slug);

  useEffect(() => () => {
    if (journalBackPressRef.current !== null) window.clearTimeout(journalBackPressRef.current);
  }, []);

  const returnFromArticle = () => {
    if (journalBackPressRef.current !== null) {
      window.clearTimeout(journalBackPressRef.current);
      journalBackPressRef.current = null;
      navigate("/");
      return;
    }
    journalBackPressRef.current = window.setTimeout(() => {
      journalBackPressRef.current = null;
      navigate("/");
    }, 420);
  };

  if (!article) {
    return (
      <main id="main-content" className="journal-not-found">
        <div className="journal-not-found-menu"><PublicMobileMenu /></div>
        <p className="eyebrow">ZAVERRE JOURNAL</p>
        <h1>Article unavailable.</h1>
        <Link href="/" className="button button-gold">BACK TO HOME <ArrowLeft size={17} /></Link>
      </main>
    );
  }

  return (
    <main id="main-content" className={`journal-article-page${theme === "light" ? " zaverre-day" : ""}`}>
      <header className="journal-article-header">
        <button type="button" className="journal-back" onClick={returnFromArticle}><ArrowLeft size={16} /> BACK</button>
        <div className="journal-article-actions"><PublicMobileMenu /></div>
      </header>
      <article className="journal-article">
        <div className="journal-article-intro">
          <p className="eyebrow">{article.eyebrow}</p>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
        </div>
        <JournalVisual src={article.image} alt={article.imageAlt} title={article.title} />
        <div className="journal-article-body">
          {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <aside>
            <strong>Want to confirm availability?</strong>
            <span>Contact ZAVERRE with the vehicle, your preferred dates, and location.</span>
            <a href={`mailto:${content.contact.email}`}>{content.contact.email} <ArrowUpRight size={15} /></a>
          </aside>
        </div>
      </article>
    </main>
  );
}
