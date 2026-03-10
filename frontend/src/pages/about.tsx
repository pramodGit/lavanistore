import React from 'react';
import '../assets/about-page.css';
import Footer from '../layout/footer';
import Header from '../layout/header';

type Milestone = {
  year: string;
  title: string;
  description: string;
};

type Stat = {
  value: string;
  label: string;
};

// const MILESTONES: Milestone[] = [
//   {
//     year: '2016',
//     title: 'Foundation',
//     description:
//       'Started with a vision to bring quality wellness and personal care to every household.',
//   },
//   {
//     year: '2018',
//     title: 'First 1M Customers',
//     description:
//       'Reached 1 million happy customers through relentless product innovation.',
//   },
//   {
//     year: '2020',
//     title: 'Pan-India Expansion',
//     description:
//       'Scaled logistics and distribution to service all major metros and Tier 2/3 cities.',
//   },
//   {
//     year: '2022',
//     title: 'Global Presence',
//     description:
//       'Entered international markets with a growing community of distributors.',
//   },
//   {
//     year: '2024',
//     title: 'Smart Supply Chain',
//     description:
//       'Adopted AI-driven demand planning and real-time inventory visibility.',
//   },
// ];

const STATS: Stat[] = [
  { value: '250+', label: 'SKUs' },
  { value: '1.5M+', label: 'Happy Customers' },
  { value: '10K+', label: 'Distributors' },
  // { value: '18+', label: 'Countries' },
];

const BRANDS_PLACEHOLDERS = Array.from({ length: 10 }, (_, i) => i);

const AboutJourney: React.FC = () => {
  return (
    <>
      <Header />
      <main className="about">
        {/* Hero */}
        <section className="about__hero">
          <div className="about__hero-inner">
            <h2 className="about__title">Our Journey</h2>
            <p className="about__subtitle">
              From a humble start to a trusted wellness brand — here’s how we grew with you.
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="about__story">
          <div className="about__story-grid">
            <div className="about__story-media" aria-hidden="true">
              {/* Decorative illustration block */}
              <div className="about__story-blob" />
            </div>
            <div className="about__story-content">
              <h2>About Lavani Wellness</h2>
              <p>
                Lavani Wellness is committed to crafting reliable, affordable, and effective products
                for everyday wellness. We partner with trusted manufacturers, uphold strict
                quality standards, and focus on long-term value for our customers and distributors.
              </p>
              <p>
                Our community-first mindset helps us innovate faster — whether that’s simplifying
                last-mile delivery or building a transparent rewards ecosystem for our partners.
              </p>
              <ul className="about__story-points">
                <li>Scientific formulations and rigorous testing</li>
                <li>Ethical sourcing & sustainable packaging</li>
                <li>Omnichannel availability & strong post-purchase support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        {/* <section className="about__mv">
          <div className="about__mv-grid">
            <article className="about__card">
              <h3>Our Mission</h3>
              <p>
                To make high-quality wellness accessible to everyone through thoughtfully
                formulated products, reliable distribution, and a thriving partner network.
              </p>
            </article>
            <article className="about__card">
              <h3>Our Vision</h3>
              <p>
                To be a globally admired, people-first brand that elevates everyday living
                with trust, consistency, and measurable results.
              </p>
            </article>
            <article className="about__card">
              <h3>Our Promise</h3>
              <p>
                We’ll always choose integrity over shortcuts—clear labels, honest claims,
                and support that actually supports.
              </p>
            </article>
          </div>
        </section> */}

        {/* Timeline */}
        {/* <section className="about__timeline">
          <h2 className="about__section-title">Milestones</h2>
          <div className="about__timeline-track" role="list" aria-label="Company milestones">
            {MILESTONES.map((m, idx) => (
              <article className="about__timeline-item" role="listitem" key={m.year}>
                <div className="about__timeline-node" aria-hidden="true" />
                <div className="about__timeline-year" aria-label={`Year ${m.year}`}>
                  {m.year}
                </div>
                <h3 className="about__timeline-title">{m.title}</h3>
                <p className="about__timeline-desc">{m.description}</p>
              </article>
            ))}
          </div>
        </section> */}

        {/* Stats */}
        <section className="about__stats" aria-label="Key statistics">
          <ul className="about__stats-grid">
            {STATS.map((s) => (
              <li className="about__stat" key={s.label}>
                <div className="about__stat-value" aria-label={s.label}>{s.value}</div>
                <div className="about__stat-label">{s.label}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Our Brands (placeholders with shimmer) */}
        <section className="about__brands">
          <div className="about__brands-header">
            <h2 className="about__section-title">Our Brands</h2>
            <p className="about__brands-sub">
              Preview of our portfolio. Images intentionally replaced with animated placeholders.
            </p>
          </div>
          <div className="about__brands-grid" role="list" aria-label="Brand thumbnails">
            {BRANDS_PLACEHOLDERS.map((i) => (
              <div className="about__brand about__brand--loading" role="listitem" key={i}>
                <span className="sr-only">Brand placeholder {i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Founder / Leadership */}
        <section className="about__founder">
          <div className="about__founder-card">
            <div className="about__founder-avatar" aria-hidden="true" />
            <div className="about__founder-content">
              <h3>From Our Founder</h3>
              <p>
                “We built Lavani Wellness on trust. Every product we ship is a promise—of quality,
                consistency, and support. Thank you for being part of our story.”
              </p>
              <div className="about__founder-meta">
                <strong>Founder & CEO</strong>
                <span>Lavani Wellness</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about__cta">
          <h2>Be Part of the Journey</h2>
          <p>Join our distributor network or explore our range of wellness products today.</p>
          <div className="about__cta-actions">
            <a className="btn btn--primary" href="/shop">Explore Products</a>
            <a className="btn btn--ghost" href="/contact">Let’s Get in Touch</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutJourney;
