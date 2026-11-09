import { Award, Briefcase, GraduationCap } from "lucide-react";
import { record, type RecordItem } from "@/lib/content";
import { SectionLabel } from "@/components/ui";

const kindStyle: Record<RecordItem["kind"], { cls: string; Icon: typeof Briefcase }> = {
  Experience: { cls: "border-accent/40 text-accent", Icon: Briefcase },
  Education: { cls: "border-zinc-300/30 text-zinc-200", Icon: GraduationCap },
  Certification: { cls: "border-zinc-500/40 text-zinc-400", Icon: Award },
};

export default function RecordSection() {
  return (
    <section id="record" className="section">
      <div className="container-x">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="03" label="Record" />
            <h2 data-build="wipe" className="h-display">
              On the record
            </h2>
          </div>
          <p data-build="type" className="max-w-[40ch] text-zinc-400 lg:col-span-5">
            Experience, education and certifications, most recent first.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-accent/60 via-white/10 to-white/5 md:left-[229px]"
          />
          <ol>
          {record.map((item) => {
            const k = kindStyle[item.kind];
            return (
              <li
                data-build="pop"
                key={`${item.date}-${item.title}`}
                className="relative grid gap-2 pb-11 pl-9 last:pb-0 md:grid-cols-[200px_1fr] md:gap-14 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-accent bg-ink md:left-[224px]"
                />
                <p className="font-mono text-xs tracking-[0.12em] text-zinc-400 uppercase md:pt-0.5 md:text-right">
                  {item.date}
                </p>
                <div className="md:pl-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase ${k.cls}`}
                  >
                    <k.Icon className="size-3" aria-hidden />
                    {item.kind}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-tight tracking-wide uppercase md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{item.org}</p>
                  {item.note ? <p className="mt-2 max-w-[60ch] text-sm text-zinc-500">{item.note}</p> : null}
                </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
