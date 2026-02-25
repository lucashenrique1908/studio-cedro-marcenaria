import { useEffect, useMemo, useRef, useState } from 'react'
import { HiMiniMoon, HiMiniSun } from 'react-icons/hi2'
import logoSrc from '../img/studioMarcenariaProfile.jpg'

const WHATSAPP_NUMBER = '5521999619369'
const WHATSAPP_DISPLAY = '+55 21 99961-9369'
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Quero fazer um orçamento com a Studio Cedro Marcenaria.',
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`
const INSTAGRAM_URL = 'https://www.instagram.com/studiocedromarcenaria/'

const PROJECT_PREVIEW_LIMIT = 8

const SERVICE_ITEMS = [
  {
    title: 'Cozinhas Planejadas',
    text: 'Projetos sob medida para otimizar circulação, armazenamento e estética com acabamento refinado.',
  },
  {
    title: 'Closets e Quartos',
    text: 'Soluções personalizadas para organização, conforto e melhor aproveitamento do espaço.',
  },
  {
    title: 'Painéis e Salas',
    text: 'Integração entre design e funcionalidade para ambientes elegantes e acolhedores.',
  },
  {
    title: 'Móveis Corporativos',
    text: 'Marcenaria sob medida para escritórios, recepções e ambientes comerciais com presença profissional.',
  },
  {
    title: 'Banheiros e Lavabos',
    text: 'Peças sob medida para espaços compactos, com foco em durabilidade e acabamento.',
  },
  {
    title: 'Projetos Personalizados',
    text: 'Desenvolvimento de mobiliário conforme necessidade do cliente e conceito arquitetônico.',
  },
]

const REVIEW_ITEMS = [
  {
    name: 'Atendimento Personalizado',
    text: 'Cada projeto é tratado com atenção aos detalhes, alinhando expectativa, funcionalidade e estética.',
  },
  {
    name: 'Acabamento Refinado',
    text: 'Compromisso com qualidade visual e técnica em todas as etapas, do planejamento à entrega.',
  },
  {
    name: 'Confiança e Compromisso',
    text: 'Experiência de mais de 15 anos em marcenaria aplicada a projetos sob medida no Rio de Janeiro.',
  },
]

const sortMediaEntries = (entries) =>
  entries.sort(([a], [b]) =>
    a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }),
  )

const mapModulesToMedia = (modules, type, prefix) =>
  sortMediaEntries(Object.entries(modules)).map(([path, src], index) => ({
    id: `${prefix}-${index}`,
    src,
    type,
    name: path.split('/').pop() ?? `${prefix}-${index + 1}`,
  }))

const projectImageModules = import.meta.glob(
  '../projetos/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)
const projectVideoModules = import.meta.glob('../projetos/*.{mp4,webm,mov}', {
  eager: true,
  import: 'default',
})

const projectMedia = [
  ...mapModulesToMedia(projectImageModules, 'image', 'project'),
  ...mapModulesToMedia(projectVideoModules, 'video', 'project-video'),
].map((item) => ({ ...item, group: 'projects' }))
const projectImages = projectMedia.filter((item) => item.type === 'image')
const projectVideos = projectMedia.filter((item) => item.type === 'video')

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function createLayoutPattern(length, seed) {
  const pattern = []
  let value = seed || 1

  for (let index = 0; index < length; index += 1) {
    value = (value * 9301 + 49297) % 233280
    pattern.push(value)
  }

  return pattern
}

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === 'woodlight'

  return (
    <button
      type="button"
      className={`theme-toggle ${isLight ? 'is-light' : 'is-dark'}`}
      onClick={onToggle}
      aria-label={isLight ? 'Ativar tema escuro' : 'Ativar tema claro'}
      title={isLight ? 'Tema claro ativo' : 'Tema escuro ativo'}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb" />
        <span className="theme-icon sun" aria-hidden="true">
          <HiMiniSun />
        </span>
        <span className="theme-icon moon" aria-hidden="true">
          <HiMiniMoon />
        </span>
      </span>
    </button>
  )
}

function NavLink({ href, label, activeId }) {
  const targetId = href.replace('#', '')

  return (
    <a className={activeId === targetId ? 'is-active' : ''} href={href}>
      {label}
    </a>
  )
}

function TiltCard({ className = '', children }) {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()

  const onMove = (event) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 10
    const rotateX = (0.5 - y) * 8

    ref.current.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`)
  }

  const reset = () => {
    if (!ref.current) return
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  )
}

