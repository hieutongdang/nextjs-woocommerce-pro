import Head from 'next/head';
import React from 'react';

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  children?: React.ReactNode;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  canonical,
  opengraphTitle,
  opengraphDescription,
  opengraphImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  children,
}) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* OpenGraph */}
      {opengraphTitle && <meta property="og:title" content={opengraphTitle} />}
      {opengraphDescription && <meta property="og:description" content={opengraphDescription} />}
      {opengraphImage && <meta property="og:image" content={opengraphImage} />}
      {/* Twitter */}
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      {children}
    </Head>
  );
};

export default Seo; 