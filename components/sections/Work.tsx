import { ArrowUpRight, Code2, Globe } from "lucide-react";
import { projects, workStats } from "@/lib/content";
import { SectionLabel } from "@/components/ui";

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container-x">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01" label="Selected work" />
            <h2 data-build="wipe" className="h-display">
              Work that
              <br />
              <span className="text-accent">ships</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p data-build="type" className="max-w-[44ch] text-zinc-400">
              Six campaigns across technical SEO, link building, local search and AI search visibility, each with
              measurable results.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {workStats.map((s) => (
                <div data-build="pop" key={s.label} className="flex flex-col-reverse gap-1.5">
                  <dt className="font-mono text-[10px] leading-snug tracking-[0.12em] text-zinc-500 uppercase">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <ul className="mt-16 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.title} className="flex">
              <article
                data-build="pop"
                className="group flex w-full flex-col rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 transition-colors duration-300 hover:border-white/20 hover:bg-zinc-900/70 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-mono text-[11px] tracking-[0.15em] text-zinc-500 uppercase">
                    <span className="text-zinc-300">{String(i + 1).padStart(2, "0")}</span>
                    {p.period ? <span> · {p.period}</span> : null}
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl leading-none text-accent md:text-4xl">{p.highlight.value}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-zinc-500 uppercase">
                      {p.highlight.label}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 font-display text-2xl leading-[1.05] tracking-wide uppercase md:text-[1.9rem]">
                  {p.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-zinc-500">{p.client}</p>

                <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-zinc-300">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <ul className="flex flex-wrap gap-2" aria-label="Techniques">
                    {p.chips.map((c) => (
                      <li
                        key={c}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-400"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                        <Globe className="size-3.5" aria-hidden /> Live site
                      </a>
                    ) : null}
                    {p.codeUrl ? (
                      <a href={p.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                        <Code2 className="size-3.5" aria-hidden /> Code
                      </a>
                    ) : null}
                    <a href="#contact" className="btn btn-ghost btn-sm">
                      Ask about this project <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
