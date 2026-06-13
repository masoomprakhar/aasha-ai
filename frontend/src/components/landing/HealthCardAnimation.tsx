export function HealthCardAnimation() {
  return (
    <section className="bg-canvas py-12 lg:py-16" aria-label="Digital health card">
      <div className="relative w-full aspect-video">
        <iframe
          src="/asha-health-card-animation.html"
          title="ASHA AI digital health card"
          className="absolute inset-0 w-full h-full border-0 bg-canvas"
          loading="lazy"
          scrolling="no"
        />
      </div>
    </section>
  );
}
