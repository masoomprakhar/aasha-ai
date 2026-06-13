export function AshaNetworkBanner() {
  return (
    <div className="w-full bg-canvas" aria-label="ASHA workers coordination network">
      <img
        src="/images/asha-network-collage.png"
        alt="ASHA workers providing community healthcare, coordination, and NGO support across rural India"
        className="block w-full h-auto min-h-[180px] sm:min-h-[240px] object-cover object-center"
        width={1920}
        height={640}
        loading="lazy"
      />
    </div>
  );
}
