'use client';

import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const DEFAULT_COLORS = ['#1b1818', '#211d1d', '#272121', '#2d2525'];

const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = DEFAULT_COLORS,
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/Copy of CoreCraft Logo.png',
  menuButtonColor = '#100e0e',
  openMenuButtonColor = '#ff502e',
  changeMenuColorOnOpen = true,
  accentColor = '#ff502e',
  isFixed = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openRef = useRef(false);
  const busyRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  const overlayPositionClass = isFixed
    ? `fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} bottom-0`
    : `absolute top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full`;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) {
        return;
      }

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

  const offscreen = position === 'left' ? -120 : 120;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });

    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const layerStates = layers.map((el) => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, idx) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        idx * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            ['--sm-num-opacity' as any]: 1,
            stagger: { each: 0.08, from: 'start' },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity,y' });
            },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

  const offscreen = position === 'left' ? -120 : 120;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]
  );

  useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const sequence: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i += 1) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      sequence.push(last);
    }
    if (last !== targetLabel) sequence.push(targetLabel);
    sequence.push(targetLabel);

    setTextLines(sequence);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = sequence.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [animateColor, animateIcon, animateText, onMenuClose, onMenuOpen, playClose, playOpen]);

  return (
    <div className={`sm-scope relative z-40 ${className || ''}`} data-open={open || undefined}>
      <div
        className="staggered-menu-wrapper relative z-40"
        style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className={`sm-prelayers ${overlayPositionClass} pointer-events-none z-[60]`}
          aria-hidden="true"
        >
          {(colors.length ? colors.slice(0, 4) : DEFAULT_COLORS).map((color, idx) => (
            <div
              key={idx}
              className="sm-prelayer absolute top-0 right-0 h-full w-full"
              style={{ background: color }}
            />
          ))}
        </div>

        <header
          className="staggered-menu-header pointer-events-none"
          aria-label="Main navigation header"
        >
          <button
            ref={toggleBtnRef}
            className={`sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto ${
              open ? 'text-[#ff502e]' : 'text-[#100e0e]'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={iconRef}
              className="sm-icon relative hidden md:inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center md:order-2"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 h-[2px] w-full rounded-[2px] bg-current"
              />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 h-[2px] w-full rounded-[2px] bg-current"
              />
            </span>

            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap md:order-1"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((line, idx) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={`${line}-${idx}`}>
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className={`staggered-menu-panel ${overlayPositionClass} z-[75] flex h-full flex-col overflow-y-auto`}
          aria-hidden={!open}
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="sm-panel-inner flex flex-1 flex-col gap-5">
            <ul
              className="sm-panel-list"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items.length ? (
                items.map((item, idx) => (
                  <li className="sm-panel-itemWrap" key={`${item.label}-${idx}`}>
                    <a
                      className="sm-panel-item"
                      href={item.link}
                      aria-label={item.ariaLabel}
                      data-index={String(idx + 1).padStart(2, '0')}
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials" aria-label="Social links">
                <h3 className="sm-socials-title">Follow Us</h3>
                <ul className="sm-socials-list" role="list">
                  {socialItems.map((social, idx) => (
                    <li key={`${social.label}-${idx}`} className="sm-socials-item">
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link"
                        aria-label={social.label}
                      >
                        {social.icon ? (
                          <>
                            <span className="sm-socials-icon" aria-hidden="true">
                              {social.icon}
                            </span>
                            <span className="sr-only">{social.label}</span>
                          </>
                        ) : (
                          <span>{social.label}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

  <style jsx global>{`
.sm-scope .staggered-menu-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1.75rem 0.5rem;
  pointer-events: none;
  z-index: 90;
}
@media (min-width: 768px) {
  .sm-scope .staggered-menu-header {
    padding: 1.75rem 2rem;
  }
}
.sm-scope .sm-toggle {
  font-size: 1.4rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
.sm-scope .sm-panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.sm-scope .sm-panel-itemWrap {
  position: relative;
  overflow: hidden;
  line-height: 1;
}
.sm-scope .sm-panel-item {
  position: relative;
  color: #f4f5f7;
  font-weight: 600;
  font-size: clamp(2.3rem, 4.5vw, 3.6rem);
  letter-spacing: -0.06em;
  text-transform: uppercase;
  display: inline-block;
  text-decoration: none;
  padding-right: 1.4em;
  transition: color 0.25s ease;
}
.sm-scope .sm-panel-item:hover,
.sm-scope .sm-panel-item:focus-visible {
  color: var(--sm-accent, #ff502e);
  outline: none;
}
.sm-scope .sm-panel-itemLabel {
  display: inline-block;
  transform-origin: 50% 100%;
}
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
  content: attr(data-index);
  position: absolute;
  top: 0.2em;
  right: 3em;
  font-size: 1rem;
  font-weight: 400;
  color: var(--sm-accent, #ff502e);
  opacity: var(--sm-num-opacity, 0);
  transition: opacity 0.3s ease;
}
.sm-scope .sm-socials {
  margin-top: auto;
  padding-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.sm-scope .sm-socials-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--sm-accent, #ff502e);
}
.sm-scope .sm-socials-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}
.sm-scope .sm-socials-link {
  color: #f4f5f7;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease, opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
.sm-scope .sm-socials-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}
.sm-scope .sm-socials-icon svg {
  width: 100%;
  height: 100%;
}
.sm-scope .sm-socials-link:hover,
.sm-scope .sm-socials-link:focus-visible {
  color: var(--sm-accent, #ff502e);
  outline: none;
}
.sm-scope .sm-prelayers {
  width: clamp(260px, 38vw, 420px);
}
.sm-scope [data-position='left'] .sm-prelayers,
.sm-scope [data-position='left'] .staggered-menu-panel {
  left: 0;
  right: auto;
}
.sm-scope .staggered-menu-panel {
  width: clamp(260px, 38vw, 420px);
  background: rgba(16, 14, 14, 0.94);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 7.5rem 2.25rem 2.5rem;
}
.sm-scope .sm-panel-inner {
  color: #f4f5f7;
}
.sm-scope .sm-socials-list .sm-socials-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1px;
  background: var(--sm-accent, #ff502e);
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.3s ease;
}
.sm-scope .sm-socials-list .sm-socials-link:hover::after,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible::after {
  transform: scaleX(1);
}
@media (max-width: 1024px) {
  .sm-scope .staggered-menu-panel,
  .sm-scope .sm-prelayers {
    width: 100%;
  }
}
@media (max-width: 640px) {
  .sm-scope .staggered-menu-panel {
    padding: 5rem 1.75rem 2rem;
  }
  .sm-scope .sm-panel-item {
    font-size: clamp(2.2rem, 10vw, 3.25rem);
  }
}
  `}</style>
    </div>
  );
};

export default StaggeredMenu;
