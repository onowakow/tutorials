import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Hi, I'm Owen!</h1>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hi, I'm ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div style={{ maxWidth: 800 }} className="container">
        <div
          style={{ justifyContent: 'center', marginTop: '3rem' }}
          className="row"
        >
          <h1>Hi, I'm Owen!</h1>
        </div>
        <div
          style={{ justifyContent: 'center', marginTop: '2rem' }}
          className="row"
        >
          <p className="welcome-section text--center">
            I'm a full stack developer living in Wyoming. I like to{' '}
            <a href="/blog">blog</a> about web development from my professional
            and personal projects.
          </p>
          <p className="welcome-section  text--center">
            My most recent project is using the General Transit Feed
            Specification (GTFS) to publish University of Wyoming's transit data
            to Google Maps. Check it out at{' '}
            <a href="/docs/GTFS/introduction">/docs/GTFS/introduction</a>
          </p>
          <p className="welcome-section  text--center">
            My current contract work is as an <b>Angular Developer</b> and{' '}
            <b>Azure Cloud Engineer</b>. I'm open to work, and feel free to
            reach out over{' '}
            <a href="https://www.linkedin.com/in/owen-nowakowski/">LinkedIn</a>.
          </p>
        </div>
      </div>
      <main>
        <section></section>
      </main>
    </Layout>
  );
}
