// BK-IC Digital Hub — Navbar Scroll Responsiveness & Hero Transition Test Suite
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Navbar Scroll Responsiveness & Hero Transition Verification', () => {
  const navbarFile = path.resolve('src/components/layout/Navbar.tsx');
  const heroTransitionFile = path.resolve('src/components/effects/HeroToNewsTransition.tsx');
  const newsSectionFile = path.resolve('src/components/home/NewsSection.tsx');
  const homePageFile = path.resolve('src/pages/HomePage.tsx');

  it('Scenario 1: Navbar scroll threshold is reduced for immediate response (<= 16px)', () => {
    const content = fs.readFileSync(navbarFile, 'utf8');
    assert.ok(content.includes('window.scrollY > 14'), 'Navbar should use a snappy <= 16px scroll threshold');
    assert.ok(!content.includes('window.scrollY > 48'), 'Navbar should not have the sluggish 48px threshold');
  });

  it('Scenario 2: Navbar uses snappy duration and fluid cubic-bezier curve', () => {
    const content = fs.readFileSync(navbarFile, 'utf8');
    assert.ok(content.includes('duration-300'), 'Navbar should use 300ms transition duration');
    assert.ok(content.includes('cubic-bezier(0.16,1,0.3,1)'), 'Navbar should use responsive cubic-bezier easing');
    assert.ok(content.includes('will-change-[width,border-radius,padding]'), 'Navbar should optimize GPU rendering with will-change');
  });

  it('Scenario 3: HeroToNewsTransition implements a continuous vertical color gradient (#070D22 to #FFFFFF)', () => {
    assert.ok(fs.existsSync(heroTransitionFile), 'HeroToNewsTransition.tsx must exist');
    const content = fs.readFileSync(heroTransitionFile, 'utf8');
    assert.ok(content.includes('linear-gradient'), 'Should implement multi-stop linear gradient');
    assert.ok(content.includes('#070D22'), 'Should begin at Cosmic Navy #070D22');
    assert.ok(content.includes('#FFFFFF'), 'Should reach Pure White #FFFFFF');
    assert.ok(content.includes('#38BDF8'), 'Should pass through luminous Sky Blue #38BDF8');
    assert.ok(!content.includes('transparent'), 'Should reach solid #FFFFFF without transparent interpolation line artifact');
  });

  it('Scenario 4: HomePage integrates HeroToNewsTransition at the boundary seamlessly', () => {
    const content = fs.readFileSync(homePageFile, 'utf8');
    assert.ok(content.includes('HeroToNewsTransition'), 'HomePage must import and render HeroToNewsTransition');
    assert.ok(content.includes('<HeroToNewsTransition />'), 'HomePage must mount HeroToNewsTransition between Hero and News');
    assert.ok(content.includes('bg-white -mt-1'), 'Content container must use bg-white with -mt-1 overlap for continuous ribbon canvas');
  });

  it('Scenario 5: NewsSection blends smoothly into light canvas and integrates GlowingLightTrails', () => {
    const content = fs.readFileSync(newsSectionFile, 'utf8');
    assert.ok(!content.includes('SectionTransitionGlow'), 'NewsSection should not have hard dividing line at top');
    assert.ok(content.includes('GlowingLightTrails'), 'NewsSection must include GlowingLightTrails for continuous flow');
  });

  it('Scenario 6: Global ScrollToTop component restores scroll to top on page navigation', () => {
    const appFile = path.resolve('src/App.tsx');
    const scrollToTopFile = path.resolve('src/components/common/ScrollToTop.tsx');
    const aboutPageFile = path.resolve('src/pages/AboutPage.tsx');

    assert.ok(fs.existsSync(scrollToTopFile), 'ScrollToTop component file must exist');
    const appContent = fs.readFileSync(appFile, 'utf8');
    assert.ok(appContent.includes('<ScrollToTop />'), 'App.tsx must mount <ScrollToTop /> inside BrowserRouter');

    const aboutContent = fs.readFileSync(aboutPageFile, 'utf8');
    assert.ok(aboutContent.includes('window.scrollTo'), 'AboutPage must explicitly reset window scroll to top');
  });

  it('Scenario 7: PublicLayout integrates background effects (TechGridParticles, GlowingLightTrails) for all public pages', () => {
    const layoutFile = path.resolve('src/components/layout/PublicLayout.tsx');
    const content = fs.readFileSync(layoutFile, 'utf8');
    assert.ok(content.includes('TechGridParticles'), 'PublicLayout must mount TechGridParticles');
    assert.ok(content.includes('GlowingLightTrails'), 'PublicLayout must mount GlowingLightTrails');
    assert.ok(content.includes('PageTransition'), 'PublicLayout must mount PageTransition');
  });

  it('Scenario 8: PageTransition component provides smooth cross-fade and lift on route change', () => {
    const pageTransitionFile = path.resolve('src/components/effects/PageTransition.tsx');
    assert.ok(fs.existsSync(pageTransitionFile), 'PageTransition.tsx must exist');
    const content = fs.readFileSync(pageTransitionFile, 'utf8');
    assert.ok(content.includes('AnimatePresence'), 'PageTransition must use AnimatePresence');
    assert.ok(content.includes('useOutlet'), 'PageTransition must use useOutlet for clean route preservation');
  });

  it('Scenario 9: Navbar implements hysteresis deadband to prevent scroll flutter/oscillation', () => {
    const content = fs.readFileSync(navbarFile, 'utf8');
    assert.ok(content.includes('y <= 5') || content.includes('y <= 4'), 'Navbar must implement a hysteresis restore threshold near top');
    assert.ok(content.includes('!prev && window.scrollY > 14'), 'Navbar must guard downward transition against upward oscillation');
  });
});

