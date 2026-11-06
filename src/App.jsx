import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, ContactShadows, Text } from '@react-three/drei';
import { gsap } from 'gsap';
import { ArrowRight, Cake, Camera, Gift, Mail, RotateCcw, Sparkles as SparkleIcon, Star } from 'lucide-react';
import * as THREE from 'three';

const memories = [
  { title: 'The little moments', caption: 'The random conversations that somehow become the best part of a day.', symbol: '✿', tone: 'rose' },
  { title: 'The big laughs', caption: 'May there always be a reason to laugh until your cheeks hurt.', symbol: '♡', tone: 'lilac' },
  { title: 'The next chapter', caption: 'More stories, more adventures, and more memories waiting to happen.', symbol: '✧', tone: 'peach' },
];

function GiftScene({ opened, onOpen }) {
  const group = useRef();
  const lid = useRef();
  const ribbon = useRef();
  useFrame((state, delta) => {
    if (group.current && !opened) {
      group.current.rotation.y += delta * 0.32;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.12;
    }
    if (lid.current) {
      const target = opened ? -Math.PI * 0.78 : 0;
      lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, target, 5, delta);
      lid.current.position.y = THREE.MathUtils.damp(lid.current.position.y, opened ? 1.05 : 0.78, 5, delta);
    }
    if (ribbon.current) ribbon.current.visible = !opened;
  });
  return (
    <group ref={group} onClick={onOpen} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
      <Float speed={2} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[2.25, 1.65, 1.8]} /><meshStandardMaterial color="#e88fb3" roughness={0.3} metalness={0.12} /></mesh>
        <mesh position={[0, 0.03, 0.92]}><boxGeometry args={[0.24, 1.68, 0.025]} /><meshStandardMaterial color="#fff0f6" metalness={0.35} roughness={0.24} /></mesh>
        <mesh position={[0, 0.03, -0.92]}><boxGeometry args={[0.24, 1.68, 0.025]} /><meshStandardMaterial color="#fff0f6" metalness={0.35} roughness={0.24} /></mesh>
        <group ref={lid} position={[0, 0.78, 0]}>
          <mesh castShadow><boxGeometry args={[2.42, 0.34, 1.98]} /><meshStandardMaterial color="#f6b6d0" roughness={0.28} metalness={0.12} /></mesh>
          <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.34, 0.075, 12, 36]} /><meshStandardMaterial color="#fff0f6" metalness={0.3} /></mesh>
          <mesh position={[-0.22, 0.27, 0]} rotation={[0, 0, -0.4]}><torusGeometry args={[0.25, 0.07, 12, 32, Math.PI * 1.7]} /><meshStandardMaterial color="#fff0f6" metalness={0.3} /></mesh>
          <mesh position={[0.22, 0.27, 0]} rotation={[0, 0, 0.4]}><torusGeometry args={[0.25, 0.07, 12, 32, Math.PI * 1.7]} /><meshStandardMaterial color="#fff0f6" metalness={0.3} /></mesh>
        </group>
        <group ref={ribbon}>
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.24, 1.68, 1.84]} /><meshStandardMaterial color="#fff0f6" metalness={0.35} roughness={0.24} /></mesh>
          <mesh position={[0, 0.84, 0]}><boxGeometry args={[2.42, 0.16, 0.2]} /><meshStandardMaterial color="#fff0f6" metalness={0.35} /></mesh>
        </group>
      </Float>
      <pointLight position={[0, 2.5, 1.5]} intensity={opened ? 4 : 1.8} color="#ffd5e7" distance={7} />
    </group>
  );
}