function SectionHeader({ eyebrow, title, text, align = 'left' }) {
  return (
    <header className={`section-header align-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p className="section-intro">{text}</p> : null}
    </header>
  )
}

function Gallery({ items, onOpen, layoutPattern, compact = false, tone = 'default' }) {
  if (!items.length) return null

  return (
    <div className={`gallery-grid ${compact ? 'is-compact' : ''} tone-${tone}`}>
      {items.map((item, index) => {
        const token = layoutPattern[index] ?? 0
        const variant = token % 7

        return (
          <figure
            key={item.id}
            className={`gallery-item variant-${variant}`}
            onClick={() => (item.type === 'image' ? onOpen(index) : undefined)}
            onKeyDown={(event) => {
              if (item.type !== 'image') return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpen(index)
              }
            }}
            tabIndex={item.type === 'image' ? 0 : -1}
            role={item.type === 'image' ? 'button' : undefined}
            aria-label={item.type === 'image' ? `Abrir mídia ${index + 1}` : undefined}
          >
            {item.type === 'video' ? (
              <video src={item.src} controls preload="metadata" playsInline />
            ) : (
              <img
                src={item.src}
                alt={`Projeto Studio Cedro ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            )}
            <figcaption>{item.type === 'video' ? 'Vídeo de projeto' : 'Projeto executado'}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}

