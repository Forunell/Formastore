import { useState } from 'react';
import { HeroArt } from './Illustration';
import s from './App.module.css';

export function HeroImage() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return <><HeroArt/><span className={s.imageFallback}>Демоілюстрація · зображення недоступне</span></>;
  return <div className={`${s.heroImage} ${loaded ? s.imageLoaded : ''}`} aria-busy={!loaded}>
    <img src="/images/warm-editorial-hero.jpg" width="1536" height="1024" fetchPriority="high" alt="Концептуальна AI-візуалізація: теракотова лампа, ноутбук на дерев’яній підставці та оливковий килимок у теплому сонячному світлі" onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/>
  </div>;
}