function CakeScene({ blown, setBlown }) {
  const flames = useRef([]);
  useFrame((state) => {
    flames.current.forEach((f, i) => {
      if (f) {
        f.scale.y = blown ? 0.001 : 0.8 + Math.sin(state.clock.elapsedTime * 12 + i) * 0.16;
        f.rotation.z = Math.sin(state.clock.elapsedTime * 7 + i) * 0.12;
      }
    });
  });
  return (
    <group position={[0, -0.5, 0]}>
      <mesh castShadow position={[0, -0.05, 0]}><cylinderGeometry args={[1.45, 1.55, 0.62, 64]} /><meshStandardMaterial color="#f4b4ce" roughness={0.38} /></mesh>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[1.46, 1.46, 0.12, 64]} /><meshStandardMaterial color="#fff0f5" roughness={0.25} /></mesh>
      {[-0.72, 0, 0.72].map((x, i) => <group key={i} position={[x, 0.66, 0.12]}>
        <mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.045, 0.045, 0.46, 16]} /><meshStandardMaterial color="#fff6e9" /></mesh>
        <mesh ref={(el) => flames.current[i] = el} position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color="#ffc45c" />
        </mesh>
        <mesh position={[0, 0.52, 0]}><sphereGeometry args={[0.15, 12, 12]} /><meshBasicMaterial color="#ffb2cf" transparent opacity={0.13} /></mesh>
      </group>)}
      <mesh position={[0, 0.08, 1.51]} onClick={setBlown} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <boxGeometry args={[0.7, 0.36, 0.08]} /><meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function FloatingDecor() {
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3 - 1],
    scale: 0.035 + Math.random() * 0.06,
  })), []);
  return <>{items.map((p, i) => <mesh key={i} position={p.position} scale={p.scale}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color={i % 2 ? '#ffd4e7' : '#d9c4ff'} transparent opacity={0.75} /></mesh>)}</>;
}

