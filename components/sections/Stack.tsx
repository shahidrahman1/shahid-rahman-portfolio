import { stack } from "@/lib/content";
import { SectionLabel } from "@/components/ui";

export default function Stack() {
  return (
    <section id="stack" className="section border-y border-white/[0.06] bg-zinc-950/60">
      <div className="container-x grid items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="02" label="Stack" />
          <h2 data-build="wipe" className="h-display">
            The toolkit
          </h2>
        </div>
        <p data-build="type" className="max-w-[40ch] text-zinc-400 lg:col-span-5">
          The tools and platforms I use to research, audit, optimize and measure, from Ahrefs and Screaming Frog to
          Google Search Console and AI answer engines.
        </p>
      </div>

      <div
        data-build="wipe"
        className="marquee group relative mt-14 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              aria-label={copy === 0 ? "Tools and platforms" : undefined}
              className="marquee-copy flex shrink-0 items-center"
            >
              {stack.map((tool) => (
                <li key={tool} className="flex items-center">
                  <span className="px-6 font-display text-4xl whitespace-nowrap text-zinc-200 uppercase transition-colors duration-200 hover:text-accent md:px-9 md:text-6xl">
                    {tool}
                  </span>
                  <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-accent" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
