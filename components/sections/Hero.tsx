import Image from "next/image";
import { ArrowDown, MapPin } from "lucide-react";
import { heroStats, navLinks, profile } from "@/lib/content";
import { LinkedinIcon } from "@/components/ui";

export default function Hero() {
  return (
    <section id="top" data-hero className="relative isolate overflow-hidden lg:h-[100svh] lg:min-h-[700px]">
      {/* ---------------------------------------------------------------- nav */}
      <header data-build="pop" className="absolute inset-x-0 top-0 z-30">
        <nav className="container-x flex items-center justify-between py-5" aria-label="Primary">
          <a href="#top" className="link-u font-display text-xl tracking-wide" aria-label={`${profile.name}, home`}>
            SR<span className="text-accent">.</span>
          </a>
          <ul className="hidden items-center gap-7 font-mono text-[11px] tracking-[0.18em] text-zinc-400 uppercase md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a className="link-u" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm !px-2.5"
              aria-label="LinkedIn profile (opens in a new tab)"
            >
              <LinkedinIcon />
            </a>
            <a href="#contact" className="btn btn-ghost btn-sm">
              Let&apos;s talk
            </a>
          </div>
        </nav>
      </header>

      {/* ---------------------------------------------------------------- giant word */}
      <div className="pointer-events-none relative z-0 pt-24 text-center select-none lg:absolute lg:inset-x-0 lg:top-[10svh] lg:pt-0">
        <p
          aria-hidden="true"
          data-build="wipe"
          className="portfolio-word inline-block font-display text-[21vw] leading-[0.82] tracking-[-0.01em] uppercase lg:text-[19vw]"
        >
          Portfolio
        </p>
      </div>

      {/* ---------------------------------------------------------------- portrait */}
      <div
        data-build="pop"
        className="relative z-10 mx-auto -mt-[5vw] h-[64svh] max-h-[620px] min-h-[380px] w-fit lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:h-[80svh] lg:max-h-none lg:-translate-x-1/2 xl:h-[86svh]"
      >
        <div
          aria-hidden="true"
          className="absolute bottom-[6%] left-1/2 aspect-square w-[150%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_59_47/0.45),rgb(255_59_47/0.14)_55%,transparent)] blur-2xl"
        />
        <Image
          src="/headshot.png"
          alt={`Portrait of ${profile.name}`}
          width={1100}
          height={1805}
          priority
          sizes="(min-width: 1024px) 52vh, 80vw"
          className="relative h-full w-auto contrast-125 grayscale [mask-image:linear-gradient(to_bottom,black_60%,transparent_97%)]"
        />
      </div>

      {/* ---------------------------------------------------------------- intro (left) */}
      <div className="relative z-20 -mt-24 px-5 lg:absolute lg:bottom-[11svh] lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:mt-0 lg:max-w-[min(29rem,30vw)] lg:px-0">
        <p data-build="type" className="-rotate-3 font-brush text-3xl text-zinc-300 md:text-4xl">
          Hello, I&apos;m
        </p>
        <h1
          data-build="wipe"
          className="mt-2 font-display text-[clamp(3.4rem,15vw,5rem)] leading-[0.88] uppercase lg:text-[clamp(3.2rem,5.6vw,6.25rem)]"
        >
          {profile.firstName}
          <br />
          {profile.lastName}
        </h1>
        <p data-build="type" className="mt-4 font-mono text-xs tracking-[0.2em] text-accent uppercase md:text-sm">
          {profile.role}
        </p>
        <p data-build="type" className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-zinc-400">
          {profile.bio}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
          <a data-build="pop" href="#work" className="btn btn-primary">
            View work <ArrowDown className="size-4" aria-hidden />
          </a>
          <p data-build="type" className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase">
            <MapPin className="size-3.5 text-accent" aria-hidden />
            Based in {profile.location}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- stats (right) */}
      <dl className="relative z-20 grid grid-cols-3 gap-4 px-5 pt-12 pb-20 lg:absolute lg:right-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:bottom-[11svh] lg:grid-cols-1 lg:gap-7 lg:p-0 lg:text-right">
        {heroStats.map((s) => (
          <div data-build="pop" key={s.value} className="flex flex-col-reverse gap-1.5">
            <dt className="font-mono text-[10px] leading-snug tracking-[0.12em] text-zinc-500 uppercase lg:ml-auto lg:max-w-[22ch] lg:text-[11px]">
              {s.label}
            </dt>
            <dd className="font-display text-[clamp(1.75rem,8vw,2.5rem)] leading-none text-zinc-50 lg:text-5xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] hidden h-28 bg-gradient-to-t from-ink to-transparent lg:block"
      />
    </section>
  );
}
