import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/lib/content";
import CopyEmail from "@/components/CopyEmail";
import { LinkedinIcon, SectionLabel } from "@/components/ui";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="section pb-28 md:pb-32">
      <div className="container-x">
        <SectionLabel index="05" label="Contact" />
        <h2 data-build="wipe" className="h-display">
          Let&apos;s get
          <br />
          you <span className="text-accent">found</span>
        </h2>

        <div
          data-build="pop"
          className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-7 md:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 -right-1/4 aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_59_47/0.22),transparent)]"
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.02] uppercase">
                Want your site ranking higher on Google and showing up in AI answers?
              </p>
              <p className="mt-4 max-w-[48ch] text-zinc-400">
                Tell me about your site and goals. I&apos;ll reply by email.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="btn btn-primary">
                  <Mail className="size-4" aria-hidden /> Email me
                </a>
                <CopyEmail email={profile.email} />
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <LinkedinIcon /> LinkedIn
                </a>
              </div>
            </div>

            <dl className="space-y-6 font-mono text-sm lg:col-span-5 lg:justify-self-end">
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-zinc-500 uppercase">Email</dt>
                <dd className="mt-1.5 break-all">
                  <a className="link-u text-zinc-200" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-zinc-500 uppercase">LinkedIn</dt>
                <dd className="mt-1.5">
                  <a
                    className="link-u inline-flex items-center gap-1 text-zinc-200"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    in/{profile.linkedinHandle} <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div
          data-build="pop"
          className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 font-mono text-xs text-zinc-500 md:flex-row md:items-center md:justify-between"
        >
          <p>
            © {year} {profile.name} · {profile.role}
          </p>
          <p className="hidden lg:block">
            Built live by robot agents · press <span className="text-zinc-300">T</span> for a tour
          </p>
          <a href="#top" className="link-u inline-flex w-fit items-center gap-1.5 text-zinc-400">
            Back to top <ArrowUp className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
