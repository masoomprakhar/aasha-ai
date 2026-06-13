import { Navbar, Hero, HealthCardAnimation, VoiceDataFlow, TaglineBand, Footer } from '../components/landing';

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      <Navbar />
      <main>
        <Hero />
        <HealthCardAnimation />
        <VoiceDataFlow />
        <TaglineBand />
      </main>
      <Footer />
    </div>
  );
}
