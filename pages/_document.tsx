import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang="tr">
      <Head>
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://uxatteyrnfxztxjplqtr.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://uxatteyrnfxztxjplqtr.supabase.co" />
        <link rel="preconnect" href="https://picsum.photos" crossOrigin="" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/og.svg" />
        <link rel="apple-touch-icon" href="/og.svg" />

        {/* PWA */}
        <meta name="application-name" content="hangimekan" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="hangimekan" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Theme */}
        <meta name="theme-color" content="#FF385C" />
        <meta name="msapplication-TileColor" content="#FF385C" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
