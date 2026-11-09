import {
  Activity,
  FileText,
  KeyRound,
  Layers,
  Link2,
  MapPin,
  PenLine,
  Search,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { about, principles, skills, type SkillIcon } from "@/lib/content";
import { SectionLabel } from "@/components/ui";

const icons: Record<SkillIcon, LucideIcon> = {
  search: Search,
  sparkles: Sparkles,
  wrench: Wrench,
  file: FileText,
  map: MapPin,
  key: KeyRound,
  pen: PenLine,
  link: Link2,
  activity: Activity,
  layers: Layers,
};

export default function About() {
  return (
    <section id="about" className="section border-t border-white/[0.06]">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="04" label="About" />
            <h2 data-build="wipe" className="h-display lg:!text-[clamp(3rem,6vw,5.75rem)]">
              Findable,
              <br />
              <span className="text-accent">by design</span>
            </h2>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400 md:text-base">
              {about.paragraphs.map((p) => (
                <p data-build="type" key={p.slice(0, 24)}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 data-build="type" className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
              Skills
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {skills.map((s) => {
                const Icon = icons[s.icon];
                return (
                  <li
                    data-build="pop"
                    key={s.name}
                    className="flex items-start gap-3.5 rounded-xl border border-white/[0.07] bg-zinc-900/40 p-4 transition-colors duration-200 hover:border-white/15"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-zinc-100">{s.name}</span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{s.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-24">
          <h3 data-build="type" className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
            Principles I work by
          </h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li
                data-build="pop"
                key={p.title}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/70 to-zinc-950/30 p-6"
              >
                <span className="font-display text-5xl leading-none text-accent/90">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-6 font-display text-xl tracking-wide uppercase">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
