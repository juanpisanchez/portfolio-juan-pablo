/* ==========================================================================
   INTERACTIVE PORTFOLIO LOGIC - JUAN PABLO SÁNCHEZ (2026 - MVP 2)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== STATE ====================
    const state = {
        unlocked: false,
        user: { name: "", company: "", email: "" }
    };

    // ==================== DOM ELEMENTS ====================
    // Gating Elements
    const gatingOverlay = document.getElementById("gating-overlay");
    const gatingForm = document.getElementById("gating-form");
    const portfolioWrapper = document.getElementById("portfolio-wrapper");
    const userBadge = document.getElementById("user-badge");

    // Menu Elements
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Typing Animation
    const typingTextEl = document.getElementById("typing-text");
    const roles = ["Transformación y Procesos", "Automatización con IA", "People Analytics", "Gestión de Cambio (UAT)"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    // Video Presentation Elements
    const playVideoBtn = document.getElementById("play-video-btn");
    const videoModal = document.getElementById("video-modal");
    const videoCloseBtn = document.getElementById("video-close-btn-el");
    const slideContent = document.getElementById("slide-content");
    const modalPlayBtn = document.getElementById("modal-play-btn");
    const modalMuteBtn = document.getElementById("modal-mute-btn");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const videoTimeLbl = document.getElementById("video-time-lbl");

    let isVideoPlaying = false;
    let isVideoMuted = false;
    const videoDuration = 135; // 2m 15s in seconds
    let videoCurrentTime = 0;
    let simulatedPlaybackInterval = null;

    // Projects Overlay Elements
    const categoryCards = document.querySelectorAll(".project-category-card");
    const projectsOverlay = document.getElementById("projects-overlay");
    const overlayTitle = document.getElementById("overlay-title");
    const overlayDesc = document.getElementById("overlay-desc");
    const overlayProjectsList = document.getElementById("overlay-projects-list");
    const overlayCloseBtn = document.getElementById("overlay-close-btn");

    // ==================== LOCK / UNLOCK PORTFOLIO ====================
    const checkGating = () => {
        const storedUser = localStorage.getItem("portfolioUser");
        if (storedUser) {
            try {
                state.user = JSON.parse(storedUser);
                state.unlocked = true;
                unlockPortfolio(false); // unlock instantly without animation
            } catch (e) {
                localStorage.removeItem("portfolioUser");
            }
        }
    };

    const unlockPortfolio = (animate = true) => {
        if (animate) {
            gatingOverlay.style.opacity = "0";
            setTimeout(() => {
                gatingOverlay.style.display = "none";
                portfolioWrapper.classList.remove("is-blurred");
            }, 600);
        } else {
            gatingOverlay.style.display = "none";
            portfolioWrapper.classList.remove("is-blurred");
        }
        
        // Show personalized greeting in header
        if (state.user && state.user.name) {
            userBadge.innerHTML = `<i class="fa-solid fa-user-tie"></i> ${state.user.name} (${state.user.company})`;
            userBadge.style.display = "inline-flex";
        }
        
        // Start typing animation once site is unlocked
        setTimeout(typeEffect, 500);
    };

    if (gatingForm) {
        gatingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("gate-name").value.trim();
            const company = document.getElementById("gate-company").value.trim();
            const email = document.getElementById("gate-email").value.trim();

            if (name && company && email) {
                const btnUnlock = document.getElementById("btn-unlock");
                const originalText = btnUnlock.innerHTML;
                
                // Show loading state
                btnUnlock.disabled = true;
                btnUnlock.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Accediendo...`;

                state.user = { name, company, email };
                localStorage.setItem("portfolioUser", JSON.stringify(state.user));
                state.unlocked = true;

                // Send access log to Web3Forms
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        access_key: "edd64041-be92-4064-9c5b-c668007fff00",
                        subject: `Nuevo Acceso: ${name} (${company})`,
                        from_name: "Portafolio JPS",
                        name: name,
                        email: email,
                        company: company,
                        message: `El usuario ${name} (${email}) de la empresa ${company} ha ingresado al portafolio.`
                    })
                })
                .then(() => {
                    unlockPortfolio(true);
                })
                .catch(() => {
                    // Fallback: unlock even if fetch fails due to network issues
                    unlockPortfolio(true);
                });
            }
        });
    }

    // ==================== TYPING EFFECT ====================
    const typeEffect = () => {
        if (!typingTextEl) return;
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    // ==================== MOBILE MENU TOGGLE ====================
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("mobile-active");
            const icon = mobileMenuToggle.querySelector("i");
            if (navMenu.classList.contains("mobile-active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu) {
                navMenu.classList.remove("mobile-active");
            }
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector("i");
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // ==================== VIDEOPRESENTACIÓN MODAL ====================
    const startSimulatedPlayback = () => {
        isVideoPlaying = true;
        if (modalPlayBtn) {
            modalPlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        }
        
        if (slideContent) {
            slideContent.classList.remove("animate-pulse");
            slideContent.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin avatar-placeholder"></i>
                <h2>Juan Pablo Sánchez</h2>
                <p class="role-desc">Cargando videopresentación...</p>
            `;
        }

        setTimeout(() => {
            if (!isVideoPlaying) return;
            if (slideContent) {
                slideContent.innerHTML = `
                    <div class="video-mock-playing">
                        <i class="fa-solid fa-user-circle" style="font-size: 5rem; color: #8b5cf6;"></i>
                        <h3 style="margin-top: 1rem;">Video en Reproducción</h3>
                        <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                            "Hola, soy Juan Pablo Sánchez. Mi objetivo es conectar la estrategia de negocio, procesos, datos y personas a través de la tecnología y la IA aplicada..."
                        </p>
                        <div class="visualizer" style="display:flex; gap:4px; justify-content:center; margin-top:1.5rem;">
                            <span class="bar animate-bounce-custom" style="width:4px; height:20px; background:#3b82f6;"></span>
                            <span class="bar animate-bounce-custom-2" style="width:4px; height:35px; background:#8b5cf6;"></span>
                            <span class="bar animate-bounce-custom-3" style="width:4px; height:15px; background:#3b82f6;"></span>
                        </div>
                    </div>
                `;
            }
            
            // Add custom animation styles for bounce
            if (!document.getElementById("custom-bounce-styles")) {
                const style = document.createElement("style");
                style.id = "custom-bounce-styles";
                style.innerHTML = `
                    @keyframes bounce-custom {
                        0%, 100% { height: 10px; }
                        50% { height: 35px; }
                    }
                    .animate-bounce-custom { animation: bounce-custom 0.8s infinite ease-in-out; }
                    .animate-bounce-custom-2 { animation: bounce-custom 0.6s infinite ease-in-out 0.2s; }
                    .animate-bounce-custom-3 { animation: bounce-custom 0.9s infinite ease-in-out 0.1s; }
                `;
                document.head.appendChild(style);
            }
        }, 1200);

        simulatedPlaybackInterval = setInterval(() => {
            if (videoCurrentTime >= videoDuration) {
                stopSimulatedPlayback();
                videoCurrentTime = 0;
                if (progressBarFill) progressBarFill.style.width = "0%";
                if (videoTimeLbl) videoTimeLbl.textContent = "0:00 / 2:15";
                return;
            }
            videoCurrentTime += 1;
            const pct = (videoCurrentTime / videoDuration) * 100;
            if (progressBarFill) progressBarFill.style.width = `${pct}%`;
            
            const minutes = Math.floor(videoCurrentTime / 60);
            const seconds = videoCurrentTime % 60;
            const formattedSec = seconds < 10 ? `0${seconds}` : seconds;
            if (videoTimeLbl) {
                videoTimeLbl.textContent = `${minutes}:${formattedSec} / 2:15`;
            }
        }, 1000);
    };

    const stopSimulatedPlayback = () => {
        isVideoPlaying = false;
        if (modalPlayBtn) {
            modalPlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }
        clearInterval(simulatedPlaybackInterval);
        
        if (slideContent) {
            slideContent.classList.add("animate-pulse");
            slideContent.innerHTML = `
                <i class="fa-solid fa-circle-user avatar-placeholder"></i>
                <h2>Juan Pablo Sánchez</h2>
                <p class="role-desc">Resumen Profesional y Formación</p>
                <p class="slide-subtitle">Reproducción en pausa.</p>
            `;
        }
    };

    if (playVideoBtn) {
        playVideoBtn.addEventListener("click", () => {
            if (videoModal) {
                videoModal.style.display = "flex";
                void videoModal.offsetWidth;
                videoModal.style.opacity = "1";
            }
            startSimulatedPlayback();
            document.body.style.overflow = "hidden";
        });
    }

    const closeVideoModal = () => {
        stopSimulatedPlayback();
        if (videoModal) {
            videoModal.style.opacity = "0";
            setTimeout(() => {
                videoModal.style.display = "none";
                document.body.style.overflow = "";
            }, 400);
        }
    };

    if (videoCloseBtn) {
        videoCloseBtn.addEventListener("click", closeVideoModal);
    }

    if (modalPlayBtn) {
        modalPlayBtn.addEventListener("click", () => {
            if (isVideoPlaying) {
                stopSimulatedPlayback();
            } else {
                startSimulatedPlayback();
            }
        });
    }

    if (modalMuteBtn) {
        modalMuteBtn.addEventListener("click", () => {
            isVideoMuted = !isVideoMuted;
            if (isVideoMuted) {
                modalMuteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
            } else {
                modalMuteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
            }
        });
    }

    if (videoModal) {
        videoModal.addEventListener("click", (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // ==================== CAREER TIMELINE DATA & GENERATION =======    // ==================== CAREER DASHBOARD DATA & GENERATION ====================
    const careerErasData = {
        era3: {
            id: "era3",
            title: "IA, Datos y Consultoría",
            period: "2023 - Presente",
            icon: "fa-robot",
            desc: "Liderazgo estratégico, automatizaciones avanzadas y analítica de personas en el centro de la toma de decisiones.",
            metrics: [
                { value: "+600", label: "Ingresos Anuales", detail: "Escalamiento en salud (ASE/Medifé)" },
                { value: "80%", label: "Screening con IA", detail: "ATS automatizado con GPT-4o" },
                { value: "-45%", label: "Soporte de HR", detail: "Bot de consultas RAG y flujos n8n" }
            ],
            roles: [
                {
                    role: "Consultor en Procesos, IA & Talento",
                    company: "Entropyx",
                    period: "May 2026 - Actualidad",
                    achievements: [
                        "Diseño y ejecuto proyectos de consultoría en transformación digital de procesos, analítica de datos e IA aplicada a gestión.",
                        "Construyo automatizaciones personalizadas (n8n, Make, Power Automate, Google Apps Script) para eficientizar flujos operativos.",
                        "Desarrollé un ATS interno propio potenciado por IA generativa para clasificar perfiles y reducir los tiempos de preselección."
                    ],
                    tools: ["n8n", "Make", "IA Generativa", "LLMs (GPT-4o)", "APIs"]
                },
                {
                    role: "Líder de Atracción de Talento",
                    company: "Grupo Cober",
                    period: "Ene 2026 - May 2026",
                    achievements: [
                        "Coordiné una operación de alta demanda con 80 búsquedas activas y 50 incorporaciones mensuales promedio.",
                        "Rediseñé el flujo de reclutamiento, priorizando vacantes mediante un tablero ágil en Power BI creado desde cero.",
                        "Creé una base de datos automatizada y asistida por IA para centralizar la información operativa y reportar a gerencia."
                    ],
                    tools: ["Power BI", "Airtable", "n8n", "AI Sourcing"]
                },
                {
                    role: "Consultor de Desarrollo & Negocios",
                    company: "Knowment",
                    period: "Jun 2025 - Actualidad",
                    achievements: [
                        "Colaboro en el diseño organizacional, propuestas y desarrollo de negocio de consultoría para empresas medianas y grandes.",
                        "Aporto diagnósticos basados en análisis de procesos de talento, efectividad operativa y change management.",
                        "Codiseñé programas formativos en liderazgo y talleres de transformación cultural para equipos jerárquicos."
                    ],
                    tools: ["Change Management", "Diseño Organizacional", "Formatos Culturales"]
                },
                {
                    role: "Jefe de TA & People Analytics",
                    company: "ASE | Medifé | Finochietto",
                    period: "Nov 2023 - Nov 2025",
                    achievements: [
                        "Lideré las áreas de Atracción de Talento y People Analytics (6 reportes directos) en un grupo de salud de 3000 colaboradores.",
                        "Implementé el proceso formal de aprobación de vacantes corporativo y el tablero de control de presupuesto anual.",
                        "Diseñé y desplegué los tableros unificados de control en Power BI de People Analytics para la toma de decisiones del Comité."
                    ],
                    tools: ["Power BI", "Power Query", "Excel Avanzado", "Meta4"]
                }
            ]
        },
        era2: {
            id: "era2",
            title: "Gestión de Talento y Agilidad",
            period: "2019 - 2023",
            icon: "fa-users-gear",
            desc: "Liderazgo de equipos soft de People, HRBP de áreas técnicas y adopción de marcos ágiles en estructuras complejas.",
            metrics: [
                { value: "120+", label: "Líderes Capacitados", detail: "Programa HERA de coaching directivo" },
                { value: "-12%", label: "Rotación Voluntaria IT", detail: "Diseño de bandas salariales y beneficios" },
                { value: "-35%", label: "Time-to-Market IT", detail: "Acompañamiento a células en Emergencias" }
            ],
            roles: [
                {
                    role: "Jefe de Talento",
                    company: "Grupo Gire",
                    period: "Oct 2021 - May 2023",
                    achievements: [
                        "Lideré el área soft de People (~1500 colaboradores, 6 analistas a cargo) gestionando atracción, capacitación y desempeño.",
                        "Diseñé e implementé la estrategia de potencial con Nine Box y programas insignes como Make It Talent y DevForce.",
                        "Optimicé el uso de SuccessFactors y el control del presupuesto consolidando indicadores de retorno de inversión de capacitación."
                    ],
                    tools: ["SuccessFactors", "Nine Box", "Presupuestos HR"]
                },
                {
                    role: "Head of People",
                    company: "ICAP Global",
                    period: "Jun 2023 - Nov 2023",
                    achievements: [
                        "Reportando a CEO y CFO, reorganicé e instalé procesos formales de People para una estructura internacional en expansión.",
                        "Formalicé el onboarding digital, evaluaciones de clima y políticas de compensaciones en mercados LATAM.",
                        "Brindé asesoría directa como HRBP ejecutivo a directores para el desarrollo de planes de sucesión y clima."
                    ],
                    tools: ["Onboarding Digital", "Compensaciones", "Planes de Sucesión"]
                },
                {
                    role: "IT & Digital Talent Lead",
                    company: "Grupo Gire",
                    period: "May 2021 - Nov 2021",
                    achievements: [
                        "Lideré la estrategia de atracción, marca empleadora y formación para el hub de perfiles de tecnología de la compañía.",
                        "Coordiné un equipo de 2 analistas dedicados en forma exclusiva a búsquedas de nicho digital.",
                        "Impulsé programas de formación acelerada y reskilling técnico interno para cubrir posiciones complejas."
                    ],
                    tools: ["Digital Sourcing", "Tech Reskilling", "Tech Branding"]
                },
                {
                    role: "HRBP IT",
                    company: "Emergencias",
                    period: "Oct 2020 - May 2021",
                    achievements: [
                        "Partner de People para 200 colaboradores y líderes del área de IT, conectando la estrategia de talento con la operación.",
                        "Actué como referente funcional y focal point de SuccessFactors para optimizar el uso de los módulos del portal de empleados.",
                        "Acompañé la conformación de células de desarrollo bajo marcos de trabajo ágiles y negociaciones salariales IT."
                    ],
                    tools: ["SuccessFactors", "Agile Células", "IT Recruitment"]
                },
                {
                    role: "HRBP IT & L&D Lead",
                    company: "Grupo Gire",
                    period: "Oct 2019 - Oct 2020",
                    achievements: [
                        "Desempeñé rol dual brindando soporte como partner estratégico a la Dirección de IT durante su cambio a marcos ágiles.",
                        "Lideré programas de formación técnica y de e-learning, coordinando el diseño de las rutas de aprendizaje.",
                        "Facilité sesiones de coaching de equipos para destrabar conflictos de comunicación y agilizar la entrega."
                    ],
                    tools: ["Agile Coaching", "E-learning", "Coaching de Equipos"]
                },
                {
                    role: "Especialista en Desarrollo de Talento",
                    company: "Grupo Gire",
                    period: "Ene 2019 - Oct 2019",
                    achievements: [
                        "Promovido al área de Personas por mi impacto transversal y base de procesos aplicada al desarrollo organizacional.",
                        "Coordiné el ciclo anual de evaluación del desempeño, calibraciones de talento y definición de planes de desarrollo (IDP).",
                        "Lideré formaciones internas y brindé coaching a líderes operativos para fortalecer capacidades internas."
                    ],
                    tools: ["IDP", "Calibración Desempeño", "Coaching"]
                },
                {
                    role: "IT Freelance Recruiter",
                    company: "Autónomo",
                    period: "Ene 2019 - Jun 2022",
                    achievements: [
                        "Ejecuté procesos de reclutamiento especializado en perfiles técnicos y digitales (DevOps, QA, Backend, Product Managers).",
                        "Construí un pipeline calificado para búsquedas de tecnología de carácter urgente en mercados competitivos.",
                        "Estructuré un modelo propio de seguimiento y reporte periódico para clientes freelance."
                    ],
                    tools: ["IT Recruitment", "Sourcing", "Tech Pipeline"]
                }
            ]
        },
        era1: {
            id: "era1",
            title: "Eficiencia y Procesos",
            period: "2010 - 2018",
            icon: "fa-arrows-spin",
            desc: "Sólida formación analítica aplicada a la mejora continua, mapeo BPMN, Lean Six Sigma y negociación de cambios operativos.",
            metrics: [
                { value: "-30%", label: "Tiempo de Espera", detail: "Optimización de atención en cajas (Coppel)" },
                { value: "-25%", label: "Conciliación Diaria", detail: "Reingeniería de Rapipago (Grupo Gire)" },
                { value: "-18%", label: "Costos Operativos", detail: "Layout logístico y personal (Coppel)" }
            ],
            roles: [
                {
                    role: "Analista Sr. de Procesos",
                    company: "Grupo Gire",
                    period: "May 2016 - Ene 2019",
                    achievements: [
                        "Diseñé e implementé procesos operativos para nuevos servicios financieros de Rapipago (retiro de efectivo, cobros con tarjeta).",
                        "Referente en mejoras del CRM Dynamics y del proyecto de implementación de SAP para administración y finanzas.",
                        "Documenté y estandaricé políticas transversales entre PMO, Sistemas y el área de Desarrollo Humano."
                    ],
                    tools: ["SAP", "Dynamics CRM", "BPMN"]
                },
                {
                    role: "Analista Ssr. de Procesos",
                    company: "Swiss Medical Group",
                    period: "Dic 2015 - May 2016",
                    achievements: [
                        "Acompañé el análisis funcional y relevamiento de requerimientos para migraciones de CRM de atención y SuccessFactors.",
                        "Diseñé flujos de procesos AS IS / TO BE, documentando procedimientos críticos y elaborando manuales para mitigar la fricción.",
                        "Brindé soporte funcional y capacitación presencial a usuarios y managers afectados por el cambio de sistemas."
                    ],
                    tools: ["SuccessFactors", "UAT", "BPMN"]
                },
                {
                    role: "Analista de Mejora Continua",
                    company: "Coppel",
                    period: "Feb 2014 - Dic 2015",
                    achievements: [
                        "Lideré proyectos de reingeniería de flujos de atención y procesos de caja física, reduciendo tiempos de espera del cliente.",
                        "Rediseñé el layout operativo y dimensionamiento de personal del sector de distribución para aumentar la productividad.",
                        "Participé en la negociación de cambios de procesos de trabajo ante delegados de sindicatos (Comercio y Camioneros)."
                    ],
                    tools: ["Lean Six Sigma", "BPMN", "Relaciones Laborales"]
                },
                {
                    role: "Analista de Aprendizaje",
                    company: "Tarjeta Naranja",
                    period: "Dic 2012 - Dic 2013",
                    achievements: [
                        "Diseñé planes anuales de capacitación y desarrollo orientados a alinear los objetivos del negocio con la inducción interna.",
                        "Responsable del diseño instruccional y facilitación presencial de los programas de onboarding para nuevos ingresantes.",
                        "Implementé los primeros indicadores cuantitativos de aprendizaje (completitud de rutas de formación y satisfacción)."
                    ],
                    tools: ["L&D", "Onboarding", "Indicadores de Aprendizaje"]
                },
                {
                    role: "Analista de Calidad / Team Leader",
                    company: "Nextel",
                    period: "Jun 2010 - Oct 2012",
                    achievements: [
                        "Lideré el control de calidad de servicio, coaching y capacitación para un equipo de 9 representantes de atención.",
                        "Diseñé e implementé matrices de evaluación de llamadas y rutinas de feedback individual que mejoraron el NPS del sector.",
                        "Participé en el programa interno de alto desempeño, rotando por áreas transversales del negocio."
                    ],
                    tools: ["Coaching", "Matrices de Calidad", "NPS"]
                }
            ]
        }
    };

    // Render Career Dashboard Navigation Track & Detail Panel
    const careerNavTrack = document.getElementById("career-nav-track");
    const careerDetailPanel = document.getElementById("career-detail-panel");

    const renderCareerDashboard = (activeEraId) => {
        if (!careerNavTrack || !careerDetailPanel) return;

        // Render Nav buttons
        const eras = ["era3", "era2", "era1"];
        careerNavTrack.innerHTML = eras.map(eraId => {
            const era = careerErasData[eraId];
            const isActive = eraId === activeEraId ? "active" : "";
            return `
                <div class="era-nav-card ${isActive}" data-era="${eraId}">
                    <div class="era-card-glow"></div>
                    <span class="era-card-period">${era.period}</span>
                    <h4><i class="fa-solid ${era.icon} era-icon-inline"></i> ${era.title}</h4>
                    <p>${era.desc}</p>
                </div>
            `;
        }).join('');

        // Render Active Era details with a clean layout
        const activeEra = careerErasData[activeEraId];
        
        careerDetailPanel.innerHTML = `
            <div class="era-detail-content">
                <div class="era-detail-header">
                    <span class="era-detail-badge">${activeEra.period}</span>
                    <h3>${activeEra.title}</h3>
                    <p class="era-detail-summary">${activeEra.desc}</p>
                </div>

                <!-- KPI Metrics Dashboard Grid -->
                <div class="era-metrics-grid">
                    ${activeEra.metrics.map(metric => `
                        <div class="era-metric-box">
                            <div class="metric-glow"></div>
                            <span class="metric-val">${metric.value}</span>
                            <span class="metric-lbl">${metric.label}</span>
                            <p class="metric-det">${metric.detail}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Internal Chronological Milestones -->
                <div class="era-milestones-title">Experiencia y Logros en esta Era</div>
                <div class="era-milestones-list">
                    ${activeEra.roles.map(r => `
                        <div class="era-milestone-item">
                            <div class="milestone-header">
                                <div class="milestone-title-area">
                                    <h4>${r.role}</h4>
                                    <span class="milestone-company">${r.company}</span>
                                </div>
                                <span class="milestone-period">${r.period}</span>
                            </div>
                            <ul class="milestone-achievements">
                                ${r.achievements.map(ach => `<li>${ach}</li>`).join('')}
                            </ul>
                            <div class="milestone-tools">
                                ${r.tools.map(tool => `<span class="milestone-tool-badge">${tool}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Wire click handlers for Era Navigation
        const cards = careerNavTrack.querySelectorAll(".era-nav-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const selectedEra = card.getAttribute("data-era");
                // Avoid redundant renders
                if (selectedEra === activeEraId) return;

                // Animate transition
                careerDetailPanel.style.opacity = "0";
                careerDetailPanel.style.transform = "translateY(10px)";
                
                setTimeout(() => {
                    renderCareerDashboard(selectedEra);
                    careerDetailPanel.style.opacity = "1";
                    careerDetailPanel.style.transform = "translateY(0)";
                }, 200);
            });
        });
    };

    // Initial render (era3 is selected by default)
    renderCareerDashboard("era3");

    // ==================== EDUCATION DATA & GENERATION ====================
    const educationData = [
        {
            category: "Formación Académica y Posgrados",
            icon: "fa-graduation-cap",
            items: [
                {
                    title: "Licenciatura en Administración de Empresas",
                    institution: "UAI - Universidad Abierta Interamericana",
                    status: "En proceso de graduación"
                },
                {
                    title: "Diplomatura / Especialización en Gestión de RRHH",
                    institution: "UAI - Universidad Abierta Interamericana",
                    status: "Completado"
                },
                {
                    title: "Licenciatura en Psicología",
                    institution: "UBA - Universidad de Buenos Aires",
                    status: "En pausa"
                },
                {
                    title: "Técnico Superior en Liderazgo Ontológico / Coaching",
                    institution: "ICP - Instituto de Capacitación Profesional",
                    status: "Completado"
                }
            ]
        },
        {
            category: "Agilidad y Gestión (Agile)",
            icon: "fa-arrows-spin",
            items: [
                {
                    title: "Agile Coach & Scrum Master",
                    institution: "Estudio Locht",
                    status: "Certificado"
                },
                {
                    title: "OKRs Certified & HR Agile Practitioner",
                    institution: "Estudio Locht",
                    status: "Certificado"
                },
                {
                    title: "People Experience",
                    institution: "Estudio Locht",
                    status: "Completado"
                }
            ]
        },
        {
            category: "Tecnología e Inteligencia Artificial",
            icon: "fa-robot",
            items: [
                {
                    title: "IA para Negocios",
                    institution: "Educación IT",
                    status: "Completado"
                },
                {
                    title: "IA para HR / Capital Humano",
                    institution: "UTN / Estudio Locht",
                    status: "Completado"
                },
                {
                    title: "Transformación Digital para Líderes",
                    institution: "DCH / Certificaciones Varias",
                    status: "Completado"
                }
            ]
        },
        {
            category: "Datos, Herramientas y Selección",
            icon: "fa-chart-line",
            items: [
                {
                    title: "Excel Avanzado & Power BI",
                    institution: "Pablo Senra Training",
                    status: "Completado"
                },
                {
                    title: "Programación en Python & R",
                    institution: "Sergio Mora Academy",
                    status: "Completado"
                },
                {
                    title: "Indicadores de HR & Compensaciones",
                    institution: "Humanos Reales / ADRHA - UBA",
                    status: "Completado"
                },
                {
                    title: "Selección IT & Evaluaciones Psicotécnicas",
                    institution: "Conexión HR / Psicométricos Pro",
                    status: "Completado"
                }
            ]
        }
    ];

    const educationGrid = document.getElementById("education-category-grid");
    if (educationGrid) {
        educationGrid.innerHTML = educationData.map(cat => `
            <div class="education-group-card">
                <h4><i class="fa-solid ${cat.icon}"></i> ${cat.category}</h4>
                <ul class="education-items-list">
                    ${cat.items.map(item => `
                        <li class="education-item-row">
                            <h5>${item.title}</h5>
                            <p>${item.institution} • <strong>${item.status}</strong></p>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    // ==================== 27 MOCK PROJECTS DATA ====================
    const projectsData = {
        procesos: {
            title: "Procesos y mejora continua",
            desc: "Reingeniería operativa, Lean, Six Sigma y eliminación de desperdicios en negocio y operaciones.",
            projects: [
                {
                    title: "Reingeniería Operativa de Rapipago (Gire)",
                    problem: "Cuellos de botella en la recaudación de cajas físicas, control transaccional y conciliación al lanzar nuevos servicios financieros.",
                    solution: "Mapeo completo de flujos BPMN AS IS / TO BE de los procesos transaccionales y de logística de valores. Rediseño del flujo de reclamos de clientes en SAC.",
                    impact: "Disminución del 25% en tiempos de conciliación diaria y reducción del 15% en fallos de conciliación de arqueo."
                },
                {
                    title: "Optimización de Atención en Cajas y Cajas Rápidas (Coppel)",
                    problem: "Demoras críticas en el flujo de cobros presenciales y atención al cliente en tiendas físicas durante períodos comerciales de alta demanda.",
                    solution: "Aplicación de metodologías Lean y Six Sigma para simplificar pasos del cajero, reestructurar la cola física y entrenar en estándares de competencia.",
                    impact: "Reducción del 30% en el tiempo medio de espera de clientes en fila y aumento del 12% en productividad de cobro."
                },
                {
                    title: "Rediseño Operativo y Logístico del Centro de Distribución (Coppel)",
                    problem: "Inconsistencia de stock y retrasos en los tiempos de entrega de mercaderías hacia las sucursales por cuellos de botella en logística inversa.",
                    solution: "Rediseño completo del layout físico de stock y dimensionamiento del área de logística, negociando los cambios operativos con gremios clave (Comercio y Camioneros).",
                    impact: "Reducción del 18% en costos operativos de distribución y aumento del cumplimiento de plazos de entrega a sucursales al 95%."
                }
            ]
        },
        servicios: {
            title: "Diseño de servicios",
            desc: "Mapeo de interacciones, Service Blueprints y diseño del ecosistema del empleado y cliente.",
            projects: [
                {
                    title: "Service Blueprint de Inducción Digital",
                    problem: "Rotación temprana del 18% en los primeros 90 días de contratación de personal debido a un onboarding confuso y no estructurado.",
                    solution: "Mapeo del Employee Journey de bienvenida y desarrollo de un Service Blueprint unificado de onboarding que conecta sistemas de HR, IT (accesos) y líderes del negocio.",
                    impact: "Reducción de la rotación temprana al 8% y un nivel de satisfacción de ingreso superior al 95%."
                },
                {
                    title: "Candidate Experience Redesign",
                    problem: "Fuga de talentos de tecnología durante el embudo de selección por falta de visibilidad del estado de su postulación.",
                    solution: "Creación de un Journey Map de candidatos con puntos de contacto claros y automatización de correos transaccionales integrados en el ATS.",
                    impact: "Incremento del NPS de candidatos a +45 y reducción del time-to-hire en un 20% promedio."
                },
                {
                    title: "Blueprint de Aprobación de Vacantes para Negocio",
                    problem: "Managers frustrados por la burocracia en la aprobación de nuevas posiciones, tardando más de 15 días solo en la autorización.",
                    solution: "Diseño de servicios mapeando los puntos de fricción del manager y el flujo administrativo para crear un proceso simplificado de aprobación de vacantes.",
                    impact: "Reducción del tiempo de aprobación a menos de 48 horas con el 90% de los líderes utilizando el nuevo canal digital."
                }
            ]
        },
        sistemas: {
            title: "Implementación y adopción de sistemas",
            desc: "Migraciones funcionales de HRIS, ERP, CRM y gestión del cambio para usuarios.",
            projects: [
                {
                    title: "Migración e Implementación Funcional de SuccessFactors (Gire)",
                    problem: "Ausencia de un software central de talento, con evaluaciones anuales de desempeño basadas en planillas manuales de Excel.",
                    solution: "Liderazgo funcional de la implementación de los módulos de Desempeño y Sucesión de SuccessFactors. Coordinación de pruebas UAT y capacitación a mandos medios.",
                    impact: "100% de la dotación evaluada en sistema y adopción real del 92% de los líderes del negocio."
                },
                {
                    title: "Enablement Ágil en SuccessFactors (Emergencias)",
                    problem: "Resistencia del equipo técnico y mandos medios ante la carga y uso de objetivos en el nuevo portal de autoservicio de HR.",
                    solution: "Plan de Enablement como focal point del sistema, combinando talleres prácticos y dinámicas ágiles en las células de desarrollo de IT.",
                    impact: "Curva de aprendizaje del personal IT reducida a la mitad y resolución de incidencias post-implementación en 48hs."
                },
                {
                    title: "Implementación y Unificación de Procesos en Meta4 (Gire)",
                    problem: "Inconsistencia de datos duros de personal entre las bases operativas de nómina y los programas de desarrollo de talento.",
                    solution: "Revisión funcional y unificación de criterios de registro en Meta4, y confección de manuales prácticos para administradores funcionales.",
                    impact: "Reducción del 95% en discrepancias de datos salariales/de puestos y automatización del control presupuestario de HR."
                }
            ]
        },
        talento: {
            title: "Atracción de Talento y Marca Empleadora",
            desc: "Búsquedas end-to-end, contratación de volumen y campañas de posicionamiento técnico.",
            projects: [
                {
                    title: "Contratación de Volumen de Perfiles de Salud (ASE/Medifé)",
                    problem: "Dificultad recurrente para cubrir vacantes médicas y asistenciales de alta rotación en sanatorios ante emergencias sanitarias.",
                    solution: "Rediseño de flujos de selección masiva en el ATS y alianzas con centros formativos de enfermería para crear un pipeline constante.",
                    impact: "Más de 600 cierres de vacantes anuales logrados y reducción del costo por contratación de personal en un 25%."
                },
                {
                    title: "DevForce: Marca Empleadora de Tecnología (Gire)",
                    problem: "Baja atracción de perfiles de software debido a que la compañía no era percibida como un hub tecnológico.",
                    solution: "Lanzamiento de la marca técnica 'DevForce', organizando meetups de desarrollo, hackathons internos y un programa de academia IT.",
                    impact: "Aumento del 200% en postulaciones espontáneas calificadas y reducción del time to fill IT a 32 días."
                },
                {
                    title: "Rediseño Operativo del Embudo de Selección (Cober)",
                    problem: "Sobrecarga administrativa del equipo de atracción (80 vacantes activas/mes) y falta de control en los desvíos del proceso.",
                    solution: "Reordenamiento de prioridades del equipo de reclutamiento instalando rutinas ágiles y tableros diarios de estados de búsquedas.",
                    impact: "50 contrataciones logradas mensualmente y reducción del time-to-fill promedio a 30 días."
                }
            ]
        },
        cultura: {
            title: "Transformación cultural",
            desc: "Acompañamiento al cambio en metodologías ágiles, OKRs de negocio y desarrollo de liderazgo.",
            projects: [
                {
                    title: "Programa HERA de Desarrollo de Líderes (Gire)",
                    problem: "Falta de habilidades blandas en managers de mandos medios para gestionar el cambio cultural en procesos de digitalización.",
                    solution: "Diseño y facilitación de talleres del Programa HERA, enfocado en competencias de comunicación asertiva, agilidad y coaching directivo.",
                    impact: "120 líderes capacitados con incremento verificado de 8 puntos en clima laboral y mayor cohesión de equipos organizativos."
                },
                {
                    title: "Implementación de OKRs Estratégicos Corporativos",
                    problem: "Estrategia anual de la Dirección desvinculada de los planes operativos diarios del personal.",
                    solution: "Facilitación de dinámicas de diseño de OKRs para la capa directiva y de jefaturas, unificando metas comerciales y de experiencia humana.",
                    impact: "Alineación del 100% de las iniciativas corporativas del año con los OKRs aprobados por el Comité de Dirección."
                },
                {
                    title: "Escalamiento Ágil en Dirección de IT (Emergencias)",
                    problem: "Fricción constante entre el área de Sistemas (IT) y el negocio por demoras en entregas de desarrollo.",
                    solution: "Acompañamiento a líderes en la transición a estructuras de células de producto, redefiniendo roles (PO, Scrum Master) y ceremonias.",
                    impact: "Reducción del 35% del time-to-market de proyectos e incremento de 15 puntos en la satisfacción del cliente interno."
                }
            ]
        },
        aprendizaje: {
            title: "Aprendizaje y Desarrollo",
            desc: "Planes anuales de capacitación, formador de formadores, e-learning y reskilling.",
            projects: [
                {
                    title: "Red de Instructores Internos: Formador de Formadores",
                    problem: "Elevados costos en proveedores de capacitación externa y pérdida del conocimiento operativo crítico acumulado en la empresa.",
                    solution: "Programa de reclutamiento de instructores internos clave y entrenamiento presencial en oratoria, diseño didáctico y facilitación.",
                    impact: "Red con 40 instructores internos activos que impartieron 350 horas de capacitación con ahorro del 60% en presupuesto externo."
                },
                {
                    title: "Academia Virtual de Reskilling Transaccional",
                    problem: "Colaboradores operativos rezagados frente a la digitalización del cobro y automatización de conciliaciones de cajas.",
                    solution: "Diseño instruccional de rutas de formación virtual en herramientas digitales (Power BI, low-code, bases de datos básicas) en la plataforma e-learning.",
                    impact: "Reskilling exitoso del 85% del personal operativo afectado, reduciendo la necesidad de reemplazos externos."
                },
                {
                    title: "Evaluación de Potencial y Calibración Nine Box",
                    problem: "Subjetividad en las decisiones de ascensos y falta de visibilidad sobre los sucesores de posiciones críticas de dirección.",
                    solution: "Diseño del proceso formal de calibración de talento bajo metodología Nine Box, unificando criterios de potencial y desempeño con directores.",
                    impact: "Identificación de sucesores del 100% de las gerencias clave y planes individuales de carrera personalizados para talentos 'high-potential'."
                }
            ]
        },
        compensaciones: {
            title: "Compensaciones",
            desc: "Benchmarks, bandas salariales, modelos variables de incentivos y auditoría de costo laboral.",
            projects: [
                {
                    title: "Estructura de Bandas Salariales para Perfiles de IT (Gire)",
                    problem: "Fuga del 28% de talentos de tecnología por desvíos salariales frente al mercado IT y falta de equidad salarial interna.",
                    solution: "Benchmarking salarial externo enfocado en roles IT y diseño de una matriz funcional de categorías con bandas de compensación y beneficios flexibles.",
                    impact: "Reducción de la rotación voluntaria en IT al 12% anual y equidad interna garantizada por puesto de desarrollo."
                },
                {
                    title: "Auditoría, Control de Dotación y Costo Laboral (ASE/Medifé)",
                    problem: "Desvíos presupuestarios anuales constantes en el costo salarial por descontrol en las contrataciones y horas extras.",
                    solution: "Modelo integrado de control de gestión de vacantes y horas extras mensuales correlacionadas con el presupuesto anual de la gerencia.",
                    impact: "Desviación presupuestaria final inferior al 1% en el transcurso del año, logrando ahorros operativos de $150K USD."
                },
                {
                    title: "Esquemas de Incentivos Variables en Ventas Corporativas",
                    problem: "Fuerza comercial desmotivada por estructuras de bonos complejas e indicadores no alineados a la rentabilidad del producto.",
                    solution: "Rediseño completo de la fórmula de comisiones variables enfocada en el margen operativo neto en lugar del volumen de venta simple.",
                    impact: "Aumento de la venta de productos estratégicos en un 22% y satisfacción laboral del equipo comercial superior al 85%."
                }
            ]
        },
        analytics: {
            title: "People Analytics",
            desc: "Construcción de KPIs, reportes y tableros interactivos automatizados con Power BI.",
            projects: [
                {
                    title: "Tableros de Control de Dotación, Ausentismo y Rotación (ASE)",
                    problem: "Carga administrativa de 24 horas mensuales dedicadas a consolidar planillas manuales y reportar desvíos con datos desactualizados.",
                    solution: "Unificación funcional de bases de datos del personal en Power Query y diseño de tableros interactivos automatizados en Power BI.",
                    impact: "Toma de decisiones directiva basada en datos actualizados a un solo clic y ahorro del 100% del tiempo de armado del reporte manual."
                },
                {
                    title: "Modelo de Predicción de Fuga de Talento Crítico",
                    problem: "Pérdida de personal calificado en sanatorios de la red asistencial, impactando los costos por sobrecarga laboral de otros equipos.",
                    solution: "Análisis descriptivo correlacionando variables de ausentismo, antigüedad, carga de guardia y evaluaciones de desempeño pasadas.",
                    impact: "Implementación de alertas predictivas que ayudaron a los HRBPs a retener preventivamente al 75% del personal calificado en riesgo."
                },
                {
                    title: "Auditoría de Tiempos de Ciclo Operativo en HR (TAT)",
                    problem: "Quejas recurrentes de las gerencias de línea por demoras operativas excesivas en los flujos de People (compras, contratos, altas).",
                    solution: "Mapeo y medición del Turnaround Time (TAT) por etapa en los sistemas transaccionales, identificando cuellos de botella.",
                    impact: "Redistribución de tareas con base en datos reales de carga y reducción del 30% en los tiempos totales del ciclo."
                }
            ]
        },
        automatizacion: {
            title: "Automatización & IA",
            desc: "Conexión de herramientas con n8n/Make, automatización de tareas y desarrollo de agentes.",
            projects: [
                {
                    title: "Simulador de Screening Inteligente de Candidatos (Entropyx)",
                    problem: "Reclutadores desbordados por el gran caudal de postulaciones espontáneas, perdiendo candidatos valiosos por demoras en el cribado.",
                    solution: "Diseño de un asistente inteligente integrado en el ATS que clasifica el texto de los CVs contra el perfil del puesto usando el LLM GPT-4o.",
                    impact: "Screening inicial automatizado en un 80% y preselección final de ternas consistente en menos de 24 horas."
                },
                {
                    title: "Integración de Notificaciones de Pipeline vía n8n (Cober)",
                    problem: "Falta de comunicación sobre el estado de búsquedas abiertas hacia los gerentes, generando un flujo constante de consultas manuales.",
                    solution: "Flujo de automatización robusto en n8n que conecta los cambios de estados de Airtable con canales específicos de Slack.",
                    impact: "Eliminación de un 45% de mensajes de consulta directa al equipo de selección y mayor agilidad en agendar entrevistas."
                },
                {
                    title: "Agente de IA de Autoservicio para Políticas de Beneficios",
                    problem: "Un 30% de la carga de soporte de HR se dedicaba a responder consultas repetitivas de colaboradores sobre vacaciones, licencias y beneficios.",
                    solution: "Desarrollo de un Bot de IA (RAG) entrenado con los documentos oficiales de políticas y convenios colectivos de la empresa.",
                    impact: "Resolución del 70% de consultas de forma inmediata y autoservicio, liberando 10 horas semanales del equipo administrativo de HR."
                }
            ]
        }
    };

    // Category Card Click Handler to open dynamic fluid overlays
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const catKey = card.getAttribute("data-category");
            const catData = projectsData[catKey];
            if (!catData) return;

            // Set overlay text content
            if (overlayTitle) overlayTitle.textContent = catData.title;
            if (overlayDesc) overlayDesc.textContent = catData.desc;

            // Inject project cards
            if (overlayProjectsList) {
                overlayProjectsList.innerHTML = catData.projects.map(proj => `
                    <div class="overlay-project-card">
                        <h4>${proj.title}</h4>
                        <p><strong>Problema:</strong> ${proj.problem}</p>
                        <p><strong>Solución:</strong> ${proj.solution}</p>
                        <div class="project-impact-highlight">
                            <p><i class="fa-solid fa-chart-line"></i> <strong>Impacto:</strong> <strong>${proj.impact}</strong></p>
                        </div>
                    </div>
                `).join('');
            }

            // Display overlay with transitions
            if (projectsOverlay) {
                projectsOverlay.style.display = "flex";
                void projectsOverlay.offsetWidth; // Force reflow
                projectsOverlay.classList.add("active");
            }
            document.body.style.overflow = "hidden"; // disable body scrolling
        });
    });

    const closeOverlay = () => {
        if (projectsOverlay) {
            projectsOverlay.classList.remove("active");
            setTimeout(() => {
                projectsOverlay.style.display = "none";
                document.body.style.overflow = "";
            }, 500); // Wait for the transition to finish
        }
    };

    if (overlayCloseBtn) {
        overlayCloseBtn.addEventListener("click", closeOverlay);
    }

    if (projectsOverlay) {
        projectsOverlay.addEventListener("click", (e) => {
            if (e.target === projectsOverlay) {
                closeOverlay();
            }
        });
    }

    // ==================== CONTACT FORM REAL SUBMIT WITH WEB3FORMS ====================
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-message").value.trim();

            if (name && email && message) {
                const submitBtn = contactForm.querySelector("button[type='submit']");
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...`;
                
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        access_key: "edd64041-be92-4064-9c5b-c668007fff00",
                        subject: `Nuevo mensaje de contacto: ${name}`,
                        from_name: "Contacto Portafolio JPS",
                        name: name,
                        email: email,
                        message: message
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        submitBtn.style.background = "#10b981"; // green success color
                        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> ¡Mensaje Enviado!`;
                        contactForm.reset();
                    } else {
                        submitBtn.style.background = "#ef4444"; // red error color
                        submitBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Error al enviar`;
                    }
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.background = "";
                        submitBtn.innerHTML = originalText;
                    }, 3000);
                })
                .catch(() => {
                    submitBtn.style.background = "#ef4444";
                    submitBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Error de Red`;
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.background = "";
                        submitBtn.innerHTML = originalText;
                    }, 3000);
                });
            }
        });
    }

    // ==================== INITIAL CHECK ====================
    checkGating();
});
