/* ═══════════════════════════════════════
   script.ts — Portfolio Interactions
═══════════════════════════════════════ */

import { supabase } from './supabase';

// ─── IIFE wrapper ──────────────────────
(function (): void {
  'use strict';

  // ─── Utility — safe querySelector ────────
  function qs<T extends HTMLElement>(selector: string, parent: ParentNode = document): T | null {
    return parent.querySelector<T>(selector);
  }

  function qsAll<T extends HTMLElement>(selector: string, parent: ParentNode = document): NodeListOf<T> {
    return parent.querySelectorAll<T>(selector);
  }

  function getById<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  // ─── LOADING SCREEN ─────────────────────
  const loader: HTMLElement | null = getById('loader');

  window.addEventListener('load', (): void => {
    setTimeout((): void => {
      loader?.classList.add('hidden');
      document.body.style.overflow = '';
      triggerHeroAnimations();
      
      isLoaderGone = true;
      tryInitObservers();
    }, 2000);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';



  // ─── NAVBAR ─────────────────────────────
  const navbar: HTMLElement | null = getById('navbar');
  const hamburger: HTMLButtonElement | null = getById<HTMLButtonElement>('hamburger');
  const mobileMenu: HTMLElement | null = getById('mobile-menu');
  const mobileLinks: NodeListOf<HTMLAnchorElement> = qsAll<HTMLAnchorElement>('.mobile-link');

  // Scroll detection
  window.addEventListener('scroll', (): void => {
    const scrollY: number = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active nav link
    updateActiveLink();

    // Back to top visibility
    const btt: HTMLElement | null = getById('back-to-top');
    if (btt) {
      if (scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', (): void => {
    if (!mobileMenu || !hamburger) return;

    const isOpen: boolean = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach((link: HTMLAnchorElement): void => {
    link.addEventListener('click', (): void => {
      mobileMenu?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  mobileMenu?.addEventListener('click', (e: Event): void => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Active nav link tracking
  function updateActiveLink(): void {
    const sections: NodeListOf<HTMLElement> = qsAll<HTMLElement>('section[id]');
    const navLinks: NodeListOf<HTMLAnchorElement> = qsAll<HTMLAnchorElement>('.nav-link');
    let current: string = '';

    sections.forEach((sec: HTMLElement): void => {
      const top: number = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });

    navLinks.forEach((link: HTMLAnchorElement): void => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  let isDataLoaded = false;
  let isLoaderGone = false;
  
  function tryInitObservers(): void {
    if (isDataLoaded && isLoaderGone) {
      initScrollObservers();
    }
  }

  // ─── SCROLL REVEAL ──────────────────────
  let observersInitialized = false;
  function initScrollObservers(): void {
    if (observersInitialized) return;
    observersInitialized = true;

    const revealEls: NodeListOf<HTMLElement> = qsAll<HTMLElement>(
      '.reveal, .reveal-up, .reveal-fade, .reveal-right'
    );

    const revealObserver: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        entries.forEach((entry: IntersectionObserverEntry): void => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            // Animate skill bars when they come into view
            const bars: NodeListOf<HTMLElement> = (entry.target as HTMLElement).querySelectorAll<HTMLElement>('.skill-fill');
            bars.forEach((bar: HTMLElement): void => animateSkillBar(bar));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el: HTMLElement): void => revealObserver.observe(el));

    // Also observe skill cards individually
    qsAll<HTMLElement>('.skill-card').forEach((card: HTMLElement): void => {
      const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
          entries.forEach((entry: IntersectionObserverEntry): void => {
            if (entry.isIntersecting) {
              const bar: HTMLElement | null = qs<HTMLElement>('.skill-fill', entry.target as HTMLElement);
              if (bar) animateSkillBar(bar);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(card);
    });
  }

  // ─── HERO ANIMATIONS ────────────────────
  function triggerHeroAnimations(): void {
    const heroEls: NodeListOf<HTMLElement> = qsAll<HTMLElement>(
      '.section-hero .reveal, .section-hero .reveal-up, .section-hero .reveal-fade, .section-hero .reveal-right'
    );
    heroEls.forEach((el: HTMLElement, i: number): void => {
      setTimeout((): void => el.classList.add('visible'), i * 80);
    });
    animateCounters();
  }

  // ─── COUNTER ANIMATION ──────────────────
  function animateCounters(): void {
    qsAll<HTMLElement>('.stat-number[data-target]').forEach((el: HTMLElement): void => {
      const targetStr: string | undefined = (el as HTMLElement).dataset.target;
      if (!targetStr) return;

      const target: number = parseInt(targetStr, 10);
      const duration: number = 1500;
      const step: number = target / (duration / 16);
      let current: number = 0;

      const timer: ReturnType<typeof setInterval> = setInterval((): void => {
        current += step;
        if (current >= target) {
          el.textContent = String(target);
          clearInterval(timer);
        } else {
          el.textContent = String(Math.floor(current));
        }
      }, 16);
    });
  }

  // ─── SKILL BAR ANIMATION ────────────────
  function animateSkillBar(bar: HTMLElement): void {
    const level: string | undefined = (bar as HTMLElement).dataset.level;
    if (!level) return;
    // Small delay to make it feel smooth
    requestAnimationFrame((): void => {
      bar.style.width = `${level}%`;
    });
  }

  // ─── SKILLS TABS ────────────────────────
  const skillTabs: NodeListOf<HTMLButtonElement> = qsAll<HTMLButtonElement>('.skill-tab');
  const skillGrids: NodeListOf<HTMLElement> = qsAll<HTMLElement>('#skills .skills-grid');

  skillTabs.forEach((tab: HTMLButtonElement): void => {
    tab.addEventListener('click', (): void => {
      const targetTab: string | undefined = tab.dataset.tab;
      if (!targetTab) return;

      // Update tabs
      skillTabs.forEach((t: HTMLButtonElement): void => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide grids
      skillGrids.forEach((grid: HTMLElement): void => {
        const isTarget: boolean = grid.id === `tab-content-${targetTab}`;
        grid.classList.toggle('hidden', !isTarget);

        if (isTarget) {
          // Trigger reveal + bar animations
          const cards: NodeListOf<HTMLElement> = grid.querySelectorAll<HTMLElement>('.skill-card');
          cards.forEach((card: HTMLElement, i: number): void => {
            card.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5');
            card.classList.remove('visible');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout((): void => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              const bar: HTMLElement | null = card.querySelector<HTMLElement>('.skill-fill');
              if (bar) {
                bar.style.width = '0';
                setTimeout((): void => animateSkillBar(bar), 200);
              }
            }, i * 80);
          });
        }
      });
    });
  });

  // ─── CONTACT FORM ───────────────────────
  const form: HTMLFormElement | null = getById<HTMLFormElement>('contact-form');

  if (form) {
    form.addEventListener('submit', (e: Event): void => {
      e.preventDefault();

      const btn: HTMLButtonElement | null = getById<HTMLButtonElement>('btn-send-message');
      if (!btn) return;

      const btnText: HTMLSpanElement | null = btn.querySelector<HTMLSpanElement>('.btn-text');
      if (!btnText) return;

      // Validate
      const inputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement> =
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required], textarea[required]');
      let valid: boolean = true;

      inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement): void => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#ef4444';
          setTimeout((): void => {
            input.style.borderColor = '';
          }, 2000);
        }
      });

      if (!valid) return;

      // Send to Supabase
      btnText.textContent = 'Sending…';
      btn.disabled = true;

      const name = (document.getElementById('form-name') as HTMLInputElement)?.value || '';
      const email = (document.getElementById('form-email') as HTMLInputElement)?.value || '';
      const subject = (document.getElementById('form-subject') as HTMLInputElement)?.value || '';
      const content = (document.getElementById('form-message') as HTMLTextAreaElement)?.value || '';
      const fullMessage = subject ? `Subject: ${subject}\n\n${content}` : content;

      supabase.from('messages').insert([{ name, email, message: fullMessage }])
        .then(({ error }) => {
          if (error) {
            console.error('Supabase error:', error);
            btnText.textContent = 'Error Sending!';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
          } else {
            btnText.textContent = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            form.reset();
          }

          setTimeout((): void => {
            btnText.textContent = 'Send Message';
            btn.disabled = false;
            btn.style.background = '';
          }, 3000);
        });
    });

    // Real-time validation styling
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(
      (field: HTMLInputElement | HTMLTextAreaElement): void => {
        field.addEventListener('blur', (): void => {
          if (field.required && !field.value.trim()) {
            field.style.borderColor = 'rgba(239, 68, 68, 0.6)';
          } else {
            field.style.borderColor = '';
          }
        });
        field.addEventListener('input', (): void => {
          if (field.value.trim()) field.style.borderColor = '';
        });
      }
    );
  }

  // ─── BACK TO TOP ────────────────────────
  const btt: HTMLButtonElement | null = getById<HTMLButtonElement>('back-to-top');
  if (btt) {
    btt.addEventListener('click', (): void => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────
  qsAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor: HTMLAnchorElement): void => {
    anchor.addEventListener('click', (e: Event): void => {
      const href: string | null = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target: HTMLElement | null = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();
      const offset: number = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  // ─── FOOTER YEAR ────────────────────────
  const yearEl: HTMLElement | null = getById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ─── WORK CARD TILT (subtle 3D) ─────────
  qsAll<HTMLElement>('.work-card').forEach((card: HTMLElement): void => {
    card.addEventListener('mousemove', (e: MouseEvent): void => {
      const rect: DOMRect = card.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const y: number = e.clientY - rect.top;
      const cx: number = rect.width / 2;
      const cy: number = rect.height / 2;
      const rotY: number = ((x - cx) / cx) * 4;
      const rotX: number = -((y - cy) / cy) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', (): void => {
      card.style.transform = '';
    });
  });

  // ─── PAGE VISIBILITY API — pause animations ─
  document.addEventListener('visibilitychange', (): void => {
    const track: HTMLElement | null = qs<HTMLElement>('.marquee-track');
    if (!track) return;
    track.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });

  // ─── DYNAMIC CMS FETCHING ──────────────────
  async function loadCMSData() {
    // Settings (About text)
    const { data: settingsData } = await supabase.from('settings').select('*').limit(1);
    if (settingsData && settingsData.length > 0) {
      const s = settingsData[0];
      const aboutEl = qs('#about-text-container');
      if (aboutEl && s.about_text) {
        const pars = s.about_text.split('\n').filter((p: string) => p.trim() !== '');
        aboutEl.innerHTML = pars.map((p: string) => `<p class="about-text reveal-fade">${p}</p>`).join('');
      }
      
      const gpaEl = qs('#about-gpa-val');
      if (gpaEl && s.gpa) {
        gpaEl.textContent = `GPA ${s.gpa}`;
      }

      const aboutCtfEl = qs('#about-ctf-val');
      if (aboutCtfEl && s.stat_ctf) {
        aboutCtfEl.textContent = `${s.stat_ctf}+ CTFs`;
      }
      
      const emailLinkAbout = qs('#about-email-link') as HTMLAnchorElement;
      if (emailLinkAbout && s.email) {
        emailLinkAbout.href = `mailto:${s.email}`;
        emailLinkAbout.textContent = s.email;
      }
      const phoneLinkAbout = qs('#about-phone-link') as HTMLAnchorElement;
      if (phoneLinkAbout && s.phone) {
        const phoneClean = s.phone.replace(/\D/g, '');
        phoneLinkAbout.href = `tel:+84${phoneClean.startsWith('0') ? phoneClean.slice(1) : phoneClean}`;
        phoneLinkAbout.textContent = s.phone;
      }
      const locVal = qs('#about-location-val');
      if (locVal && s.location) {
        locVal.innerHTML = s.location;
      }

      // Hero Section
      const heroTitleEl = qs('#client-hero-title');
      if (heroTitleEl && s.hero_title) {
        heroTitleEl.innerHTML = `<span class="title-line reveal-up">${s.hero_title}</span>`;
      }
      const heroSubtitleEl = qs('#client-hero-subtitle');
      if (heroSubtitleEl && s.hero_subtitle) {
        // Convert bold markdown-style to strong tag
        let subtitleHtml = s.hero_subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        heroSubtitleEl.innerHTML = subtitleHtml;
      }
      
      const statCtf = qs('#stat-ctf-val');
      if (statCtf && s.stat_ctf) statCtf.dataset.target = s.stat_ctf;
      const statLang = qs('#stat-lang-val');
      if (statLang && s.stat_languages) statLang.dataset.target = s.stat_languages;
      const statPlat = qs('#stat-plat-val');
      if (statPlat && s.stat_platforms) statPlat.dataset.target = s.stat_platforms;

      // Social Links
      const updateLink = (idPrefix: string, url: string | undefined) => {
        if (!url) return;
        const links = qsAll(`[id^="${idPrefix}"]`) as NodeListOf<HTMLAnchorElement>;
        links.forEach(l => l.href = url);
      };
      updateLink('social-github', s.github_url);
      updateLink('footer-github', s.github_url);
      updateLink('contact-github', s.github_url);
      
      updateLink('social-linkedin', s.linkedin_url);
      updateLink('footer-linkedin', s.linkedin_url);
      updateLink('contact-linkedin', s.linkedin_url);
      
      updateLink('social-facebook', s.facebook_url);
      updateLink('footer-facebook', s.facebook_url);
      
      updateLink('social-instagram', s.instagram_url);
      updateLink('footer-instagram', s.instagram_url);

      // Contact Links Text extraction
      const updateContactTextFromUrl = (id: string, url: string | undefined) => {
        if (!url) return;
        const el = qs(`#${id} .contact-value`);
        if (el) {
           const parts = url.split('/').filter(Boolean);
           el.textContent = parts[parts.length - 1];
        }
      }
      updateContactTextFromUrl('contact-github', s.github_url);
      updateContactTextFromUrl('contact-linkedin', s.linkedin_url);

      // Contact Links
      const emailLink = qs('#contact-email-link') as HTMLAnchorElement;
      if (emailLink && s.email) {
        emailLink.href = `mailto:${s.email}`;
        const val = emailLink.querySelector('.contact-value');
        if (val) val.textContent = s.email;
      }
      const phoneLink = qs('#contact-phone-link') as HTMLAnchorElement;
      if (phoneLink && s.phone) {
        const phoneClean = s.phone.replace(/\D/g, '');
        phoneLink.href = `tel:+84${phoneClean.startsWith('0') ? phoneClean.slice(1) : phoneClean}`;
        const val = phoneLink.querySelector('.contact-value');
        if (val) val.textContent = s.phone;
      }
    }

    // Skills
    const { data: skills } = await supabase.from('skills').select('*').order('level', { ascending: false });
    if (skills && skills.length > 0) {
      const fe = getById('tab-content-frontend');
      const be = getById('tab-content-backend');
      const tools = getById('tab-content-tools');
      const getSkillIcon = (name: string, iconStr?: string) => {
        if (iconStr) return iconStr;
        const n = name.toLowerCase();
        if (n.includes('python')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Python"/>';
        if (n.includes('c/c++') || n === 'c++') return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="C++"/>';
        if (n.includes('java') && !n.includes('script')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Java"/>';
        if (n.includes('sql')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="SQL"/>';
        if (n.includes('bash') || n.includes('shell')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Bash"/>';
        if (n.includes('html') || n.includes('css') || n.includes('typescript')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="TS"/>';
        
        // Bonus generic icons
        if (n.includes('git')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Git"/>';
        if (n.includes('ubuntu')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Ubuntu"/>';
        if (n.includes('debian')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-plain.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Debian"/>';
        if (n.includes('windows')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Windows"/>';
        if (n.includes('kali')) return '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kalilinux/kalilinux-original.svg" style="width:2.2rem;height:2.2rem;object-fit:contain;" alt="Kali Linux"/>';
        
        return `<span style="font-size:1.5rem">🖥️</span>`;
      };

      const hashColor = (str: string): string => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 55%)`;
      };

      const renderSkill = (s: any, delay: number) => `
        <div class="skill-card reveal-up delay-${delay % 5}">
          <div class="skill-icon" style="--clr:${hashColor(s.name)};display:flex;align-items:center;justify-content:center;">
            ${getSkillIcon(s.name, s.icon)}
          </div>
          <h3>${s.name}</h3>
          <div class="skill-bar"><div class="skill-fill" data-level="${s.level}" style="width: ${s.level}%"></div></div>
        </div>`;

      if (fe) fe.innerHTML = skills.filter((s:any)=>s.category.toLowerCase() === 'frontend' || s.category.toLowerCase().includes('program')).map((s:any, i:number)=>renderSkill(s,i)).join('');
      if (be) be.innerHTML = skills.filter((s:any)=>s.category.toLowerCase() === 'backend' || s.category.toLowerCase().includes('secur')).map((s:any, i:number)=>renderSkill(s,i)).join('');
      if (tools) tools.innerHTML = skills.filter((s:any)=>s.category.toLowerCase() === 'tools' || s.category.toLowerCase().includes('os') || s.category.toLowerCase().includes('platform')).map((s:any, i:number)=>renderSkill(s,i)).join('');
    }

    // Projects
    const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projects && projects.length > 0) {
      const grid = document.querySelector('#works .works-grid');
      if (grid) {
        grid.innerHTML = projects.map((p: any) => `
          <article class="work-card reveal-up">
            <div class="work-image">
              <div class="work-placeholder" style="--hue: ${Math.floor(Math.random()*360)}">
                <span class="placeholder-label" style="font-size: 2.5rem;">${p.title[0]}</span>
              </div>
              <div class="work-overlay">
                <div class="work-links">
                  ${p.github_link ? `<a href="${p.github_link}" target="_blank" rel="noopener" class="work-link" aria-label="View source code">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>` : ''}
                </div>
              </div>
            </div>
            <div class="work-info">
              <h3 class="work-title">${p.title}</h3>
              <p class="work-desc">${p.description || ''}</p>
              <div class="work-tags">
                ${p.tags ? p.tags.map((t:string)=>`<span>${t}</span>`).join('') : ''}
              </div>
            </div>
          </article>
        `).join('');
      }
    }

    // CTFs
    const { data: ctfs } = await supabase.from('ctfs').select('*').order('year', { ascending: false });
    if (ctfs && ctfs.length > 0) {
      const list = getById('ctf-list');
      if (list) {
        list.innerHTML = ctfs.map((c: any, i: number) => `
          <div class="skill-card reveal-up ${i>0 ? `delay-${i%5}` : ''}" style="padding: 1.8rem">
            <div class="work-meta" style="margin-bottom:0.5rem">
              <span class="work-category">🥇 Rank ${c.rank || '-'}</span>
              <span class="work-year">${c.year}</span>
            </div>
            <h3 style="font-size:1.15rem;color:var(--clr-white);margin-bottom:0.5rem">${c.name}</h3>
            ${c.tags ? `<div class="work-tags">${c.tags.map((t:string)=>`<span>${t}</span>`).join('')}</div>` : ''}
          </div>
        `).join('');
      }
    }

    // Education
    const { data: education } = await supabase.from('education').select('*').order('order_idx', { ascending: true });
    if (education && education.length > 0) {
      const eduList = getById('education-timeline');
      if (eduList) {
        eduList.innerHTML = education.map((e: any, i: number) => `
          <div class="timeline-item reveal-up ${i>0 ? `delay-${i%5}` : ''}">
            <div class="timeline-dot accent"></div>
            <div class="timeline-content">
              <div class="timeline-date">${e.start_date || ''} ${e.start_date && e.end_date ? '–' : ''} ${e.end_date || ''}</div>
              <h4 class="timeline-role">${e.role}</h4>
              <span class="timeline-company">${e.institution}</span>
              ${e.description ? `<p>${e.description}</p>` : ''}
              ${e.tags && e.tags.length > 0 ? `<div class="timeline-tags">${e.tags.map((t:string)=>`<span>${t}</span>`).join('')}</div>` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // Activities
    const { data: activities } = await supabase.from('activities').select('*').order('order_idx', { ascending: true });
    if (activities && activities.length > 0) {
      const actList = getById('activities-timeline');
      if (actList) {
        actList.innerHTML = activities.map((a: any, i: number) => `
          <div class="timeline-item reveal-up ${i>0 ? `delay-${i%5}` : ''}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">${a.start_date || ''} ${a.start_date && a.end_date ? '–' : ''} ${a.end_date || ''}</div>
              <h4 class="timeline-role">${a.role}</h4>
              <span class="timeline-company">${a.organization}</span>
              ${a.description ? `<p>${a.description}</p>` : ''}
              ${a.tags && a.tags.length > 0 ? `<div class="timeline-tags">${a.tags.map((t:string)=>`<span>${t}</span>`).join('')}</div>` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // Platforms
    const { data: platforms } = await supabase.from('platforms').select('*').order('order_idx', { ascending: true });
    if (platforms && platforms.length > 0) {
      const platGrid = getById('platforms-grid');
      if (platGrid) {
        platGrid.innerHTML = platforms.map((p: any) => `
          <a href="${p.link_url || '#'}" target="_blank" rel="noopener" class="skill-card" style="text-decoration:none;color:inherit;text-align:center;align-items:center;cursor:pointer">
            <img src="${p.logo_url}" alt="${p.name}" style="width: 100%; height: 4.5rem; margin-bottom: 1rem; border-radius: 6px; object-fit: contain;">
            <h3>${p.name}</h3>
          </a>
        `).join('');
      }
    }

    isDataLoaded = true;
    tryInitObservers();
  }

  loadCMSData();

  // ─── ADMIN FRONT-DOOR ───────────────────────
  const btnAdmin = getById('footer-admin');
  if (btnAdmin) {
    btnAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "/admin.html";
    });
  }

})();
