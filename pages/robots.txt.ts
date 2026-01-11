import type { GetServerSideProps } from 'next';

const buildRobots = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hangimekan.co';
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robots = buildRobots();

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();

  return { props: {} };
};

const Robots = () => null;

export default Robots;
