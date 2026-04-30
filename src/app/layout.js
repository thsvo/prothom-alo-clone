import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
});

export const metadata = {
  title: "সময়ের ঘটনা | সর্বশেষ বাংলা খবর",
  description: "Bengali News portal clone",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${notoSansBengali.variable} ${notoSerifBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50">{children}</body>
    </html>
  );
}
