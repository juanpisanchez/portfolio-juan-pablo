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
        liderazgo: {
            title: "Liderazgo y Project Management",
            desc: "Liderazgo de equipos, gestión de iniciativas, priorización, seguimiento de avances, coordinación de stakeholders y gobierno de procesos en contextos de transformación.",
            metrics: [
                { value: "10+ años", label: "De experiencia", detail: "Gestionando iniciativas, procesos, stakeholders, equipos o proyectos transversales." },
                { value: "+1500", label: "Colaboradores", detail: "Estructura gestionada en Grupo Gire" },
                { value: "120+", label: "Líderes Capacitados", detail: "Programa HERA de desarrollo directivo" },
                { value: "6", label: "Reportes Directos", detail: "Liderazgo de equipo en salud y HR" }
            ],
            roles: [
                {
                    role: "Jefe de TA & People Analytics",
                    company: "ASE | Medifé | Finochietto",
                    period: "Nov 2023 - Nov 2025",
                    tools: ["Power BI", "Power Query", "Excel Avanzado", "Meta4"]
                },
                {
                    role: "Jefe de Talento",
                    company: "Grupo Gire",
                    period: "Oct 2021 - May 2023",
                    tools: ["SuccessFactors", "Nine Box", "Presupuestos HR"]
                },
                {
                    role: "Head of People",
                    company: "ICAP Global",
                    period: "Jun 2023 - Nov 2023",
                    tools: ["Onboarding Digital", "Compensaciones", "Planes de Sucesión"]
                },
                {
                    role: "IT & Digital Talent Lead",
                    company: "Grupo Gire",
                    period: "May 2021 - Nov 2021",
                    tools: ["Digital Sourcing", "Tech Reskilling", "Tech Branding"]
                },
                {
                    role: "Analista de Calidad / Team Leader",
                    company: "Nextel",
                    period: "Jun 2010 - Oct 2012",
                    tools: ["Coaching", "Matrices de Calidad", "NPS"]
                }
            ]
        },
        change: {
            title: "Implementación y adopción de sistemas",
            desc: "Acompañamiento a líderes y usuarios en transiciones tecnológicas. Gestión del impacto, relevamiento AS IS / TO BE, diseño de capacitaciones y testing funcional (UAT).",
            metrics: [
                { value: "9+ años", label: "De experiencia", detail: "Participando en proyectos de implementación, evolución funcional, UAT, capacitación y adopción de sistemas." },
                { value: "100%", label: "Adopción", detail: "Migración exitosa a SuccessFactors y SAP" },
                { value: "80%", label: "Satisfacción", detail: "Programas de inducción y L&D" },
                { value: "-35%", label: "Time-to-Market", detail: "Adopción de Scrum en células de IT" }
            ],
            roles: [
                {
                    role: "Consultor de Desarrollo & Negocios",
                    company: "Knowment",
                    period: "Jun 2025 - Actualidad",
                    tools: ["Change Management", "Diseño Organizacional", "Formatos Culturales"]
                },
                {
                    role: "HRBP IT & L&D Lead",
                    company: "Grupo Gire",
                    period: "Oct 2019 - Oct 2020",
                    tools: ["Agile Coaching", "E-learning", "Coaching de Equipos"]
                },
                {
                    role: "Especialista en Desarrollo de Talento",
                    company: "Grupo Gire",
                    period: "Ene 2019 - Oct 2019",
                    tools: ["IDP", "Calibración Desempeño", "Coaching"]
                },
                {
                    role: "Analista Ssr. de Procesos",
                    company: "Swiss Medical Group",
                    period: "Dic 2015 - May 2016",
                    tools: ["SuccessFactors", "UAT", "BPMN"]
                },
                {
                    role: "Analista de Aprendizaje",
                    company: "Tarjeta Naranja",
                    period: "Dic 2012 - Dic 2013",
                    tools: ["L&D", "Onboarding", "Indicadores de Aprendizaje"]
                }
            ]
        },
        procesos: {
            title: "Diseño de servicios y Procesos",
            desc: "Relevamiento, AS IS / TO BE, service blueprint, documentación funcional, mejora continua y diseño de procesos para nuevos servicios, operaciones y áreas de gestión.",
            metrics: [
                { value: "10+ años", label: "De experiencia", detail: "En mejora continua, reingeniería operativa, AS IS / TO BE, documentación funcional, implementación y gestión del cambio." },
                { value: "-30%", label: "Tiempo de Espera", detail: "Optimización de atención en cajas en Coppel" },
                { value: "-25%", label: "Conciliación Diaria", detail: "Estandarización de Rapipago" },
                { value: "-18%", label: "Costos Operativos", detail: "Rediseño de layout logístico en Coppel" }
            ],
            roles: [
                {
                    role: "Analista Sr. de Procesos",
                    company: "Grupo Gire",
                    period: "May 2016 - Ene 2019",
                    tools: ["SAP", "Dynamics CRM", "BPMN", "Scrum", "Kanban", "OKRs"]
                },
                {
                    role: "Analista de Mejora Continua",
                    company: "Coppel",
                    period: "Feb 2014 - Dic 2015",
                    tools: ["Lean Six Sigma", "BPMN", "Relaciones Laborales"]
                }
            ]
        },
        talento: {
            title: "Gestión de Talento & HRBP",
            desc: "Soporte estratégico como socio de negocio cercano a operaciones críticas y áreas de IT. Diseño de programas de desempeño, onboarding, potencial (Nine Box) y planes de desarrollo.",
            metrics: [
                { value: "10+ años", label: "De experiencia", detail: "En procesos de talento, aprendizaje, desarrollo, HRBP, atracción, desempeño y acompañamiento a líderes." },
                { value: "-12%", label: "Rotación IT", detail: "Diseño de bandas salariales y beneficios" },
                { value: "+600", label: "Altas Anuales", detail: "Onboarding de personal de salud (ASE/Medifé)" },
                { value: "100%", label: "Cobertura Nine Box", detail: "Estrategia de potencial y planes de sucesión" }
            ],
            roles: [
                {
                    role: "Líder de Atracción de Talento",
                    company: "Grupo Cober",
                    period: "Ene 2026 - May 2026",
                    tools: ["Power BI", "Airtable", "n8n", "AI Sourcing"]
                },
                {
                    role: "Jefe de Talento",
                    company: "Grupo Gire",
                    period: "Oct 2021 - May 2023",
                    tools: ["SuccessFactors", "Nine Box", "Presupuestos HR"]
                },
                {
                    role: "HRBP IT",
                    company: "Emergencias",
                    period: "Oct 2020 - May 2021",
                    tools: ["SuccessFactors", "Agile Células", "IT Recruitment"]
                },
                {
                    role: "IT Freelance Recruiter",
                    company: "Autónomo",
                    period: "Ene 2019 - Jun 2022",
                    tools: ["IT Recruitment", "Sourcing", "Tech Pipeline"]
                }
            ]
        },
        analytics: {
            title: "People Analytics & HRIS",
            desc: "Construcción de indicadores, tableros ejecutivos, limpieza y unificación de bases, criterios de lectura, reportería de gestión y soporte funcional en HRIS / HR Tech.",
            metrics: [
                { value: "10+ años", label: "De experiencia", detail: "Trabajando con indicadores, reportes y tableros de gestión." },
                { value: "2+ años", label: "De liderazgo", detail: "Liderando formalmente People Analytics." },
                { value: "3000+", label: "Colaboradores", detail: "Tablero unificado de People Analytics para Comité." },
                { value: "100%", label: "Control Presupuestario", detail: "Automatización del proceso anual de gastos de personal." }
            ],
            roles: [
                {
                    role: "Jefe de TA & People Analytics",
                    company: "ASE | Medifé | Finochietto",
                    period: "Nov 2023 - Nov 2025",
                    tools: ["Power BI", "Power Query", "Excel Avanzado", "Meta4"]
                },
                {
                    role: "Jefe de Talento",
                    company: "Grupo Gire",
                    period: "Oct 2021 - May 2023",
                    tools: ["SuccessFactors", "Nine Box", "Presupuestos HR"]
                },
                {
                    role: "Analista Ssr. de Procesos",
                    company: "Swiss Medical Group",
                    period: "Dic 2015 - May 2016",
                    tools: ["SuccessFactors", "UAT", "BPMN"]
                }
            ]
        },
        automatizacion: {
            title: "Automatización & IA",
            desc: "Diseño de soluciones funcionales y técnicas con automatización, IA generativa y herramientas low-code/no-code para ordenar información, mejorar trazabilidad y reducir tareas manuales.",
            metrics: [
                { value: "2+ años", label: "De experiencia", detail: "Aplicando automatización, IA generativa, low-code/no-code y herramientas digitales a procesos de gestión." },
                { value: "80%", label: "Screening con IA", detail: "Filtro de candidatos por IA en ATS interno" },
                { value: "-45%", label: "Soporte de HR", detail: "Bot de consultas RAG integrado en Teams" },
                { value: "-10h", label: "Semanales", detail: "Ahorro de tiempo en administración mediante flujos n8n" }
            ],
            roles: [
                {
                    role: "Consultor en Procesos, IA & Talento",
                    company: "Entropyx",
                    period: "May 2026 - Actualidad",
                    tools: ["n8n", "Make", "IA Generativa", "LLMs (GPT-4o)", "APIs", "Apps Script"]
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
                "summary": "Proyecto de mejora continua orientado a optimizar criterios de routeo y planificación logística.",
                "desc": "Participé en un proyecto de mejora de procesos logísticos, trabajando sobre la planificación de rutas, distribución y criterios operativos. El proyecto incluyó relevamiento de necesidades, análisis de variables operativas, rediseño de criterios de routeo y acompañamiento de la implementación.",
                "tools": [
                    "Mejora continua",
                    "análisis de procesos",
                    "Lean Six Sigma",
                    "programación lineal",
                    "análisis operativo"
                ],
                "skills": [
                    "Reingeniería operativa",
                    "análisis de procesos",
                    "eficiencia operativa",
                    "documentación",
                    "implementación"
                ]
            },
            {
                "title": "Dimensionamiento operativo en cajas y distribución",
                "company": "Coppel",
                "type": "Mejora continua · Procesos · Dimensionamiento operativo",
                "summary": "Proyecto de análisis y dimensionamiento para mejorar la asignación de recursos en atención en cajas y distribución.",
                "desc": "Trabajé en proyectos de dimensionamiento operativo para estimar necesidades de recursos en línea de cajas, atención y distribución. El trabajo combinó análisis de demanda, revisión de procesos, criterios de capacidad operativa y propuestas de mejora para la asignación de recursos.",
                "tools": [
                    "Mejora continua",
                    "análisis de procesos",
                    "teoría de colas",
                    "dimensionamiento operativo",
                    "indicadores"
                ],
                "skills": [
                    "Análisis operativo",
                    "mejora continua",
                    "eficiencia",
                    "capacidad instalada",
                    "toma de decisiones basada en datos"
                ]
            },
            {
                "title": "Control transaccional",
                "company": "Grupo Gire",
                "type": "Procesos · Controles · Operación · Mejora continua",
                "summary": "Proyecto vinculado al ordenamiento y mejora de controles operativos en procesos transaccionales.",
                "desc": "Participé desde el rol de procesos en iniciativas asociadas al control transaccional dentro de la operación de Rapipago. El trabajo incluyó relevamiento de circuitos, documentación de procesos, identificación de responsables, controles, puntos críticos y necesidades de articulación entre negocio, operación, sistemas y áreas de soporte.",
                "tools": [
                    "Relevamiento",
                    "AS IS / TO BE",
                    "documentación funcional",
                    "gestión de procesos",
                    "controles operativos"
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "control operativo",
                    "documentación",
                    "coordinación con stakeholders"
                ]
            },
            {
                "title": "ABM de agentes",
                "company": "Grupo Gire",
                "type": "Procesos · Mejora operativa · Documentación funcional",
                "summary": "Mejora de procesos vinculados al alta, baja y modificación de agentes.",
                "desc": "Participé en el relevamiento, análisis y mejora del proceso de alta, baja y modificación de agentes. El trabajo incluyó revisión del circuito operativo, documentación de responsabilidades, puntos de control, interacción entre áreas y necesidades de mejora para facilitar trazabilidad y ejecución.",
                "tools": [
                    "Relevamiento",
                    "documentación de procesos",
                    "AS IS / TO BE",
                    "mejora continua",
                    "controles"
                ],
                "skills": [
                    "Análisis de procesos",
                    "documentación",
                    "mejora operativa",
                    "trazabilidad",
                    "articulación entre áreas"
                ]
            },
            {
                "title": "Tercerización del SAC",
                "company": "Grupo Gire",
                "type": "Procesos · Operaciones · Gestión del cambio",
                "summary": "Proyecto de tercerización del servicio de atención al cliente, con foco en procesos, implementación y transferencia operativa.",
                "desc": "Participé en el proyecto de tercerización del SAC desde la mirada de procesos. El trabajo incluyó relevamiento, documentación de circuitos, definición de roles, responsabilidades, criterios operativos y acompañamiento de la implementación para facilitar la transición del servicio.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "gestión del cambio",
                    "procesos operativos",
                    "transferencia de conocimiento"
                ],
                "skills": [
                    "Procesos",
                    "gestión del cambio",
                    "coordinación",
                    "documentación",
                    "implementación operativa"
                ]
            },
            {
                "title": "Gobierno de procesos, políticas e iniciativas",
                "company": "Grupo Gire",
                "type": "Gobierno de procesos · Políticas · PMO · Mejora continua",
                "summary": "Participación en la definición de políticas y procesos transversales para ordenar iniciativas, proyectos y prácticas organizacionales.",
                "desc": "Fui referente del equipo en mejora continua de procesos y políticas vinculadas a servicios de Rapipago y áreas transversales como Desarrollo Humano, PMO y Sistemas. Participé en la construcción y documentación de políticas para ordenar criterios, responsabilidades y circuitos de trabajo.<br><br><strong>Políticas de gestión de proyectos e iniciativas:</strong><ul><li>Gestión de iniciativas y anteproyectos.</li><li>Gestión de proyectos.</li><li>PMO.</li></ul><strong>Políticas de Desarrollo Humano / RRHH:</strong><ul><li>Reclutamiento y selección.</li><li>Comunicación interna.</li><li>Formación interna.</li><li>Teletrabajo.</li></ul><strong>Políticas operativas y de negocio:</strong><ul><li>Categorización de sucursales y agentes.</li><li>Administración de obras sociales.</li></ul>",
                "tools": [
                    "Documentación de procesos",
                    "políticas",
                    "gobierno de iniciativas",
                    "mejora continua",
                    "PMO",
                    "gestión de stakeholders"
                ],
                "skills": [
                    "Gobierno de procesos",
                    "documentación",
                    "estandarización",
                    "mejora continua",
                    "articulación transversal"
                ]
            },
            {
                "title": "Rediseño del modelo operativo de Atracción de Talento",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Procesos · Transformación de área · Gobierno de demanda",
                "summary": "Rediseño del modelo operativo de Empleos hacia una función integral de Atracción de Talento.",
                "desc": "Lideré la evolución del modelo operativo de Empleos hacia Atracción de Talento, fortaleciendo gobierno de demanda, priorización, criterios de seguimiento, relación con líderes y trazabilidad del proceso. El proyecto incluyó ordenamiento de solicitudes, estados, indicadores, rutinas de seguimiento y articulación con HRBPs y líderes.",
                "tools": [
                    "Rediseño de procesos",
                    "indicadores",
                    "tableros",
                    "gobierno de demanda",
                    "seguimiento operativo",
                    "gestión de stakeholders"
                ],
                "skills": [
                    "Transformación de procesos",
                    "liderazgo de equipo",
                    "priorización",
                    "operación de alta demanda",
                    "gestión con líderes"
                ]
            },
            {
                "title": "Transformación de Selección y gestión de demanda",
                "company": "Grupo Cober",
                "type": "Procesos · Talent Operations · Mejora continua · Datos",
                "summary": "Ordenamiento del proceso de selección en una operación de alta demanda, incorporando tableros, prioridades y criterios de seguimiento.",
                "desc": "Lideré la transformación operativa del área de Selección de Grupo Cober, en un contexto de aproximadamente 80 vacantes activas mensuales, 50 cierres mensuales promedio y time to fill cercano a 30 días. El proyecto incluyó mejora de flujos de trabajo, criterios de priorización, seguimiento de demanda, tableros de gestión y mayor visibilidad para conversaciones con líderes.",
                "tools": [
                    "Gestión de procesos",
                    "tableros",
                    "indicadores",
                    "priorización",
                    "seguimiento operativo",
                    "IA generativa",
                    "automatización"
                ],
                "skills": [
                    "Procesos",
                    "liderazgo",
                    "datos",
                    "automatización",
                    "gestión de demanda",
                    "mejora continua"
                ]
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
                "summary": "Diseño e implementación de procesos para un nuevo servicio de logística inversa dentro del ecosistema Rapipago.",
                "desc": "Participé desde el área de procesos en el diseño e implementación de RapiEntrega / logística inversa. El trabajo incluyó participación desde la idea y diseño del servicio hasta su implementación, coordinando sesiones de relevamiento, service blueprint, experiencia de usuario, procesos operativos, requerimientos funcionales, documentación, capacitación y acompañamiento a áreas impactadas.",
                "tools": [
                    "Service blueprint",
                    "AS IS / TO BE",
                    "documentación funcional",
                    "relevamiento",
                    "gestión del cambio",
                    "capacitación"
                ],
                "skills": [
                    "Diseño de servicios",
                    "procesos",
                    "análisis funcional",
                    "implementación",
                    "coordinación transversal"
                ]
            },
            {
                "title": "RapiTrámite",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación operativa",
                "summary": "Participación en el diseño e implementación de procesos para un nuevo servicio de Rapipago.",
                "desc": "Participé en el proyecto RapiTrámite desde la mirada de procesos, acompañando relevamientos, definición de circuitos operativos, documentación funcional, roles, controles, interacción con sistemas y áreas impactadas para facilitar la implementación del nuevo servicio.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "diseño de procesos",
                    "AS IS / TO BE",
                    "implementación"
                ],
                "skills": [
                    "Diseño de procesos",
                    "nuevos servicios",
                    "coordinación",
                    "documentación",
                    "gestión del cambio"
                ]
            },
            {
                "title": "RapiPOS",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación",
                "summary": "Participación en el diseño e implementación de procesos para un nuevo modelo de servicio dentro de Rapipago.",
                "desc": "Participé en el proyecto RapiPOS acompañando la definición de procesos, circuitos operativos, requerimientos funcionales, documentación y gestión del cambio para su implementación. El foco estuvo en traducir la necesidad de negocio en procesos claros, roles, controles y criterios de operación.",
                "tools": [
                    "Diseño de procesos",
                    "relevamiento",
                    "documentación funcional",
                    "gestión del cambio",
                    "capacitación"
                ],
                "skills": [
                    "Procesos",
                    "implementación",
                    "análisis funcional",
                    "documentación",
                    "articulación entre áreas"
                ]
            },
            {
                "title": "CashFlow",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Operación",
                "summary": "Participación desde procesos en el diseño e implementación del proyecto CashFlow.",
                "desc": "Participé en el proyecto CashFlow desde el rol de procesos, acompañando relevamiento, diseño de circuitos operativos, documentación funcional, definición de roles, controles y articulación con áreas de negocio, sistemas y operación para facilitar la implementación.",
                "tools": [
                    "Relevamiento",
                    "diseño de procesos",
                    "documentación funcional",
                    "AS IS / TO BE",
                    "gestión del cambio"
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "diseño operativo",
                    "documentación",
                    "implementación"
                ]
            },
            {
                "title": "Cobranzas y extracciones con débito",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Sistemas · Operación",
                "summary": "Participación en el diseño e implementación de procesos para cobranzas y extracciones con débito.",
                "desc": "Participé en el proyecto de cobranzas y extracciones con débito, acompañando la definición de procesos, circuitos operativos, requerimientos funcionales, documentación, controles y coordinación con áreas impactadas para su implementación.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "análisis de procesos",
                    "controles",
                    "implementación"
                ],
                "skills": [
                    "Diseño de procesos",
                    "análisis funcional",
                    "operación",
                    "sistemas",
                    "gestión del cambio"
                ]
            },
            {
                "title": "Prisma Convenios Efectivo",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Implementación operativa",
                "summary": "Participación en procesos vinculados a Prisma Convenios Efectivo dentro de la unidad de negocio Rapipago.",
                "desc": "Participé desde procesos en el proyecto Prisma Convenios Efectivo, colaborando en relevamiento, documentación de circuitos, definición de responsabilidades, controles, requerimientos funcionales y acompañamiento a áreas impactadas.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "procesos operativos",
                    "controles",
                    "implementación"
                ],
                "skills": [
                    "Procesos",
                    "documentación",
                    "análisis funcional",
                    "implementación",
                    "coordinación transversal"
                ]
            },
            {
                "title": "Red solo Débito",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Procesos · Operación",
                "summary": "Participación en el diseño e implementación de procesos para el servicio Red solo Débito.",
                "desc": "Participé en el proyecto Red solo Débito desde la mirada de procesos, acompañando el relevamiento, diseño de circuitos, documentación funcional, definición de roles, controles e implementación junto a áreas de negocio, operación y sistemas.",
                "tools": [
                    "Diseño de procesos",
                    "relevamiento",
                    "documentación funcional",
                    "controles",
                    "implementación"
                ],
                "skills": [
                    "Procesos",
                    "análisis funcional",
                    "coordinación",
                    "implementación",
                    "documentación"
                ]
            },
            {
                "title": "Smart Boxes",
                "company": "Grupo Gire",
                "type": "Diseño de servicios · Innovación operativa · Procesos",
                "summary": "Participación en el piloto de Smart Boxes, acompañando procesos, documentación e implementación.",
                "desc": "Participé en el piloto de Smart Boxes desde el rol de procesos, colaborando en el diseño de circuitos operativos, documentación, identificación de áreas impactadas, roles, controles y criterios de implementación.",
                "tools": [
                    "Relevamiento",
                    "documentación funcional",
                    "diseño de procesos",
                    "implementación",
                    "gestión del cambio"
                ],
                "skills": [
                    "Diseño de servicios",
                    "procesos",
                    "innovación operativa",
                    "implementación",
                    "articulación con stakeholders"
                ]
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
                "summary": "Proyecto de evolución y escalamiento de Microsoft Dynamics CRM hacia nuevos usuarios y procesos.",
                "desc": "Participé en la mejora y escalamiento de Microsoft Dynamics CRM. El sistema ya existía, pero necesitaba evolucionar y ampliar su uso. Mi rol estuvo centrado en procesos: diagnóstico, entrevistas con usuarios clave, documentación AS IS / TO BE, diseño de procesos en Visio, definiciones funcionales con proveedor y Sistemas, seguimiento de implementación y capacitación a nuevos usuarios.",
                "tools": [
                    "Microsoft Dynamics CRM",
                    "Visio",
                    "AS IS / TO BE",
                    "relevamiento funcional",
                    "documentación",
                    "capacitación",
                    "gestión del cambio"
                ],
                "skills": [
                    "Análisis funcional",
                    "procesos",
                    "CRM",
                    "implementación",
                    "capacitación",
                    "coordinación con Sistemas y proveedores"
                ]
            },
            {
                "title": "Implementación SAP en administración, finanzas y recaudaciones",
                "company": "Grupo Gire",
                "type": "ERP · Procesos · Implementación funcional · Gestión del cambio",
                "summary": "Participación desde procesos en la implementación de SAP en áreas administrativas, financieras y de recaudación.",
                "desc": "Participé en la implementación de SAP vinculada a áreas de administración, finanzas y gestión de recaudaciones. Mi aporte estuvo orientado al relevamiento, documentación de procesos, articulación con áreas usuarias, acompañamiento de cambios operativos y soporte desde la mirada funcional y de procesos.",
                "tools": [
                    "SAP",
                    "relevamiento",
                    "documentación funcional",
                    "procesos administrativos",
                    "gestión del cambio"
                ],
                "skills": [
                    "Implementación funcional",
                    "procesos",
                    "ERP",
                    "usuarios",
                    "documentación",
                    "adopción"
                ]
            },
            {
                "title": "SuccessFactors / Meta4 / HR Tech",
                "company": "Grupo Gire · Swiss Medical Group · Emergencias",
                "type": "HR Tech · Implementación funcional · Adopción de sistemas",
                "summary": "Participación en proyectos de implementación, evolución funcional y adopción de sistemas de RRHH.",
                "desc": "Participé en diferentes iniciativas vinculadas a HR Tech, incluyendo Meta4, SuccessFactors y mejoras funcionales en sistemas de RRHH. Mi rol incluyó relevamiento de necesidades, conexión entre procesos de RRHH y usuarios internos, testing/UAT, soporte funcional, capacitación, documentación, adopción y seguimiento de mejoras.",
                "tools": [
                    "SuccessFactors",
                    "Meta4",
                    "HRIS",
                    "UAT/testing",
                    "capacitación a usuarios",
                    "documentación funcional",
                    "soporte funcional"
                ],
                "skills": [
                    "HR Tech",
                    "implementación funcional",
                    "adopción",
                    "gestión del cambio",
                    "procesos de RRHH",
                    "usuarios"
                ]
            },
            {
                "title": "Proceso de aprobación de vacantes en Oracle HCM",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Oracle HCM · Procesos · Gobierno de demanda · Implementación funcional",
                "summary": "Diseño e implementación del proceso formal de aprobación de vacantes en Oracle HCM.",
                "desc": "Diseñé e implementé el proceso formal de aprobación de vacantes para ordenar solicitudes, responsables, criterios de validación, estados y seguimiento. El proyecto incluyó definición del flujo, alineamiento con Dirección, HRBPs y líderes, parametrización funcional, testing, puesta en marcha, capacitación a usuarios y seguimiento operativo.",
                "tools": [
                    "Oracle HCM",
                    "flujo de aprobación",
                    "testing/UAT",
                    "capacitación",
                    "procesos",
                    "gobierno de demanda"
                ],
                "skills": [
                    "Procesos",
                    "HR Tech",
                    "implementación funcional",
                    "adopción",
                    "gestión con líderes",
                    "control de demanda"
                ]
            },
            {
                "title": "Adopción y mejora funcional de HiringRoom ATS",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "ATS · Talent Operations · Adopción de sistemas · Procesos",
                "summary": "Mejora de uso y adopción de HiringRoom como ATS para aumentar trazabilidad del proceso de selección.",
                "desc": "Impulsé la adopción de HiringRoom para que el proceso de selección tuviera mayor trazabilidad, registro, seguimiento e información para la toma de decisiones. El trabajo incluyó revisión de uso, mejora funcional, entrenamiento al equipo, seguimiento en reuniones, incorporación del uso del ATS en la gestión diaria y conexión con indicadores de selección.",
                "tools": [
                    "HiringRoom",
                    "ATS",
                    "seguimiento operativo",
                    "capacitación",
                    "indicadores",
                    "mejora de procesos"
                ],
                "skills": [
                    "HR Tech",
                    "ATS",
                    "adopción",
                    "indicadores",
                    "liderazgo de equipo",
                    "mejora continua"
                ]
            },
            {
                "title": "Módulo de capacitación en Oracle HCM",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "HR Tech · Learning · Implementación funcional · Adopción",
                "summary": "Migración e implementación de gestión de capacitaciones en Oracle HCM.",
                "desc": "Participé en la migración de capacitaciones desde Moodle hacia Oracle HCM, acompañando la implementación funcional, entrenamiento de usuarios, documentación y adopción del módulo para mejorar la gestión de aprendizaje dentro del ecosistema de sistemas de RRHH.",
                "tools": [
                    "Oracle HCM",
                    "Moodle",
                    "capacitación a usuarios",
                    "documentación",
                    "soporte funcional",
                    "gestión del cambio"
                ],
                "skills": [
                    "HR Tech",
                    "Learning",
                    "implementación funcional",
                    "adopción de sistemas",
                    "capacitación"
                ]
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
                "summary": "Transformación del modelo de Empleos hacia una función integral de Atracción de Talento.",
                "desc": "Lideré la profesionalización de Atracción de Talento en una operación de alta demanda, con búsquedas para perfiles masivos, asistenciales, comerciales, IT, staff, jefaturas, gerencias y roles críticos. El proyecto incluyó rediseño del modelo operativo, gobierno de demanda, priorización, indicadores, tableros, uso de ATS, rutinas de seguimiento y mejora del vínculo con líderes y HRBPs.",
                "tools": [
                    "Talent Acquisition",
                    "ATS",
                    "indicadores",
                    "tableros",
                    "gobierno de demanda",
                    "priorización",
                    "seguimiento operativo"
                ],
                "skills": [
                    "Liderazgo",
                    "selección",
                    "procesos",
                    "datos",
                    "mejora continua",
                    "gestión con negocio"
                ]
            },
            {
                "title": "Transformación de Selección, tableros e IA",
                "company": "Grupo Cober",
                "type": "Talent Operations · Procesos · Datos · IA",
                "summary": "Ordenamiento de una operación de selección de alta demanda mediante procesos, tableros e IA aplicada.",
                "desc": "Lideré la transformación operativa del área de Selección de Grupo Cober, en un contexto de aproximadamente 80 vacantes activas mensuales, 50 cierres mensuales promedio y time to fill cercano a 30 días. El proyecto incluyó mejora de flujos de trabajo, criterios de priorización, seguimiento de demanda, tableros de gestión y mayor visibilidad para conversaciones con líderes.",
                "tools": [
                    "Tableros",
                    "IA generativa",
                    "automatización",
                    "seguimiento operativo",
                    "gestión de demanda",
                    "indicadores"
                ],
                "skills": [
                    "Liderazgo",
                    "Talent Operations",
                    "procesos",
                    "datos",
                    "IA",
                    "mejora continua"
                ]
            },
            {
                "title": "Atracción y desarrollo de talento IT / digital",
                "company": "Grupo Gire",
                "type": "Talent Acquisition · IT Talent · Marca empleadora · Desarrollo",
                "summary": "Gestión de talento para áreas IT y digitales, integrando atracción, desarrollo, indicadores y marca empleadora.",
                "desc": "Lideré la agenda de talento para áreas IT y digitales, con foco en atracción, selección, desarrollo, marca empleadora, indicadores y acciones de reskilling/upskilling. El objetivo fue fortalecer capacidades técnicas internas, mejorar fuentes, pipeline técnico y respuesta a necesidades del negocio.",
                "tools": [
                    "Recruiting IT",
                    "marca empleadora",
                    "indicadores",
                    "reskilling",
                    "upskilling",
                    "seguimiento de pipeline"
                ],
                "skills": [
                    "Talent Acquisition",
                    "perfiles IT",
                    "desarrollo de talento",
                    "indicadores",
                    "gestión con líderes técnicos"
                ]
            },
            {
                "title": "Optimización de proveedores de selección",
                "company": "Grupo Cober",
                "type": "Talent Operations · Proveedores · Mejora de procesos",
                "summary": "Revisión y optimización de proveedores de selección para mejorar cobertura y especialización.",
                "desc": "Relevé proveedores activos de selección y elaboré criterios comparativos vinculados a costo, calidad, velocidad, especialidad, geografía y tecnología. El trabajo permitió proponer cambios, sumar proveedores para búsquedas estratégicas o gerenciales y mejorar condiciones comerciales.",
                "tools": [
                    "Matriz comparativa",
                    "análisis de proveedores",
                    "criterios de evaluación",
                    "negociación",
                    "gestión de stakeholders"
                ],
                "skills": [
                    "Gestión de proveedores",
                    "análisis",
                    "mejora de procesos",
                    "negociación",
                    "Talent Operations"
                ]
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
                "summary": "Participación en programa de transformación cultural con foco en liderazgo, capacidades, talento y nuevos modelos de trabajo.",
                "desc": "Participé en el Programa ERA, una iniciativa de transformación cultural de Grupo Gire. Mi participación estuvo vinculada al mapeo de líderes, identificación de capacidades, acompañamiento a nuevas formas de trabajo, desarrollo de talento y coordinación de acciones de aprendizaje y cambio asociadas al proceso de transformación.",
                "tools": [
                    "Gestión del cambio",
                    "liderazgo",
                    "mapeo de talento",
                    "capacidades",
                    "agilidad",
                    "aprendizaje"
                ],
                "skills": [
                    "Transformación cultural",
                    "talento",
                    "liderazgo",
                    "cambio",
                    "desarrollo organizacional"
                ]
            },
            {
                "title": "Acompañamiento a estructuras ágiles en IT",
                "company": "Grupo Gire · Emergencias",
                "type": "Agilidad · Cambio organizacional · HRBP IT · Talento",
                "summary": "Acompañamiento a áreas IT en procesos de cambio hacia estructuras ágiles y nuevos modelos de trabajo.",
                "desc": "Acompañé a líderes IT en procesos de transformación hacia modelos ágiles, participando en conversaciones sobre estructura, células, capacidades necesarias, identificación de talento interno y externo, acompañamiento al cambio y soporte a líderes y equipos durante la transición.",
                "tools": [
                    "Agilidad",
                    "estructuras ágiles",
                    "HRBP IT",
                    "coaching",
                    "gestión del cambio",
                    "mapeo de capacidades"
                ],
                "skills": [
                    "Cambio organizacional",
                    "agilidad",
                    "liderazgo",
                    "talento IT",
                    "acompañamiento a líderes"
                ]
            },
            {
                "title": "Liderazgo, OKRs y desarrollo de capacidades para la transformación",
                "company": "Grupo Gire",
                "type": "Liderazgo · OKRs · Desarrollo · Transformación",
                "summary": "Implementación y acompañamiento de prácticas de liderazgo, objetivos y capacidades para sostener procesos de transformación.",
                "desc": "Participé en iniciativas vinculadas a liderazgo, OKRs, desempeño y desarrollo de capacidades, acompañando a líderes y equipos en la adopción de nuevas prácticas de gestión. El trabajo integró aprendizaje, desempeño, seguimiento de objetivos, conversaciones de desarrollo y acompañamiento a líderes.",
                "tools": [
                    "OKRs",
                    "liderazgo",
                    "desempeño",
                    "aprendizaje",
                    "gestión del cambio",
                    "acompañamiento a líderes"
                ],
                "skills": [
                    "Liderazgo",
                    "desarrollo organizacional",
                    "transformación",
                    "gestión de objetivos",
                    "adopción de prácticas"
                ]
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
                "summary": "Diseño, facilitación y participación en procesos de Talent Review, evaluación de potencial y Nine Box.",
                "desc": "Participé y lideré procesos vinculados a mapeo de talento, evaluación de potencial, Talent Review y Nine Box. El trabajo incluyó definiciones metodológicas, acompañamiento a líderes y HRBPs, calibración de talento, lectura de desempeño y potencial, identificación de decisiones de desarrollo y seguimiento.",
                "tools": [
                    "Talent Review",
                    "Nine Box",
                    "potencial",
                    "desempeño",
                    "calibración",
                    "planes de desarrollo"
                ],
                "skills": [
                    "Talent Management",
                    "liderazgo",
                    "facilitación",
                    "desarrollo",
                    "análisis de talento"
                ]
            },
            {
                "title": "Make IT Talent y DevForce",
                "company": "Grupo Gire",
                "type": "Reskilling · Upskilling · Talento IT · Aprendizaje",
                "summary": "Programas orientados al desarrollo de capacidades tecnológicas internas y formación de talento IT.",
                "desc": "Participé en iniciativas de reskilling y upskilling como Make IT Talent y DevForce, orientadas a fortalecer capacidades técnicas internas y desarrollar talento para áreas IT/digitales. El trabajo se integró con la agenda de talento, aprendizaje, desarrollo, marca empleadora e indicadores.",
                "tools": [
                    "Reskilling",
                    "upskilling",
                    "rutas de aprendizaje",
                    "talento IT",
                    "indicadores",
                    "desarrollo de capacidades"
                ],
                "skills": [
                    "Aprendizaje",
                    "desarrollo",
                    "talento IT",
                    "transformación",
                    "gestión de programas"
                ]
            },
            {
                "title": "Onboarding, desempeño y prácticas de People",
                "company": "ICAP Global",
                "type": "People · Desempeño · Onboarding · Profesionalización",
                "summary": "Ordenamiento y formalización de prácticas de People en una estructura global en crecimiento.",
                "desc": "Como Head of People, lideré el ordenamiento de procesos de People, incluyendo onboarding, desempeño, desarrollo, comunicaciones, compensaciones básicas y acompañamiento a líderes. El foco estuvo en profesionalizar prácticas de gestión y dar mayor consistencia a procesos internos.",
                "tools": [
                    "Onboarding",
                    "desempeño",
                    "comunicaciones internas",
                    "acompañamiento a líderes",
                    "procesos de People"
                ],
                "skills": [
                    "People Management",
                    "liderazgo",
                    "procesos",
                    "desempeño",
                    "onboarding",
                    "gestión con dirección"
                ]
            },
            {
                "title": "Outplacement y empleabilidad en proceso de transición organizacional",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Aprendizaje · Empleabilidad · Transición organizacional",
                "summary": "Diseño y coordinación de acciones de empleabilidad y outplacement para una unidad de negocio en transición.",
                "desc": "Lideré el proceso de outplacement para una unidad de negocio afectada por una reestructuración. El proyecto incluyó diseño del proceso, coordinación de talleres, acompañamiento de empleabilidad, CV, LinkedIn, entrevistas, feedback, articulación con equipo interno y luego con proveedor externo por volumen.",
                "tools": [
                    "Outplacement",
                    "empleabilidad",
                    "talleres",
                    "CV",
                    "LinkedIn",
                    "entrevistas",
                    "gestión de proveedores",
                    "seguimiento"
                ],
                "skills": [
                    "Aprendizaje",
                    "empleabilidad",
                    "gestión del cambio",
                    "coordinación",
                    "acompañamiento de personas"
                ]
            },
            {
                "title": "Formador de Formadores",
                "company": "Grupo Gire",
                "type": "Aprendizaje · Desarrollo · Capacitación interna",
                "summary": "Iniciativa de formación para fortalecer capacidades internas de facilitación y transferencia de conocimiento.",
                "desc": "Participé en iniciativas de Formador de Formadores dentro de la agenda de aprendizaje y desarrollo, orientadas a fortalecer capacidades internas para facilitar contenidos, transferir conocimiento y acompañar la adopción de prácticas en la organización.",
                "tools": [
                    "Train the trainer",
                    "aprendizaje",
                    "facilitación",
                    "capacitación interna",
                    "desarrollo de capacidades"
                ],
                "skills": [
                    "Learning & Development",
                    "facilitación",
                    "capacitación",
                    "desarrollo interno",
                    "adopción"
                ]
            },
            {
                "title": "Puestos críticos y sucesión",
                "company": "Grupo Gire",
                "type": "Talent Management · Sucesión · Desarrollo organizacional",
                "summary": "Identificación de puestos críticos, análisis de riesgo de cobertura y planificación de sucesión.",
                "desc": "Lideré initiatives vinculadas a puestos críticos y sucesión, trabajando con matriz de criticidad, riesgo de vacancia, identificación de posibles sucesores, planes de desarrollo y conversaciones con líderes para fortalecer la continuidad de capacidades clave.",
                "tools": [
                    "Matriz de criticidad",
                    "sucesión",
                    "puestos críticos",
                    "planes de desarrollo",
                    "Talent Review"
                ],
                "skills": [
                    "Talent Management",
                    "sucesión",
                    "liderazgo",
                    "desarrollo",
                    "planificación de capacidades"
                ]
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
                "summary": "Participación transversal en análisis de bandas salariales, benchmarks y propuestas de compensación para perfiles críticos.",
                "desc": "Participé en iniciativas vinculadas a análisis salarial, benchmarks y definición de criterios de compensación para perfiles IT, críticos y posiciones de liderazgo. Mi rol fue aportar información de mercado desde buscas, necesidades de cobertura, criticidad de perfiles, lectura de negocio, estructura y articulación con referentes de compensaciones, payroll o dirección según el contexto.",
                "tools": [
                    "Benchmark salarial",
                    "análisis de bandas",
                    "estructura",
                    "perfiles críticos",
                    "información de mercado",
                    "articulación con áreas especializadas"
                ],
                "skills": [
                    "Compensaciones",
                    "análisis",
                    "talento",
                    "negocio",
                    "perfiles críticos",
                    "toma de decisiones"
                ]
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
                "summary": "Diseño y puesta en marcha del área de People Analytics para la Dirección de Personas.",
                "desc": "Impulsé el startup de People Analytics, definiendo criterios de análisis, reportería, KPIs, tableros ejecutivos, fuentes de información, responsables, calidad de datos y rutinas de seguimiento. El proyecto permitió instalar una lógica de gestión más basada en datos dentro de la Dirección de Personas.",
                "tools": [
                    "People Analytics",
                    "KPIs",
                    "tableros",
                    "Power BI",
                    "Excel",
                    "calidad de datos",
                    "reportería ejecutiva"
                ],
                "skills": [
                    "Analytics",
                    "datos",
                    "liderazgo",
                    "transformación HR",
                    "reporting",
                    "gobierno de información"
                ]
            },
            {
                "title": "Tablero integral de indicadores de RRHH",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "People Analytics · BI · Reporting ejecutivo · Control de gestión",
                "summary": "Construcción de tableros e indicadores integrales de RRHH para seguimiento ejecutivo.",
                "desc": "Construí tableros e indicadores integrales de RRHH, incluyendo limpieza y unificación de bases, definición de fuentes, responsables, criterios de lectura y reportería ejecutiva. Los indicadores incluyeron dotación, rotación, ausentismo, vacantes, cobertura, tiempos de proceso, desempeño, capacitación, presupuesto y otros datos de gestión.",
                "tools": [
                    "Power BI",
                    "Excel",
                    "KPIs",
                    "limpieza de datos",
                    "reporting",
                    "criterios de lectura",
                    "tableros ejecutivos"
                ],
                "skills": [
                    "People Analytics",
                    "BI",
                    "datos",
                    "reporting",
                    "control de gestión",
                    "soporte a decisiones"
                ]
            },
            {
                "title": "Presupuesto integral de RRHH y control de gestión",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "Presupuesto · Control de gestión · People Analytics · Reporting",
                "summary": "Coordinación del presupuesto integral de RRHH y seguimiento de información para control de gestión.",
                "desc": "Coordiné el presupuesto integral de RRHH, consolidando información de distintas áreas, acompañando validaciones, seguimiento y control de gestión. El trabajo permitió ordenar información presupuestaria, articular con áreas internas y aportar visibilidad para planificación y toma de decisiones.",
                "tools": [
                    "Presupuesto",
                    "Excel",
                    "control de gestión",
                    "reportería",
                    "consolidación de información",
                    "seguimiento"
                ],
                "skills": [
                    "Control de gestión",
                    "presupuesto",
                    "datos",
                    "coordinación",
                    "reporting ejecutivo"
                ]
            },
            {
                "title": "Tableros de gestión de selección",
                "company": "Grupo Cober",
                "type": "Talent Analytics · Dashboards · Seguimiento operativo",
                "summary": "Implementación de tableros para seguimiento de vacantes, estados, aging, carga operativa y performance.",
                "desc": "Implementé tableros de gestión end-to-end para el área de Selección, incluyendo definición de indicadores, selección de herramienta, diseño de solución, testing, puesta en marcha y capacitación a usuarios. Los tableros facilitaron seguimiento de demanda, prioridades, carga del equipo y conversaciones con líderes.",
                "tools": [
                    "Dashboards",
                    "indicadores",
                    "selección",
                    "seguimiento operativo",
                    "testing",
                    "capacitación",
                    "IA/automatización"
                ],
                "skills": [
                    "People Analytics",
                    "Talent Operations",
                    "indicadores",
                    "procesos",
                    "capacitación",
                    "adopción"
                ]
            },
            {
                "title": "Indicadores de aprendizaje",
                "company": "Tarjeta Naranja",
                "type": "Learning Analytics · Indicadores · Capacitación",
                "summary": "Implementación temprana de indicadores de aprendizaje y seguimiento de capacitaciones.",
                "desc": "Formé parte del equipo de Learning & Development, acompañando planes anuales de formación, contenidos, proveedores e indicadores de aprendizaje. Trabajé con indicadores de finalización, tiempos de completitud y satisfacción, conectando capacitación con necesidades del negocio.",
                "tools": [
                    "Indicadores de aprendizaje",
                    "reportes",
                    "capacitación",
                    "proveedores",
                    "seguimiento"
                ],
                "skills": [
                    "Learning Analytics",
                    "capacitación",
                    "indicadores",
                    "reporting",
                    "gestión de formación"
                ]
            },
            {
                "title": "Control de headcount y estructura",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto · Grupo Cober",
                "type": "People Analytics · Headcount · Control de gestión · Estructura",
                "summary": "Implementación de criterios de seguimiento de dotación, estructura y control de demanda.",
                "desc": "Participé en iniciativas vinculadas al control de headcount, seguimiento de dotación, estructura, crecimiento y demanda de cobertura. El trabajo se conectó con indicadores de RRHH, presupuesto, aprobación de vacantes y conversaciones con líderes para mejorar la visibilidad de la estructura y su evolución.",
                "tools": [
                    "Headcount",
                    "dotación",
                    "estructura",
                    "indicadores",
                    "control de gestión",
                    "presupuesto",
                    "reportería"
                ],
                "skills": [
                    "People Analytics",
                    "control de gestión",
                    "estructura",
                    "datos",
                    "soporte a decisiones"
                ]
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
                "summary": "Desarrollo de una solución web para centralizar información y mejorar seguimiento de selección.",
                "desc": "Desarrollé una solución web con automatizaciones e IA para ordenar información del proceso de selección, centralizar datos, mejorar trazabilidad, facilitar seguimiento operativo y ejecutivo, y reducir dispersión en una operación de alta demanda.",
                "tools": [
                    "IA generativa",
                    "automatización",
                    "solución web",
                    "tableros",
                    "datos",
                    "seguimiento operativo"
                ],
                "skills": [
                    "Automatización",
                    "IA",
                    "procesos",
                    "datos",
                    "Talent Operations",
                    "diseño funcional"
                ]
            },
            {
                "title": "IA aplicada a preselección y screening",
                "company": "Grupo Cober",
                "type": "IA generativa · Recruiting · Screening · Automatización",
                "summary": "Aplicación de IA generativa para asistir tareas de preselección y análisis de CVs.",
                "desc": "Implementé un piloto de IA aplicada a preselección y screening, utilizando GPTs personalizados, prompts, repositorios de CVs y criterios parametrizados para asistir al análisis inicial de candidatos. El objetivo fue acelerar tareas operativas, mejorar consistencia de criterios y apoyar al equipo de selección.",
                "tools": [
                    "ChatGPT",
                    "Claude",
                    "GPTs personalizados",
                    "prompts",
                    "Google Sheets",
                    "IA generativa",
                    "screening"
                ],
                "skills": [
                    "IA aplicada",
                    "recruiting",
                    "automatización",
                    "procesos",
                    "capacitación al equipo",
                    "mejora operativa"
                ]
            },
            {
                "title": "ATS propio con automatizaciones e IA",
                "company": "Entropyx",
                "type": "Automatización · IA · ATS · Procesos",
                "summary": "Diseño de un ATS propio como activo operativo inicial para gestionar oportunidades, candidatos y seguimiento.",
                "desc": "Diseñé un ATS propio durante el lanzamiento de Entropyx como herramienta inicial para gestionar oportunidades, candidatos y seguimiento sin depender de herramientas externas. El proyecto integró mirada de procesos, automatización, trazabilidad, indicadores e IA aplicada a flujos de gestión.",
                "tools": [
                    "ATS",
                    "automatización",
                    "IA generativa",
                    "Airtable",
                    "herramientas low-code/no-code",
                    "diseño funcional"
                ],
                "skills": [
                    "Diseño funcional",
                    "automatización",
                    "IA",
                    "procesos",
                    "gestión de información",
                    "HR Tech"
                ]
            },
            {
                "title": "Evaluación de plataformas de IA para recruiting",
                "company": "ASE Obra Social · Medifé · Sanatorio Finochietto",
                "type": "IA · HR Tech · Evaluación funcional · Business case",
                "summary": "Evaluación de herramientas de IA para procesos de recruiting y mejora de selección.",
                "desc": "Evalué plataformas de IA aplicadas a recruiting, analizando funcionalidad, impacto potencial, costos, aplicación al proceso de selección y viabilidad de implementación. El trabajo incluyó armado de propuestas y business cases para presentar alternativas de mejora tecnológica.",
                "tools": [
                    "Evaluación funcional",
                    "IA para recruiting",
                    "HR Tech",
                    "business case",
                    "análisis costo/beneficio"
                ],
                "skills": [
                    "HR Tech",
                    "IA",
                    "análisis funcional",
                    "evaluación de soluciones",
                    "mirada de negocio"
                ]
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
            if (projectDetailDesc) projectDetailDesc.innerHTML = proj.desc;

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
