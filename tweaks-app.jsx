/* Ethan Dvir Motorsport — Tweaks panel (persists across pages via localStorage) */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2e86f0",
  "grain": true,
  "parallax": true
}/*EDITMODE-END*/;

const ACCENTS = ['#2e86f0', '#1ec8cf', '#8be04e', '#7b3ff2', '#e6e8ec'];

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return v;
  } catch (e) { return fallback; }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // seed from localStorage once (so a choice on one page carries to others)
  React.useEffect(() => {
    const a = readLS('ed3-accent', null);
    const g = readLS('ed3-grain', null);
    const p = readLS('ed3-parallax', null);
    if (a !== null && a !== t.accent) setTweak('accent', a);
    if (g !== null && g !== t.grain) setTweak('grain', g);
    if (p !== null && p !== t.parallax) setTweak('parallax', p);
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (t.accent) root.style.setProperty('--accent-override', t.accent);
    else root.style.removeProperty('--accent-override');
    if (t.grain) root.setAttribute('data-grain', ''); else root.removeAttribute('data-grain');
    window.__noParallax = !t.parallax;
    if (window.__refreshParallax) window.__refreshParallax();
    if (!t.parallax) document.querySelectorAll('.band-media, .pagehead-media, #heroMedia').forEach(el => { el.style.transform = ''; });
    try {
      localStorage.setItem('ed3-accent', t.accent || '');
      localStorage.setItem('ed3-grain', t.grain ? 'true' : 'false');
      localStorage.setItem('ed3-parallax', t.parallax ? 'true' : 'false');
    } catch (e) {}
  }, [t.accent, t.grain, t.parallax]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakColor label="Accent color" value={t.accent} options={ACCENTS} onChange={(v) => setTweak('accent', v)} />
      <div style={{ fontSize: 11, lineHeight: 1.45, opacity: 0.6, margin: '2px 2px 6px', fontStyle: 'italic' }}>
        Used sparingly — for live markers, links &amp; hairlines. Photography carries the colour. Applies across every page.
      </div>
      <TweakSection label="Motion &amp; texture" />
      <TweakToggle label="Parallax" value={t.parallax} onChange={(v) => setTweak('parallax', v)} />
      <TweakToggle label="Film grain" value={t.grain} onChange={(v) => setTweak('grain', v)} />
    </TweaksPanel>
  );
}

const _root = document.createElement('div');
_root.id = 'tweaks-root';
document.body.appendChild(_root);
ReactDOM.createRoot(_root).render(<App />);
