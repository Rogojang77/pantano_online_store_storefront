import Link from 'next/link';
import { siteConfig } from '@/config/site';

const LOGO_PATH = '/images/logo.svg';

type LogoProps = {
  /** Link wrapper: set to false to render only the image (e.g. in footer) */
  linkToHome?: boolean;
  /** CSS class for the img (e.g. height) */
  className?: string;
  /** Alt text for the image */
  alt?: string;
};

export function Logo({
  linkToHome = true,
  className = 'h-10',
  alt = siteConfig.name,
}: LogoProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- SVG scales; no need for next/image
    <img src={LOGO_PATH} alt={alt} className={className} />
  );

  if (linkToHome) {
    return (
      <Link href="/" aria-label={`${siteConfig.name} – acasă`}>
        {img}
      </Link>
    );
  }

  return img;
}
