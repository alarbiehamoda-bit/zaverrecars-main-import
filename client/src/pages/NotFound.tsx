import { ZaverreMark } from "@/components/ZaverreMark";
import { PublicMobileMenu } from "@/components/PublicMobileMenu";
import { ArrowLeft, Compass } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <main className="zaverre-not-found">
      <header className="public-error-header"><PublicMobileMenu /></header>
      <div className="zaverre-not-found__mark"><ZaverreMark className="zaverre-not-found__logo" label="ZAVERRE" /></div>
      <p className="eyebrow">ZAVERRE · NAVIGATION</p>
      <h1>404</h1>
      <h2>This route has<br /><em>moved on.</em></h2>
      <p className="zaverre-not-found__copy">The page you requested is no longer available. Return to the collection to continue exploring.</p>
      <button id="not-found-button-group" className="button button-gold" onClick={handleGoHome}><Compass size={17} /> RETURN TO ZAVERRE <ArrowLeft size={16} /></button>
    </main>
  );
}
