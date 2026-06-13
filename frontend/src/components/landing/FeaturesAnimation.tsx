export function FeaturesAnimation() {
  return (
    <div className="w-full pt-4 pb-12 lg:pb-20" aria-label="ASHA AI features">
      <div className="relative w-full aspect-video">
        <iframe
          src="/asha-features-animation.html"
          title="ASHA AI features overview"
          className="absolute inset-0 w-full h-full border-0 bg-canvas"
          loading="lazy"
          scrolling="no"
        />
      </div>
    </div>
  );
}
