import { useState, useEffect, useRef, useCallback } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'

const BADRI_EMAIL = 'badri.supernetrix@gmail.com'
const CORNELLEWS_EMAIL = 'cornellews.supernetrix@gmail.com'
const START_PROJECT_MAILTO = `mailto:${BADRI_EMAIL}?subject=Project%20Inquiry%20-%20SuperNetrix`
const INSTAGRAM_URL = 'https://www.instagram.com/supernetrix'
const THREADS_URL = 'https://www.threads.com/@supernetrix'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function ThreadsIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.7 8.1c-.7-3-2.8-4.6-6-4.6-4.2 0-7.1 3.3-7.1 8.5 0 5.3 3 8.5 7.4 8.5 3.8 0 6.4-2.2 6.4-5.1 0-2.6-2-4.2-5.3-4.2-2.6 0-4.2 1.1-4.2 2.8 0 1.5 1.2 2.5 3 2.5 2.5 0 4.2-1.9 4.2-4.8 0-2.7-1.6-4.4-4.3-4.4-1.3 0-2.5.4-3.4 1.1" />
      <path strokeLinecap="round" d="M17.1 8.4c1.8.5 3.3 1.4 4.4 2.7" />
    </svg>
  )
}

function BrandMark({ className = 'h-4 w-4' }: { className?: string }) {
  return <img src="/supernetrix-mark.png" alt="" aria-hidden="true" className={`${className} object-contain`} />
}

/* ═══════════════════════ HOOKS ═══════════════════════ */
function useReveal(cls = 'reveal-up', threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.classList.add(cls)
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [cls, threshold])
  return ref
}

function useCounter(end: number, dur = 2000, suffix = '') {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const ran = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true; const t0 = performance.now()
        const tick = (now: number) => { const p = Math.min((now - t0) / dur, 1); setVal(Math.floor((1 - Math.pow(1 - p, 3)) * end)); if (p < 1) requestAnimationFrame(tick) }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el); return () => obs.disconnect()
  }, [end, dur])
  return { ref, display: `${val}${suffix}` }
}

/* ═══════════════════════ CUSTOM CURSOR ═══════════════════════ */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    const onEnter = () => { dotRef.current?.classList.add('hovering'); ringRef.current?.classList.add('hovering') }
    const onLeave = () => { dotRef.current?.classList.remove('hovering'); ringRef.current?.classList.remove('hovering') }

    window.addEventListener('mousemove', onMove)
    const interactives = document.querySelectorAll('a, button, [data-hover]')
    const addListeners = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    addListeners()
    const mo = new MutationObserver(addListeners)
    mo.observe(document.body, { childList: true, subtree: true })

    let raf: number
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (dotRef.current) { dotRef.current.style.left = pos.current.x + 'px'; dotRef.current.style.top = pos.current.y + 'px' }
      if (ringRef.current) { ringRef.current.style.left = ringPos.current.x + 'px'; ringRef.current.style.top = ringPos.current.y + 'px' }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); mo.disconnect() }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}

