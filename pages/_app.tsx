import type { AppProps } from "next/app";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <main className={`${fraunces.variable} ${spaceGrotesk.variable} font-[var(--font-body)]`}>
      <Component {...pageProps} />
    </main>
  );
}
