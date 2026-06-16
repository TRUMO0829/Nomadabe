type TravelSectionIntroProps = {
  id?: string;
  title: string;
  videoSrc?: string;
};

const DEFAULT_TRAVEL_VIDEO =
  "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4";

export function TravelSectionIntro({
  id,
  title,
  videoSrc = DEFAULT_TRAVEL_VIDEO,
}: TravelSectionIntroProps) {
  return (
    <section
      id={id}
      className="relative flex min-h-[calc(34svh/var(--site-scale))] items-end justify-center overflow-hidden bg-[#11100b] px-6 pb-12 pt-24 text-center text-[#fff8ea] lg:min-h-[calc(40svh/var(--site-scale))] lg:pb-14"
    >
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
      />
      <div className="absolute inset-0 bg-[#11100b]/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,212,0,0.18),transparent_32%),linear-gradient(180deg,rgba(17,16,11,0.1),rgba(17,16,11,0.76))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,248,234,0.45)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative z-10 mx-auto max-w-[92vw]">
        <h2 className="whitespace-nowrap text-[clamp(1.65rem,4.6vw,4.4rem)] font-semibold uppercase leading-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
          {title}
        </h2>
      </div>
    </section>
  );
}
