document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FONDO ORGÁNICO REACTIVO (CANVAS)
    // ==========================================
    const canvas = document.getElementById('organic-bg');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let lines = [];
    const gap = 35; // Espacio vertical entre líneas
    let time = 0;   // Variable de tiempo para la animación automática
    
    // Posición del mouse (Objetivo y Actual para suavizado)
    const mouse = { x: -1000, y: -1000 }; // Empieza fuera de pantalla
    const smoothMouse = { x: 0, y: 0 };   // Valor interpolado
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initLines();
    }
    
    function initLines() {
        lines = [];
        // Creamos líneas cubriendo toda la altura
        for (let y = -50; y < height + 50; y += gap) {
            lines.push({ 
                baseY: y,
                color: `rgba(0,0,0,${Math.random() * 0.04 + 0.02})` // Opacidad sutil variable
            });
        }
    }
    
    // Interpolación lineal para suavizar movimiento (Lerp)
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function draw() {
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Aumentar el tiempo para el movimiento automático de las ondas
        time += 0.008; 
        
        // Suavizar la posición del mouse (Inercia)
        smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.1);
        smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.1);

        ctx.lineWidth = 1;

        lines.forEach((line, i) => {
            ctx.beginPath();
            ctx.strokeStyle = line.color;

            // Dibujamos la línea punto por punto de izquierda a derecha
            for (let x = 0; x <= width; x += 15) {
                
                // 1. Movimiento Automático (Ondas constantes)
                // Combinamos dos ondas seno para que no sea repetitivo
                const noise = 
                    Math.sin(x * 0.0025 + time + i * 0.1) * 15 + 
                    Math.cos(x * 0.008 - time * 0.5) * 8;
                
                // 2. Reacción al Mouse (Efecto Campo Magnético)
                const dx = x - smoothMouse.x;
                const dy = line.baseY - smoothMouse.y;
                
                // Distancia entre el punto actual de la línea y el mouse
                const dist = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 350; // Radio de efecto
                let interaction = 0;

                if (dist < interactionRadius) {
                    // Calculamos la fuerza (más fuerte cuanto más cerca)
                    const force = (interactionRadius - dist) / interactionRadius;
                    
                    // Función de curva para que sea suave (tipo campana de Gauss simple)
                    // El mouse "empuja" las líneas hacia abajo (o arriba si cambias el signo)
                    interaction = Math.sin(force * Math.PI) * 80; 
                }

                // Posición final Y = Base + Ruido Automático + Interacción Mouse
                const y = line.baseY + noise + interaction;
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
        
        requestAnimationFrame(draw);
    }
    
    // Event Listeners para el Canvas
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Iniciar
    resize();
    draw();


    // ==========================================
    // 2. LOGICA INTERFAZ (PARALLAX + MODALES)
    // ==========================================
    // (Mismo código de la versión anterior para la funcionalidad del portfolio)

    const scene = document.getElementById('scene');
    const wrapper = document.getElementById('character-wrapper');
    const wordTarget = document.getElementById('changing-word');
    const cursor = document.getElementById('typing-cursor');
    const langButtons = document.querySelectorAll('.lang-btn');
    const i18nElements = document.querySelectorAll('[data-i18n]');
    const slider = document.getElementById('slider');
    const slidesWrapper = document.getElementById('slides-wrapper');
    const sliderIndicator = document.getElementById('slider-indicator');
    const arrowLeft = document.querySelector('.slider-arrow--left');
    const arrowRight = document.querySelector('.slider-arrow--right');
    const hotspots = document.querySelectorAll('.hotspot');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContentBox = document.getElementById('modal-content-inject');
    const closeModalBtn = document.querySelector('.close-modal');

    const modalTargetMap = {
        'modal-euromon': 'euromon',
        'modal-ailab': 'ailab',
        'modal-services': 'services',
        'modal-teaching': 'teaching'
    };

    const translations = {
        es: {
            nav: { work: 'Proyectos', contact: 'Contacto' },
            intro: { hello: 'Hola', nameLine: 'mi nombre es' },
            hotspots: {
                euromon: { title: 'Euromon PLV', description: 'Transformación digital retail', tags: ['Retail', 'Data'] },
                ailab: { title: 'The AI Lab', description: 'Micro-vídeos de IA', tags: ['Contenido', 'Growth'] },
                services: { title: 'Servicios', description: 'Consultoría estratégica', tags: ['Estrategia', 'Growth'] },
                teaching: { title: 'Docencia', description: 'Formación in-company', tags: ['Speaker', 'Workshops'] }
            }
        },
        en: {
            nav: { work: 'Work', contact: 'Contact' },
            intro: { hello: 'Hi', nameLine: 'my name is' },
            hotspots: {
                euromon: { title: 'Euromon PLV', description: 'Retail digital transformation', tags: ['Retail', 'Data'] },
                ailab: { title: 'The AI Lab', description: 'AI micro-videos', tags: ['Content', 'Growth'] },
                services: { title: 'Services', description: 'Strategic consulting', tags: ['Strategy', 'Growth'] },
                teaching: { title: 'Teaching', description: 'In-company training', tags: ['Speaker', 'Workshops'] }
            }
        }
    };

    const typingWords = {
        es: [
            'estratega de marketing',
            'consultor de IA',
            'storyteller creativo',
            'growth partner',
            'chief AI evangelist',
            'arquitecto de funnels',
            'brand futurist'
        ],
        en: [
            'marketing strategist',
            'AI consultant',
            'creative storyteller',
            'growth partner',
            'chief AI evangelist',
            'funnel architect',
            'brand futurist'
        ]
    };

const slidesContent = {
        es: [
            {
                key: 'about',
                type: 'text-media',
                eyebrow: 'Quién soy',
                title: 'Quién soy',
                paragraphs: [
                    'Trabajo entre marketing, contenido e IA para diseñar experiencias con impacto medible.',
                    'Hago de puente entre visión y ejecución: research rápido, sistemas que escalan y equipos que adoptan nuevas herramientas.'
                ],
                media: {
                src: 'Who_Arturo.jpeg',
                alt: 'Retrato Arturo Martínez'
                }
            },
            {
                key: 'experience',
                type: 'timeline',
                eyebrow: 'Trayectoria',
                title: 'Experiencia',
                paragraphs: [
                    'Más de 10 años impulsando growth y activaciones tecnológicas para marcas y startups.'
                ],
                timeline: [
                    { title: 'Euromon PLV', detail: 'Computer vision en retail físico +45% engagement' },
                    { title: 'The AI Lab', detail: 'Comunidad global sobre IA aplicada a negocio' },
                    { title: 'Consultoría independiente', detail: 'Roadmaps de IA para scale-ups y corporaciones' },
                    { title: 'Docencia & workshops', detail: 'Masters y programas in-company sobre AI marketing' }
                ]
            },
            {
                key: 'projects',
                type: 'projects',
                eyebrow: 'Case studies',
                title: 'Proyectos',
                projects: [
                    { name: 'Retail Sense', detail: 'Panel de insights en tienda para reordenar planogramas en tiempo real.' },
                    { name: 'Creator OS', detail: 'Sistema de micro-vídeos con IA: +3M views orgánicos en 90 días.' },
                    { name: 'Growth Sprints', detail: 'Experimentos de funnels que generaron +28% MRR en 6 semanas.' },
                    { name: 'Executive Copilot', detail: 'Copiloto interno para priorizar casos de IA dentro de la empresa.' }
                ]
            },
            {
                key: 'content',
                type: 'text-list',
                eyebrow: 'Creator mode',
                title: 'Contenido & Charlas',
                paragraphs: [
                    'Community-led learning: newsletters, pódcasts y microclases enfocadas en casos reales.',
                    'He compartido escenario en masters, conferencias y compañías que quieren acelerar con IA.'
                ],
                bullets: [
                    '+160K personas siguiendo los experimentos de The AI Lab.',
                    'Talks en IE, ESIC, ISDI y foros corporativos de innovación.',
                    'Series de micro-vídeos con >200M views combinados.'
                ]
            },
            {
                key: 'services',
                type: 'services',
                eyebrow: 'Cómo te ayudo',
                title: 'Servicios',
                services: [
                    { title: 'AI Marketing Strategy', detail: 'Roadmaps y casos de uso accionables con foco en impacto comercial.' },
                    { title: 'Contenido & Formación', detail: 'Workshops, playbooks y academias internas para activar IA.' },
                    { title: 'Consultoría puntual', detail: 'Sparring sessions para founders, CMOs y equipos de innovación.' },
                    { title: 'Copilotos & automatización', detail: 'Diseño de flujos híbridos (human + AI) para equipos de growth.' }
                ]
            },
            {
                key: 'contact',
                type: 'contact',
                eyebrow: 'Let\'s build',
                title: 'Contacto',
                paragraphs: [
                    '¿Listo para lanzar algo nuevo? Escríbeme y diseñamos juntos la siguiente iteración.'
                ],
                links: [
                    { label: 'Email', href: 'mailto:hello@arturo.ai' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturo-martinez', external: true }
                ]
            }
        ],
        en: [
            {
                key: 'about',
                type: 'text-media',
                eyebrow: 'About me',
                title: 'About me',
                paragraphs: [
                    'I operate where marketing, content, and AI collide to build measurable experiences.',
                    'I translate vision into execution: rapid research, scalable systems, and teams that adopt new tools fast.'
                ],
                media: {
                src: 'Who_Arturo.jpeg',
                alt: 'Portrait Arturo Martínez'
                }
            },
            {
                key: 'experience',
                type: 'timeline',
                eyebrow: 'Journey',
                title: 'Experience',
                paragraphs: [
                    '10+ years boosting growth and tech activations for brands and startups.'
                ],
                timeline: [
                    { title: 'Euromon PLV', detail: 'Computer vision in physical retail delivering +45% engagement' },
                    { title: 'The AI Lab', detail: 'Global community sharing applied AI playbooks' },
                    { title: 'Independent consulting', detail: 'AI roadmaps for scale-ups and corporates' },
                    { title: 'Teaching & workshops', detail: 'Masters and in-company programs on AI marketing' }
                ]
            },
            {
                key: 'projects',
                type: 'projects',
                eyebrow: 'Case studies',
                title: 'Projects',
                projects: [
                    { name: 'Retail Sense', detail: 'In-store insight layer to rearrange planograms in real time.' },
                    { name: 'Creator OS', detail: 'AI-powered micro-video system: +3M organic views in 90 days.' },
                    { name: 'Growth Sprints', detail: 'Funnel experiments delivering +28% MRR in six weeks.' },
                    { name: 'Executive Copilot', detail: 'Internal copilot to prioritize AI cases across teams.' }
                ]
            },
            {
                key: 'content',
                type: 'text-list',
                eyebrow: 'Creator mode',
                title: 'Content & Talks',
                paragraphs: [
                    'Community-led learning: newsletters, podcasts, and micro-classes grounded in real cases.',
                    'I speak at masters, conferences, and companies looking to accelerate with AI.'
                ],
                bullets: [
                    '160K+ people following The AI Lab experiments.',
                    'Talks at IE, ESIC, ISDI and corporate innovation forums.',
                    'Micro-video series with 200M+ combined views.'
                ]
            },
            {
                key: 'services',
                type: 'services',
                eyebrow: 'How I help',
                title: 'Services',
                services: [
                    { title: 'AI Marketing Strategy', detail: 'Roadmaps and use cases focused on commercial impact.' },
                    { title: 'Content & Training', detail: 'Workshops, playbooks, and internal academies to activate AI.' },
                    { title: 'Sparring sessions', detail: 'On-demand consulting for founders, CMOs, and innovation teams.' },
                    { title: 'Copilots & automation', detail: 'Hybrid (human + AI) flows for growth and product squads.' }
                ]
            },
            {
                key: 'contact',
                type: 'contact',
                eyebrow: 'Let\'s build',
                title: 'Contact',
                paragraphs: [
                    'Ready to ship the next iteration? Reach out and let’s design it together.'
                ],
                links: [
                    { label: 'Email', href: 'mailto:hello@arturo.ai' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arturo-martinez', external: true }
                ]
            }
        ]
    };

const homeSlideLabels = {
    es: 'Inicio',
    en: 'Home'
};

    let currentLanguage = 'es';
    let activeModalKey = null;

    const buildParagraphs = (arr = []) => arr.map((text) => `<p class="slide-paragraph">${text}</p>`).join('');

    const buildTimeline = (timeline = []) => {
        if (!timeline.length) return '';
        return `
            <div class="timeline">
                ${timeline.map(item => `
                    <div class="timeline-item">
                        <strong>${item.title}</strong>
                        <span>${item.detail}</span>
                    </div>
                `).join('')}
            </div>
        `;
    };

    const buildProjects = (projects = []) => {
        if (!projects.length) return '';
        return `
            <ul class="projects-list">
                ${projects.map(project => `
                    <li>
                        <strong>${project.name}</strong>
                        <span>${project.detail}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    };

    const buildBullets = (bullets = []) => {
        if (!bullets.length) return '';
        return `
            <ul class="slide-bullets">
                ${bullets.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    };

    const buildServices = (services = []) => {
        if (!services.length) return '';
        return `
            <div class="services-grid">
                ${services.map(service => `
                    <div class="service-card">
                        <strong>${service.title}</strong>
                        <p class="slide-paragraph">${service.detail}</p>
                    </div>
                `).join('')}
            </div>
        `;
    };

    const buildContactLinks = (links = []) => {
        if (!links.length) return '';
        return `
            <div class="contact-actions">
                ${links.map(link => `
                    <a class="contact-link" href="${link.href}" ${link.external ? 'target="_blank" rel="noopener"' : ''}>
                        ${link.label}
                    </a>
                `).join('')}
            </div>
        `;
    };

    const composeSlide = (slide) => {
        const eyebrow = slide.eyebrow ? `<p class="slide-eyebrow">${slide.eyebrow}</p>` : '';
        const paragraphs = buildParagraphs(slide.paragraphs);

        if (slide.type === 'text-media') {
            return `
                <div class="slide-shell">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${paragraphs}
                    </div>
                    <div class="slide-media">
                        <img src="${slide.media?.src || 'Arturo_NB.png'}" alt="${slide.media?.alt || slide.title}">
                    </div>
                </div>
            `;
        }

        if (slide.type === 'timeline') {
            return `
                <div class="slide-shell slide-shell--stack">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${paragraphs}
                        ${buildTimeline(slide.timeline)}
                    </div>
                </div>
            `;
        }

        if (slide.type === 'projects') {
            return `
                <div class="slide-shell slide-shell--stack">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${buildProjects(slide.projects)}
                    </div>
                </div>
            `;
        }

        if (slide.type === 'text-list') {
            return `
                <div class="slide-shell slide-shell--stack">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${paragraphs}
                        ${buildBullets(slide.bullets)}
                    </div>
                </div>
            `;
        }

        if (slide.type === 'services') {
            return `
                <div class="slide-shell slide-shell--stack">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${buildServices(slide.services)}
                    </div>
                </div>
            `;
        }

        if (slide.type === 'contact') {
            return `
                <div class="slide-shell slide-shell--stack">
                    <div class="slide-text">
                        ${eyebrow}
                        <h2>${slide.title}</h2>
                        ${paragraphs}
                        ${buildContactLinks(slide.links)}
                    </div>
                </div>
            `;
        }

        return '';
    };

    const sliderState = {
        currentIndex: 1,
        slideWidth: slider ? slider.offsetWidth : 0,
        isTransitioning: false,
        totalRealSlides: 0,
        indicatorDots: [],
        initialized: false,
        autoSlideTimeout: null,
        autoSlideDelay: 15000,
        userStoppedAuto: false
    };

    let slidesCollection = [];
    const dynamicSlideClass = 'slide--dynamic';
    const cloneSlideClass = 'slide--clone';
    let currentSlidesMeta = [];

    const removeGeneratedSlides = () => {
        if (!slidesWrapper) return;
        slidesWrapper.querySelectorAll(`.${dynamicSlideClass}, .${cloneSlideClass}`).forEach(node => node.remove());
    };

    const buildSlidesForLanguage = (lang) => {
        if (!slider || !slidesWrapper) return;

        const slidesForLang = slidesContent[lang] || slidesContent.es || [];
        currentSlidesMeta = slidesForLang;

        removeGeneratedSlides();

        slidesForLang.forEach((slide) => {
            const section = document.createElement('section');
            section.className = `slide slide--${slide.key} ${dynamicSlideClass}`;
            section.innerHTML = composeSlide(slide);
            slidesWrapper.appendChild(section);
        });

        const indicatorMeta = [
            { key: 'home', title: homeSlideLabels[lang] || homeSlideLabels.es || 'Home' },
            ...slidesForLang.map(slide => ({ key: slide.key, title: slide.title }))
        ];

        const baseSlides = Array.from(slidesWrapper.children);
        sliderState.totalRealSlides = indicatorMeta.length;

        if (sliderState.totalRealSlides <= 1) {
            slidesCollection = baseSlides;
            buildIndicators(indicatorMeta);
            setActiveIndicator();
            sliderState.currentIndex = 0;
            sliderState.slideWidth = slider.offsetWidth;
            slidesWrapper.style.transition = 'none';
            updateTransform();
            requestAnimationFrame(() => {
                slidesWrapper.style.transition = '';
            });
            return;
        }

        const firstClone = baseSlides[0].cloneNode(true);
        const lastClone = baseSlides[baseSlides.length - 1].cloneNode(true);
        firstClone.classList.add(cloneSlideClass);
        lastClone.classList.add(cloneSlideClass);
        slidesWrapper.appendChild(firstClone);
        slidesWrapper.insertBefore(lastClone, slidesWrapper.firstChild);

        slidesCollection = Array.from(slidesWrapper.children);
        sliderState.currentIndex = 1;
        sliderState.slideWidth = slider.offsetWidth;
        slidesWrapper.style.transition = 'none';
        updateTransform();
        requestAnimationFrame(() => {
            slidesWrapper.style.transition = '';
        });

        buildIndicators(indicatorMeta);
        setActiveIndicator();
        slidesWrapper.classList.add('is-switching');
        requestAnimationFrame(() => {
            slidesWrapper.classList.remove('is-switching');
        });
    };

    const cancelAutoSlide = () => {
        if (sliderState.autoSlideTimeout) {
            clearTimeout(sliderState.autoSlideTimeout);
            sliderState.autoSlideTimeout = null;
        }
    };

    const scheduleAutoSlide = () => {
        if (sliderState.userStoppedAuto || sliderState.totalRealSlides <= 1) return;
        cancelAutoSlide();
        sliderState.autoSlideTimeout = setTimeout(() => {
            moveSlide(1);
        }, sliderState.autoSlideDelay);
    };

    const markUserInteraction = () => {
        if (!sliderState.userStoppedAuto) {
            sliderState.userStoppedAuto = true;
            cancelAutoSlide();
        }
    };

    const buildIndicators = (slidesMeta = []) => {
        if (!sliderIndicator) return;
        sliderIndicator.innerHTML = '';
        sliderState.indicatorDots = [];
        slidesMeta.forEach((meta, index) => {
            const span = document.createElement('span');
            span.dataset.label = meta?.title || `Slide ${index + 1}`;
            if (index === 0) span.classList.add('active');
            sliderIndicator.appendChild(span);
            sliderState.indicatorDots.push(span);
        });
    };

    const setActiveIndicator = () => {
        if (!sliderState.indicatorDots.length || !sliderState.totalRealSlides) return;
        const normalizedIndex = ((sliderState.currentIndex - 1) % sliderState.totalRealSlides + sliderState.totalRealSlides) % sliderState.totalRealSlides;
        sliderState.indicatorDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === normalizedIndex);
        });
    };

    const updateTransform = () => {
        if (!slidesWrapper) return;
        slidesWrapper.style.transform = `translateX(-${sliderState.currentIndex * sliderState.slideWidth}px)`;
    };

    const jumpToIndexWithoutAnimation = (index) => {
        if (!slidesWrapper) return;
        slidesWrapper.style.transition = 'none';
        sliderState.currentIndex = index;
        updateTransform();
        // Force reflow to avoid visual glitch
        void slidesWrapper.offsetWidth;
        requestAnimationFrame(() => {
            slidesWrapper.style.transition = '';
        });
    };

    const moveSlide = (direction = 1) => {
        if (!slidesWrapper || sliderState.isTransitioning) return;
        if (sliderState.totalRealSlides <= 1) return;
        if (modalOverlay?.classList.contains('active')) return;
        cancelAutoSlide();
        sliderState.isTransitioning = true;
        sliderState.currentIndex += direction;
        slidesWrapper.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
        updateTransform();
        setActiveIndicator();
    };

    const handleTransitionEnd = (event) => {
        if (event.target !== slidesWrapper) return;
        sliderState.isTransitioning = false;
        const totalSlides = slidesCollection.length;
        const currentSlide = slidesCollection[sliderState.currentIndex];
        if (currentSlide?.classList.contains(cloneSlideClass)) {
            if (sliderState.currentIndex === totalSlides - 1) {
                jumpToIndexWithoutAnimation(1);
            } else if (sliderState.currentIndex === 0) {
                jumpToIndexWithoutAnimation(totalSlides - 2);
            }
        }
        setActiveIndicator();
        scheduleAutoSlide();
    };

    const handleResize = () => {
        if (!slider || !slidesWrapper) return;
        sliderState.slideWidth = slider.offsetWidth;
        slidesWrapper.style.transition = 'none';
        updateTransform();
        requestAnimationFrame(() => {
            slidesWrapper.style.transition = '';
        });
    };

    const rebuildSlider = (lang) => {
        sliderState.isTransitioning = false;
        cancelAutoSlide();
        slidesWrapper?.classList.add('is-switching');
        buildSlidesForLanguage(lang);
        slidesCollection = Array.from(slidesWrapper.children);
        if (!sliderState.userStoppedAuto) {
            scheduleAutoSlide();
        }
        requestAnimationFrame(() => {
            slidesWrapper?.classList.remove('is-switching');
        });
    };

    const initSlider = () => {
        if (!slider || !slidesWrapper) return;
        buildSlidesForLanguage(currentLanguage);
        slidesCollection = Array.from(slidesWrapper.children);
        if (!slidesCollection.length) return;
        sliderState.initialized = true;

        arrowLeft?.addEventListener('click', () => {
            markUserInteraction();
            moveSlide(-1);
        });
        arrowRight?.addEventListener('click', () => {
            markUserInteraction();
            moveSlide(1);
        });
        slidesWrapper.addEventListener('transitionend', handleTransitionEnd);
        window.addEventListener('resize', handleResize);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                markUserInteraction();
                moveSlide(1);
            }
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                markUserInteraction();
                moveSlide(-1);
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchEndX = touchStartX;
        });

        slider.addEventListener('touchmove', (event) => {
            touchEndX = event.touches[0].clientX;
        });

        slider.addEventListener('touchend', () => {
            const distance = touchEndX - touchStartX;
            if (Math.abs(distance) > 50) {
                markUserInteraction();
                moveSlide(distance > 0 ? -1 : 1);
            }
            touchStartX = 0;
            touchEndX = 0;
        });

        scheduleAutoSlide();
    };

    initSlider();

    const modalData = {
        es: {
            euromon: {
                title: 'Euromon PLV',
                subtitle: 'Revolucionando el punto de venta con IA.',
                statsGroups: [
                    [
                        { value: '+45%', label: 'Engagement' },
                        { value: '80M+', label: 'Data points' }
                    ]
                ],
                paragraphs: [
                    'Implementación de algoritmos de visión por computador para analizar el comportamiento del consumidor en tiempo real dentro de espacios físicos, optimizando la disposición de productos.'
                ]
            },
            ailab: {
                title: 'The AI Lab',
                subtitle: 'Storytelling en IA Generativa.',
                statsGroups: [
                    [
                        { value: '100+', label: 'Vídeos cortos' },
                        { value: '160K+', label: 'Seguidores' }
                    ],
                    [
                        { value: '2.5M+', label: 'Likes' },
                        { value: '200M+', label: 'Views' }
                    ]
                ],
                paragraphs: [
                    'En The AI Lab comenzamos compartiendo en TikTok e Instagram hacks reales sobre cómo aprovechar la IA generativa en el día a día. Fue una experiencia que me hizo aprender muchísimo sobre cómo analizar y optimizar contenido en redes: pulir los primeros segundos para mejorar retención, probar distintos hooks y formatos, y tomar decisiones basadas en métricas como watch time, compartidos e interacción.'
                ],
                note: 'Dato interesante: nuestro mejor vídeo llegó a más de 46M de views.',
                socialLinks: [
                    { icon: 'instagram', url: 'https://www.instagram.com/theofficialailab', label: '@theofficialailab' },
                    { icon: 'tiktok', url: 'https://www.tiktok.com/@theofficialailab', label: '@theofficialailab' }
                ]
            },
            services: {
                title: 'Servicios',
                subtitle: 'Consultoría estratégica & despliegues de IA.',
                paragraphs: [
                    'Diseño roadmaps de IA y growth alineados con objetivos de negocio, construyendo quick wins que desbloquean inversión y confianza.',
                    'Trabajo junto a equipos directivos para activar casos de uso medibles: desde automatización de funnels hasta copilotos internos.'
                ]
            },
            teaching: {
                title: 'Docencia',
                subtitle: 'Formación aplicada para equipos.',
                paragraphs: [
                    'Diseño workshops a medida para marketing, innovación y liderazgo, enfocándome en aterrizar IA generativa en flujos reales.',
                    'Mi objetivo es que cada sesión termine con frameworks accionables y playbooks listos para usar al día siguiente.'
                ]
            }
        },
        en: {
            euromon: {
                title: 'Euromon PLV',
                subtitle: 'Reimagining retail touchpoints with AI.',
                statsGroups: [
                    [
                        { value: '+45%', label: 'Engagement' },
                        { value: '80M+', label: 'Data points' }
                    ]
                ],
                paragraphs: [
                    'We deployed computer vision models to analyse shopper behavior in real time inside physical stores, optimising product placement and in-store storytelling.'
                ]
            },
            ailab: {
                title: 'The AI Lab',
                subtitle: 'Generative AI storytelling.',
                statsGroups: [
                    [
                        { value: '100+', label: 'Short-form videos' },
                        { value: '160K+', label: 'Followers' }
                    ],
                    [
                        { value: '2.5M+', label: 'Likes' },
                        { value: '200M+', label: 'Views' }
                    ]
                ],
                paragraphs: [
                    'We started by sharing practical generative AI hacks on TikTok and Instagram. That journey taught me to fine-tune hooks, iterate formats fast and make creative decisions grounded in watch time, shares and retention.'
                ],
                note: 'Fun fact: our best-performing video surpassed 46M views.',
                socialLinks: [
                    { icon: 'instagram', url: 'https://www.instagram.com/theofficialailab', label: '@theofficialailab' },
                    { icon: 'tiktok', url: 'https://www.tiktok.com/@theofficialailab', label: '@theofficialailab' }
                ]
            },
            services: {
                title: 'Services',
                subtitle: 'Strategic consulting & AI activation.',
                paragraphs: [
                    'I build AI and growth roadmaps aligned with business goals, prioritising quick wins that unlock investment and internal buy-in.',
                    'From funnel automation to internal copilots, I partner with leadership teams to launch measurable use cases.'
                ]
            },
            teaching: {
                title: 'Teaching',
                subtitle: 'Applied learning for teams.',
                paragraphs: [
                    'I craft bespoke workshops for marketing, innovation and leadership teams, grounding generative AI in real workflows.',
                    'Every session ends with actionable frameworks and plug-and-play playbooks for immediate adoption.'
                ]
            }
        }
    };

    const fallbackModal = {
        es: {
            title: 'Próximamente',
            paragraphs: ['Información detallada próximamente.']
        },
        en: {
            title: 'Coming soon',
            paragraphs: ['Detailed information will be available soon.']
        }
    };

    const typingState = {
        timeoutId: null,
        words: typingWords[currentLanguage],
        wordIndex: 0,
        charIndex: 0,
        deleting: false,
        typeSpeed: 110,
        deleteSpeed: 70,
        holdDelay: 1700
    };

    const getNestedTranslation = (lang, path) => {
        return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object') ? acc[part] : undefined, translations[lang]);
    };

    const applyTranslations = (lang) => {
        i18nElements.forEach((el) => {
            const key = el.dataset.i18n;
            const value = getNestedTranslation(lang, key);
            if (typeof value === 'undefined') return;

            if (el.dataset.i18nType === 'html') {
                el.innerHTML = value;
            } else {
                el.textContent = value;
            }
        });
    };

    const startTypingLoop = () => {
        if (!wordTarget || !typingState.words.length) return;

        const currentWord = typingState.words[typingState.wordIndex] || '';

        if (!typingState.deleting && typingState.charIndex < currentWord.length) {
            typingState.charIndex++;
            wordTarget.textContent = currentWord.slice(0, typingState.charIndex);
            typingState.timeoutId = setTimeout(startTypingLoop, typingState.typeSpeed);
            return;
        }

        if (!typingState.deleting && typingState.charIndex === currentWord.length) {
            typingState.deleting = true;
            typingState.timeoutId = setTimeout(startTypingLoop, typingState.holdDelay);
            return;
        }

        if (typingState.deleting && typingState.charIndex > 0) {
            typingState.charIndex--;
            wordTarget.textContent = currentWord.slice(0, typingState.charIndex);
            typingState.timeoutId = setTimeout(startTypingLoop, typingState.deleteSpeed);
            return;
        }

        typingState.deleting = false;
        typingState.wordIndex = (typingState.wordIndex + 1) % typingState.words.length;
        typingState.timeoutId = setTimeout(startTypingLoop, 400);
    };

    const resetTypingWords = (lang) => {
        if (!wordTarget) return;
        if (typingState.timeoutId) clearTimeout(typingState.timeoutId);
        typingState.words = typingWords[lang] || [];
        typingState.wordIndex = 0;
        typingState.charIndex = 0;
        typingState.deleting = false;
        wordTarget.textContent = '';

        if (typingState.words.length) {
            startTypingLoop();
        }
    };

    const buildStatsHtml = (groups = []) => {
        return groups.map(group => `
            <div class="stats-grid">
                ${group.map(stat => `
                    <div class="stat">
                        <strong>${stat.value}</strong>
                        <small>${stat.label}</small>
                    </div>
                `).join('')}
            </div>
        `).join('');
    };

    const buildParagraphsHtml = (paragraphs = []) => {
        return paragraphs.map(text => `<p class="body-text">${text}</p>`).join('');
    };

    const buildSocialHtml = (links = []) => {
        if (!links.length) return '';
        return `
            <div class="social-links">
                ${links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" class="social-link">
                        <span class="social-icon ${link.icon}"></span>
                        <span>${link.label}</span>
                    </a>
                `).join('')}
            </div>
        `;
    };

    const renderModalContent = (modalKey) => {
        const langPack = modalData[currentLanguage] || {};
        const content = langPack[modalKey] || fallbackModal[currentLanguage];

        if (!content) {
            modalContentBox.innerHTML = '';
            return;
        }

        const statsHtml = content.statsGroups ? buildStatsHtml(content.statsGroups) : '';
        const paragraphsHtml = content.paragraphs ? buildParagraphsHtml(content.paragraphs) : '';
        const noteHtml = content.note ? `<p class="body-text body-text--note"><em>${content.note}</em></p>` : '';
        const socialHtml = content.socialLinks ? buildSocialHtml(content.socialLinks) : '';

        modalContentBox.innerHTML = `
            <h2>${content.title}</h2>
            ${content.subtitle ? `<p class="subtitle">${content.subtitle}</p>` : ''}
            ${statsHtml}
            ${paragraphsHtml}
            ${noteHtml}
            ${socialHtml}
        `;
    };

    const openModal = (modalKey) => {
        activeModalKey = modalKey;
        renderModalContent(modalKey);
        modalOverlay.classList.add('active');
        wrapper.style.transform = `translateX(-100px) rotateY(10deg)`;
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        activeModalKey = null;
        wrapper.style.transform = `translate3d(0, 0, 0) rotateX(0) rotateY(0)`;
    };

    const setLanguage = (lang) => {
        if (!translations[lang]) return;
        const languageChanged = lang !== currentLanguage;
        currentLanguage = lang;
        applyTranslations(lang);
        resetTypingWords(lang);
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        if (languageChanged && sliderState.initialized) {
            rebuildSlider(lang);
        }
        if (activeModalKey) {
            renderModalContent(activeModalKey);
        }
    };

    langButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (lang && lang !== currentLanguage) {
                setLanguage(lang);
            }
        });
    });

    setLanguage(currentLanguage);
    
    // Efecto Tilt 3D en la foto central - rotación más suave y reducida
    // Escucha en todo el documento para evitar cortes bruscos al salir del contenedor
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Rotación mucho más reducida (de 8 a 3 grados máximo)
        const rotateX = -((y - centerY) / centerY) * 3; 
        const rotateY = ((x - centerX) / centerX) * 3;
        const planeShiftX = ((x - centerX) / centerX) * 12; // desplazamiento sutil en X
        const planeShiftY = ((y - centerY) / centerY) * 8;  // desplazamiento sutil en Y
        
        wrapper.style.transform = `translate3d(${planeShiftX}px, ${planeShiftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Cuando el cursor abandona la ventana, vuelve suavemente a la posición inicial
    window.addEventListener('mouseleave', () => {
        wrapper.style.transform = `translate3d(0, 0, 0) rotateX(0) rotateY(0)`;
    });

    hotspots.forEach((spot) => {
        spot.addEventListener('click', () => {
            const targetId = spot.getAttribute('data-target');
            const modalKey = modalTargetMap[targetId];

            if (modalKey) {
                openModal(modalKey);
                return;
            }

            const fallback = fallbackModal[currentLanguage];
            activeModalKey = null;
            modalContentBox.innerHTML = `
                <h2>${fallback.title}</h2>
                ${fallback.paragraphs ? buildParagraphsHtml(fallback.paragraphs) : ''}
            `;
            modalOverlay.classList.add('active');
            wrapper.style.transform = `translateX(-100px) rotateY(10deg)`;
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});