/* ═══════════════════════ MARQUEE ═══════════════════════ */
function Marquee({ items, reverse = false, className = '', speed = '' }: { items: string[], reverse?: boolean, className?: string, speed?: string }) {
  const text = items.join(' \u2022 ') + ' \u2022 '
  const anim = speed || (reverse ? 'marquee-right' : 'marquee-left')
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex ${anim}`}>
        {[0,1,2,3].map(i => <span key={i} className="inline-block pr-8">{text}</span>)}
      </div>
    </div>
  )
}

/* ═══════════════════════ WORD REVEAL ═══════════════════════ */
function WordReveal({ children, className = '' }: { children: string, className?: string }) {
  const ref = useReveal('word-reveal', 0.2)
  return <div ref={ref} className={className}>{children.split(' ').map((w, i) => <span key={i} className="word">{w}</span>)}</div>
}

/* ═══════════════════════ NAVBAR ═══════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen(v => !v), [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!open) return

    const previousBodyOverflow = document.body.style.overflow
    const previousOverscroll = document.documentElement.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'contain'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        requestAnimationFrame(() => menuButtonRef.current?.focus())
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMenu()
    }
    const onHashChange = () => closeMenu()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHashChange)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overscrollBehavior = previousOverscroll
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [open, closeMenu])

  const links = [{ l: 'About', h: '#about' }, { l: 'Services', h: '#services' }, { l: 'Work', h: '#work' }, { l: 'Process', h: '#process' }, { l: 'FAQ', h: '#faq' }, { l: 'Contact', h: '#contact' }]
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled || open ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'}`}>
        <div className="relative z-[140] max-w-[1600px] mx-auto px-4 md:px-12 h-14 md:h-20 flex items-center justify-between">
          <a href="#" onClick={closeMenu} className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#0b0b0b]" style={{ fontFamily: 'Space Grotesk' }}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e9edf2] bg-white">
              <BrandMark className="h-[17px] w-[17px]" />
            </span>
            <span>super<span className="text-[#00c853]">netrix</span>.com</span>
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => <a key={l.h} href={l.h} className="text-[13px] font-medium text-[#666] hover:text-[#0b0b0b] transition-colors duration-300">{l.l}</a>)}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="SuperNetrix Instagram" className="w-9 h-9 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#888] hover:text-[#0b0b0b] hover:border-[#0b0b0b] transition-all"><InstagramIcon className="w-3.5 h-3.5" /></a>
            <a href={THREADS_URL} target="_blank" rel="noopener" aria-label="SuperNetrix Threads" className="w-9 h-9 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#888] hover:text-[#0b0b0b] hover:border-[#0b0b0b] transition-all"><ThreadsIcon className="w-3.5 h-3.5" /></a>
            <a href={START_PROJECT_MAILTO} data-hover className="magnetic-btn text-[13px] font-semibold bg-[#0b0b0b] text-white px-5 py-2.5 rounded-full hover:bg-[#00c853] transition-all duration-300">Start Your Project</a>
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={toggleMenu}
            className="mobile-menu-button lg:hidden relative flex h-11 w-11 items-center justify-center rounded-full border border-transparent transition-colors duration-300 hover:border-[#e5e5e5]"
          >
            <span className="flex flex-col gap-[5px]">
            <span className={`block w-6 h-[2px] bg-[#0b0b0b] transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#0b0b0b] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-[#0b0b0b] transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </span>
          </button>
        </div>
      </nav>
      <div
        id="mobile-menu"
        aria-hidden={!open}
        onClick={closeMenu}
        className={`lg:hidden fixed inset-x-0 bottom-0 top-14 md:top-20 z-[90] bg-[#0b0b0b]/20 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onClick={(event) => event.stopPropagation()}
          className={`mobile-menu-panel absolute left-3 right-3 top-3 overflow-hidden rounded-[1.75rem] border border-[#e5e5e5] bg-white shadow-[0_24px_70px_rgba(11,11,11,0.14)] transition-all duration-300 ${open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-3 scale-[0.98] opacity-0'}`}
        >
          <div className="px-5 py-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#eeeeee] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ca3af]">Navigation</span>
              <span className="h-2 w-2 rounded-full bg-[#00c853]" />
            </div>
            <div className="flex flex-col">
              {links.map((l, index) => (
                <a
                  key={l.h}
                  href={l.h}
                  onClick={closeMenu}
                  className="group flex items-center justify-between border-b border-[#eeeeee] py-4 text-[#0b0b0b] transition-colors active:text-[#00a844]"
                >
                  <span className="text-[1.65rem] font-black leading-none tracking-[-0.03em]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{l.l}</span>
                  <span className="text-xs font-bold text-[#a3a3a3] transition-colors group-active:text-[#00a844]">{String(index + 1).padStart(2, '0')}</span>
                </a>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto_auto] items-center gap-2">
              <a href={START_PROJECT_MAILTO} onClick={closeMenu} className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b0b0b] px-5 text-sm font-bold text-white transition-colors active:bg-[#00a844]">Start Your Project</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" onClick={closeMenu} aria-label="SuperNetrix Instagram" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e5e5] text-[#0b0b0b]"><InstagramIcon className="h-4 w-4" /></a>
              <a href={THREADS_URL} target="_blank" rel="noopener" onClick={closeMenu} aria-label="SuperNetrix Threads" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e5e5] text-[#0b0b0b]"><ThreadsIcon className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════ BLUR WORD COMPONENT ═══════════════════════ */
function BlurRevealText({ children, delay = 0, className = '' }: { children: string, delay?: number, className?: string }) {
  const words = children.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="blur-word" style={{ animationDelay: `${delay + i * 0.08}s` }}>{word}</span>
      ))}
    </span>
  )
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <section className="relative w-full bg-white min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 md:pb-20 px-4 md:px-6">
      {/* Animated gradient blobs */}
      <div className="absolute top-20 -left-40 w-[600px] h-[600px] rounded-full bg-[#00c853]/[0.05] blur-[120px] blob pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] rounded-full bg-[#00c853]/[0.04] blur-[100px] blob-2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#6366f1]/[0.03] blur-[80px] blob pointer-events-none" />

      {/* Subtle noise grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #0b0b0b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Decorative lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#e5e5e5] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#e5e5e5] to-transparent opacity-30 pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`absolute rounded-full bg-[#00c853] ${i % 2 === 0 ? 'float-anim' : i % 3 === 0 ? 'float-anim-d1' : 'float-anim-d2'}`}
            style={{ width: `${3 + (i % 3) * 2}px`, height: `${3 + (i % 3) * 2}px`, opacity: 0.15 + (i % 4) * 0.05, left: `${8 + i * 11}%`, top: `${15 + (i * 13) % 65}%` }} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-[#e5e5e5] bg-white/70 backdrop-blur-sm mb-8 md:mb-12 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="w-2 h-2 rounded-full bg-[#00c853] pulse-dot shrink-0" />
          <span className="text-[10px] md:text-[11px] font-semibold text-[#666] uppercase tracking-[0.1em] md:tracking-[0.15em]">Now booking new builds</span>
        </div>

        {/* Heading with BLUR REVEAL effect */}
        {loaded && (
          <h1 className="mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0b0b0b]">
              <BlurRevealText delay={0.2}>Software Development</BlurRevealText>
            </span>
            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0b0b0b] mt-1">
              <BlurRevealText delay={0.5}>Agency for</BlurRevealText>
            </span>
            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] mt-1">
              <BlurRevealText delay={0.8} className="text-[#00c853]">SaaS, AI & Apps</BlurRevealText>
            </span>
          </h1>
        )}

        {/* Sub - also blur reveals */}
        {loaded && (
          <p className="text-[#666] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            <BlurRevealText delay={1.2}>SuperNetrix designs and builds SaaS platforms, AI workflows, mobile apps, web apps, admin portals, and automation systems for startups and SMEs worldwide.</BlurRevealText>
          </p>
        )}

        {/* CTA */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-[1800ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a href={START_PROJECT_MAILTO} data-hover className="group inline-flex items-center gap-3 bg-[#0b0b0b] text-white font-semibold px-6 md:px-8 py-3.5 md:py-4 rounded-full hover:bg-[#00c853] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,200,83,0.3)] text-sm md:text-[15px]">
            Start Your Project
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a href="#work" data-hover className="inline-flex items-center gap-2 text-sm md:text-[15px] font-semibold border border-[#d5d5d5] text-[#0b0b0b] px-6 md:px-7 py-3.5 md:py-4 rounded-full hover:border-[#0b0b0b] transition-all duration-300">
            View Our Work
          </a>
        </div>

        {/* Trusted by strip */}
        <div className={`mt-10 md:mt-16 flex flex-col items-center gap-3 transition-all duration-1000 delay-[2200ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-[11px] font-semibold text-[#bbb] uppercase tracking-[0.15em]">Trusted by Leaders</span>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 text-[#0b0b0b]/20">
            {['MoneyOS', 'Breyus', 'Di-Twin API', 'Onsite'].map((name, i) => (
              <span key={i} className="text-[10px] md:text-sm font-bold tracking-wider uppercase whitespace-nowrap">{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-[2500ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-5 h-9 rounded-full border border-[#ccc] flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-[#00c853] animate-bounce" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ CLIENT MARQUEE ═══════════════════════ */
function ClientMarquee() {
  return (
    <div className="w-full border-y border-[#e5e5e5] bg-[#fafafa] py-5">
      <Marquee items={['MONEYOS', 'BREYUS', 'DI-TWIN API', 'ONSITE', 'EVERKIND', 'GG KRISHI', 'SITESALES AI']}
        className="text-sm font-bold tracking-[0.2em] text-[#0b0b0b]/25 uppercase" />
    </div>
  )
}

/* ═══════════════════════ ABOUT (sujalbuild.in style word-by-word reveal) ═══════════════════════ */
function About() {
  const text = "SuperNetrix designs and builds SaaS platforms, AI workflows, mobile apps, web apps, admin portals, and automation systems for startups and SMEs worldwide. We focus on practical product engineering: clear scopes, fast builds, usable admin tools, and software that survives real operations."
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const words = container.querySelectorAll('.about-word-blur')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.filter = 'blur(0px)'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    words.forEach(w => obs.observe(w))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" className="max-w-[1600px] mx-auto px-4 md:px-12 pt-14 pb-6 md:pt-24 md:pb-8 bg-white">
      <div className="reveal-up" ref={useReveal()}>
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tight leading-[1.05] text-[#0b0b0b] mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          MORE THAN <span className="italic text-[#00c853] relative">code<svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 6" fill="none"><path d="M0 5C25 1 75 1 100 5" stroke="#00c853" strokeWidth="2" strokeLinecap="round"/></svg></span>
        </h2>
      </div>
      <div className="flex gap-3 mb-14">
        <span className="reveal-up text-xs font-semibold uppercase tracking-[0.15em] text-[#888] border border-[#e5e5e5] px-3 py-1 rounded-full" ref={useReveal()}>About Us</span>
        <span className="reveal-up text-xs font-semibold uppercase tracking-[0.15em] text-[#888] border border-[#e5e5e5] px-3 py-1 rounded-full" ref={useReveal()}>The Vision</span>
      </div>
      <div ref={containerRef} className="text-[clamp(1.3rem,3vw,2.2rem)] font-medium leading-[1.55] text-[#0b0b0b] max-w-4xl">
        {text.split(' ').map((word, i) => (
          <span key={i} className="about-word-blur" style={{
            transitionDelay: `${i * 0.03}s`
          }}>{word}</span>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════ STATS ═══════════════════════ */
function Stats() {
  const c1 = useCounter(25, 2000, '+'); const c2 = useCounter(100, 2000, '%'); const c3 = useCounter(5, 1500, '+'); const c4 = useCounter(10, 1500, 'x')
  const stats = [
    { r: c1, label: 'Projects Shipped', note: 'Production systems, private platforms, and public launches.', n: '01', accent: '#2563eb' },
    { r: c2, label: 'Client Retention', note: 'Long-running delivery relationships built on trust.', n: '02', accent: '#00a86b' },
    { r: c3, label: 'Years Building', note: 'Hands-on product, AI, automation, and web engineering.', n: '03', accent: '#7c3aed' },
    { r: c4, label: 'Faster Delivery', note: 'Lean planning, tight builds, and direct communication.', n: '04', accent: '#d97706' },
  ]
  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-12 pt-0 pb-12 md:pt-0 md:pb-16 bg-white">
      <div className="delivery-snapshot reveal-up rounded-2xl md:rounded-[2rem] border border-[#e7e7e7] bg-white overflow-hidden" ref={useReveal()}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.45fr]">
          <div className="delivery-snapshot-intro p-5 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#e7e7e7]">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#888] block mb-4">Delivery Snapshot</span>
            <h3 className="text-[clamp(1.75rem,3.4vw,3.1rem)] font-black tracking-tight leading-[1.02] text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Proof without the noise.
            </h3>
            <p className="text-sm md:text-base text-[#666] leading-relaxed mt-4 max-w-md">
              A calmer view of the numbers that matter: shipped work, retained clients, and faster execution.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#e7e7e7]">
            {stats.map((s) => (
              <div key={s.n} data-hover className="metric-card relative min-h-[178px] md:min-h-[220px] bg-white p-5 md:p-6 overflow-hidden" style={{ '--metric-color': s.accent } as React.CSSProperties}>
                <div className="metric-card-surface absolute inset-0 pointer-events-none" />
                <span className="metric-card-number absolute bottom-2 right-3 select-none" style={{ fontFamily: 'Space Grotesk' }}>{s.n}</span>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span ref={s.r.ref} className="metric-value text-4xl md:text-5xl font-black text-[#0b0b0b] block leading-none" style={{ fontFamily: 'Space Grotesk' }}>{s.r.display}</span>
                    <span className="text-[10px] md:text-xs font-bold text-[#7a7f87] uppercase tracking-[0.14em] block mt-4">{s.label}</span>
                  </div>
                  <p className="hidden md:block text-xs text-[#777] leading-relaxed pr-2">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ WHAT WE BUILD (replaces Building For) ═══════════════════════ */
function WhatWeBuild() {
  const items = [
    { label: 'SaaS Platforms', desc: 'Multi-tenant, scalable', icon: '◆', num: '01' },
    { label: 'AI Systems', desc: 'LLMs, agents, automation', icon: '◈', num: '02' },
    { label: 'Web Applications', desc: 'React, Next.js, MERN', icon: '◇', num: '03' },
    { label: 'Mobile Apps', desc: 'Cross-platform native', icon: '○', num: '04' },
    { label: 'Data Platforms', desc: 'Visualization & analytics', icon: '△', num: '05' },
    { label: 'API Systems', desc: 'Microservices & integrations', icon: '□', num: '06' },
  ]
  return (
    <section className="w-full bg-[#0b0b0b] py-20 md:py-28 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="reveal-up mb-10 md:mb-16" ref={useReveal()}>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#00c853] block mb-3">What We Build</span>
          <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-extrabold text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Everything Ships <span className="italic text-[#00c853]">Production-Grade</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((item, i) => {
            const ref = useReveal('reveal-scale', 0.1)
            return (
              <div key={i} ref={ref} data-hover className="shimmer-hover group relative rounded-2xl border border-[#222] p-5 md:p-8 hover:border-[#00c853] transition-all duration-500 hover:bg-[#111] overflow-hidden">
                {/* Number watermark */}
                <span className="absolute bottom-3 right-4 text-[60px] md:text-[80px] font-black leading-none text-white/[0.03] group-hover:text-[#00c853]/[0.08] transition-all duration-700 select-none pointer-events-none" style={{ fontFamily: 'Space Grotesk' }}>{item.num}</span>
                {/* Icon with glow */}
                <div className="text-4xl md:text-5xl text-[#00c853]/20 group-hover:text-[#00c853]/50 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(0,200,83,0.3)] mb-3">{item.icon}</div>
                <h3 className="text-base md:text-xl font-bold text-white mb-1 group-hover:text-[#00c853] transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{item.label}</h3>
                <p className="text-sm text-[#666] group-hover:text-[#888] transition-colors">{item.desc}</p>
                {/* Explore arrow */}
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#00c853] opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-500">
                  Explore <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#00c853] w-0 group-hover:w-2/3 transition-all duration-500 rounded-full" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ TRIPLE MARQUEE ═══════════════════════ */
function TripleMarquee() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="py-8 md:py-12 -rotate-[2deg] scale-[1.08] origin-center">
        <Marquee items={['BUILD THE FUTURE', '✦', 'SHIP FAST', '✦', 'SCALE GLOBALLY']} className="text-[clamp(2rem,5vw,4rem)] font-extrabold text-[#0b0b0b] tracking-tight mb-3" />
        <Marquee items={['PRODUCT ENGINEERING', '✦', 'AI INTEGRATION', '✦', 'WEB PLATFORMS']} reverse className="text-[clamp(2rem,5vw,4rem)] font-extrabold text-[#0b0b0b]/[0.06] tracking-tight mb-3" />
        <Marquee items={['SUPERNETRIX', '≈', 'MASTERS AT WORK', '≈', 'ENGINEER THE OUTCOME']} className="text-[clamp(1rem,2.5vw,1.6rem)] font-bold text-[#00c853]/50 tracking-[0.05em]" speed="marquee-slow" />
      </div>
    </section>
  )
}

/* ═══════════════════════ PROJECTS ═══════════════════════ */
function Projects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [modalProject, setModalProject] = useState<number | null>(null)
  const [modalClosing, setModalClosing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const modalCloseTimerRef = useRef<number | null>(null)
  const projects = [
    {
      name: 'MoneyOS',
      cat: 'Fintech App',
      desc: 'Cross-platform finance operating system for accounts, transactions, budgets, loans, crypto, reports, and WhatsApp-based finance workflows.',
      detail: 'MoneyOS is a private finance workspace built across mobile and web. The product foundation includes authenticated routing, account and transaction models, budgets, loans, crypto holdings, net-worth snapshots, notifications, recurring workflows, report generation, offline state, and Supabase-backed ownership rules.',
      stack: ['Expo', 'Supabase', 'PostgreSQL'],
      color: '#2563eb'
    },
    {
      name: 'Breyus',
      cat: 'B2B Trade Platform',
      desc: 'AI-assisted commodity trading platform that connects sourcing, partner discovery, negotiation, documents, and admin operations.',
      detail: 'Breyus brings multiple trade workflows into one platform: marketplace discovery, buyer/seller negotiation, deal lifecycle tracking, document handling, AI partner matching, KYC/admin operations, disputes, alerts, taxonomy management, and content publishing. The platform spans a buyer/seller app, admin portal, backend API, and AI service.',
      stack: ['React', 'NestJS', 'FastAPI'],
      color: '#7c3aed'
    },
    {
      name: 'Di-Twin API',
      cat: 'Health Platform',
      desc: 'Nutrition backend that connects onboarding, wearable data, care plans, reminders, dashboards, and AI-generated routines.',
      detail: 'Di-Twin API provides the backend contract for a nutrition workflow with client and nutritionist surfaces. It handles profile onboarding, referrals, appointments, versioned plans, notifications, Fitbit sync, dashboard snapshots, meal generation, exercise recommendations, and background jobs that keep reminders and wearable data outside the request path.',
      stack: ['Node.js', 'PostgreSQL', 'BullMQ'],
      color: '#0891b2'
    },
    {
      name: 'Onsite',
      cat: 'Construction SaaS',
      desc: 'Project collaboration platform for construction teams to manage documents, approvals, annotations, client chat, and phase timelines.',
      detail: 'Onsite is a construction collaboration workspace built around project isolation and a simple client experience. The product covers PDF/image document management, versioned review cycles, all-reviewer approval rules, Figma-style pinned comments, Slack-style channels, project phase tracking, timeline change logs, and mobile-friendly PWA access.',
      stack: ['PWA', 'Real-time Chat', 'Approvals'],
      color: '#d97706',
      url: 'https://heartfelt-dango-68d136.netlify.app/#',
      previewImage: '/project-preview-onsite.png'
    },
    {
      name: 'EverKind AI UGC',
      cat: 'AI Content Pipeline',
      desc: 'Internal AI UGC pipeline that turns trend inputs into persona-aware scripts, generated short-form videos, review queues, and social publishing flows.',
      detail: 'EverKind is designed around a single loop: trending topic in, reviewed video out. The pipeline analyzes 7-10 reference videos, generates scripts with persona and product context, creates AI video variants, routes them through human review, and publishes to TikTok, Instagram, and Facebook with analytics tied back to the original trend and references.',
      stack: ['Next.js', 'BullMQ', 'AI Video'],
      color: '#c026d3'
    },
    {
      name: 'GG Krishi',
      cat: 'WhatsApp / MRV',
      desc: 'WhatsApp-first verification system that validates field images with AI, routes edge cases to review, and supports automated farmer reward flows.',
      detail: 'GG Krishi turns a WhatsApp chat into an auditable MRV workflow. Farmers submit images from the field, AI checks image quality and evidence, duplicate/suspicious cases move into review, and the admin portal tracks users, sessions, CRM follow-up, support tickets, analytics, and reward/payment status.',
      stack: ['WhatsApp API', 'AI Vision', 'Admin CRM'],
      color: '#f97316'
    },
    {
      name: 'SiteSales AI',
      cat: 'Construction Sales Intelligence',
      desc: 'AI sales intelligence platform that analyzes site-visit calls, coaches agents, flags risky behavior, and tracks company mobile status.',
      detail: 'SiteSales AI gives construction sales leaders a complete view of how agents handle prospects visiting house sites. The platform analyzes every sales call for confidence, objection handling, follow-up quality, closing ideas, and compliance risks, then turns the findings into admin-ready coaching notes, agent scorecards, and escalation signals. Because the phones are company-owned, the admin view also tracks agent availability, online status, mobile battery/charging state, and device health so operations can separate sales performance from field-availability issues.',
      stack: ['AI Call QA', 'Agent Tracking', 'Device Telemetry'],
      color: '#be123c'
    },
    {
      name: 'PowerBlog',
      cat: 'Publishing Platform',
      desc: 'Multi-project publishing system that turns one CMS workflow into static, SEO-ready blogs, help centers, changelogs, and newsrooms.',
      detail: 'PowerBlog pairs an internal CMS with a static public renderer. Editors can manage projects, authors, media, taxonomy, blogs, news, case studies, legal pages, help-center docs, changelogs, and roadmaps, while the build pipeline emits sitemap indexes, News sitemaps, llms.txt, IndexNow files, and search indexing outputs.',
      stack: ['Next.js', 'Prisma', 'SEO'],
      color: '#4f46e5',
      url: 'https://getpowerblog.com',
      previewImage: '/project-preview-powerblog.png'
    },
    {
      name: 'Digital Twin',
      cat: 'Enterprise Data Viz',
      desc: 'Enterprise visualization system that turns complex operational data into real-time dashboards and decision-ready views.',
      detail: 'Digital Twin converts complex datasets into operational visibility for decision-makers. The platform focuses on dashboard UX, real-time data presentation, scenario views, and a clean interface for teams that need to inspect system state without digging through raw tables.',
      stack: ['Data Viz', 'Dashboards', 'Enterprise'],
      color: '#0284c7',
      url: 'https://dtwin-theta.vercel.app/',
      previewImage: '/project-preview-digital-twin.png'
    },
    {
      name: 'VoiceGuard AI',
      cat: 'AI / Call Analytics',
      desc: 'AI call monitoring platform that reviews call quality, extracts sales insights, and turns daily conversations into operator-ready performance signals.',
      detail: 'We built VoiceGuard AI as a production call-analytics workflow for teams that needed more than call recording. The system processes large call volumes, scores conversation quality, surfaces coaching signals, and gives operators a dashboard for review and follow-up.',
      stack: ['AI Analysis', 'Dashboards', 'Call QA'],
      color: '#475569',
      url: 'https://www.voiceguardai.com/',
      previewImage: '/project-preview-voiceguard-ai.png'
    },
    {
      name: 'ShelfSense',
      cat: 'Retail Simulation',
      desc: 'Assortment-planning workspace for testing SKU changes, delists, flowback, and scenario outcomes before shelf decisions go live.',
      detail: 'ShelfSense gives category teams a planning workspace for assortment decisions. Users can review must-carry recommendations, edit SKU status or ACV, run simulations, save scenarios, export reports, and estimate flowback/margin impacts using Snowflake-backed data and model-driven simulation services.',
      stack: ['Streamlit', 'FastAPI', 'Snowflake'],
      color: '#9333ea'
    },
    {
      name: 'Future Sportler',
      cat: 'Sports Platform',
      desc: 'Sports network for athletes, coaches, and clubs with real-time updates, clean discovery flows, and scalable community workflows.',
      detail: 'Future Sportler focuses on connecting athletes, coaches, and clubs through a structured sports platform. The build emphasizes fast UX, user discovery, role-aware flows, real-time updates, and infrastructure that can handle traffic spikes around events and recruitment activity.',
      stack: ['Web App', 'Real-time', 'Community'],
      color: '#ea580c',
      url: 'https://futuresportler.com',
      previewImage: '/project-preview-future-sportler.png'
    },
  ]

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const card = el.children[idx] as HTMLElement
    if (card) {
      const centeredLeft = card.offsetLeft - ((el.clientWidth - card.clientWidth) / 2)
      el.scrollTo({ left: Math.max(0, centeredLeft), behavior: 'smooth' })
      setActiveIdx(idx)
    }
  }, [])

  const openProjectModal = useCallback((idx: number) => {
    if (modalCloseTimerRef.current) {
      window.clearTimeout(modalCloseTimerRef.current)
      modalCloseTimerRef.current = null
    }
    setModalClosing(false)
    setModalProject(idx)
  }, [])

  const closeProjectModal = useCallback(() => {
    if (modalCloseTimerRef.current) return
    setModalClosing(true)
    modalCloseTimerRef.current = window.setTimeout(() => {
      setModalProject(null)
      setModalClosing(false)
      modalCloseTimerRef.current = null
    }, 220)
  }, [])

  // Modal: lock body scroll + ESC to close
  useEffect(() => {
    if (modalProject !== null) {
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeProjectModal() }
      window.addEventListener('keydown', onKey)
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
    } else {
      document.body.style.overflow = ''
    }
  }, [modalProject, closeProjectModal])

  useEffect(() => () => {
    if (modalCloseTimerRef.current) window.clearTimeout(modalCloseTimerRef.current)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[]
      const center = el.scrollLeft + el.clientWidth / 2
      let nextIdx = 0
      let nearest = Number.POSITIVE_INFINITY
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const distance = Math.abs(cardCenter - center)
        if (distance < nearest) {
          nearest = distance
          nextIdx = idx
        }
      })
      setActiveIdx(nextIdx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="work" data-nosnippet className="max-w-[1600px] mx-auto px-4 md:px-12 pt-10 pb-6 md:pt-16 md:pb-8 bg-white">
      {/* Header with pagination */}
      <div className="flex items-end justify-between gap-5 mb-8 md:mb-14">
        <div className="reveal-up" ref={useReveal()}>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#888] block mb-3">Our Work</span>
          <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] font-extrabold tracking-tight text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Featured Projects</h2>
        </div>
        <div className="reveal-up flex items-center gap-4" ref={useReveal()}>
          <span className="text-sm font-bold text-[#0b0b0b]" style={{ fontFamily: 'Space Grotesk' }}>{activeIdx + 1}/{projects.length}</span>
          <div className="flex gap-2">
            <button onClick={() => scrollTo(Math.max(0, activeIdx - 1))} data-hover className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#0b0b0b] transition-colors">
              <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scrollTo(Math.min(projects.length - 1, activeIdx + 1))} data-hover className="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:border-[#0b0b0b] transition-colors">
              <svg className="w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Project cards — horizontal scroll */}
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pt-3 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {projects.map((p, i) => (
          <div key={i} onClick={() => openProjectModal(i)} data-hover
            style={{ '--project-color': p.color } as React.CSSProperties}
            className={`project-card ${activeIdx === i ? 'project-card-active' : ''} snap-center flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[70vw] md:w-[460px] lg:w-[500px] min-h-[430px] md:min-h-[410px] rounded-2xl md:rounded-3xl border border-[#e5e5e5] bg-white p-5 md:p-7 relative overflow-hidden cursor-pointer flex flex-col`}>
            <div className="project-card-surface absolute inset-0 pointer-events-none" />
            <div className="project-card-number absolute bottom-3 right-4 md:bottom-4 md:right-6 select-none" style={{ fontFamily: 'Space Grotesk' }}>{String(i + 1).padStart(2, '0')}</div>

            <div className="relative z-10 flex items-start justify-between gap-4 mb-9">
              <span className="project-card-kicker px-3.5 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider">{p.cat}</span>
              <span className="shrink-0 rounded-full border border-[#ececec] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#999]">{p.url ? 'Public' : 'Private'}</span>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="project-card-title text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] font-black tracking-[-0.02em] leading-[0.95] text-[#0b0b0b] mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>{p.name}</h3>
                <p className="text-sm md:text-[15px] text-[#666] leading-relaxed max-w-[96%] md:max-w-[90%]">{p.desc}</p>
              </div>

              <div className="project-card-tags relative z-20 mt-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.stack.map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#666]">{item}</span>
                  ))}
                </div>
                <span className="project-card-link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#777]">
                  View case study
                  <svg className="project-card-arrow w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {projects.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)} style={activeIdx === i ? { backgroundColor: projects[i].color } : undefined} className={`h-1.5 rounded-full transition-all duration-300 ${activeIdx === i ? 'w-8' : 'w-1.5 bg-[#ddd]'}`} />
        ))}
      </div>

      {/* Project Modal */}
      {modalProject !== null && (() => {
        const p = projects[modalProject]
        return (
          <div className={`project-modal-overlay fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto scrollbar-hide p-2 md:items-center md:overflow-hidden md:p-4 lg:p-6 ${modalClosing ? 'is-closing' : ''}`} onClick={closeProjectModal}>
            <div className="project-modal-backdrop absolute inset-0 bg-black/55 backdrop-blur-md" />
            <div className="project-modal-panel relative z-10 my-4 w-full overflow-hidden rounded-[1.5rem] border border-white/40 bg-white shadow-[0_34px_120px_rgba(0,0,0,0.34)] md:my-0 md:rounded-[2rem]" onClick={e => e.stopPropagation()}>
              <button onClick={closeProjectModal} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e8ef] bg-white/90 text-[#0b0b0b] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#0b0b0b] hover:text-white md:right-5 md:top-5" aria-label="Close project popup">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className={`project-modal-grid grid grid-cols-1 ${p.url ? 'md:grid-cols-[0.9fr_1.1fr]' : 'md:grid-cols-[1fr_0.78fr]'}`}>
                <div className="project-modal-info relative overflow-y-auto overflow-x-hidden scrollbar-hide px-5 py-6 md:px-7 md:py-7 lg:px-8 lg:py-8" style={{ background: `linear-gradient(135deg, ${p.color}10, #fff 56%)` }}>
                  <div className="absolute right-7 top-16 hidden text-[96px] font-black leading-none text-[#0b0b0b]/[0.035] select-none md:block" style={{ fontFamily: 'Space Grotesk' }}>{String(modalProject + 1).padStart(2, '0')}</div>
                  <div className="relative z-10 max-w-xl">
                    <div className="mb-5 flex flex-wrap items-center gap-2.5 pr-12">
                      <span className="rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ background: p.color + '16', color: p.color }}>{p.cat}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9aa1ad]">{p.url ? 'Public' : 'Private'}</span>
                    </div>
                    <h3 className="text-[clamp(2.25rem,5vw,4.9rem)] font-black tracking-[-0.025em] leading-[0.92] text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{p.name}</h3>
                    <p className="mt-5 text-sm leading-relaxed text-[#555d6a] md:text-base">{p.desc}</p>
                  </div>

                  <div className="relative z-10 mt-6 rounded-2xl border border-[#e8ecf2] bg-white/78 p-4 backdrop-blur-sm md:mt-7 md:p-4 lg:p-5">
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.16em] text-[#98a2b3]">Project overview</span>
                    <p className="text-sm leading-relaxed text-[#555d6a] md:text-[15px]">{p.detail}</p>
                  </div>

                  <div className="relative z-10 mt-4 rounded-2xl border border-[#e8ecf2] bg-white/78 p-4 backdrop-blur-sm md:p-4 lg:p-5">
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.16em] text-[#98a2b3]">Stack</span>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {p.stack.map((item) => (
                        <span key={item} className="rounded-full border border-[#edf0f4] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5f6673]">{item}</span>
                      ))}
                    </div>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener" data-hover className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0b0b0b] px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00c853]">
                        Open website
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    ) : (
                      <div className="flex w-full items-center justify-center rounded-full border bg-white px-5 py-3 text-sm font-semibold" style={{ borderColor: p.color + '40', color: p.color }}>
                        Private engagement
                      </div>
                    )}
                  </div>
                </div>

                {p.url ? (
                  <div className="project-preview-panel hidden min-h-full flex-col justify-between border-l border-[#e7ebf0] bg-[#f6f8fb] p-4 md:flex lg:p-5">
                    <div className="mb-3 flex items-center justify-between gap-4 pr-12">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#9aa1ad]">Live preview</span>
                        <p className="mt-1 text-sm font-semibold text-[#0b0b0b]">{p.name} website</p>
                      </div>
                    </div>
                    <div className="project-preview-shell flex-1 overflow-hidden rounded-[1.35rem] border border-[#dce3ec] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.14)]">
                      <div className="flex h-9 items-center gap-2 border-b border-[#e8edf3] bg-white px-4">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
                        <span className="ml-3 truncate rounded-full bg-[#f3f5f8] px-3 py-1 text-[11px] font-medium text-[#8a93a0]">{p.url.replace('https://', '')}</span>
                      </div>
                      {p.previewImage ? (
                        <div
                          role="img"
                          aria-label={`${p.name} website preview`}
                          className="project-preview-capture"
                          style={{ backgroundImage: `url(${p.previewImage})` }}
                        />
                      ) : (
                        <iframe
                          key={p.url}
                          src={p.url}
                          title={`${p.name} live website preview`}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          className="project-preview-frame h-full w-full border-0"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="hidden min-h-full flex-col justify-end border-l border-[#e7ebf0] bg-[#f7f8fa] p-7 md:flex">
                    <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.18em] text-[#9aa1ad]">Private delivery</span>
                    <p className="max-w-sm text-2xl font-black leading-tight tracking-[-0.02em] text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                      Work kept private for the client, shown here as a concise case note.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}

/* ═══════════════════════ TECH ICONS ═══════════════════════ */
const techIcons: Record<string, JSX.Element> = {
  React: <svg viewBox="0 0 256 228" className="w-full h-full"><circle cx="128" cy="114" r="20" fill="currentColor"/><g fill="none" stroke="currentColor" strokeWidth="8"><ellipse cx="128" cy="114" rx="100" ry="38"/><ellipse cx="128" cy="114" rx="100" ry="38" transform="rotate(60 128 114)"/><ellipse cx="128" cy="114" rx="100" ry="38" transform="rotate(120 128 114)"/></g></svg>,
  'Node.js': <svg viewBox="0 0 256 292" className="w-full h-full"><path d="M128 0L256 73.9v146.2L128 292 0 220.1V73.9z" fill="currentColor" opacity="0.15"/><path d="M128 32l96 55.4v110.8L128 253.6 32 198.2V87.4z" fill="none" stroke="currentColor" strokeWidth="8"/><text x="128" y="160" textAnchor="middle" fill="currentColor" fontSize="80" fontFamily="Space Grotesk" fontWeight="700">N</text></svg>,
  'Next.js': <svg viewBox="0 0 256 256" className="w-full h-full"><circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="8"/><path d="M106 88v80M106 88l80 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/><circle cx="168" cy="88" r="6" fill="currentColor"/></svg>,
  TypeScript: <svg viewBox="0 0 256 256" className="w-full h-full"><rect x="8" y="8" width="240" height="240" rx="24" fill="currentColor" opacity="0.12"/><rect x="8" y="8" width="240" height="240" rx="24" fill="none" stroke="currentColor" strokeWidth="8"/><text x="128" y="170" textAnchor="middle" fill="currentColor" fontSize="120" fontFamily="Space Grotesk" fontWeight="800">TS</text></svg>,
  AWS: <svg viewBox="0 0 256 256" className="w-full h-full"><path d="M44 160c28 28 72 40 112 28" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none"/><path d="M180 100c-8-36-44-60-80-52s-56 44-48 80" stroke="currentColor" strokeWidth="8" fill="none"/><path d="M160 188l32-12-12-32" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
  MongoDB: <svg viewBox="0 0 256 256" className="w-full h-full"><path d="M128 24c-12 40-48 68-48 108 0 44 24 76 48 100 24-24 48-56 48-100 0-40-36-68-48-108z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="6"/><line x1="128" y1="60" x2="128" y2="220" stroke="currentColor" strokeWidth="4" strokeDasharray="8 6"/></svg>,
  Docker: <svg viewBox="0 0 256 256" className="w-full h-full"><rect x="48" y="100" width="160" height="96" rx="12" fill="none" stroke="currentColor" strokeWidth="7"/>{[0,1,2,3,4].map(i=><rect key={i} x={56+i*30} y={108} width={24} height={20} rx={3} fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth={2}/>)}{[0,1,2].map(i=><rect key={i+5} x={86+i*30} y={80} width={24} height={20} rx={3} fill="currentColor" opacity={0.15} stroke="currentColor" strokeWidth={2}/>)}<path d="M28 148c-8-4-12-12-8-20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/></svg>,
  PostgreSQL: <svg viewBox="0 0 256 256" className="w-full h-full"><ellipse cx="128" cy="80" rx="72" ry="40" fill="none" stroke="currentColor" strokeWidth="7"/><path d="M56 80v96c0 22 32 40 72 40s72-18 72-40V80" fill="none" stroke="currentColor" strokeWidth="7"/><path d="M56 128c0 22 32 40 72 40s72-18 72-40" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.4"/></svg>,
  Redis: <svg viewBox="0 0 256 256" className="w-full h-full"><path d="M128 40l88 44v84l-88 44-88-44V84z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="6"/><circle cx="128" cy="128" r="28" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M128 100v-30M128 156v30M100 128h-30M156 128h30" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>,
  Python: <svg viewBox="0 0 256 256" className="w-full h-full"><path d="M126 8C80 8 56 30 56 60v28h72v8H44c-24 0-44 20-44 56s16 56 40 56h24v-32c0-24 16-44 40-44h72c20 0 36-16 36-36V60c0-28-26-52-86-52zm-40 28a12 12 0 110 24 12 12 0 010-24z" fill="currentColor" opacity="0.7"/><path d="M130 248c46 0 70-22 70-52v-28h-72v-8h84c24 0 44-20 44-56s-16-56-40-56h-24v32c0 24-16 44-40 44H80c-20 0-36 16-36 36v36c0 28 26 52 86 52zm40-28a12 12 0 110-24 12 12 0 010 24z" fill="currentColor" opacity="0.4"/></svg>,
  Kubernetes: <svg viewBox="0 0 256 256" className="w-full h-full"><circle cx="128" cy="128" r="100" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M128 28v200M28 128h200M52 52l152 152M204 52L52 204" stroke="currentColor" strokeWidth="3" opacity="0.2"/><circle cx="128" cy="128" r="36" fill="none" stroke="currentColor" strokeWidth="6"/><circle cx="128" cy="128" r="8" fill="currentColor"/></svg>,
  GraphQL: <svg viewBox="0 0 256 256" className="w-full h-full"><polygon points="128,32 220,84 220,172 128,224 36,172 36,84" fill="none" stroke="currentColor" strokeWidth="6"/><circle cx="128" cy="32" r="12" fill="currentColor"/><circle cx="220" cy="84" r="12" fill="currentColor"/><circle cx="220" cy="172" r="12" fill="currentColor"/><circle cx="128" cy="224" r="12" fill="currentColor"/><circle cx="36" cy="172" r="12" fill="currentColor"/><circle cx="36" cy="84" r="12" fill="currentColor"/></svg>,
}

/* ═══════════════════════ TECH STACK ═══════════════════════ */
function TechStack() {
  const sectionRef = useReveal()
  const toolsRef = useReveal('reveal-up', 0.08)
  const tools = [
    { name: 'React', color: '#61dafb' },
    { name: 'Next.js', color: '#0b0b0b' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Python', color: '#3776ab' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'AWS', color: '#ff9900' },
    { name: 'Docker', color: '#2496ed' },
  ]
  const outcomes = ['Fast product surfaces', 'Clean handover', 'Reliable hosting']

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-12 pt-4 pb-14 md:pt-8 md:pb-20 bg-white">
      <div className="tech-quiet-panel rounded-2xl md:rounded-[2rem] border border-[#e7e7e7] bg-white p-5 md:p-8 relative overflow-hidden">
        <div className="tech-quiet-bg absolute inset-0 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.35fr] gap-8 lg:gap-16 items-start">
          <div className="reveal-up" ref={sectionRef}>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a8a8a] block mb-3">Technology</span>
            <h2 className="text-[clamp(1.8rem,3.5vw,3.1rem)] font-extrabold tracking-tight leading-[1.05] text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Familiar tools. Practical choices.
            </h2>
            <p className="text-[#666] text-sm md:text-base leading-relaxed max-w-xl mt-4">
              Most clients do not need to think about frameworks. We choose proven tools, document the important parts, and keep the product easy to maintain after launch.
            </p>
          </div>

          <div className="reveal-up" ref={toolsRef}>
            <div className="tech-minimal-grid grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[#e7e7e7] bg-[#e7e7e7]">
              {tools.map((tool) => (
                <div key={tool.name} className="tech-minimal-cell bg-white/95 p-5 md:p-6 min-h-[105px] flex flex-col justify-between">
                  <span className="w-7 h-7 md:w-8 md:h-8" style={{ color: tool.color }}>
                    {techIcons[tool.name]}
                  </span>
                  <span className="text-base md:text-lg font-black text-[#101010]" style={{ fontFamily: 'Space Grotesk' }}>
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
              {outcomes.map((item) => (
                <div key={item} className="tech-outcome-item rounded-full border border-[#e7e7e7] bg-white px-4 py-3 text-xs font-bold text-[#444]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ MILESTONES (sujalbuild.in Awards style) ═══════════════════════ */
function Milestones() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const items = [
    {
      year: '2026',
      title: 'Construction AI Systems',
      status: 'Active build',
      accent: '#38bdf8',
      desc: 'Expanded construction work into practical operating platforms: Onsite for project collaboration and SiteSales AI for call analysis, sales coaching, risk signals, and company-device visibility.',
      projects: ['Onsite', 'SiteSales AI'],
    },
    {
      year: '2026',
      title: 'WhatsApp MRV + Field Rewards',
      status: 'Private platform',
      accent: '#f97316',
      desc: 'GG Krishi brought WhatsApp intake, AI image validation, carbon-audit support, farmer CRM, admin analytics, and reward/payment tracking into one field-ready workflow.',
      projects: ['GG Krishi'],
    },
    {
      year: '2025',
      title: 'AI Content Operations',
      status: 'Internal tooling',
      accent: '#c026d3',
      desc: 'EverKind AI UGC shaped a pipeline from trend intake to reference analysis, script generation, video creation, human review, publishing, and analytics.',
      projects: ['EverKind AI UGC'],
    },
    {
      year: '2025',
      title: 'Finance + Trade Platforms',
      status: 'Platform builds',
      accent: '#7c3aed',
      desc: 'MoneyOS and Breyus pushed the portfolio into fintech operating systems and B2B trade workflows with authenticated product surfaces, backend contracts, dashboards, and admin tools.',
      projects: ['MoneyOS', 'Breyus'],
    },
    {
      year: '2025',
      title: 'Sales + Call Intelligence',
      status: 'AI analytics',
      accent: '#be123c',
      desc: 'VoiceGuard AI established the call-analytics pattern; SiteSales AI extended that thinking into construction sales coaching, agent scorecards, and field-device context.',
      projects: ['VoiceGuard AI', 'SiteSales AI'],
    },
    {
      year: '2024',
      title: 'Sports, Publishing, and Health Systems',
      status: 'Product range',
      accent: '#2563eb',
      desc: 'Future Sportler, PowerBlog, and Di-Twin API added community flows, SEO publishing infrastructure, health-plan APIs, notifications, and wearable-data integrations.',
      projects: ['Future Sportler', 'PowerBlog', 'Di-Twin API'],
    },
    {
      year: '2024',
      title: 'SuperNetrix Founded',
      status: 'Foundation',
      accent: '#00c853',
      desc: 'Started as a small engineering team focused on shipping practical web, mobile, AI, and automation systems for startup and SME use cases.',
      projects: ['SuperNetrix'],
    },
  ]
  const projectHighlights = ['MoneyOS', 'VoiceGuard AI', 'GG Krishi', 'EverKind AI UGC', 'Onsite', 'SiteSales AI', 'Future Sportler']
  return (
    <section className="w-full bg-[#0b0b0b] py-20 md:py-28 px-4 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Two-column: heading left, items right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
          {/* Left - heading */}
          <div className="reveal-up" ref={useReveal()}>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-white tracking-tight leading-[1.1]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              TRACK RECORD
            </h2>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-tight leading-[1.1] mt-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <span className="text-[#00c853]">& MILESTONES</span>
            </h2>
            <p className="text-[#8aa0b5] text-sm md:text-base leading-relaxed max-w-md mt-6">
              A realistic view of the portfolio: private systems, public products, AI workflows, construction tools, finance platforms, and content infrastructure.
            </p>
            <div className="flex flex-wrap gap-2 max-w-md mt-7">
              {projectHighlights.map((name) => (
                <span key={name} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#b9cad8]">{name}</span>
              ))}
            </div>
          </div>

          {/* Right - expandable items */}
          <div>
            {items.map((item, i) => {
              const ref = useReveal('reveal-up', 0.1)
              const isOpen = openIdx === i
              return (
                <div key={i} ref={ref} className="border-b border-[#1f3547] group" data-hover>
                  <button onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full flex items-start gap-3 md:gap-6 py-5 md:py-6 text-left">
                    <span className="text-sm font-bold text-[#555] shrink-0 pt-1 w-10 md:w-12" style={{ fontFamily: 'Space Grotesk' }}>{item.year}</span>
                    <div className="flex-1">
                      <span className="inline-flex mb-2 rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9fb4c7]">{item.status}</span>
                      <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#dce8f3] group-hover:text-white'}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>{item.title}</h3>
                    </div>
                    <span className={`text-xl shrink-0 text-[#00c853] transition-all duration-300 ${isOpen ? 'rotate-45 scale-110' : ''}`}>+</span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden min-h-0">
                      <div className={`pl-[52px] md:pl-[72px] pr-4 md:pr-8 transition-opacity duration-500 ${isOpen ? 'opacity-100 pb-6' : 'opacity-0'}`}>
                        <p className="text-[#8aa0b5] text-sm leading-relaxed">{item.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.projects.map((project) => (
                            <span key={project} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d7e7f4]">{project}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ SERVICES ═══════════════════════ */
function Services() {
  return (
    <section id="services" className="relative max-w-[1600px] mx-auto px-4 md:px-12 pt-14 pb-12 md:pt-24 md:pb-20 bg-white overflow-visible">
      {/* Giant "out of place" heading — overflows the container */}
      <div className="reveal-up mb-6" ref={useReveal()}>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#888] block mb-4">What We Do</span>
      </div>
      <div className="reveal-up relative mb-12 md:mb-20" ref={useReveal()}>
        <h2 className="text-[clamp(3.5rem,12vw,11rem)] font-black tracking-[-0.04em] leading-[0.85] text-[#0b0b0b] relative z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          OUR
        </h2>
        <h2 className="text-[clamp(3.5rem,12vw,11rem)] font-black tracking-[-0.04em] leading-[0.85] italic text-[#00c853] -mt-1 md:-mt-3 relative z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          services
        </h2>
        {/* Ghost outline text behind — hidden on mobile */}
        <div className="hidden md:block absolute top-0 left-[8%] text-[clamp(4rem,14vw,13rem)] font-black tracking-[-0.04em] leading-[0.85] text-transparent pointer-events-none select-none z-0" style={{ fontFamily: 'Plus Jakarta Sans', WebkitTextStroke: '1px rgba(0,0,0,0.04)' }}>
          services
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5" style={{ gridAutoRows: 'minmax(0, auto)' }}>

        {/* Card 1: Mobile Apps - span 5, green bg */}
        <div data-hover className="bento-card md:col-span-5 rounded-[1.5rem] md:rounded-[2rem] bg-[#00c853] p-6 md:p-10 flex flex-col justify-between group reveal-scale min-h-[340px] md:min-h-[500px]" ref={useReveal('reveal-scale', 0.05)}>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b0b0b] text-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              <span className="text-[11px] font-bold uppercase tracking-wider">High Performance</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0b0b0b]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0b0b0b]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-[#0b0b0b] leading-[0.95] mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mobile<br/>Apps</h3>
            <p className="text-[#0b0b0b]/50 text-sm italic mb-6">iOS & Android Solutions</p>
            <div className="border-t border-[#0b0b0b]/15 pt-5 flex items-center justify-between">
              <div>
                <span className="text-base md:text-lg font-bold text-[#0b0b0b] block">Flutter</span>
                <span className="text-[11px] font-semibold text-[#0b0b0b]/50 uppercase tracking-wider">Cross-Platform Mastery</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#0b0b0b]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0b0b0b]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: SaaS + Web Apps stacked - span 3 */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-5">
          <div data-hover className="bento-card flex-1 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-[#e5e5e5] p-5 md:p-7 flex flex-col items-center justify-center text-center group reveal-scale min-h-[180px] md:min-h-0" ref={useReveal('reveal-scale', 0.05)}>
            <div className="w-12 h-12 rounded-xl bg-[#f0f0f0] flex items-center justify-center mb-4 group-hover:bg-[#00c853]/10 transition-colors duration-500">
              <svg className="w-6 h-6 text-[#888] group-hover:text-[#00c853] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25" /></svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b0b0b] mb-1 group-hover:text-[#00c853] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>SaaS</h3>
            <p className="text-xs text-[#888]">Scalable Platforms</p>
            <svg className="w-5 h-5 text-[#ddd] group-hover:text-[#00c853] transition-all duration-300 mt-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </div>
          <div data-hover className="bento-card flex-1 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-[#e5e5e5] p-5 md:p-7 flex flex-col items-center justify-center text-center group reveal-scale min-h-[180px] md:min-h-0" ref={useReveal('reveal-scale', 0.05)}>
            <div className="w-12 h-12 rounded-xl bg-[#f0f0f0] flex items-center justify-center mb-4 group-hover:bg-[#00c853]/10 transition-colors duration-500">
              <svg className="w-6 h-6 text-[#888] group-hover:text-[#00c853] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b0b0b] mb-1 group-hover:text-[#00c853] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>Web Apps</h3>
            <p className="text-xs text-[#888]">Modern & Responsive</p>
            <svg className="w-5 h-5 text-[#ddd] group-hover:text-[#00c853] transition-all duration-300 mt-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </div>
        </div>

        {/* Card 3: AI Agents - span 4, blue bg */}
        <div data-hover className="bento-card md:col-span-4 rounded-[1.5rem] md:rounded-[2rem] bg-[#1e4bff] p-6 md:p-10 flex flex-col justify-between group reveal-scale min-h-[340px] md:min-h-[500px] relative overflow-hidden" ref={useReveal('reveal-scale', 0.05)}>
          {/* Decorative watermark */}
          <div className="absolute top-8 right-4 md:right-8 text-[120px] md:text-[180px] font-black leading-none text-white/[0.08] pointer-events-none select-none" style={{ fontFamily: 'Space Grotesk' }}>AI</div>
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block mb-4 md:mb-6">#GenerativeAI</span>
            <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-white leading-[0.95] mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>AI<br/>Agents</h3>
            <p className="text-white/50 text-sm italic mb-6">Automate. Optimize. Evolve.</p>
          </div>
          <div className="relative z-10">
            <div className="border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {['Chatbots', 'Custom LLMs', 'Automation', 'Workflows', 'Predictive', 'Analytics'].map((tag, j) => (
                  <span key={j} className="text-[12px] font-semibold text-white/60">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: UI/UX Design - span 6, dark bg + shimmer */}
        <div data-hover className="bento-card shimmer-hover md:col-span-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#0b0b0b] p-6 md:p-10 flex flex-col justify-between group reveal-scale min-h-[220px] md:min-h-[280px] relative overflow-hidden" ref={useReveal('reveal-scale', 0.05)}>
          <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-[#00c853]/5 blur-2xl group-hover:bg-[#00c853]/10 transition-all duration-700 pointer-events-none" />
          {/* Pen tool icon */}
          <div className="absolute top-6 right-6 md:top-8 md:right-10 w-12 h-12 md:w-16 md:h-16 text-[#333] group-hover:text-[#00c853]/40 transition-colors duration-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 group-hover:text-[#00c853] transition-colors duration-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>UI/UX Design</h3>
            <p className="text-[#555] text-sm">Award-winning interfaces</p>
          </div>
          <p className="text-[#444] text-sm leading-relaxed mt-4 max-w-md relative z-10">User-centric design that drives engagement and conversion. We build experiences, not just screens.</p>
        </div>

        {/* Product Strategy - span 6, dark bg + shimmer */}
        <div data-hover className="bento-card shimmer-hover md:col-span-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#0b0b0b] p-6 md:p-10 flex flex-col justify-between group reveal-scale min-h-[220px] md:min-h-[280px] relative overflow-hidden" ref={useReveal('reveal-scale', 0.05)}>
          <div className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-[#00c853]/5 blur-2xl group-hover:bg-[#00c853]/10 transition-all duration-700 pointer-events-none" />
          {/* Chart/target icon */}
          <div className="absolute top-6 right-6 md:top-8 md:right-10 w-12 h-12 md:w-16 md:h-16 text-[#333] group-hover:text-[#00c853]/40 transition-colors duration-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v-5.5m3 5.5v-3.5m3 3.5v-1.5" /></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 group-hover:text-[#00c853] transition-colors duration-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>Product Strategy</h3>
            <p className="text-[#555] text-sm">From MVP to Scale</p>
          </div>
          <p className="text-[#444] text-sm leading-relaxed mt-4 max-w-md relative z-10">Roadmapping, feasibility analysis, and growth hacking for your digital product.</p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ PROCESS ═══════════════════════ */
function Process() {
  const steps = [
    { n: '01', t: 'Frame', d: 'Set the goal, users, scope, constraints, and decisions that matter before design starts.', output: 'Scope map', accent: '#2563eb', x: 330, y: 38, mx: 80, my: 130 },
    { n: '02', t: 'Design', d: 'Shape flows, screen states, data paths, and the build plan into something everyone can review.', output: 'Product map', accent: '#7c3aed', x: 760, y: 268, mx: 430, my: 142 },
    { n: '03', t: 'Build', d: 'Ship working slices with real data paths, frequent demos, and visible progress instead of hidden sprints.', output: 'Working system', accent: '#0891b2', x: 1190, y: 38, mx: 775, my: 130 },
    { n: '04', t: 'Launch', d: 'Deploy, test, monitor, and prepare the team to operate the product with confidence.', output: 'Live release', accent: '#d97706', x: 1620, y: 268, mx: 1120, my: 142 },
    { n: '05', t: 'Improve', d: 'Use real usage, feedback, and operational signals to decide what gets sharper next.', output: 'Next roadmap', accent: '#0f766e', x: 2050, y: 38, mx: 1465, my: 130 },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    const progress = progressRef.current
    if (!section || !viewport || !track || !progress) return

    let raf = 0
    let travel = 0
    let targetRatio = 0
    let currentRatio = 0
    let lastStep = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const clamp = (value: number) => Math.max(0, Math.min(1, value))

    const syncTarget = () => {
      const rect = section.getBoundingClientRect()
      const total = Math.max(1, section.offsetHeight - window.innerHeight)
      targetRatio = clamp(-rect.top / total)
    }

    const render = () => {
      syncTarget()
      const easing = reducedMotion.matches ? 1 : 0.14
      currentRatio += (targetRatio - currentRatio) * easing
      if (Math.abs(targetRatio - currentRatio) < 0.001) currentRatio = targetRatio

      track.style.transform = `translate3d(${-travel * currentRatio}px, 0, 0)`
      progress.style.transform = `scaleX(${currentRatio})`
      section.style.setProperty('--process-ratio', currentRatio.toFixed(4))

      const next = Math.min(steps.length - 1, Math.round(currentRatio * (steps.length - 1)))
      if (next !== lastStep) {
        lastStep = next
        setActiveStep(next)
      }

      if (currentRatio !== targetRatio) {
        raf = window.requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth)
      const isMobile = viewport.clientWidth < 768
      const scrollDistance = Math.max(
        window.innerHeight * (isMobile ? 3.65 : 2.05),
        travel * (isMobile ? 1.6 : 0.92),
      )
      section.style.setProperty('--process-flow-height', `${Math.round(window.innerHeight + scrollDistance)}px`)
      syncTarget()
      currentRatio = targetRatio
      track.style.transform = `translate3d(${-travel * currentRatio}px, 0, 0)`
      progress.style.transform = `scaleX(${currentRatio})`
      section.style.setProperty('--process-ratio', currentRatio.toFixed(4))
    }

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(render)
    }

    const onResize = () => measure()
    measure()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', onResize)
    }
  }, [steps.length])

  return (
    <section id="process" ref={sectionRef} className="process-flow-section relative w-full border-y border-[#e5e8ef]">
      <div className="process-flow-sticky">
        <div className="process-flow-inner mx-auto max-w-[1600px] px-4 md:px-12">
          <div className="process-flow-header">
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.15em] text-[#888]">How We Work</span>
              <h2 className="text-[clamp(2rem,4.8vw,4.2rem)] font-extrabold tracking-[-0.03em] leading-[0.96] text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                From idea to release.
              </h2>
            </div>
            <div className="process-flow-status">
              <p>A five-step delivery flow, moved by normal page scroll.</p>
              <div className="process-flow-progressbar">
                <span>{steps[activeStep].n}</span>
                <div>
                  <i ref={progressRef} />
                </div>
                <strong>{steps[activeStep].output}</strong>
              </div>
            </div>
          </div>

          <div ref={viewportRef} className="process-flow-viewport">
            <div ref={trackRef} className="process-flow-track">
              <svg className="process-flow-svg" viewBox="0 0 2580 560" preserveAspectRatio="none" aria-hidden="true">
                <path className="process-flow-path-base" d="M100 300 C260 126 430 134 560 254 C705 388 805 430 925 334 C1055 230 1100 122 1245 178 C1395 236 1420 408 1575 404 C1745 400 1790 160 1960 172 C2140 186 2225 302 2450 286" />
                <path className="process-flow-path-progress" pathLength="1" d="M100 300 C260 126 430 134 560 254 C705 388 805 430 925 334 C1055 230 1100 122 1245 178 C1395 236 1420 408 1575 404 C1745 400 1790 160 1960 172 C2140 186 2225 302 2450 286" />
              </svg>

              <div className="process-flow-anchor process-flow-origin">
                <span>Start</span>
                <strong>Brief</strong>
              </div>

              {steps.map((s, idx) => (
                <article
                  key={s.n}
                  data-hover
                  style={{ '--project-color': s.accent, '--node-x': `${s.x}px`, '--node-y': `${s.y}px`, '--mobile-node-x': `${s.mx}px`, '--mobile-node-y': `${s.my}px` } as React.CSSProperties}
                  className={`process-flow-node ${idx === activeStep ? 'is-active' : ''}`}
                >
                  <div className="process-flow-node-cap">
                    <span>{s.n}</span>
                    <i />
                  </div>
                  <div className="process-flow-node-body">
                    <p>{s.output}</p>
                    <h3>{s.t}</h3>
                    <span>{s.d}</span>
                  </div>
                </article>
              ))}

              <div className="process-flow-anchor process-flow-finish">
                <span>Release</span>
                <strong>Operate</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ SIGNAL LOG ═══════════════════════ */
function Testimonials() {
  const logIntroRef = useReveal()
  const [expanded, setExpanded] = useState(false)
  const items = [
    { quote: "WhatsApp intake became a controlled verification workflow with image checks, review lanes, CRM follow-up, and admin visibility.", name: 'GG Krishi', role: 'MRV Platform', signal: 'AI image validation', outcome: 'Field evidence to verified payout flow', accent: '#f97316' },
    { quote: "Trend research, scripts, video generation, human review, publishing, and analytics moved into one operating pipeline.", name: 'EverKind', role: 'AI UGC Pipeline', signal: 'Content ops engine', outcome: 'Trend input to reviewed video output', accent: '#c026d3' },
    { quote: "The trade workflow was mapped around sourcing, negotiation, documents, partner discovery, and admin control.", name: 'Breyus', role: 'B2B Trade Platform', signal: 'Multi-surface platform', outcome: 'Buyer, seller, admin, and AI surfaces', accent: '#7c3aed' },
    { quote: "Call recordings turned into reviewable coaching signals instead of staying as raw audio no one had time to inspect.", name: 'VoiceGuard AI', role: 'AI Analytics', signal: 'Call QA automation', outcome: 'Raw calls to performance review queues', accent: '#be123c' },
    { quote: "Scattered content work moved into one CMS with static delivery, SEO outputs, and search-ready publishing flows.", name: 'PowerBlog', role: 'Publishing Platform', signal: 'SEO publishing system', outcome: 'CMS workflow to static SEO delivery', accent: '#2563eb' },
    { quote: "Construction collaboration became structured around documents, approvals, pinned comments, client chat, and phase timelines.", name: 'Onsite', role: 'Construction SaaS', signal: 'Project ops portal', outcome: 'Documents, approvals, and client updates', accent: '#d97706' },
  ]
  const visibleItems = expanded ? items : items.slice(0, 3)
  const hiddenCount = items.length - visibleItems.length

  return (
    <section className="outcome-ledger-section w-full py-10 md:py-16 bg-white border-y border-[#e5e8ef] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
        <div className="outcome-ledger-header reveal-up" ref={logIntroRef}>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#888] block mb-3">Client Signals</span>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-tight text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              What changed after launch.
            </h2>
          </div>
          <p className="text-[#666] text-sm md:text-base leading-relaxed max-w-lg">A short ledger of recent systems and the operational change each one created.</p>
        </div>

        <div className="outcome-ledger-list">
          {visibleItems.map((t, i) => (
            <article key={t.name} className="outcome-ledger-row">
              <span className="outcome-ledger-index">{String(i + 1).padStart(2, '0')}</span>
              <div className="outcome-ledger-project">
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </div>
              <p className="outcome-ledger-copy">{t.quote}</p>
              <p className="outcome-ledger-result">
                <span>{t.signal}</span>
                <strong>{t.outcome}</strong>
              </p>
            </article>
          ))}
        </div>

        <div className="outcome-ledger-more">
          <span>{expanded ? 'Showing all proof notes.' : `${hiddenCount} more proof notes available.`}</span>
          <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ FAQ ═══════════════════════ */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const faqs = [
    { cat: 'Timeline', q: 'What is your typical project timeline?', a: 'Most focused MVPs and internal tools ship within 4-8 weeks. Larger platforms, mobile apps, AI pipelines, or admin-heavy systems are planned in phases so you can start using the core product early.' },
    { cat: 'Support', q: 'Do you provide post-launch support?', a: 'Yes. We can stay on as a monthly product and engineering partner for monitoring, fixes, optimization, feature iteration, analytics, hosting support, and roadmap planning.' },
    { cat: 'Pricing', q: 'What is your pricing model?', a: 'We usually work project-based for defined scopes and monthly retainers for ongoing work. After discovery, we give a clear scope, timeline, payment structure, and what is included before development starts.' },
    { cat: 'Ownership', q: 'Who owns the code and product after launch?', a: 'The client owns the product code and assets created for the engagement, unless a separate agreement says otherwise. We can hand over repositories, documentation, deployment notes, environment guidance, and admin access.' },
    { cat: 'Confidentiality', q: 'Can you work on private or confidential projects?', a: 'Yes. Many of our projects are private or not publicly linkable. We can work under NDA, avoid public links, limit case study detail, and keep sensitive business logic, customer data, and internal workflows private.' },
    { cat: 'Scope', q: 'Can you improve an existing product instead of building from scratch?', a: 'Yes. We can audit the current app, stabilize bugs, redesign weak flows, add AI or automation, improve performance, clean up architecture, or ship new modules on top of the existing codebase.' },
    { cat: 'AI', q: 'Do you build real AI workflows or just chatbot wrappers?', a: 'We build both simple assistants and deeper AI systems: document workflows, image validation, call analysis, UGC pipelines, admin review queues, scoring logic, human-in-the-loop checks, and analytics around model outputs.' },
    { cat: 'Team', q: 'How do we communicate during a project?', a: 'We keep communication practical: a clear project owner, weekly progress updates, async check-ins, demos at important milestones, and shared task visibility so you always know what is being built and what is blocked.' },
    { cat: 'Launch', q: 'Can you handle hosting, deployment, and domain setup?', a: 'Yes. We can set up Vercel, cloud hosting, databases, storage, environment variables, CI/CD, monitoring, and launch checklists. If the deployment account is owned by you, we may need access or an invite.' },
    { cat: 'Fit', q: 'What do you need from us to start?', a: 'A short product goal, target users, must-have workflows, examples of apps you like, any existing brand assets, and access to current code or tools if we are extending something. If details are unclear, we help shape the scope.' },
  ]
  return (
    <section id="faq" className="w-full bg-[#000] py-14 md:py-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="reveal-up mb-8 md:mb-12" ref={useReveal()}>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-tight text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>FAQs</h2>
          <p className="text-[#888] text-lg">Everything clients usually ask <span className="text-[#00c853] font-semibold">before we start</span></p>
        </div>
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-[#222]">
            <button onClick={() => setOpen(open === i ? null : i)} data-hover className="w-full flex items-start justify-between gap-4 py-6 text-left group">
              <div className="pr-2">
                <span className="inline-flex mb-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#7ea0bd]">{f.cat}</span>
                <h3 className="text-base md:text-xl font-semibold text-white group-hover:text-[#00c853] transition-colors duration-300">{f.q}</h3>
              </div>
              <span className={`text-[#00c853] transition-all duration-300 text-xl shrink-0 ${open === i ? 'rotate-45 scale-110' : ''}`}>+</span>
            </button>
            <div className={`faq-answer ${open === i ? 'open' : ''}`}>
              <p className="text-[#8aa0b5] text-sm md:text-base leading-relaxed pb-6 pr-8 md:pr-14">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════ CTA ═══════════════════════ */
function CTA() {
  return (
    <section id="contact" className="w-full relative px-3 md:px-8 pt-8 md:pt-12 pb-0 bg-[#fafafa]">
      {/* Blue rounded card */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#1e4bff] rounded-[2rem] md:rounded-[3rem] pt-20 md:pt-32 pb-40 md:pb-52 px-4 md:px-12 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e4bff] via-[#1e4bff] to-[#1a42e6] pointer-events-none rounded-[inherit]" />
        {/* Decorative blobs */}
        <div className="absolute top-10 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.03] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-[300px] h-[300px] rounded-full bg-[#00c853]/[0.05] blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="reveal-up" ref={useReveal()}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8 md:mb-10">
              <span className="w-2 h-2 rounded-full bg-[#00c853] pulse-dot" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.15em]">Let's Collaborate</span>
            </div>

            {/* Heading */}
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-[-0.02em] text-white leading-[1] mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Ready to <span className="italic text-[#c8ff00]" style={{ fontFamily: 'Georgia, Times, serif' }}>Scale</span><br />Your Business?
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10">
              Whether you need a high-performance web app, a mobile solution, or an AI integration, our team is ready to engineer your success.
            </p>
          </div>

          {/* Buttons */}
          <div className="reveal-up flex flex-col sm:flex-row gap-4 justify-center items-center" ref={useReveal()}>
            <a href={START_PROJECT_MAILTO} data-hover className="group inline-flex items-center gap-3 bg-[#c8ff00] text-[#0b0b0b] font-bold px-8 py-4 rounded-full hover:bg-[#d4ff33] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,255,0,0.4)] text-sm uppercase tracking-wider">
              Start A Project
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a href="#services" data-hover className="inline-flex items-center gap-2 text-sm font-bold border-2 border-white/30 text-white px-7 py-3.5 rounded-full hover:bg-white hover:text-[#1e4bff] transition-all duration-300 uppercase tracking-wider">
              View Services
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee bands — sujalbuild.in style */}
      <div className="relative -mt-10 md:-mt-14 z-20 -rotate-[1.5deg]" style={{ marginLeft: '-5vw', marginRight: '-5vw' }}>
        {/* Lime band */}
        <div className="bg-[#c8ff00] py-3 md:py-4">
          <Marquee items={['DESIGN', '✦', 'DEVELOP', '✦', 'DEPLOY', '✦', 'SCALE', '✦']} className="text-[clamp(1.5rem,4vw,2.8rem)] font-black text-[#0b0b0b] tracking-tight" />
        </div>
        {/* Blue band */}
        <div className="bg-[#1e4bff] py-3 md:py-4 mt-1">
          <Marquee items={['MOBILE APP EXPERTS', '✦', 'AI INTEGRATION', '✦', 'WEB PLATFORMS', '✦']} reverse className="text-[clamp(1.5rem,4vw,2.8rem)] font-black text-white tracking-tight" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════ FOOTER ═══════════════════════ */
function Footer() {
  const legalDocs = {
    privacy: {
      title: 'Privacy Policy',
      updated: 'Last updated: April 24, 2026',
      intro: 'This Privacy Policy explains how SuperNetrix collects, uses, shares, stores, and protects information submitted through this website, email, social links, and project inquiry channels.',
      sections: [
        { heading: 'Scope', body: 'This policy applies to visitors, prospects, clients, and partners who interact with SuperNetrix through this website, email, direct messages, calls, documents, or project collaboration channels.' },
        { heading: 'Information We Collect', body: 'We may collect names, email addresses, social handles, company details, project notes, requirements, budgets, timelines, attachments, meeting notes, and messages you choose to share with us.' },
        { heading: 'Technical Data', body: 'Our website or hosting providers may process basic technical data such as IP address, browser type, device information, referring pages, approximate location, pages visited, and timestamps for security, analytics, and site performance.' },
        { heading: 'How We Use Information', body: 'We use information to respond to inquiries, evaluate project fit, prepare proposals, schedule calls, plan delivery, manage client relationships, improve our services, keep business records, and protect our website and systems.' },
        { heading: 'Cookies and Analytics', body: 'We may use essential cookies, hosting logs, or privacy-conscious analytics to understand site performance and visitor behavior. You can control cookies through your browser settings, though some site features may work differently.' },
        { heading: 'Sharing Information', body: 'We do not sell personal information. We may share limited information with trusted service providers for hosting, email, analytics, document collaboration, project delivery, security, accounting, legal, or operational support.' },
        { heading: 'Client and Project Data', body: 'Project data, credentials, source files, business information, customer data, and internal materials are handled according to the relevant project agreement, access rules, and confidentiality expectations agreed with the client.' },
        { heading: 'Retention', body: 'We keep information only as long as reasonably needed for the purposes described here, including inquiry follow-up, project delivery, business records, legal obligations, dispute prevention, security, and operational continuity.' },
        { heading: 'Security', body: 'We use reasonable administrative, technical, and organizational safeguards designed for the size and nature of our work. No internet transmission, email, or storage system can be guaranteed to be completely secure.' },
        { heading: 'Your Choices', body: `You can request access, correction, deletion, or restriction of information you shared with us by contacting ${BADRI_EMAIL}. We may need to verify the request and retain records where required for legitimate business or legal reasons.` },
        { heading: 'International Visitors', body: 'If you contact us from outside India, your information may be processed in countries where we or our service providers operate. We handle such information with appropriate care for the type of data involved.' },
        { heading: 'Children', body: 'This website and our services are intended for business users and are not directed to children. We do not knowingly collect personal information from children through this website.' },
        { heading: 'Updates and Contact', body: `We may update this policy as our website, tools, or services evolve. For privacy questions, contact ${BADRI_EMAIL} or ${CORNELLEWS_EMAIL}.` },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'Last updated: April 24, 2026',
      intro: 'These Terms explain the rules for using this website, reviewing our public portfolio, and starting conversations with SuperNetrix about potential projects.',
      sections: [
        { heading: 'Acceptance', body: 'By using this website, sending an inquiry, or reviewing our public materials, you agree to use the site responsibly and follow these Terms. If you do not agree, please do not use the website.' },
        { heading: 'Website Use', body: 'You may view and share public website content for informational purposes. You may not misuse the site, scrape it at scale, interfere with its operation, upload malicious content, or attempt unauthorized access.' },
        { heading: 'No Automatic Engagement', body: 'Contacting SuperNetrix does not create a client relationship, delivery obligation, exclusivity, service-level commitment, or confidentiality obligation unless both parties sign a written agreement.' },
        { heading: 'Project Conversations', body: 'Discovery calls, emails, estimates, and informal recommendations are for evaluation only. Final scope, timeline, pricing, milestones, acceptance criteria, and responsibilities must be documented separately.' },
        { heading: 'Project Agreements', body: 'Each paid engagement is governed by its own proposal, statement of work, master services agreement, or written contract. If a project agreement conflicts with these Terms, the signed project agreement controls for that project.' },
        { heading: 'Payments and Scheduling', body: 'Deposits, invoices, milestone payments, late-payment handling, refunds, change requests, and delivery schedules are defined in project-specific agreements and are not created by this website alone.' },
        { heading: 'Intellectual Property', body: 'Website text, design, code, graphics, and brand assets belong to SuperNetrix or their respective owners. Client deliverable ownership, licenses, source access, and reusable components are handled in the relevant project agreement.' },
        { heading: 'Confidentiality', body: 'Please do not send confidential, regulated, or sensitive information before a confidentiality agreement or project agreement is in place. If you voluntarily send materials, we will handle them carefully but no formal confidentiality duty is created by website use alone.' },
        { heading: 'Portfolio Content', body: 'Case studies and project descriptions may summarize public work, private work, or generalized delivery patterns. Some names, metrics, details, or links may be omitted to protect confidentiality or because a project is not public.' },
        { heading: 'Third-Party Services', body: 'This website may reference or link to third-party tools, social platforms, hosting providers, analytics providers, or client websites. We are not responsible for third-party content, policies, availability, or security practices.' },
        { heading: 'No Warranties', body: 'Website content is provided for general information. We try to keep it accurate, but services, availability, claims, examples, and descriptions may change and are not guaranteed outcomes for future projects.' },
        { heading: 'Liability', body: 'To the fullest extent permitted by law, SuperNetrix is not liable for indirect, incidental, special, consequential, or punitive damages arising from website use or reliance on website content.' },
        { heading: 'Changes and Contact', body: `We may update these Terms as the website or services evolve. Questions can be sent to ${BADRI_EMAIL} or ${CORNELLEWS_EMAIL}.` },
      ],
    },
    conduct: {
      title: 'Code of Conduct',
      updated: 'Last updated: April 24, 2026',
      intro: 'This Code of Conduct sets the collaboration standards we expect from SuperNetrix, clients, partners, vendors, contributors, and anyone working with us on a project.',
      sections: [
        { heading: 'Respectful Communication', body: 'We expect clear, professional, and respectful communication across email, calls, shared documents, chat channels, tickets, comments, and review sessions.' },
        { heading: 'No Harassment or Abuse', body: 'Harassment, discrimination, threats, bullying, hate speech, intimidation, spam, abusive language, or retaliation against someone raising a concern is not acceptable.' },
        { heading: 'Constructive Feedback', body: 'Feedback should be specific, actionable, and focused on the work. We avoid personal attacks, vague blame, public shaming, and pressure tactics that make collaboration unsafe or unproductive.' },
        { heading: 'Confidentiality Mindset', body: 'Project ideas, credentials, customer data, business materials, source code, private documents, meeting recordings, and internal plans should be shared only with people who need access.' },
        { heading: 'Credential and Access Safety', body: 'Access to repositories, cloud accounts, analytics, databases, admin portals, and AI tools should be granted with least privilege, removed when no longer needed, and never shared through unsafe channels.' },
        { heading: 'Responsible AI and Automation', body: 'AI, automation, scraping, agents, and analytics systems should be used transparently and lawfully. We do not support deceptive impersonation, fraud, unlawful surveillance, unauthorized access, or harmful misuse.' },
        { heading: 'Client Data and User Trust', body: 'When projects involve user data, call recordings, images, payments, location, health, finance, or workplace monitoring, we expect extra care around consent, security, retention, access control, and auditability.' },
        { heading: 'Scope and Availability', body: 'We respect agreed working hours, response expectations, milestones, and escalation paths. Urgent work, weekend work, or major changes should be discussed clearly rather than assumed.' },
        { heading: 'Quality and Honesty', body: 'We aim to communicate risks early, avoid overstating what is shipped, document meaningful decisions, and make limitations visible before they become delivery or trust problems.' },
        { heading: 'Reporting Concerns', body: `Concerns can be raised directly through ${BADRI_EMAIL} or ${CORNELLEWS_EMAIL}. We will review concerns in good faith and take reasonable steps to address confirmed issues.` },
      ],
    },
  }
  const [legalOpen, setLegalOpen] = useState<keyof typeof legalDocs | null>(null)
  const socials = [
    { href: INSTAGRAM_URL, label: 'Instagram', icon: <InstagramIcon /> },
    { href: THREADS_URL, label: 'Threads', icon: <ThreadsIcon /> },
  ]
  const legalLinks: Array<{ key: keyof typeof legalDocs; label: string; note: string }> = [
    { key: 'privacy', label: 'Privacy Policy', note: 'How inquiry data is handled' },
    { key: 'terms', label: 'Terms & Conditions', note: 'Website and project conversation terms' },
    { key: 'conduct', label: 'Code of Conduct', note: 'How we collaborate with clients' },
  ]

  useEffect(() => {
    if (!legalOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLegalOpen(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [legalOpen])

  return (
    <footer className="w-full bg-[#fafafa] pt-12 md:pt-16 pb-8 px-3 md:px-8">
      {/* Rounded card container */}
      <div className="max-w-[1600px] mx-auto bg-white rounded-[2rem] md:rounded-[3rem] border border-[#e8e8e8] p-6 md:p-12 lg:p-16">
        {/* Top: Contacts + Email */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#999] mb-3 block">Contacts</span>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${BADRI_EMAIL}`} data-hover className="text-[#0b0b0b] text-xl md:text-3xl font-bold hover:text-[#00c853] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>{BADRI_EMAIL}</a>
              <a href={`mailto:${CORNELLEWS_EMAIL}`} data-hover className="text-[#666] text-base md:text-xl font-semibold hover:text-[#00c853] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>{CORNELLEWS_EMAIL}</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener" data-hover aria-label={s.label}
                className="w-11 h-11 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#888] hover:text-white hover:bg-[#00c853] transition-all duration-300">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 mb-12 md:mb-16">
          {/* Col 1: About card */}
          <div className="lg:col-span-2 bg-[#f8f8f8] rounded-2xl p-6 md:p-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c853] block mb-3">Designed & Developed By</span>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e9edf2] bg-white">
                <BrandMark className="h-6 w-6" />
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-[#0b0b0b]" style={{ fontFamily: 'Plus Jakarta Sans' }}>SuperNetrix</h3>
            </div>
            <p className="text-[#777] text-sm leading-relaxed max-w-sm">Strategic Technology Partner crafting high-impact digital experiences for startups and enterprises.</p>
            <p className="text-[#aaa] text-xs mt-4">Based globally. Building remotely.</p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#999] mb-5 block">Quick Links</span>
            <nav className="flex flex-col gap-3">
              {[['Home', '#'], ['About', '#about'], ['Services', '#services'], ['Case Studies', '#work'], ['Contact', '#contact']].map(([label, href]) => (
                <a key={label} href={href} data-hover className="text-sm font-medium text-[#444] hover:text-[#00c853] transition-colors inline-block w-fit">{label}</a>
              ))}
            </nav>
          </div>

          {/* Col 3: Legal */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#999] mb-5 block">Legal</span>
            <nav className="flex flex-col gap-2.5">
              {legalLinks.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLegalOpen(item.key)}
                  data-hover
                  className="group rounded-2xl border border-[#eceff3] bg-[#fbfbfc] px-3.5 py-3 text-left transition-all duration-300 hover:border-[#0b0b0b] hover:bg-white"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-sm font-bold text-[#1f2228] leading-tight">{item.label}</span>
                      <span className="mt-1 block text-[11px] leading-snug text-[#8b95a5]">{item.note}</span>
                    </span>
                    <span className="mt-0.5 text-[#a3adbb] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#0b0b0b]">↗</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Col 4: Inquiries */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#999] mb-5 block">Inquiries</span>
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bbb] block mb-1">Projects</span>
                <a href={`mailto:${BADRI_EMAIL}`} data-hover className="text-sm font-medium text-[#444] hover:text-[#00c853] transition-colors inline-block w-fit">{BADRI_EMAIL}</a>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bbb] block mb-1">Operations</span>
                <a href={`mailto:${CORNELLEWS_EMAIL}`} data-hover className="text-sm font-medium text-[#444] hover:text-[#00c853] transition-colors inline-block w-fit">{CORNELLEWS_EMAIL}</a>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bbb] block mb-1">Instagram</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener" data-hover className="text-sm font-medium text-[#444] hover:text-[#00c853] transition-colors inline-block w-fit">@supernetrix</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#eee] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#aaa]">&copy; 2026 SuperNetrix. All Rights Reserved.</p>
          <a href="#" data-hover className="text-xs text-[#aaa] hover:text-[#00c853] transition-colors">Back to Top ↑</a>
        </div>
      </div>

      {legalOpen && (() => {
        const doc = legalDocs[legalOpen]
        return (
          <div className="legal-modal-overlay fixed inset-0 z-[300] overflow-y-auto scrollbar-hide p-3 md:p-6" onClick={() => setLegalOpen(null)}>
            <div className="fixed inset-0 bg-[#0b0b0b]/55 backdrop-blur-md" />
            <div className="legal-modal-panel relative z-10 mx-auto my-4 md:my-8 w-full max-w-4xl overflow-hidden rounded-[1.35rem] md:rounded-[2rem] border border-white/30 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]" role="dialog" aria-modal="true" aria-labelledby={`legal-${legalOpen}-title`} onClick={e => e.stopPropagation()}>
              <div className="relative border-b border-[#e9edf3] bg-white px-5 pb-5 pt-6 md:px-8 md:pb-7 md:pt-8">
                <button type="button" onClick={() => setLegalOpen(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e8ef] bg-white text-[#0b0b0b] transition-colors hover:bg-[#0b0b0b] hover:text-white md:right-6 md:top-6" aria-label="Close legal popup">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="pr-14">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8b95a5]">SuperNetrix Legal</span>
                  <h3 id={`legal-${legalOpen}-title`} className="mt-3 text-[2rem] font-black leading-[0.98] tracking-tight text-[#0b0b0b] md:text-5xl" style={{ fontFamily: 'Plus Jakarta Sans' }}>{doc.title}</h3>
                  <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-[#5f6673] md:mt-5 md:text-lg">{doc.intro}</p>
                  <span className="mt-4 inline-flex rounded-full border border-[#edf0f4] bg-[#fafbfc] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#8b95a5]">{doc.updated}</span>
                </div>
              </div>

              <div className="px-4 py-4 md:px-8 md:py-7">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {doc.sections.map((section, i) => (
                    <section key={section.heading} className="rounded-[1.1rem] border border-[#e8ecf2] bg-[#fdfdfd] p-4 md:p-5">
                      <div className="mb-3 flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2f4f7] text-[11px] font-black text-[#7b8494]" style={{ fontFamily: 'Space Grotesk' }}>{String(i + 1).padStart(2, '0')}</span>
                        <h4 className="text-[1rem] font-black leading-tight text-[#0b0b0b] md:text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>{section.heading}</h4>
                      </div>
                      <p className="text-[0.9rem] leading-relaxed text-[#5f6673] md:text-sm">{section.body}</p>
                    </section>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#e9edf3] bg-[#fafbfc] px-5 py-4 md:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-xs leading-relaxed text-[#7b8494]">Questions about these terms can be sent to <a className="font-bold text-[#0b0b0b] hover:text-[#00c853]" href={`mailto:${BADRI_EMAIL}`}>{BADRI_EMAIL}</a>.</p>
                  <button type="button" onClick={() => setLegalOpen(null)} className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-[#e1e5eb] bg-white px-5 text-xs font-bold text-[#0b0b0b] transition-colors hover:border-[#0b0b0b]">Done</button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </footer>
  )
}

/* ═══════════════════════ APP ═══════════════════════ */
function App() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <CustomCursor />
      <Navbar />
      <Hero />
      <ClientMarquee />
      <About />
      <Stats />
      <WhatWeBuild />
      <TripleMarquee />
      <Projects />
      <TechStack />
      <Milestones />
      <Services />
      <Process />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <SpeedInsights />
    </div>
  )
}

export default App
