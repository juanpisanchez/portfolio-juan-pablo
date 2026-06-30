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
    const roles = [
        "Liderazgo y Project Management",
        "Implementación y adopción de sistemas",
        "Diseño de servicios y Procesos",
        "Gestión de Talento & HRBP",
        "People Analytics & HRIS",
        "Automatización & IA"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

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
                document.body.style.overflow = "hidden"; // lock body scroll
            }
        } else {
            document.body.style.overflow = "hidden"; // lock body scroll
        }
    };

    const unlockPortfolio = (animate = true) => {
        document.body.style.overflow = ""; // restore body scroll
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
                document.body.style.overflow = "hidden"; // lock scroll
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
                document.body.style.overflow = ""; // restore scroll
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
            document.body.style.overflow = ""; // restore scroll

            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });



    // ==================== CAREER TIMELINE DATA & GENERATION =======    // ==================== CAREER DASHBOARD DATA & GENERATION =======    // ==================== EXPERIENCE DATA & OVERLAY GENERATION ====================
    const experienceData = {
    "liderazgo": {
        "title": "Liderazgo y Project Management",
        "desc": "Liderazgo de equipos, gestión de iniciativas, priorización, seguimiento de avances, coordinación de stakeholders y gobierno de procesos en contextos de transformación.",
        "metrics": [
            {
                "value": "10+ años",
                "label": "De experiencia",
                "detail": "Gestionando iniciativas, procesos, stakeholders, equipos o proyectos transversales."
            },
            {
                "value": "+1500",
                "label": "Colaboradores",
                "detail": "Estructura gestionada en Grupo Gire"
            },
            {
                "value": "120+",
                "label": "Líderes Capacitados",
                "detail": "Programa HERA de desarrollo directivo"
            },
            {
                "value": "6",
                "label": "Reportes Directos",
                "detail": "Liderazgo de equipo en salud y HR"
            }
        ],
        "roles": [
            {
                "role": "Líder de Atracción de Talento",
                "company": "Grupo Cober",
                "period": "Ene 2026 - May 2026",
                "tools": []
            },
            {
                "role": "Jefe de TA & People Analytics",
                "company": "ASE | Medifé | Finochietto",
                "period": "Nov 2023 - Nov 2025",
                "tools": []
            },
            {
                "role": "Head of People",
                "company": "ICAP Global",
                "period": "Jun 2023 - Nov 2023",
                "tools": []
            },
            {
                "role": "Jefe de Talento",
                "company": "Grupo Gire",
                "period": "Oct 2021 - May 2023",
                "tools": []
            },
            {
                "role": "IT & Digital Talent Lead",
                "company": "Grupo Gire",
                "period": "May 2021 - Nov 2021",
                "tools": []
            },
            {
                "role": "Líder de Desarrollo de Talento",
                "company": "Grupo Gire",
                "period": "Oct 2019 - Oct 2020",
                "tools": []
            },
            {
                "role": "Analista de Calidad / Team Leader",
                "company": "Nextel",
                "period": "Jun 2010 - Oct 2012",
                "tools": []
            }
        ]
    },
    "change": {
        "title": "Implementación y adopción de sistemas",
        "desc": "Acompañamiento a líderes y usuarios en transiciones tecnológicas. Gestión del impacto, relevamiento AS IS / TO BE, diseño de capacitaciones y testing funcional (UAT).",
        "metrics": [
            {
                "value": "9+ años",
                "label": "De experiencia",
                "detail": "Participando en proyectos de implementación, evolución funcional, UAT, capacitación y adopción de sistemas."
            },
            {
                "value": "100%",
                "label": "Adopción",
                "detail": "Migración exitosa a SuccessFactors y SAP"
            },
            {
                "value": "80%",
                "label": "Satisfacción",
                "detail": "Programas de inducción y L&D"
            },
            {
                "value": "-35%",
                "label": "Time-to-Market",
                "detail": "Adopción de Scrum en células de IT"
            }
        ],
        "roles": [
            {
                "role": "Consultor en Procesos, IA & Talento",
                "company": "Entropyx",
                "period": "May 2026 - Actualidad",
                "tools": []
            },
            {
                "role": "Jefe de TA & People Analytics",
                "company": "ASE | Medifé | Finochietto",
                "period": "Nov 2023 - Nov 2025",
                "tools": []
            },
            {
                "role": "HRBP IT & L&D Lead",
                "company": "Grupo Gire",
                "period": "Oct 2019 - Oct 2020",
                "tools": []
            },
            {
                "role": "Especialista en Desarrollo de Talento",
                "company": "Grupo Gire",
                "period": "Ene 2019 - Oct 2019",
                "tools": []
            },
            {
                "role": "Analista Sr. de Procesos",
                "company": "Grupo Gire",
                "period": "May 2016 - Ene 2019",
                "tools": []
            },
            {
                "role": "Analista Ssr. de Procesos",
                "company": "Swiss Medical Group",
                "period": "Dic 2015 - May 2016",
                "tools": []
            },
            {
                "role": "Analista de Aprendizaje",
                "company": "Tarjeta Naranja",
                "period": "Dic 2012 - Dic 2013",
                "tools": []
            }
        ]
    },
    "procesos": {
        "title": "Diseño de servicios y Procesos",
        "desc": "Relevamiento, AS IS / TO BE, service blueprint, documentación funcional, mejora continua y diseño de procesos para nuevos servicios, operaciones y áreas de gestión.",
        "metrics": [
            {
                "value": "10+ años",
                "label": "De experiencia",
                "detail": "En mejora continua, reingeniería operativa, AS IS / TO BE, documentación funcional, implementación y gestión del cambio."
            },
            {
                "value": "-30%",
                "label": "Tiempo de Espera",
                "detail": "Optimización de atención en cajas en Coppel"
            },
            {
                "value": "-25%",
                "label": "Conciliación Diaria",
                "detail": "Estandarización de Rapipago"
            },
            {
                "value": "-18%",
                "label": "Costos Operativos",
                "detail": "Rediseño de layout logístico en Coppel"
            }
        ],
        "roles": [
            {
                "role": "Analista Sr. de Procesos",
                "company": "Grupo Gire",
                "period": "May 2016 - Ene 2019",
                "tools": []
            },
            {
                "role": "Analista Ssr. de Procesos",
                "company": "Swiss Medical Group",
                "period": "Dic 2015 - May 2016",
                "tools": []
            },
            {
                "role": "Analista de Mejora Continua",
                "company": "Coppel",
                "period": "Feb 2014 - Dic 2015",
                "tools": []
            }
        ]
    },
    "talento": {
        "title": "Gestión de Talento & HRBP",
        "desc": "Soporte estratégico como socio de negocio cercano a operaciones críticas y áreas de IT. Diseño de programas de desempeño, onboarding, potencial (Nine Box) y planes de desarrollo.",
        "metrics": [
            {
                "value": "10+ años",
                "label": "De experiencia",
                "detail": "En procesos de talento, aprendizaje, desarrollo, HRBP, atracción, desempeño y acompañamiento a líderes."
            },
            {
                "value": "-12%",
                "label": "Rotación IT",
                "detail": "Diseño de bandas salariales y beneficios"
            },
            {
                "value": "+600",
                "label": "Altas Anuales",
                "detail": "Onboarding de personal de salud (ASE/Medifé)"
            },
            {
                "value": "100%",
                "label": "Cobertura Nine Box",
                "detail": "Estrategia de potencial y planes de sucesión"
            }
        ],
        "roles": [
            {
                "role": "Consultor en Procesos, IA & Talento",
                "company": "Entropyx",
                "period": "May 2026 - Actualidad",
                "tools": []
            },
            {
                "role": "Líder de Atracción de Talento",
                "company": "Grupo Cober",
                "period": "Ene 2026 - May 2026",
                "tools": []
            },
            {
                "role": "Jefe de TA & People Analytics",
                "company": "ASE | Medifé | Finochietto",
                "period": "Nov 2023 - Nov 2025",
                "tools": []
            },
            {
                "role": "Jefe de Talento",
                "company": "Grupo Gire",
                "period": "Oct 2021 - May 2023",
                "tools": []
            },
            {
                "role": "HRBP IT",
                "company": "Emergencias",
                "period": "Oct 2020 - May 2021",
                "tools": []
            },
            {
                "role": "HRBP IT y Líder de Desarrollo de Talento",
                "company": "Grupo Gire",
                "period": "Oct 2019 - Oct 2020",
                "tools": []
            },
            {
                "role": "IT Freelance Recruiter",
                "company": "Autónomo",
                "period": "Ene 2019 - Jun 2022",
                "tools": []
            }
        ]
    },
    "analytics": {
        "title": "People Analytics & HRIS",
        "desc": "Construcción de indicadores, tableros ejecutivos, limpieza y unificación de bases, criterios de lectura, reportería de gestión y soporte funcional en HRIS / HR Tech.",
        "metrics": [
            {
                "value": "10+ años",
                "label": "De experiencia",
                "detail": "Trabajando con indicadores, reportes y tableros de gestión."
            },
            {
                "value": "2+ años",
                "label": "De liderazgo",
                "detail": "Liderando formalmente People Analytics."
            },
            {
                "value": "3000+",
                "label": "Colaboradores",
                "detail": "Tablero unificado de People Analytics para Comité."
            },
            {
                "value": "100%",
                "label": "Control Presupuestario",
                "detail": "Automatización del proceso anual de gastos de personal."
            }
        ],
        "roles": [
            {
                "role": "Jefe de TA & People Analytics",
                "company": "ASE | Medifé | Finochietto",
                "period": "Nov 2023 - Nov 2025",
                "tools": []
            },
            {
                "role": "Jefe de Talento",
                "company": "Grupo Gire",
                "period": "Oct 2021 - May 2023",
                "tools": []
            },
            {
                "role": "Analista Ssr. de Procesos",
                "company": "Swiss Medical Group",
                "period": "Dic 2015 - May 2016",
                "tools": []
            }
        ]
    },
    "automatizacion": {
        "title": "Automatización & IA",
        "desc": "Diseño de soluciones funcionales y técnicas con automatización, IA generativa y herramientas low-code/no-code para ordenar información, mejorar trazabilidad y reducir tareas manuales.",
        "metrics": [
            {
                "value": "2+ años",
                "label": "De experiencia",
                "detail": "Aplicando automatización, IA generativa, low-code/no-code y herramientas digitales a procesos de gestión."
            },
            {
                "value": "80%",
                "label": "Screening con IA",
                "detail": "Filtro de candidatos por IA en ATS interno"
            },
            {
                "value": "-45%",
                "label": "Soporte de HR",
                "detail": "Bot de consultas RAG integrado en Teams"
            },
            {
                "value": "-10h",
                "label": "Semanales",
                "detail": "Ahorro de tiempo en administración mediante flujos n8n"
            }
        ],
        "roles": [
            {
                "role": "Consultor en Procesos, IA & Talento",
                "company": "Entropyx",
                "period": "May 2026 - Actualidad",
                "tools": []
            },
            {
                "role": "Líder de Atracción de Talento",
                "company": "Grupo Cober",
                "period": "Ene 2026 - May 2026",
                "tools": []
            }
        ]
    }
};

    // Experience Overlay Elements
    const experienceOverlay = document.getElementById("experience-overlay");
    const experienceTitle = document.getElementById("experience-title");
    const experienceDesc = document.getElementById("experience-desc");
    const experienceRolesList = document.getElementById("experience-roles-list");
    const experienceCloseBtn = document.getElementById("experience-close-btn");

    const experienceCards = document.querySelectorAll(".expertise-card");
    experienceCards.forEach(card => {
        card.addEventListener("click", () => {
            const expKey = card.getAttribute("data-experience");
            const expData = experienceData[expKey];
            if (!expData) return;

            // Set text contents
            if (experienceTitle) experienceTitle.textContent = expData.title;
            if (experienceDesc) experienceDesc.textContent = expData.desc;

            // Inject roles list
            if (experienceRolesList) {
                experienceRolesList.innerHTML = expData.roles.map(role => `
                    <div class="era-milestone-item" style="padding: 14px 20px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 15px; border: 1px solid var(--border-glass); border-radius: 12px; background: rgba(30, 41, 59, 0.2);">
                        <div class="milestone-title-area">
                            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${role.role}</h4>
                            <span class="milestone-company" style="font-size: 0.85rem; font-weight: 600; color: #60a5fa;">${role.company}</span>
                        </div>
                        <span class="milestone-period" style="font-size: 0.8rem; padding: 4px 10px; background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 20px; color: #60a5fa; white-space: nowrap;">${role.period}</span>
                    </div>
                `).join('');
            }

            // Show overlay
            if (experienceOverlay) {
                experienceOverlay.style.display = "flex";
                void experienceOverlay.offsetWidth;
                experienceOverlay.classList.add("active");
            }
            document.body.style.overflow = "hidden";
        });
    });

    const closeExperienceOverlay = () => {
        if (experienceOverlay) {
            experienceOverlay.classList.remove("active");
            setTimeout(() => {
                experienceOverlay.style.display = "none";
                if (!state.unlocked) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }
            }, 500);
        }
    };

    if (experienceCloseBtn) {
        experienceCloseBtn.addEventListener("click", closeExperienceOverlay);
    }
    if (experienceOverlay) {
        experienceOverlay.addEventListener("click", (e) => {
            if (e.target === experienceOverlay) {
                closeExperienceOverlay();
            }
        });
    }

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
                            <p>${item.institution}${item.status === 'En pausa' ? ' • <strong>En pausa</strong>' : ''}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    // ==================== 27 MOCK PROJECTS DATA ====================
    const projectsData = {
    "procesos": {
        "title": "Procesos y mejora continua",
        "desc": "Reingeniería operativa, mejora continua, Lean Six Sigma, rediseño de procesos, documentación funcional e implementación de nuevos modelos de trabajo.",
        "projects": [
            {
                "title": "Reingeniería logística / routeo",
                "company": "Coppel",
                "type": "Mejora continua · Procesos · Operaciones · Logística",
                "what": "Participé en un proyecto de mejora continua orientado a optimizar criterios de routeo, planificación logística y distribución.",
                "how": "Trabajé sobre el relevamiento del proceso operativo, análisis de variables de demanda, revisión de criterios de asignación de rutas y uso de programación lineal para acompañar decisiones de planificación.",
                "result": "El proyecto permitió fortalecer el modelo de planificación logística, ordenar criterios operativos y aportar una base más analítica para la asignación de recursos y recorridos.",
                "tools": [
                    "Lean Six Sigma",
                    "mejora continua",
                    "análisis de procesos",
                    "programación lineal",
                    "análisis operativo."
                ],
                "skills": [
                    "Reingeniería operativa",
                    "procesos",
                    "análisis de datos",
                    "eficiencia operativa",
                    "implementación."
                ],
                "summary": "Participé en un proyecto de mejora continua orientado a optimizar criterios de routeo, planificación logística y distribución."
            },
            {
                "title": "Dimensionamiento operativo en cajas y distribución",
                "company": "Coppel",
                "type": "Mejora continua · Procesos · Dimensionamiento operativo",
                "what": "Participé en proyectos de dimensionamiento operativo para mejorar la asignación de recursos en línea de cajas, atención y distribución.",
                "how": "Analicé demanda, flujos operativos, capacidad de atención y necesidades de recursos, utilizando criterios de teoría de colas, análisis de procesos e indicadores operativos.",
                "result": "El trabajo permitió generar criterios más objetivos para dimensionar recursos, mejorar la lectura de capacidad operativa y acompañar decisiones vinculadas a eficiencia y atención.",
                "tools": [
                    "Teoría de colas",
                    "mejora continua",
                    "análisis de procesos",
                    "dimensionamiento operativo",
                    "indicadores."
                ],
                "skills": [
                    "Análisis operativo",
                    "procesos",
                    "eficiencia",
                    "datos",
                    "mejora continua."
                ],
                "summary": "Participé en proyectos de dimensionamiento operativo para mejorar la asignación de recursos en línea de cajas, atención y distribución."
            },
            {
                "title": "Control transaccional",
                "company": "Grupo Gire",
                "type": "Procesos · Controles · Operación · Mejora continua",
                "what": "Participé en iniciativas de ordenamiento y mejora de procesos vinculados al control transaccional dentro de la operación de Rapipago.",
                "how": "Relevé circuitos operativos, documenté procesos, identifiqué responsables, puntos críticos, controles y necesidades de articulación entre negocio, operación, sistemas y áreas de soporte.",
                "result": "El trabajo aportó mayor claridad sobre circuitos operativos, responsabilidades, controles y puntos de seguimiento dentro de procesos transaccionales.",
                "tools": [
                    "Relevamiento",
                    "AS IS / TO BE",
                    "documentación funcional",
                    "análisis de procesos",
                    "controles operativos."
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "control operativo",
                    "documentación",
                    "coordinación transversal."
                ],
                "summary": "Participé en iniciativas de ordenamiento y mejora de procesos vinculados al control transaccional dentro de la operación de Rapipago."
            },
            {
                "title": "ABM de agentes",
                "company": "Grupo Gire",
                "type": "Procesos · Mejora operativa · Documentación funcional",
                "what": "Participé en la mejora del proceso de alta, baja y modificación de agentes.",
                "how": "Relevé el circuito operativo, documenté responsabilidades, puntos de control, áreas involucradas e interacciones necesarias para mejorar trazabilidad y ejecución.",
                "result": "El proyecto permitió ordenar el proceso, clarificar responsabilidades y mejorar la visibilidad de los pasos necesarios para gestionar altas, bajas y modificaciones de agentes.",
                "tools": [
                    "Relevamiento",
                    "documentación de procesos",
                    "AS IS / TO BE",
                    "mejora continua",
                    "controles."
                ],
                "skills": [
                    "Procesos",
                    "documentación",
                    "mejora operativa",
                    "trazabilidad",
                    "articulación entre áreas."
                ],
                "summary": "Participé en la mejora del proceso de alta, baja y modificación de agentes."
            },
            {
                "title": "Tercerización del SAC",
                "company": "Grupo Gire",
                "type": "Procesos · Operaciones · Gestión del cambio",
                "what": "Participé desde la mirada de procesos en el proyecto de tercerización del servicio de atención al cliente.",
                "how": "Relevé circuitos, documenté procesos, definí roles, responsabilidades, criterios operativos y necesidades de transferencia de conocimiento para acompañar la transición del servicio.",
                "result": "El proyecto permitió ordenar la transición operativa, facilitar la transferencia de conocimiento y dejar definidos procesos y responsabilidades para el nuevo esquema de atención.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "gestión del cambio",
                    "procesos operativos",
                    "transferencia de conocimiento."
                ],
                "skills": [
                    "Procesos",
                    "gestión del cambio",
                    "documentación",
                    "implementación operativa",
                    "coordinación."
                ],
                "summary": "Participé desde la mirada de procesos en el proyecto de tercerización del servicio de atención al cliente."
            },
            {
                "title": "Gobierno de procesos, políticas e iniciativas",
                "company": "Grupo Gire",
                "type": "Gobierno de procesos · Políticas · PMO · Mejora continua",
                "what": "Participé en la definición, documentación y ordenamiento de políticas y procesos transversales vinculados a iniciativas, proyectos, áreas de soporte y operación.",
                "how": "Trabajé con áreas como Desarrollo Humano, PMO, Sistemas y áreas operativas, relevando prácticas existentes, documentando criterios, circuitos, responsabilidades y necesidades de gobierno. Agrupar dentro del detalle estas categorías de políticas: Políticas de gestión de proyectos e iniciativas: * Gestión de iniciativas y anteproyectos. * Gestión de proyectos. * PMO. Políticas de Desarrollo Humano / RRHH: * Reclutamiento y selección. * Comunicación interna. * Formación interna. * Teletrabajo. Políticas operativas y de negocio: * Categorización de sucursales y agentes. * Administración de obras sociales.",
                "result": "El trabajo permitió estandarizar criterios, ordenar circuitos de trabajo, clarificar responsabilidades y fortalecer el gobierno de procesos e iniciativas transversales.",
                "tools": [
                    "Documentación de procesos",
                    "políticas",
                    "gobierno de iniciativas",
                    "mejora continua",
                    "PMO",
                    "gestión de stakeholders."
                ],
                "skills": [
                    "Gobierno de procesos",
                    "documentación",
                    "estandarización",
                    "mejora continua",
                    "articulación transversal."
                ],
                "summary": "Participé en la definición, documentación y ordenamiento de políticas y procesos transversales vinculados a iniciativas, proyectos, áreas de soporte y operación."
            },
            {
                "title": "Rediseño del modelo operativo de Atracción de Talento",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Procesos · Transformación de área · Gobierno de demanda",
                "what": "Lideré la evolución del modelo operativo de Empleos hacia una función integral de Atracción de Talento.",
                "how": "Ordené solicitudes, estados, prioridades, rutinas de seguimiento, indicadores, uso de ATS y articulación con HRBPs y líderes. También trabajé sobre gobierno de demanda, trazabilidad y mejora del vínculo con las áreas internas.",
                "result": "El área ganó mayor orden operativo, visibilidad de la demanda, trazabilidad del proceso y mejores condiciones para gestionar conversaciones con líderes y HRBPs.",
                "tools": [
                    "Rediseño de procesos",
                    "indicadores",
                    "tableros",
                    "gobierno de demanda",
                    "seguimiento operativo",
                    "ATS",
                    "gestión de stakeholders."
                ],
                "skills": [
                    "Transformación de procesos",
                    "liderazgo",
                    "priorización",
                    "operación de alta demanda",
                    "gestión con líderes."
                ],
                "summary": "Lideré la evolución del modelo operativo de Empleos hacia una función integral de Atracción de Talento."
            },
            {
                "title": "Transformación de Selección y gestión de demanda",
                "company": "Grupo Cober",
                "type": "Procesos · Talent Operations · Mejora continua · Datos",
                "what": "Lideré la transformación operativa del área de Selección de Grupo Cober, en una operación de alta demanda.",
                "how": "Ordené flujos de trabajo, prioridades, seguimiento de vacantes, tableros de gestión, criterios de demanda y uso de información para conversaciones con líderes.",
                "result": "El área llegó a gestionar aproximadamente 80 vacantes activas mensuales, 50 cierres mensuales promedio y un time to fill cercano a 30 días, con mayor visibilidad de la operación y mejores herramientas para la toma de decisiones.",
                "tools": [
                    "Gestión de procesos",
                    "tableros",
                    "indicadores",
                    "priorización",
                    "seguimiento operativo",
                    "IA generativa",
                    "automatización."
                ],
                "skills": [
                    "Procesos",
                    "liderazgo",
                    "datos",
                    "automatización",
                    "gestión de demanda",
                    "mejora continua. =================================================="
                ],
                "summary": "Lideré la transformación operativa del área de Selección de Grupo Cober, en una operación de alta demanda."
            }
        ]
    },
    "servicios": {
        "title": "Diseño de servicios",
        "desc": "Diseño de nuevos servicios y experiencias operativas, desde blueprints y flujos de usuario hasta requerimientos funcionales e implementación.",
        "projects": [
            {
                "title": "RapiEntrega / logística inversa",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Logística inversa · Implementación",
                "what": "Participé en el diseño e implementación de RapiEntrega / logística inversa dentro del ecosistema Rapipago.",
                "how": "Trabajé desde la idea y diseño del servicio hasta su implementación, coordinando relevamientos, service blueprint, experiencia de usuario, procesos operativos, requerimientos funcionales, documentación, capacitación y acompañamiento a áreas impactadas.",
                "result": "El proyecto permitió transformar una necesidad de negocio en un servicio operativo, con procesos, roles, requerimientos y criterios de implementación definidos.",
                "tools": [
                    "Service blueprint",
                    "AS IS / TO BE",
                    "documentación funcional",
                    "relevamiento",
                    "gestión del cambio",
                    "capacitación."
                ],
                "skills": [
                    "Diseño de servicios",
                    "procesos",
                    "análisis funcional",
                    "implementación",
                    "coordinación transversal."
                ],
                "summary": "Participé en el diseño e implementación de RapiEntrega / logística inversa dentro del ecosistema Rapipago."
            },
            {
                "title": "RapiTrámite",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación operativa",
                "what": "Participé en el diseño de procesos e implementación operativa de RapiTrámite.",
                "how": "Acompañé relevamientos, definición de circuitos operativos, documentación funcional, roles, controles, interacción con sistemas y áreas impactadas.",
                "result": "El proyecto permitió ordenar el circuito operativo del servicio, facilitar su implementación y alinear a las áreas involucradas sobre roles y responsabilidades.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "diseño de procesos",
                    "AS IS / TO BE",
                    "implementación."
                ],
                "skills": [
                    "Diseño de procesos",
                    "nuevos servicios",
                    "coordinación",
                    "documentación",
                    "gestión del cambio."
                ],
                "summary": "Participé en el diseño de procesos e implementación operativa de RapiTrámite."
            },
            {
                "title": "RapiPOS",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación",
                "what": "Participé en el diseño e implementación de procesos para RapiPOS.",
                "how": "Acompañé la definición de circuitos operativos, requerimientos funcionales, documentación, roles, controles y gestión del cambio para su implementación.",
                "result": "El proyecto permitió traducir una necesidad de negocio en procesos claros, criterios operativos y documentación funcional para facilitar la adopción del servicio.",
                "tools": [
                    "Diseño de procesos",
                    "relevamiento",
                    "documentación funcional",
                    "gestión del cambio",
                    "capacitación."
                ],
                "skills": [
                    "Procesos",
                    "implementación",
                    "análisis funcional",
                    "documentación",
                    "articulación entre áreas."
                ],
                "summary": "Participé en el diseño e implementación de procesos para RapiPOS."
            },
            {
                "title": "CashFlow",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Operación",
                "what": "Participé desde procesos en el diseño e implementación del proyecto CashFlow.",
                "how": "Acompañé relevamiento, diseño de circuitos operativos, documentación funcional, definición de roles, controles y articulación con áreas de negocio, sistemas y operación.",
                "result": "El proyecto permitió ordenar el flujo operativo del servicio, clarificar responsabilidades y facilitar la implementación con las áreas involucradas.",
                "tools": [
                    "Relevamiento",
                    "diseño de procesos",
                    "documentación funcional",
                    "AS IS / TO BE",
                    "gestión del cambio."
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "diseño operativo",
                    "documentación",
                    "implementación."
                ],
                "summary": "Participé desde procesos en el diseño e implementación del proyecto CashFlow."
            },
            {
                "title": "Cobranzas y extracciones con débito",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Sistemas · Operación",
                "what": "Participé en el diseño de procesos para cobranzas y extracciones con débito.",
                "how": "Acompañé la definición de circuitos operativos, requerimientos funcionales, documentación, controles y coordinación con áreas de negocio, operación y sistemas.",
                "result": "El trabajo permitió dejar definidos procesos, controles y responsabilidades para facilitar la implementación del servicio y su operación posterior.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "análisis de procesos",
                    "controles",
                    "implementación."
                ],
                "skills": [
                    "Diseño de procesos",
                    "análisis funcional",
                    "operación",
                    "sistemas",
                    "gestión del cambio."
                ],
                "summary": "Participé en el diseño de procesos para cobranzas y extracciones con débito."
            },
            {
                "title": "Prisma Convenios Efectivo",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación operativa",
                "what": "Participé desde procesos en el proyecto Prisma Convenios Efectivo.",
                "how": "Colaboré en relevamiento, documentación de circuitos, definición de responsabilidades, controles, requerimientos funcionales y acompañamiento a áreas impactadas.",
                "result": "El proyecto aportó claridad operativa, documentación funcional y alineamiento entre áreas para facilitar la implementación del servicio.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "procesos operativos",
                    "controles",
                    "implementación."
                ],
                "skills": [
                    "Procesos",
                    "documentación",
                    "análisis funcional",
                    "implementación",
                    "coordinación transversal."
                ],
                "summary": "Participé desde procesos en el proyecto Prisma Convenios Efectivo."
            },
            {
                "title": "Red solo Débito",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Operación",
                "what": "Participé en el diseño e implementación de procesos para el servicio Red solo Débito.",
                "how": "Acompañé relevamiento, diseño de circuitos, documentación funcional, definición de roles, controles e implementación junto a áreas de negocio, operación y sistemas.",
                "result": "El trabajo permitió ordenar el modelo operativo del servicio, documentar el circuito y facilitar la coordinación entre las áreas involucradas.",
                "tools": [
                    "Diseño de procesos",
                    "relevamiento",
                    "documentación funcional",
                    "controles",
                    "implementación."
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "coordinación",
                    "implementación",
                    "documentación."
                ],
                "summary": "Participé en el diseño e implementación de procesos para el servicio Red solo Débito."
            },
            {
                "title": "Smart Boxes",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Innovación operativa · Procesos",
                "what": "Participé en el piloto de Smart Boxes desde el rol de procesos.",
                "how": "Colaboré en el diseño de circuitos operativos, documentación, identificación de áreas impactadas, definición de roles, controles y criterios de implementación.",
                "result": "El proyecto permitió estructurar operativamente el piloto, clarificar flujos de trabajo y facilitar la coordinación de áreas para avanzar con la implementación.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "diseño de procesos",
                    "implementación",
                    "gestión del cambio."
                ],
                "skills": [
                    "Diseño de servicios",
                    "procesos",
                    "innovación operativa",
                    "implementación",
                    "articulación con stakeholders. =================================================="
                ],
                "summary": "Participé en el piloto de Smart Boxes desde el rol de procesos."
            }
        ]
    },
    "sistemas": {
        "title": "Implementación y adopción de sistemas",
        "desc": "Implementaciones funcionales, mejoras de sistemas, UAT, capacitación, documentación, soporte a usuarios y gestión del cambio en HRIS, ERP, CRM y ATS.",
        "projects": [
            {
                "title": "Evolutivo y escalamiento de Microsoft Dynamics CRM",
                "company": "Grupo Gire",
                "type": "CRM · Procesos · Análisis funcional · Implementación",
                "what": "Participé en la mejora y escalamiento de Microsoft Dynamics CRM hacia nuevos usuarios y procesos.",
                "how": "Realicé diagnóstico, entrevistas con usuarios clave, documentación AS IS / TO BE, diseño de procesos en Visio, definiciones funcionales con proveedor y Sistemas, seguimiento de implementación y capacitación a nuevos usuarios.",
                "result": "El proyecto permitió ampliar el uso del CRM, ordenar procesos asociados, mejorar la transferencia de conocimiento y facilitar la adopción por parte de nuevos usuarios.",
                "tools": [
                    "Microsoft Dynamics CRM",
                    "Visio",
                    "AS IS / TO BE",
                    "relevamiento funcional",
                    "documentación",
                    "capacitación",
                    "gestión del cambio."
                ],
                "skills": [
                    "Análisis funcional",
                    "procesos",
                    "CRM",
                    "implementación",
                    "capacitación",
                    "coordinación con Sistemas y proveedores."
                ],
                "summary": "Participé en la mejora y escalamiento de Microsoft Dynamics CRM hacia nuevos usuarios y procesos."
            },
            {
                "title": "Implementación SAP en administración, finanzas y recaudaciones",
                "company": "Grupo Gire",
                "type": "ERP · Procesos · Implementación funcional · Gestión del cambio",
                "what": "Participé desde procesos en la implementación de SAP en áreas de administración, finanzas y recaudaciones.",
                "how": "Acompañé relevamiento, documentación de procesos, articulación con áreas usuarias, soporte funcional y seguimiento de cambios operativos necesarios para la implementación.",
                "result": "El proyecto permitió acompañar la adopción de SAP desde la mirada de procesos, facilitando la conexión entre necesidades operativas, usuarios y sistema.",
                "tools": [
                    "SAP",
                    "relevamiento",
                    "documentación funcional",
                    "procesos administrativos",
                    "gestión del cambio."
                ],
                "skills": [
                    "Implementación funcional",
                    "procesos",
                    "ERP",
                    "usuarios",
                    "documentación",
                    "adopción."
                ],
                "summary": "Participé desde procesos en la implementación de SAP en áreas de administración, finanzas y recaudaciones."
            },
            {
                "title": "SuccessFactors / Meta4 / HR Tech",
                "company": "Grupo Gire · Swiss Medical Group · Emergencias",
                "type": "HR Tech · Implementación funcional · Adopción de sistemas",
                "what": "Participé en iniciativas de implementación, evolución funcional y adopción de sistemas de RRHH.",
                "how": "Relevé necesidades, conecté procesos de RRHH con usuarios internos, participé en testing/UAT, soporte funcional, capacitación, documentación, adopción y seguimiento de mejoras.",
                "result": "Estas iniciativas permitieron mejorar la adopción de sistemas de RRHH, ordenar procesos asociados y acompañar a usuarios en el uso de herramientas tecnológicas de gestión.",
                "tools": [
                    "SuccessFactors",
                    "Meta4",
                    "HRIS",
                    "UAT/testing",
                    "capacitación a usuarios",
                    "documentación funcional",
                    "soporte funcional."
                ],
                "skills": [
                    "HR Tech",
                    "implementación funcional",
                    "adopción",
                    "gestión del cambio",
                    "procesos de RRHH",
                    "usuarios."
                ],
                "summary": "Participé en iniciativas de implementación, evolución funcional y adopción de sistemas de RRHH."
            },
            {
                "title": "Proceso de aprobación de vacantes en Oracle HCM",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Oracle HCM · Procesos · Gobierno de demanda · Implementación funcional",
                "what": "Diseñé e implementé el proceso formal de aprobación de vacantes en Oracle HCM.",
                "how": "Definí el flujo de aprobación, responsables, estados, criterios de validación y seguimiento. Alineé el proceso con Dirección, HRBPs y líderes, participé en la configuración funcional, testing, puesta en marcha, capacitación y seguimiento operativo.",
                "result": "El proyecto permitió formalizar el pedido y aprobación de vacantes, mejorar trazabilidad, ordenar responsabilidades y fortalecer el control de demanda.",
                "tools": [
                    "Oracle HCM",
                    "flujo de aprobación",
                    "testing/UAT",
                    "capacitación",
                    "procesos",
                    "gobierno de demanda."
                ],
                "skills": [
                    "Procesos",
                    "HR Tech",
                    "implementación funcional",
                    "adopción",
                    "gestión con líderes",
                    "control de demanda."
                ],
                "summary": "Diseñé e implementé el proceso formal de aprobación de vacantes en Oracle HCM."
            },
            {
                "title": "Adopción y mejora funcional de HiringRoom ATS",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "ATS · Talent Operations · Adopción de sistemas · Procesos",
                "what": "Impulsé la adopción y mejora funcional de HiringRoom como ATS para aumentar trazabilidad y seguimiento del proceso de selección.",
                "how": "Revisé el uso del sistema, entrené al equipo, incorporé el ATS en rutinas de gestión, conecté el uso de la herramienta con indicadores y promoví criterios de registro y seguimiento.",
                "result": "El proceso de selección ganó mayor trazabilidad, mejor registro de información, mayor orden operativo y mejores insumos para seguimiento e indicadores.",
                "tools": [
                    "HiringRoom",
                    "ATS",
                    "seguimiento operativo",
                    "capacitación",
                    "indicadores",
                    "mejora de procesos."
                ],
                "skills": [
                    "HR Tech",
                    "ATS",
                    "adopción",
                    "indicadores",
                    "liderazgo de equipo",
                    "mejora continua."
                ],
                "summary": "Impulsé la adopción y mejora funcional de HiringRoom como ATS para aumentar trazabilidad y seguimiento del proceso de selección."
            },
            {
                "title": "Módulo de capacitación en Oracle HCM",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "HR Tech · Learning · Implementación funcional · Adopción",
                "what": "Participé en la migración e implementación de la gestión de capacitaciones en Oracle HCM.",
                "how": "Acompañé la migración desde Moodle, la implementación funcional, entrenamiento de usuarios, documentación, soporte funcional y adopción del módulo.",
                "result": "El proyecto permitió integrar la gestión de capacitaciones dentro del ecosistema Oracle HCM, mejorando orden, trazabilidad y administración de actividades de aprendizaje.",
                "tools": [
                    "Oracle HCM",
                    "Moodle",
                    "capacitación a usuarios",
                    "documentación",
                    "soporte funcional",
                    "gestión del cambio."
                ],
                "skills": [
                    "HR Tech",
                    "Learning",
                    "implementación funcional",
                    "adopción de sistemas",
                    "capacitación. =================================================="
                ],
                "summary": "Participé en la migración e implementación de la gestión de capacitaciones en Oracle HCM."
            }
        ]
    },
    "talento": {
        "title": "Atracción de Talento y Marca Empleadora",
        "desc": "Procesos de selección end-to-end, operaciones de alta demanda, perfiles críticos, experiencia de candidatos, marca empleadora, ATS, indicadores y mejora de procesos.",
        "projects": [
            {
                "title": "Profesionalización de Atracción de Talento en operación de alta demanda",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Talent Acquisition · Procesos · Liderazgo · Datos",
                "what": "Lideré la profesionalización de Atracción de Talento en una operación de alta demanda.",
                "how": "Rediseñé el modelo operativo, ordené demanda, prioridades, indicadores, tableros, uso de ATS, rutinas de seguimiento y vínculo con líderes y HRBPs.",
                "result": "El área ganó mayor visibilidad, trazabilidad y capacidad de gestión sobre vacantes, cierres, prioridades y conversaciones con negocio.",
                "tools": [
                    "Talent Acquisition",
                    "ATS",
                    "indicadores",
                    "tableros",
                    "gobierno de demanda",
                    "priorización",
                    "seguimiento operativo."
                ],
                "skills": [
                    "Liderazgo",
                    "selección",
                    "procesos",
                    "datos",
                    "mejora continua",
                    "gestión con negocio."
                ],
                "summary": "Lideré la profesionalización de Atracción de Talento en una operación de alta demanda."
            },
            {
                "title": "Transformación de Selección, tableros e IA",
                "company": "Grupo Cober",
                "type": "Talent Operations · Procesos · Datos · IA",
                "what": "Lideré el ordenamiento de una operación de selección de alta demanda mediante procesos, tableros e IA aplicada.",
                "how": "Implementé tableros de seguimiento, criterios de priorización, mejora de flujos, automatización e IA generativa para ordenar información, reducir dispersión y mejorar conversaciones de gestión con líderes.",
                "result": "La operación alcanzó aproximadamente 80 vacantes activas mensuales, 50 cierres mensuales promedio y time to fill cercano a 30 días, con mayor visibilidad del proceso y seguimiento de demanda.",
                "tools": [
                    "Tableros",
                    "IA generativa",
                    "automatización",
                    "seguimiento operativo",
                    "gestión de demanda",
                    "indicadores."
                ],
                "skills": [
                    "Liderazgo",
                    "Talent Operations",
                    "procesos",
                    "datos",
                    "IA",
                    "mejora continua."
                ],
                "summary": "Lideré el ordenamiento de una operación de selección de alta demanda mediante procesos, tableros e IA aplicada."
            },
            {
                "title": "Atracción y desarrollo de talento IT / digital",
                "company": "Grupo Gire",
                "type": "Talent Acquisition · IT Talent · Marca empleadora · Desarrollo",
                "what": "Lideré iniciativas de talento para áreas IT y digitales, integrando atracción, selección, desarrollo, indicadores y marca empleadora.",
                "how": "Trabajé con líderes técnicos, relevé necesidades, acompañé búsquedas de perfiles IT/digitales, fortalecí pipeline, iniciativas de marca empleadora y acciones de desarrollo de talento interno.",
                "result": "El trabajo permitió fortalecer la respuesta de talento para áreas tecnológicas, conectar atracción con desarrollo y acompañar necesidades críticas del negocio digital.",
                "tools": [
                    "Recruiting IT",
                    "marca empleadora",
                    "indicadores",
                    "reskilling",
                    "upskilling",
                    "seguimiento de pipeline."
                ],
                "skills": [
                    "Talent Acquisition",
                    "perfiles IT",
                    "desarrollo de talento",
                    "indicadores",
                    "gestión con líderes técnicos."
                ],
                "summary": "Lideré iniciativas de talento para áreas IT y digitales, integrando atracción, selección, desarrollo, indicadores y marca empleadora."
            },
            {
                "title": "Optimización de proveedores de selección",
                "company": "Grupo Cober",
                "type": "Talent Operations · Proveedores · Mejora de procesos",
                "what": "Relevé y analicé proveedores de selección para mejorar cobertura, especialización y condiciones de servicio.",
                "how": "Elaboré criterios comparativos vinculados a costo, calidad, velocidad, especialidad, geografía y tecnología. Analicé alternativas y propuse cambios para búsquedas estratégicas o gerenciales.",
                "result": "El proyecto permitió ordenar la gestión de proveedores, mejorar criterios de selección de partners y ampliar opciones para búsquedas críticas.",
                "tools": [
                    "Matriz comparativa",
                    "análisis de proveedores",
                    "criterios de evaluación",
                    "negociación",
                    "gestión de stakeholders."
                ],
                "skills": [
                    "Gestión de proveedores",
                    "análisis",
                    "mejora de procesos",
                    "negociación",
                    "Talent Operations. =================================================="
                ],
                "summary": "Relevé y analicé proveedores de selección para mejorar cobertura, especialización y condiciones de servicio."
            }
        ]
    },
    "cultura": {
        "title": "Transformación cultural",
        "desc": "Programas de transformación, gestión del cambio, liderazgo, agilidad, OKRs, desarrollo de capacidades y acompañamiento a líderes y equipos.",
        "projects": [
            {
                "title": "Programa ERA de transformación cultural",
                "company": "Grupo Gire",
                "type": "Transformación cultural · Cambio organizacional · Talento",
                "what": "Participé en un programa de transformación cultural orientado a liderazgo, capacidades, talento y nuevas formas de trabajo.",
                "how": "Acompañé mapeo de líderes, identificación de capacidades, iniciativas de aprendizaje, desarrollo de talento y acciones asociadas al proceso de cambio cultural.",
                "result": "El programa permitió acompañar la evolución cultural de la organización, fortalecer conversaciones sobre talento y capacidades, y apoyar la adopción de nuevas formas de trabajo.",
                "tools": [
                    "Gestión del cambio",
                    "liderazgo",
                    "mapeo de talento",
                    "capacidades",
                    "agilidad",
                    "aprendizaje."
                ],
                "skills": [
                    "Transformación cultural",
                    "talento",
                    "liderazgo",
                    "cambio",
                    "desarrollo organizacional."
                ],
                "summary": "Participé en un programa de transformación cultural orientado a liderazgo, capacidades, talento y nuevas formas de trabajo."
            },
            {
                "title": "Acompañamiento a estructuras ágiles en IT",
                "company": "Grupo Gire · Emergencias",
                "type": "Agilidad · Cambio organizacional · HRBP IT · Talento",
                "what": "Acompañé a áreas IT en procesos de cambio hacia estructuras ágiles y nuevos modelos de trabajo.",
                "how": "Participé en conversaciones sobre estructura, células ágiles, capacidades necesarias, identificación de talento interno y externo, acompañamiento al cambio y soporte a líderes y equipos.",
                "result": "El trabajo permitió acompañar la transición hacia nuevos modelos de trabajo, clarificar capacidades necesarias y conectar necesidades organizacionales con talento y gestión del cambio.",
                "tools": [
                    "Agilidad",
                    "estructuras ágiles",
                    "HRBP IT",
                    "coaching",
                    "gestión del cambio",
                    "mapeo de capacidades."
                ],
                "skills": [
                    "Cambio organizacional",
                    "agilidad",
                    "liderazgo",
                    "talento IT",
                    "acompañamiento a líderes."
                ],
                "summary": "Acompañé a áreas IT en procesos de cambio hacia estructuras ágiles y nuevos modelos de trabajo."
            },
            {
                "title": "Liderazgo, OKRs y desarrollo de capacidades para la transformación",
                "company": "Grupo Gire",
                "type": "Liderazgo · OKRs · Desarrollo · Transformación",
                "what": "Participé en iniciativas vinculadas a liderazgo, OKRs, desempeño y desarrollo de capacidades para sostener procesos de transformación.",
                "how": "Acompañé a líderes y equipos en la adopción de prácticas de gestión, conversaciones de desarrollo, seguimiento de objetivos y conexión entre desempeño, capacidades y transformación.",
                "result": "El trabajo permitió fortalecer prácticas de liderazgo, gestión por objetivos y desarrollo de capacidades necesarias para acompañar procesos de cambio organizacional.",
                "tools": [
                    "OKRs",
                    "liderazgo",
                    "desempeño",
                    "aprendizaje",
                    "gestión del cambio",
                    "acompañamiento a líderes."
                ],
                "skills": [
                    "Liderazgo",
                    "desarrollo organizacional",
                    "transformación",
                    "gestión de objetivos",
                    "adopción de prácticas. =================================================="
                ],
                "summary": "Participé en iniciativas vinculadas a liderazgo, OKRs, desempeño y desarrollo de capacidades para sostener procesos de transformación."
            }
        ]
    },
    "aprendizaje": {
        "title": "Aprendizaje y Desarrollo",
        "desc": "Programas de aprendizaje, onboarding, liderazgo, formador de formadores, desempeño, potencial, talent review, reskilling, upskilling y rutas de desarrollo.",
        "projects": [
            {
                "title": "Talent Review, potencial y Nine Box",
                "company": "Grupo Gire · ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Talent Management · Desarrollo · Potencial · Liderazgo",
                "what": "Participé y lideré procesos de mapeo de talento, evaluación de potencial, Talent Review y Nine Box.",
                "how": "Trabajé con definiciones metodológicas, acompañamiento a líderes y HRBPs, calibración de talento, lectura de desempeño y potencial, identificación de decisiones de desarrollo y seguimiento.",
                "result": "El proceso permitió ordenar conversaciones de talento, identificar perfiles con potencial, mapear necesidades de desarrollo y fortalecer decisiones sobre sucesión y crecimiento interno.",
                "tools": [
                    "Talent Review",
                    "Nine Box",
                    "potencial",
                    "desempeño",
                    "calibración",
                    "planes de desarrollo."
                ],
                "skills": [
                    "Talent Management",
                    "liderazgo",
                    "facilitación",
                    "desarrollo",
                    "análisis de talento."
                ],
                "summary": "Participé y lideré procesos de mapeo de talento, evaluación de potencial, Talent Review y Nine Box."
            },
            {
                "title": "Make IT Talent y DevForce",
                "company": "Grupo Gire",
                "type": "Reskilling · Upskilling · Talento IT · Aprendizaje",
                "what": "Participé en iniciativas orientadas al desarrollo de capacidades tecnológicas internas y formación de talento IT.",
                "how": "Conecté necesidades de talento IT con programas de aprendizaje, desarrollo, reskilling/upskilling, marca empleadora e indicadores de seguimiento.",
                "result": "Las iniciativas permitieron fortalecer capacidades técnicas internas, apoyar la movilidad y desarrollo de talento, y acompañar necesidades de áreas digitales.",
                "tools": [
                    "Reskilling",
                    "upskilling",
                    "rutas de aprendizaje",
                    "talento IT",
                    "indicadores",
                    "desarrollo de capacidades."
                ],
                "skills": [
                    "Aprendizaje",
                    "desarrollo",
                    "talento IT",
                    "transformación",
                    "gestión de programas."
                ],
                "summary": "Participé en iniciativas orientadas al desarrollo de capacidades tecnológicas internas y formación de talento IT."
            },
            {
                "title": "Onboarding, desempeño y prácticas de People",
                "company": "ICAP Global",
                "type": "People · Desempeño · Onboarding · Profesionalización",
                "what": "Como Head of People, lideré el ordenamiento de procesos de People en una estructura global en crecimiento.",
                "how": "Trabajé sobre onboarding, desempeño, desarrollo, comunicaciones internas, compensaciones básicas y acompañamiento a líderes, con foco en profesionalizar prácticas internas.",
                "result": "El trabajo permitió dar mayor consistencia a procesos de People, ordenar prácticas de gestión y acompañar el crecimiento organizacional con mayor estructura.",
                "tools": [
                    "Onboarding",
                    "desempeño",
                    "comunicaciones internas",
                    "acompañamiento a líderes",
                    "procesos de People."
                ],
                "skills": [
                    "People Management",
                    "liderazgo",
                    "procesos",
                    "desempeño",
                    "onboarding",
                    "gestión con dirección."
                ],
                "summary": "Como Head of People, lideré el ordenamiento de procesos de People en una estructura global en crecimiento."
            },
            {
                "title": "Outplacement y empleabilidad en proceso de transición organizacional",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Aprendizaje · Empleabilidad · Transición organizacional",
                "what": "Lideré un proceso de outplacement y empleabilidad para una unidad de negocio en transición organizacional.",
                "how": "Diseñé el proceso, coordiné talleres, acompañé en CV, LinkedIn, entrevistas y feedback, articulé con equipo interno y luego con proveedor externo por volumen.",
                "result": "El proyecto permitió brindar acompañamiento estructurado a personas en proceso de transición, ordenar acciones de empleabilidad y sostener una respuesta institucional frente a una situación sensible.",
                "tools": [
                    "Outplacement",
                    "empleabilidad",
                    "talleres",
                    "CV",
                    "LinkedIn",
                    "entrevistas",
                    "gestión de proveedores",
                    "seguimiento."
                ],
                "skills": [
                    "Aprendizaje",
                    "empleabilidad",
                    "gestión del cambio",
                    "coordinación",
                    "acompañamiento de personas."
                ],
                "summary": "Lideré un proceso de outplacement y empleabilidad para una unidad de negocio en transición organizacional."
            },
            {
                "title": "Formador de Formadores",
                "company": "Grupo Gire",
                "type": "Aprendizaje · Desarrollo · Capacitación interna",
                "what": "Participé en iniciativas de formación para fortalecer capacidades internas de facilitación y transferencia de conocimiento.",
                "how": "Acompañé acciones orientadas a preparar referentes internos para facilitar contenidos, transferir conocimiento y acompañar la adopción de prácticas dentro de la organización.",
                "result": "El proyecto permitió fortalecer capacidades internas de formación, mejorar la transferencia de conocimiento y apoyar la adopción de prácticas organizacionales.",
                "tools": [
                    "Train the trainer",
                    "aprendizaje",
                    "facilitación",
                    "capacitación interna",
                    "desarrollo de capacidades."
                ],
                "skills": [
                    "Learning & Development",
                    "facilitación",
                    "capacitación",
                    "desarrollo interno",
                    "adopción."
                ],
                "summary": "Participé en iniciativas de formación para fortalecer capacidades internas de facilitación y transferencia de conocimiento."
            },
            {
                "title": "Puestos críticos y sucesión",
                "company": "Grupo Gire",
                "type": "Talent Management · Sucesión · Desarrollo organizacional",
                "what": "Lideré iniciativas vinculadas a identificación de puestos críticos, riesgo de cobertura y planificación de sucesión.",
                "how": "Trabajé con matriz de criticidad, riesgo de vacancia, identificación de posibles sucesores, planes de desarrollo y conversaciones con líderes.",
                "result": "El proyecto permitió ordenar información sobre posiciones críticas, visibilizar riesgos de cobertura y acompañar decisiones de desarrollo y sucesión.",
                "tools": [
                    "Matriz de criticidad",
                    "sucesión",
                    "puestos críticos",
                    "planes de desarrollo",
                    "Talent Review."
                ],
                "skills": [
                    "Talent Management",
                    "sucesión",
                    "liderazgo",
                    "desarrollo",
                    "planificación de capacidades. =================================================="
                ],
                "summary": "Lideré iniciativas vinculadas a identificación de puestos críticos, riesgo de cobertura y planificación de sucesión."
            }
        ]
    },
    "compensaciones": {
        "title": "Compensaciones",
        "desc": "Participación en benchmarks, análisis de bandas salariales y propuestas de compensación para perfiles críticos, IT y posiciones de liderazgo.",
        "projects": [
            {
                "title": "Análisis de bandas y benchmarks para perfiles IT y liderazgo",
                "company": "Grupo Gire · Emergencias · ICAP Global · ASE Obra Social · Medifé · Sanatorio Finochietto · Grupo Cober",
                "type": "Compensaciones · Benchmark · Estructura · Talento",
                "what": "Participé en iniciativas de análisis salarial, benchmarks y criterios de compensación para perfiles IT, críticos y posiciones de liderazgo.",
                "how": "Aporté información de mercado desde búsquedas, necesidades de cobertura, criticidad de perfiles, lectura de negocio y articulación con referentes de compensaciones, payroll o dirección según el contexto.",
                "result": "El trabajo permitió aportar información para decisiones de compensación, análisis de competitividad y conversaciones sobre atracción, retención y cobertura de perfiles críticos.",
                "tools": [
                    "Benchmark salarial",
                    "análisis de bandas",
                    "estructura",
                    "perfiles críticos",
                    "información de mercado",
                    "articulación con áreas especializadas."
                ],
                "skills": [
                    "Compensaciones",
                    "análisis",
                    "talento",
                    "negocio",
                    "perfiles críticos",
                    "toma de decisiones. =================================================="
                ],
                "summary": "Participé en iniciativas de análisis salarial, benchmarks y criterios de compensación para perfiles IT, críticos y posiciones de liderazgo."
            }
        ]
    },
    "analytics": {
        "title": "People Analytics",
        "desc": "Construcción de indicadores, tableros ejecutivos, reportería, limpieza de bases, criterios de lectura, presupuesto, control de gestión y soporte a decisiones.",
        "projects": [
            {
                "title": "Startup del área de People Analytics",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "People Analytics · Datos · Gobierno de información · Transformación HR",
                "what": "Impulsé la puesta en marcha del área de People Analytics para la Dirección de Personas.",
                "how": "Definí criterios de análisis, reportería, KPIs, tableros ejecutivos, fuentes de información, responsables, calidad de datos y rutinas de seguimiento.",
                "result": "El proyecto permitió instalar una lógica de gestión más basada en datos dentro de la Dirección de Personas, con mayor orden, visibilidad y soporte para decisiones.",
                "tools": [
                    "People Analytics",
                    "KPIs",
                    "tableros",
                    "Power BI",
                    "Excel",
                    "calidad de datos",
                    "reportería ejecutiva."
                ],
                "skills": [
                    "Analytics",
                    "datos",
                    "liderazgo",
                    "transformación HR",
                    "reporting",
                    "gobierno de información."
                ],
                "summary": "Impulsé la puesta en marcha del área de People Analytics para la Dirección de Personas."
            },
            {
                "title": "Tablero integral de indicadores de RRHH",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "People Analytics · BI · Reporting ejecutivo · Control de gestión",
                "what": "Construí tableros e indicadores integrales de RRHH para seguimiento ejecutivo.",
                "how": "Trabajé sobre limpieza y unificación de bases, definición de fuentes, responsables, criterios de lectura y reportería ejecutiva.",
                "result": "El proyecto permitió mejorar la visibilidad de indicadores clave como dotación, rotación, ausentismo, vacantes, cobertura, tiempos de proceso, desempeño, capacitación y presupuesto.",
                "tools": [
                    "Power BI",
                    "Excel",
                    "KPIs",
                    "limpieza de datos",
                    "reporting",
                    "criterios de lectura",
                    "tableros ejecutivos."
                ],
                "skills": [
                    "People Analytics",
                    "BI",
                    "datos",
                    "reporting",
                    "control de gestión",
                    "soporte a decisiones."
                ],
                "summary": "Construí tableros e indicadores integrales de RRHH para seguimiento ejecutivo."
            },
            {
                "title": "Presupuesto integral de RRHH y control de gestión",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Presupuesto · Control de gestión · People Analytics · Reporting",
                "what": "Coordiné el presupuesto integral de RRHH y el seguimiento de información para control de gestión.",
                "how": "Consolidé información de distintas áreas, acompañé validaciones, seguimiento presupuestario, reportería y articulación con referentes internos.",
                "result": "El trabajo permitió ordenar información presupuestaria, mejorar visibilidad de gestión y aportar información para planificación y toma de decisiones.",
                "tools": [
                    "Presupuesto",
                    "Excel",
                    "control de gestión",
                    "reportería",
                    "consolidación de información",
                    "seguimiento."
                ],
                "skills": [
                    "Control de gestión",
                    "presupuesto",
                    "datos",
                    "coordinación",
                    "reporting ejecutivo."
                ],
                "summary": "Coordiné el presupuesto integral de RRHH y el seguimiento de información para control de gestión."
            },
            {
                "title": "Tableros de gestión de selección",
                "company": "Grupo Cober",
                "type": "Talent Analytics · Dashboards · Seguimiento operativo",
                "what": "Implementé tableros de gestión end-to-end para el área de Selección.",
                "how": "Definí indicadores, seleccioné herramienta, diseñé la solución, realicé testing, puse en marcha el tablero y capacité a usuarios.",
                "result": "Los tableros facilitaron seguimiento de demanda, prioridades, carga del equipo, aging de vacantes y conversaciones de gestión con líderes.",
                "tools": [
                    "Dashboards",
                    "indicadores",
                    "selección",
                    "seguimiento operativo",
                    "testing",
                    "capacitación",
                    "IA/automatización."
                ],
                "skills": [
                    "People Analytics",
                    "Talent Operations",
                    "indicadores",
                    "procesos",
                    "capacitación",
                    "adopción."
                ],
                "summary": "Implementé tableros de gestión end-to-end para el área de Selección."
            },
            {
                "title": "Indicadores de aprendizaje",
                "company": "Tarjeta Naranja",
                "type": "Learning Analytics · Indicadores · Capacitación",
                "what": "Acompañé la construcción y seguimiento de indicadores de aprendizaje y capacitación.",
                "how": "Trabajé con planes anuales de formación, contenidos, proveedores, reportes e indicadores como finalización, tiempos de completitud y satisfacción.",
                "result": "El trabajo permitió conectar actividades de capacitación con información de seguimiento, medición y necesidades del negocio.",
                "tools": [
                    "Indicadores de aprendizaje",
                    "reportes",
                    "capacitación",
                    "proveedores",
                    "seguimiento."
                ],
                "skills": [
                    "Learning Analytics",
                    "capacitación",
                    "indicadores",
                    "reporting",
                    "gestión de formación."
                ],
                "summary": "Acompañé la construcción y seguimiento de indicadores de aprendizaje y capacitación."
            },
            {
                "title": "Control de headcount y estructura",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto · Grupo Cober",
                "type": "People Analytics · Headcount · Control de gestión · Estructura",
                "what": "Participé en iniciativas vinculadas al control de headcount, seguimiento de dotación, estructura y demanda de cobertura.",
                "how": "Conecté información de dotación, presupuesto, aprobación de vacantes, estructura e indicadores para mejorar conversaciones con líderes y seguimiento de evolución organizacional.",
                "result": "El trabajo permitió mejorar la visibilidad de estructura, dotación y demanda, aportando información para decisiones de cobertura y planificación.",
                "tools": [
                    "Headcount",
                    "dotación",
                    "estructura",
                    "indicadores",
                    "control de gestión",
                    "presupuesto",
                    "reportería."
                ],
                "skills": [
                    "People Analytics",
                    "control de gestión",
                    "estructura",
                    "datos",
                    "soporte a decisiones. =================================================="
                ],
                "summary": "Participé en iniciativas vinculadas al control de headcount, seguimiento de dotación, estructura y demanda de cobertura."
            }
        ]
    },
    "automatizacion": {
        "title": "Automatización & IA",
        "desc": "Soluciones con IA generativa, automatización, low-code/no-code y herramientas digitales para ordenar información, mejorar trazabilidad y reducir tareas manuales.",
        "projects": [
            {
                "title": "Solución web con automatizaciones e IA para gestión de selección",
                "company": "Grupo Cober",
                "type": "Automatización · IA · Talent Operations · Dashboards",
                "what": "Desarrollé una solución web con automatizaciones e IA para ordenar información del proceso de selección.",
                "how": "Diseñé una herramienta para centralizar datos, mejorar trazabilidad, facilitar seguimiento operativo y ejecutivo, y reducir dispersión en una operación de alta demanda.",
                "result": "La solución permitió mejorar el orden de información, la trazabilidad del proceso, el seguimiento de vacantes y la visibilidad de la operación de selección.",
                "tools": [
                    "IA generativa",
                    "automatización",
                    "solución web",
                    "tableros",
                    "datos",
                    "seguimiento operativo."
                ],
                "skills": [
                    "Automatización",
                    "IA",
                    "procesos",
                    "datos",
                    "Talent Operations",
                    "diseño funcional."
                ],
                "summary": "Desarrollé una solución web con automatizaciones e IA para ordenar información del proceso de selección."
            },
            {
                "title": "IA aplicada a preselección y screening",
                "company": "Grupo Cober",
                "type": "IA generativa · Recruiting · Screening · Automatización",
                "what": "Implementé un piloto de IA aplicada a preselección y screening.",
                "how": "Utilicé GPTs personalizados, prompts, repositorios de CVs y criterios parametrizados para asistir el análisis inicial de candidatos.",
                "result": "El piloto permitió acelerar tareas operativas, mejorar consistencia de criterios y apoyar al equipo de selección en el análisis inicial de perfiles.",
                "tools": [
                    "ChatGPT",
                    "Claude",
                    "GPTs personalizados",
                    "prompts",
                    "Google Sheets",
                    "IA generativa",
                    "screening."
                ],
                "skills": [
                    "IA aplicada",
                    "recruiting",
                    "automatización",
                    "procesos",
                    "capacitación al equipo",
                    "mejora operativa."
                ],
                "summary": "Implementé un piloto de IA aplicada a preselección y screening."
            },
            {
                "title": "ATS propio con automatizaciones e IA",
                "company": "Entropyx",
                "type": "Automatización · IA · ATS · Procesos",
                "what": "Diseñé un ATS propio como herramienta inicial para gestionar oportunidades, candidatos y seguimiento.",
                "how": "Integré lógica de procesos, automatización, trazabilidad, indicadores e IA aplicada a flujos de gestión, usando herramientas low-code/no-code.",
                "result": "El proyecto permitió contar con una herramienta operativa propia para ordenar información, dar seguimiento a procesos y reducir dependencia de herramientas externas en una etapa inicial.",
                "tools": [
                    "ATS",
                    "automatización",
                    "IA generativa",
                    "Airtable",
                    "herramientas low-code/no-code",
                    "diseño funcional"
                ],
                "skills": [
                    "Automatización",
                    "IA",
                    "procesos",
                    "datos",
                    "Talent Operations",
                    "diseño funcional"
                ],
                "summary": "Diseñé un ATS propio como herramienta inicial para gestionar oportunidades, candidatos y seguimiento."
            }
        ]
    }
};

    // Variable to track active category for project details
    let currentCategoryKey = "";

    // Category Card Click Handler to open dynamic fluid overlays
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const catKey = card.getAttribute("data-category");
            const catData = projectsData[catKey];
            if (!catData) return;

            currentCategoryKey = catKey;

            // Set overlay text content
            if (overlayTitle) overlayTitle.textContent = catData.title;
            if (overlayDesc) overlayDesc.textContent = catData.desc;

            // Inject project cards
            if (overlayProjectsList) {
                overlayProjectsList.innerHTML = catData.projects.map((proj, index) => `
                    <div class="overlay-project-card" data-project-index="${index}" style="cursor: pointer;">
                        <h4>${proj.title}</h4>
                        <div class="project-card-meta-inline" style="margin: 0.5rem 0; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 15px;">
                            <span><i class="fa-solid fa-building" style="color: var(--text-glow); margin-right: 5px;"></i>${proj.company}</span>
                            <span><i class="fa-solid fa-tags" style="color: var(--text-glow); margin-right: 5px;"></i>${proj.type}</span>
                        </div>
                        <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main); margin-bottom: 1rem;">${proj.summary}</p>
                        <div class="cat-card-action" style="font-size: 0.85rem; font-weight: 600; color: #60a5fa; display: flex; align-items: center; gap: 5px;">Ver detalle del proyecto <i class="fa-solid fa-arrow-right"></i></div>
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

    // Project Detail Overlay Elements
    const projectDetailOverlay = document.getElementById("project-detail-overlay");
    const projectDetailTitle = document.getElementById("project-detail-title");
    const projectDetailCompany = document.getElementById("project-detail-company");
    const projectDetailType = document.getElementById("project-detail-type");
    const projectDetailSummary = document.getElementById("project-detail-summary");
    const projectDetailDesc = document.getElementById("project-detail-desc");
    const projectDetailTools = document.getElementById("project-detail-tools");
    const projectDetailSkills = document.getElementById("project-detail-skills");
    const projectDetailCloseBtn = document.getElementById("project-detail-close-btn");

    // Delegate project card click inside overlay list
    if (overlayProjectsList) {
        overlayProjectsList.addEventListener("click", (e) => {
            const card = e.target.closest(".overlay-project-card");
            if (!card) return;

            const index = parseInt(card.getAttribute("data-project-index"));
            const catData = projectsData[currentCategoryKey];
            if (!catData) return;

            const proj = catData.projects[index];
            if (!proj) return;

            // Fill project detail elements
            if (projectDetailTitle) projectDetailTitle.textContent = proj.title;
            if (projectDetailCompany) projectDetailCompany.textContent = proj.company;
            if (projectDetailType) projectDetailType.textContent = proj.type;
            if (projectDetailSummary) projectDetailSummary.textContent = proj.summary;
            
            // Build structured HTML description addressing the three key questions
            const detailHtml = `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1.05rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.4rem; font-family: var(--font-title);">¿Qué hice?</h4>
                    <p style="color: var(--text-muted); line-height: 1.7; margin: 0; font-size: 0.95rem;">${proj.what}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1.05rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.4rem; font-family: var(--font-title);">¿Cómo lo hice?</h4>
                    <p style="color: var(--text-muted); line-height: 1.7; margin: 0; font-size: 0.95rem;">${proj.how}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1.05rem; font-weight: 700; color: #a78bfa; margin-bottom: 0.4rem; font-family: var(--font-title);">¿Qué resultados obtuve / qué aporte generó?</h4>
                    <p style="color: var(--text-muted); line-height: 1.7; margin: 0; font-size: 0.95rem;">${proj.result}</p>
                </div>
            `;
            if (projectDetailDesc) projectDetailDesc.innerHTML = detailHtml;

            // Inject tools
            if (projectDetailTools) {
                projectDetailTools.innerHTML = proj.tools.map(tool => `<span>${tool}</span>`).join('');
            }

            // Inject skills
            if (projectDetailSkills) {
                projectDetailSkills.innerHTML = proj.skills.map(skill => `<span>${skill}</span>`).join('');
            }

            // Display detail overlay
            if (projectDetailOverlay) {
                projectDetailOverlay.style.display = "flex";
                void projectDetailOverlay.offsetWidth;
                projectDetailOverlay.classList.add("active");
            }
        });
    }

    const closeProjectDetail = () => {
        if (projectDetailOverlay) {
            projectDetailOverlay.classList.remove("active");
            setTimeout(() => {
                projectDetailOverlay.style.display = "none";
            }, 500);
        }
    };

    if (projectDetailCloseBtn) {
        projectDetailCloseBtn.addEventListener("click", closeProjectDetail);
    }

    if (projectDetailOverlay) {
        projectDetailOverlay.addEventListener("click", (e) => {
            if (e.target === projectDetailOverlay) {
                closeProjectDetail();
            }
        });
    }

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
