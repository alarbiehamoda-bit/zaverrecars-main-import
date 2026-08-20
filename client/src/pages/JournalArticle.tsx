import { journalArticles } from "@/config/homeContent";
import { contact, whatsappUrl } from "@/config/contact";
import { useCmsContent, whatsappHref } from "@/hooks/useCmsContent";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function JournalArticle({ params }: { params: { slug: string } }) {
  const content = useCmsContent();
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

  if (!article) {
    return (
      <main className="journal-not-found">
        <p className="eyebrow">ZAVERRE JOURNAL</p>
        <h1>Article unavailable.</h1>
        <Link href="/" className="button button-gold">BACK TO HOME <ArrowLeft size={17} /></Link>
      </main>
    );
  }

  return (
    <main className="journal-article-page">
      <header className="journal-article-header">
        <Link href="/" className="journal-back"><ArrowLeft size={16} /> BACK TO ZAVERRE</Link>
        <a href={whatsappHref(content.contact, `Hello ZAVERRE, I would like to enquire after reading: ${article.title}`)} target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={15} /></a>
      </header>
      <article className="journal-article">
        <div className="journal-article-intro">
          <p className="eyebrow">{article.eyebrow}</p>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
        </div>
        <figure className="journal-article-image"><img src={article.image} alt={article.imageAlt} /></figure>
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
