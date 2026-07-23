import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export type Lang = 'en' | 'ar' | 'ckb' | 'kmr';

let globalLang: Lang = 'en';
export const getLang = () => globalLang;
export const setGlobalLang = (l: Lang) => { globalLang = l; };

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medlab-website-lang') as Lang || 'en';
    setGlobalLang(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    setReady(true);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).gtag?.('config', 'G-XXXXXXXXXX', { page_path: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  if (!ready) return null;
  return <Component {...pageProps} />;
}