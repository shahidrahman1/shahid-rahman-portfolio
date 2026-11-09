import type { Metadata, Viewport } from "next";
import { Anton, Caveat_Brush, Geist, Geist_Mono } from "next/font/google";
import AgentLayer from "@/components/agents/AgentLayer";
import BootLoader from "@/components/agents/BootLoader";
import Dock from "@/components/agents/Dock";
import { HEAD_SCRIPT } from "@/lib/agents/config";
import { profile } from "@/lib/content";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--ff-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--ff-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--ff-mono", display: "swap" });
const brush = Caveat_Brush({ weight: "400", subsets: ["latin"], variable: "--ff-brush", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.bio,
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: profile.bio,
    type: "website",
    images: ["/headshot.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${brush.variable}`}
    >
      <head>
        {/* Must run before first paint: hides unbuilt elements so nothing flashes. */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <BootLoader />
        {children}
        <Dock />
        <AgentLayer />
      </body>
    </html>
  );
}
