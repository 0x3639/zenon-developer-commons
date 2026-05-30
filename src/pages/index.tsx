import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type Persona = {
  eyebrow: string;
  title: string;
  blurb: string;
  to: string;
};

const PERSONAS: Persona[] = [
  {
    eyebrow: 'Enthusiast / Investor',
    title: 'Understand the vision',
    blurb:
      'Start with the narrative essays and plain-language overviews. Why Zenon verifies before it trusts, and what that unlocks.',
    to: '/for-enthusiasts',
  },
  {
    eyebrow: 'Developer',
    title: 'Build on the architecture',
    blurb:
      'Architecture deep-dives, specifications, and implementation guides — light clients, Bitcoin SPV, zApps, and networking.',
    to: '/for-developers',
  },
  {
    eyebrow: 'Researcher',
    title: 'Go to the primitives',
    blurb:
      'Formal specs, the core papers, bounded-verification research, and the hostile reviews that stress-test every claim.',
    to: '/for-researchers',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroLede}>
          A research commons exploring the technical architecture of Zenon — the
          Network of Momentum. Choose the path that fits how you want to read.
        </p>
      </div>
    </header>
  );
}

function PersonaCards() {
  return (
    <section className="container">
      <div className="persona-grid">
        {PERSONAS.map((p) => (
          <Link key={p.to} className="persona-card" to={p.to}>
            <span className="persona-eyebrow">{p.eyebrow}</span>
            <Heading as="h3">{p.title}</Heading>
            <p>{p.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Verification-first architecture for the Network of Momentum.">
      <HomepageHeader />
      <main>
        <PersonaCards />
      </main>
    </Layout>
  );
}