function Lightbox({ items, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    setIndex(startIndex)
  }, [startIndex])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') {
        setIndex((current) => (current + 1) % items.length)
      }
      if (event.key === 'ArrowLeft') {
        setIndex((current) => (current - 1 + items.length) % items.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [items.length, onClose])

  if (!items.length) return null
  const current = items[index]

  return (
    <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Visualização de imagem">
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Fechar">
        ×
      </button>
      <button
        type="button"
        className="lightbox-nav prev"
        onClick={() => setIndex((currentIndex) => (currentIndex - 1 + items.length) % items.length)}
        aria-label="Imagem anterior"
      >
        ‹
      </button>
      <div className="lightbox-content" onClick={onClose}>
        <div
          className={`lightbox-image-shell tone-${current.group || 'default'}`}
          onClick={(event) => event.stopPropagation()}
        >
          <img src={current.src} alt={`Projeto Studio Cedro ampliado ${index + 1}`} />
        </div>
        <p>
          {index + 1} / {items.length}
        </p>
      </div>
      <button
        type="button"
        className="lightbox-nav next"
        onClick={() => setIndex((currentIndex) => (currentIndex + 1) % items.length)}
        aria-label="Próxima imagem"
      >
        ›
      </button>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('studio-cedro-theme') || 'emerald')
  const [layoutSeed, setLayoutSeed] = useState(() => {
    const saved = Number(localStorage.getItem('studio-cedro-layout-seed'))
    return Number.isFinite(saved) && saved > 0 ? saved : 37
  })
  const [activeSection, setActiveSection] = useState('inicio')
  const [lightbox, setLightbox] = useState({ open: false, items: [], startIndex: 0 })
  const [showFullProjects, setShowFullProjects] = useState(false)

  const projectPattern = useMemo(
    () => createLayoutPattern(projectMedia.length || 1, layoutSeed),
    [layoutSeed],
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('studio-cedro-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('studio-cedro-layout-seed', String(layoutSeed))
  }, [layoutSeed])

  useEffect(() => {
    const sectionIds = [
      'inicio',
      'servicos',
      'projetos',
      'sobre',
      'avaliacoes',
      'contato',
    ]
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.55] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme)
    setLayoutSeed(Math.floor(Math.random() * 100000) + 1)
  }
  const toggleTheme = () => handleThemeChange(theme === 'woodlight' ? 'emerald' : 'woodlight')

  const openLightbox = (items, startIndex) =>
    setLightbox({ open: true, items, startIndex })

  const closeLightbox = () => setLightbox({ open: false, items: [], startIndex: 0 })
  const openProjectLightboxByItemId = (itemId) => {
    const imageIndex = projectImages.findIndex((image) => image.id === itemId)
    if (imageIndex >= 0) openLightbox(projectImages, imageIndex)
  }

  const instagramPreview = projectImages.slice(0, 6)
  const projectMediaPreview = projectMedia.slice(0, PROJECT_PREVIEW_LIMIT)
  const projectMediaExtra = projectMedia.slice(PROJECT_PREVIEW_LIMIT)

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      <header className="topbar">
        <a href="#inicio" className="brand-lockup" aria-label="Studio Cedro Marcenaria">
          <img src={logoSrc} alt="" />
          <div>
            <strong>Studio Cedro</strong>
            <span>Marcenaria</span>
          </div>
        </a>

        <div className="topbar-actions">
          <nav className="nav-links" aria-label="Navegação principal">
            <NavLink href="#inicio" label="Início" activeId={activeSection} />
            <NavLink href="#servicos" label="Serviços" activeId={activeSection} />
            <NavLink href="#projetos" label="Projetos" activeId={activeSection} />
            <NavLink href="#sobre" label="Sobre" activeId={activeSection} />
            <NavLink href="#avaliacoes" label="Avaliações" activeId={activeSection} />
            <NavLink href="#contato" label="Contato" activeId={activeSection} />
          </nav>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main>
        <section id="inicio" className="hero section-anchor">
          <div className="hero-copy">
            <p className="eyebrow">Marcenaria Sob Medida no Rio de Janeiro</p>
            <h1>
              Ambientes planejados para unir estética, funcionalidade e acabamento refinado.
            </h1>
            <p className="hero-text">
              A Studio Cedro Marcenaria desenvolve móveis sob medida para residências e espaços
              comerciais, com atenção ao projeto, ao atendimento e aos detalhes que valorizam seu
              ambiente.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Faça já seu orçamento
              </a>
              <a className="btn btn-secondary" href="#projetos">
                Ver projetos
              </a>
              <a className="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>

            <ul className="hero-metrics" aria-label="Diferenciais da Studio Cedro">
              <li>
                <strong>15+ anos</strong>
                <span>de experiência em marcenaria</span>
              </li>
              <li>
                <strong>Sob medida</strong>
                <span>projetos personalizados para cada cliente</span>
              </li>
              <li>
                <strong>RJ completo</strong>
                <span>atendimento em todo o Rio de Janeiro</span>
              </li>
            </ul>
          </div>

        </section>

        <section id="servicos" className="section section-anchor">
          <SectionHeader
            eyebrow="Serviços"
            title="Soluções em marcenaria para diferentes ambientes"
            text="Atendimento residencial e comercial com foco em funcionalidade, estética e execução personalizada."
          />
          <div className="service-grid">
            {SERVICE_ITEMS.map((service, index) => (
              <article key={service.title} className={`service-card accent-${(layoutSeed + index) % 5}`}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projetos" className="section section-anchor">
          <SectionHeader
            eyebrow="Projetos"
            title="Portfólio de ambientes executados"
            text="Prévia dos projetos para deixar a navegação mais objetiva. Clique nas imagens para ampliar."
          />

          <Gallery
            items={projectMediaPreview}
            layoutPattern={projectPattern}
            tone="projects"
            onOpen={(index) => {
              openProjectLightboxByItemId(projectMediaPreview[index]?.id)
            }}
          />

          {projectMediaExtra.length > 0 ? (
            <div className="gallery-expand-card">
              <div>
                <p className="gallery-expand-title">Mais fotos e vídeos</p>
                <p className="gallery-expand-note">
                  A seção principal mostra uma prévia. Abra a galeria complementar para ver todo o material.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFullProjects((current) => !current)}
                aria-expanded={showFullProjects}
                aria-controls="projetos-completo"
              >
                {showFullProjects ? 'Ocultar galeria completa' : 'Ver galeria completa'}
              </button>
            </div>
          ) : null}

          {showFullProjects && projectMediaExtra.length > 0 ? (
            <div id="projetos-completo" className="sub-gallery-section">
              <SectionHeader
                eyebrow="Galeria complementar"
                title="Fotos e vídeos adicionais"
                text="Área preparada para crescer sem alongar demais a página principal."
              />
              <Gallery
                items={projectMediaExtra}
                layoutPattern={projectPattern.slice(PROJECT_PREVIEW_LIMIT)}
                tone="projects"
                onOpen={(index) => {
                  openProjectLightboxByItemId(projectMediaExtra[index]?.id)
                }}
              />
            </div>
          ) : null}

          {projectVideos.length > 0 ? (
            <p className="section-note">
              Também há {projectVideos.length} vídeo(s) de projeto incluído(s) na galeria.
            </p>
          ) : null}
        </section>

        <section id="sobre" className="section section-anchor">
          <div className="about-layout">
            <div>
              <SectionHeader
                eyebrow="Sobre nós"
                title="Marcenaria com técnica, propósito e atenção a cada detalhe"
              />
              <div className="about-copy">
                <p>
                  A Studio Cedro Marcenaria nasceu da paixão pelo fazer artesanal e da experiência
                  de Keyson, marceneiro por vocação e empreendedor movido por propósito. Após anos
                  transformando projetos em ambientes reais, surgiu o desejo de criar uma
                  marcenaria que unisse técnica, inovação e cuidado em cada detalhe.
                </p>
                <p>
                  Somos especializados em móveis sob medida, desenvolvidos para atender com
                  precisão às necessidades de cada cliente. Cada projeto é único, pensado para unir
                  funcionalidade, estética e acabamento refinado, sempre com respeito ao conceito
                  arquitetônico, aos prazos e à qualidade final.
                </p>
                <p>
                  Na Studio Cedro, acreditamos que marcenaria vai além da madeira. É compromisso,
                  confiança e dedicação. Trabalhamos para transformar ideias em soluções
                  personalizadas, entregando ambientes que refletem estilo, conforto e
                  personalidade.
                </p>
              </div>
            </div>

            <TiltCard className="about-brand-panel">
              <img src={logoSrc} alt="Logo Studio Cedro Marcenaria" />
              <div className="brand-text-stack" aria-label="Marca Studio Cedro Marcenaria">
                <span>STUDIO</span>
                <span>CEDRO</span>
                <small>MARCENARIA</small>
              </div>
              <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Solicitar orçamento
              </a>
            </TiltCard>
          </div>
        </section>

        <section id="avaliacoes" className="section section-anchor">
          <SectionHeader
            eyebrow="Avaliações"
            title="Uma seção preparada para prova social"
            text="Enquanto a página cresce, você já pode direcionar visitantes para o Instagram e adicionar futuras avaliações reais sem refazer o layout."
          />

          <div className="review-grid">
            {REVIEW_ITEMS.map((review, index) => (
              <article key={review.name} className={`review-card tone-${(layoutSeed + index) % 3}`}>
                <div className="stars" aria-hidden="true">
                  ★★★★★
                </div>
                <h3>{review.name}</h3>
                <p>{review.text}</p>
              </article>
            ))}
          </div>

          <div className="instagram-panel">
            <div>
              <p className="eyebrow">Instagram</p>
              <h3>@studioCedroMarcenaria</h3>
              <p>
                Feed visual para reforçar presença nas redes sociais e apoiar o tráfego de anúncios.
              </p>
            </div>
            <a className="btn btn-secondary" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Abrir Instagram
            </a>
          </div>

          <div className="instagram-grid" aria-label="Prévia visual de publicações">
            {instagramPreview.map((image, index) => (
              <button
                key={`ig-${image.id}`}
                type="button"
                className="instagram-tile"
                onClick={() => openLightbox(projectImages, index)}
                aria-label={`Abrir prévia ${index + 1}`}
              >
                <img src={image.src} alt={`Prévia de Instagram ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        <section id="contato" className="section section-anchor contact-section">
          <SectionHeader
            eyebrow="Contato"
            title="Vamos tirar seu projeto do papel?"
            text="Atendimento em todo o Rio de Janeiro. Fale com a Studio Cedro e envie suas ideias para orçamento."
          />

          <div className="contact-grid">
            <div className="contact-card">
              <h3>Faça já seu orçamento</h3>
              <p>
                Clique no WhatsApp para falar diretamente com a empresa e iniciar seu atendimento.
              </p>
              <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                Chamar no WhatsApp
              </a>
              <p className="contact-detail">{WHATSAPP_DISPLAY}</p>
            </div>

            <div className="contact-card">
              <h3>Instagram oficial</h3>
              <p>
                Conheça mais projetos e acompanhe novas entregas no perfil da Studio Cedro
                Marcenaria.
              </p>
              <a className="btn btn-secondary" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                Abrir @studioCedroMarcenaria
              </a>
              <p className="contact-detail">@studioCedroMarcenaria</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src={logoSrc} alt="" />
          <div>
            <strong>Studio Cedro Marcenaria</strong>
            <p>Projetos sob medida em todo o Rio de Janeiro.</p>
          </div>
        </div>

        <div className="footer-links">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="#inicio">Voltar ao topo</a>
        </div>
      </footer>

      {lightbox.open ? (
        <Lightbox
          items={lightbox.items}
          startIndex={lightbox.startIndex}
          onClose={closeLightbox}
        />
      ) : null}
    </div>
  )
}

export default App
