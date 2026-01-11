import React from 'react';
import NextLink, { LinkProps } from 'next/link';

type AppLinkProps = React.PropsWithChildren<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to?: LinkProps['href'];
    href?: LinkProps['href'];
  }
>;

const AppLink = ({ to, href, ...props }: AppLinkProps) => {
  const target = to ?? href ?? '#';
  return <NextLink href={target} {...props} />;
};

export default AppLink;