function SceneShell({ children }) {
  return <Canvas shadows dpr={[1, 1.7]} camera={{ position: [0, 0.5, 6.5], fov: 42 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.25} />
    <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow />
    <pointLight position={[-4, 2, 3]} intensity={1.4} color="#f5a9ce" />
    <Suspense fallback={null}><Environment preset="city" /></Suspense>
    {children}
    <Sparkles count={55} scale={8} size={2.2} speed={0.35} color="#ffe1ef" />
    <FloatingDecor />
    <ContactShadows position={[0, -1.55, 0]} opacity={0.25} scale={7} blur={2.5} />
  </Canvas>;
}

function Fireworks({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf, particles = [], bursts = 0;
    const resize = () => { w = canvas.width = window.innerWidth * devicePixelRatio; h = canvas.height = window.innerHeight * devicePixelRatio; };
    resize(); window.addEventListener('resize', resize);
    const colors = ['#ffb6d4', '#e4c8ff', '#ffe4a8', '#ffffff', '#f28fbd'];
    const launch = () => {
      const x = Math.random() * w, y = Math.random() * h * 0.52;
      for (let i = 0; i < 48; i++) {
        const a = Math.PI * 2 * i / 48, speed = (1 + Math.random() * 3) * devicePixelRatio;
        particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1, color: colors[Math.floor(Math.random() * colors.length)] });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (bursts < 12 && Math.random() < 0.055) { launch(); bursts++; }
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.025 * devicePixelRatio; p.life -= 0.012;
        ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.1 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (bursts < 12 || particles.length) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [active]);
  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}

const steps = ['gift', 'candles', 'letter', 'memories', 'game', 'finale'];

export default function App() {
  const [step, setStep] = useState('gift');
  const [giftOpened, setGiftOpened] = useState(false);
  const [songStarted, setSongStarted] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const [stars, setStars] = useState(0);
  const [collected, setCollected] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const contentRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step === 'finale') setShowFireworks(true);
  }, [step]);

  useEffect(() => {
    if (contentRef.current) gsap.fromTo(contentRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' });
  }, [step]);

  const go = (next) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nextStep = () => {
    const i = steps.indexOf(step);
    go(steps[Math.min(i + 1, steps.length - 1)]);
  };
  const collectStar = (i) => {
    if (collected.includes(i)) return;
    setCollected(prev => [...prev, i]);
    setStars(s => s + 1);
  };


  if (showIntro) return <main className="intro-screen"><div className="intro-orb">✦</div><p>A little magic is being prepared...</p><span>FOR TAMANNA</span></main>;

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      {songStarted && <iframe
        className="youtube-audio"
        title="Birthday song"
        src="https://www.youtube.com/embed/Ic458P8NMew?autoplay=1&loop=1&playlist=Ic458P8NMew&controls=0&playsinline=1&rel=0"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      />}
      <header className="topbar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); go('gift'); }}><span className="brand-mark">✦</span> a little birthday surprise</a>
        <div className="top-actions">
          <span className="for-label">MADE WITH ♡ FOR TAMANNA</span>
        </div>
      </header>

      <nav className="progress" aria-label="Journey progress">
        {steps.map((s, i) => <button key={s} className={`progress-dot ${steps.indexOf(step) >= i ? 'active' : ''} ${step === s ? 'current' : ''}`} onClick={() => i <= steps.indexOf(step) && go(s)} title={s}><span>{i + 1}</span></button>)}
      </nav>

      <section className="hero-wrap" ref={contentRef}>
        {step === 'gift' && <div className="journey-layout">
          <div className="copy-block">
            <span className="eyebrow"><SparkleIcon size={14}/> A SURPRISE JUST FOR YOU</span>
            <h1>Hey, <em>Tamanna.</em><br/>Your day, your magic.</h1>
            <p className="lead">A tiny universe made of warm wishes, happy memories, and a little bit of sparkle. Ready to see what's inside?</p>
            <button className="primary-button" onClick={() => { setSongStarted(true); setGiftOpened(true); setTimeout(() => go('candles'), 1100); }}>Open your surprise <ArrowRight size={17}/></button>
            <p className="microcopy"><span className="pulse-dot"/> A little journey made with love</p>
          </div>
          <div className="scene-card gift-card">
            <div className="scene-caption"><span>01 / THE MYSTERY GIFT</span><span>✧ tap the gift</span></div>
            <div className="scene-stage"><SceneShell><GiftScene opened={giftOpened} onOpen={() => { setSongStarted(true); setGiftOpened(true); setTimeout(() => go('candles'), 1000); }}/></SceneShell></div>
            <div className="scene-bottom"><span>Something lovely is waiting inside</span><span className="sparkle-label">✦ ✦ ✦</span></div>
          </div>
        </div>}

        {step === 'candles' && <div className="center-layout">
          <span className="eyebrow"><Cake size={14}/> 02 / MAKE A WISH</span>
          <h1>One wish. <em>Infinite possibilities.</em></h1>
          <p className="lead">Take a breath, make a wish, then tap the candles to send it into the universe.</p>
          <div className="scene-card cake-card"><div className="scene-stage cake-stage"><SceneShell><CakeScene blown={candlesBlown} setBlown={() => setCandlesBlown(true)}/></SceneShell></div></div>
          <button className="primary-button" onClick={() => setCandlesBlown(true)}>{candlesBlown ? 'Wish sent into the universe' : 'Blow out the candles'} <SparkleIcon size={17}/></button>
          {candlesBlown && <div className="success-note">✧ May this year bring you all the good things. ✧</div>}
          <button className="text-button" disabled={!candlesBlown} onClick={nextStep}>Continue to your letter <ArrowRight size={16}/></button>
        </div>}

        {step === 'letter' && <div className="center-layout letter-layout">
          <span className="eyebrow"><Mail size={14}/> 03 / A LITTLE NOTE</span>
          <h1>A few words, <em>just for you.</em></h1>
          <p className="lead">Some wishes are too special to fit inside a gift box.</p>
          <div className={`letter-envelope ${letterOpen ? 'opened' : ''}`} onClick={() => setLetterOpen(true)} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && setLetterOpen(true)}>
            <div className="envelope-back"/><div className="letter-paper">
              <span className="letter-kicker">A NOTE FOR TAMANNA</span>
              <p>Happy Birthday! ♡</p>
              <div className="letter-body">
                <p>I hope you're doing well and that you're happy. That's all I want for you.</p>
                <p>I don't know why I still remember you after all this time. Maybe it's because we were once good friends, and those memories still mean something to me.</p>
                <p>Seeing you move so far ahead in life genuinely makes me happy. Maybe I've moved forward a little too, but honestly, only a little.</p>
                <p>Anyway, let's leave all that aside.</p>
              </div>
              <p className="letter-sign"><strong>Do you still remember me?</strong><br/><br/>~ The Friend</p>
            </div>
            <div className="envelope-flap"/><div className="envelope-seal">♡</div>
          </div>
          {!letterOpen ? <button className="primary-button" onClick={() => setLetterOpen(true)}>Open your letter <Mail size={17}/></button> : <button className="primary-button" onClick={nextStep}>See the memory garden <ArrowRight size={17}/></button>}
        </div>}

        {step === 'memories' && <div className="center-layout memories-layout">
          <span className="eyebrow"><Camera size={14}/> 04 / THE MEMORY GARDEN</span>
          <h1>Little things, <em>big feelings.</em></h1>
          <p className="lead">Tap each keepsake to turn it over. Add your own photos later to make this even more personal.</p>
          <div className="memory-grid">{memories.map((m, i) => <button className={`memory-card ${m.tone} ${flipped.includes(i) ? 'flipped' : ''}`} key={m.title} onClick={() => setFlipped(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}>
            <span className="memory-number">MEMORY 0{i + 1}</span><span className="memory-symbol">{m.symbol}</span><strong>{flipped.includes(i) ? m.title : 'A little keepsake'}</strong><small>{flipped.includes(i) ? m.caption : 'Tap to reveal'}</small><span className="flip-hint"><RotateCcw size={12}/> flip card</span>
          </button>)}</div>
          <button className="primary-button" onClick={nextStep}>One last little game <ArrowRight size={17}/></button>
        </div>}

        {step === 'game' && <div className="center-layout game-layout">
          <span className="eyebrow"><Star size={14}/> 05 / STAR CATCHER</span>
          <h1>Catch some <em>birthday magic.</em></h1>
          <p className="lead">Find all five floating stars to unlock your birthday finale.</p>
          <div className="game-board">
            <div className="game-score"><span>STARS COLLECTED</span><strong>{stars}<small> / 5</small></strong></div>
            {Array.from({ length: 5 }, (_, i) => <button key={i} className={`game-star star-${i + 1} ${collected.includes(i) ? 'caught' : ''}`} onClick={() => collectStar(i)} aria-label={`Collect star ${i + 1}`} disabled={collected.includes(i)}>{collected.includes(i) ? <Check/> : '✦'}</button>)}
            <span className="game-hint">✧ tap each star ✧</span>
          </div>
          <button className="primary-button" disabled={stars < 5} onClick={nextStep}>Unlock the finale <SparkleIcon size={17}/></button>
          {stars < 5 && <p className="microcopy">You need {5 - stars} more {5 - stars === 1 ? 'star' : 'stars'} to continue.</p>}
        </div>}

        {step === 'finale' && <div className="center-layout finale-layout">
          <Fireworks active={showFireworks}/>
          <div className="finale-orb">✧</div>
          <span className="eyebrow"><Heart size={14}/> 06 / YOUR MOMENT</span>
          <h1>Happy Birthday,<br/><em>Tamanna!</em></h1>
          <p className="finale-message">May your days be soft, your dreams be bold, and your year be full of beautiful surprises. Keep shining in your own way. The world is brighter with you in it. ♡</p>
          <div className="finale-signature">WITH LOTS OF LOVE <span>✦</span></div>
          <button className="primary-button" onClick={() => { setStep('gift'); setGiftOpened(false); setCandlesBlown(false); setLetterOpen(false); setFlipped([]); setStars(0); setCollected([]); setShowFireworks(false); }}>Experience it again <RotateCcw size={17}/></button>
        </div>}
      </section>

      <footer className="footer">
        <span>✦ A little birthday surprise</span>
        <span>Made for Tamanna, with care ♡</span>
        {step !== 'gift' && <button onClick={() => go(steps[Math.max(0, steps.indexOf(step) - 1)])}><ArrowLeft size={13}/> Previous</button>}
      </footer>
    </main>
  );
}