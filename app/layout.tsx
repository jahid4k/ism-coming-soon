import type { Metadata, Viewport } from "next";
import "@fontsource/alegreya-sans/400.css";
import "@fontsource/alegreya-sans/500.css";
import "@fontsource/alegreya-sans/700.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./tokens.css";
import "./globals.css";
import { site } from "@/lib/site";

const title = `${site.name}: coming soon`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  openGraph: { title, description: site.description, siteName: site.name, type: "website" },
  twitter: { card: "summary", title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0A1230" };

// Runs before first paint so the page never flashes the wrong atmosphere.
// Dawn from 06:00 to 18:00 local time, night otherwise, unless the visitor chose one.
const atmosphereScript = `(function(){try{var s=localStorage.getItem("atmosphere");var h=new Date().getHours();var a=(s==="dawn"||s==="night")?s:(h>=6&&h<18?"dawn":"night");document.documentElement.setAttribute("data-atmosphere",a);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",a==="dawn"?"#F7F1E6":"#0A1230")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-atmosphere="night" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: atmosphereScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
