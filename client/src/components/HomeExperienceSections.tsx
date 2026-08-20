import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { deliveryLocations, journalArticles, rentalFaqs } from "@/config/homeContent";
import { useCmsContent } from "@/hooks/useCmsContent";
import { ArrowUpRight, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";

export function DeliveryLocationsSection() {
  return (
    <section className="delivery-section" id="delivery" aria-labelledby="delivery-title">
      <div className="delivery-inner">
        <div className="delivery-intro">
          <p className="eyebrow">DELIVERY LOCATIONS</p>
          <h2 id="delivery-title">
            Considered arrival.<br />
            <em>Wherever the journey starts.</em>
          </h2>
          <p>ZAVERRE reviews the collection or delivery location and timing with your enquiry, then confirms the arrangement and applicable cost before booking.</p>
          <div className="delivery-policy">
            <Truck size={19} />
            <span>Delivery arrangements and fees are confirmed by location</span>
          </div>
        </div>
        <ul className="delivery-location-grid" aria-label="Available delivery locations">
          {deliveryLocations.map((location) => (
            <li key={location}>
              <MapPin size={15} aria-hidden="true" />
              <span>{location}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RentalFaqSection() {
  const content = useCmsContent();
  const faqs = content.data?.faqs.length ? content.data.faqs : rentalFaqs;
  return (
    <section className="home-faq-section" id="rental-faq" aria-labelledby="home-faq-title">
      <div className="home-faq-inner">
        <div className="home-faq-intro">
          <p className="eyebrow">RENTAL QUESTIONS</p>
          <h2 id="home-faq-title">
            The details.<br />
            <em>Without the friction.</em>
          </h2>
          <p>Clear initial answers before you submit a request, with ZAVERRE confirming the terms for the selected vehicle.</p>
          <div className="home-faq-assurance"><ShieldCheck size={18} /> Clear terms before booking confirmation</div>
        </div>
        <Accordion type="single" collapsible className="home-faq-list">
          {faqs.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function JournalPreviewSection() {
  const content = useCmsContent();
  const articles = content.data?.journal.length ? content.data.journal.map((item) => ({
    slug: item.slug,
    eyebrow: item.eyebrow,
    title: item.title,
    summary: item.summary,
    image: item.imageUrl,
    imageAlt: item.imageAlt,
  })) : journalArticles;
  return (
    <section className="journal-preview-section" id="journal" aria-labelledby="journal-preview-title">
      <div className="journal-preview-inner">
        <div className="journal-preview-head">
          <div>
            <p className="eyebrow">THE ZAVERRE JOURNAL</p>
            <h2 id="journal-preview-title">
              Plan the drive.<br />
              <em>Enjoy the story.</em>
            </h2>
          </div>
          <p>Three practical guides for a clearer supercar journey, from choosing the car to route planning and rental requirements.</p>
        </div>
        <div className="journal-card-grid">
          {articles.map((article) => (
            <Link key={article.slug} href={`/journal/${article.slug}`} className="journal-card" aria-label={`Open article: ${article.title}`}>
              <img src={article.image} alt={article.imageAlt} loading="lazy" width="1600" height="1195" />
              <span className="journal-card-overlay">
                <span className="journal-card-eyebrow">{article.eyebrow}</span>
                <strong>{article.title}</strong>
                <span className="journal-card-open">READ ARTICLE <ArrowUpRight size={15} /></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
