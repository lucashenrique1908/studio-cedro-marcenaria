import { useState } from 'react';
import casalImg from '../assets/fotoCasal/generalImg14.jpeg';

const WHATSAPP_NUMBER = '5521995013891';

const budgetInitialValues = {
  name: '',
  email: '',
  phone: '',
  service: 'Quero fazer um orçamento',
  location: '',
  details: '',
};

const careerInitialValues = {
  name: '',
  email: '',
  phone: '',
  role: 'Arquiteto',
  resume: '',
};

const budgetServices = [
  'Quero fazer um orçamento',
  'Quero fazer um grande projeto',
  'Quero fazer um planejamento',
  'Apenas Pesquisando valores',
];

const careerRoles = ['Arquiteto', 'Motorista', 'Marceneiro'];

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Home() {
  const [budgetForm, setBudgetForm] = useState(budgetInitialValues);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [careerForm, setCareerForm] = useState(careerInitialValues);
  const [careerSent, setCareerSent] = useState(false);

  function updateBudgetField(event) {
    const { name, value } = event.target;
    setBudgetForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function updateCareerField(event) {
    const { name, value, files } = event.target;
    setCareerForm((currentForm) => ({
      ...currentForm,
      [name]: files?.[0]?.name || value,
    }));
  }

  function handleBudgetSubmit(event) {
    event.preventDefault();

    const message = [
      'Olá estava no seu website',
      `Nome: ${budgetForm.name}`,
      `Email: ${budgetForm.email}`,
      `Telefone: ${budgetForm.phone}`,
      `Serviço desejado: ${budgetForm.service}`,
      `Localidade: ${budgetForm.location}`,
      `Descrição: ${budgetForm.details}`,
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  function handleCareerSubmit(event) {
    event.preventDefault();

    const message = [
      'Olá estava no seu website',
      'Candidatura recebida pelo formulário Trabalhe conosco',
      `Nome: ${careerForm.name}`,
      `Email: ${careerForm.email}`,
      `Telefone: ${careerForm.phone}`,
      `Função: ${careerForm.role}`,
      `Currículo anexado: ${careerForm.resume || 'Não informado'}`,
    ].join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    setCareerSent(true);
  }

  function closeCareerModal() {
    setIsCareerOpen(false);
    setCareerSent(false);
    setCareerForm(careerInitialValues);
  }

  function handleCareerBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeCareerModal();
    }
  }

  return (
    <section className="home-page">
      <div className="container home-hero">
        <span className="page-eyebrow tracking-in-expand">
          Projetos que transformam ambientes em experiencias
        </span>
        <h1 className="home-hero__title text-focus-in">
          Mais de 15 Anos Tirando seu projeto do papel
        </h1>
      </div>

      <section className="container home-about" aria-label="Sobre nós">
        <img
          className="home-about__image"
          src={casalImg}
          alt="Casal representante da Studio Cedro Marcenaria"
        />

        <div className="home-about__content text-pop-up-top">
          <h2>SOBRE NÓS</h2>
          <p>
            A Studio Cedro Marcenaria nasceu da paixão pelo fazer artesanal e da
            experiência de Keyson, marceneiro por vocação e empreendedor movido por
            propósito. Após anos transformando projetos em ambientes reais, surgiu o
            desejo de criar uma marcenaria que unisse técnica, inovação e cuidado em
            cada detalhe.
          </p>
          <p>
            Somos especializados em móveis sob medida, desenvolvidos para atender com
            precisão às necessidades de cada cliente. Cada projeto é único, pensado
            para unir funcionalidade, estética e acabamento refinado, sempre com
            respeito ao conceito arquitetônico, aos prazos e à qualidade final.
          </p>
          <p>
            Na Studio Cedro, acreditamos que marcenaria vai além da madeira. É
            compromisso, confiança e dedicação. Trabalhamos para transformar ideias em
            soluções personalizadas, entregando ambientes que refletem estilo,
            conforto e personalidade.
          </p>
        </div>
      </section>

      <section className="container home-form-section" aria-label="Formulário de orçamento">
        <div className="home-form-section__intro">
          <span className="page-eyebrow">Orçamento</span>
          <h2>Conte um pouco sobre o seu projeto</h2>
          <p>
            Preencha os dados e envie direto para o WhatsApp da Studio Cedro
            Marcenaria.
          </p>
        </div>

        <form className="lead-form" onSubmit={handleBudgetSubmit}>
          <label>
            Nome
            <input
              name="name"
              type="text"
              value={budgetForm.name}
              onChange={updateBudgetField}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={budgetForm.email}
              onChange={updateBudgetField}
              required
            />
          </label>

          <label>
            Telefone
            <input
              name="phone"
              type="tel"
              value={budgetForm.phone}
              onChange={updateBudgetField}
              required
            />
          </label>

          <label>
            Tipo de serviço desejado
            <select
              name="service"
              value={budgetForm.service}
              onChange={updateBudgetField}
            >
              {budgetServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label>
            Localidade (cidade e estado)
            <input
              name="location"
              type="text"
              value={budgetForm.location}
              onChange={updateBudgetField}
              required
            />
          </label>

          <label className="lead-form__full">
            Descreva o que pretende com a empresa
            <textarea
              name="details"
              rows="5"
              value={budgetForm.details}
              onChange={updateBudgetField}
              required
            />
          </label>

          <button className="lead-form__submit" type="submit">
            Quero fazer um orçamento
          </button>
        </form>
      </section>

      <section className="container home-links" aria-label="Links úteis">
        <a href="https://www.instagram.com/studiocedromarcenaria/" target="_blank" rel="noreferrer">
          Siga-nos no instagram
        </a>
        <button type="button" onClick={() => setIsCareerOpen(true)}>
          Trabalhe conosco
        </button>
      </section>

      {isCareerOpen && (
        <section
          className="career-modal"
          aria-label="Formulário Trabalhe conosco"
          onClick={handleCareerBackdropClick}
        >
          <div className="career-modal__panel" role="dialog" aria-modal="true">
            <button
              className="career-modal__close"
              type="button"
              aria-label="Fechar Trabalhe conosco"
              onClick={closeCareerModal}
            >
              X
            </button>

            {careerSent ? (
              <div className="career-modal__message">
                <h2>Sua candidatura foi enviada e iremos avaliar seu currículo, Obrigado!</h2>
              </div>
            ) : (
              <>
                <span className="page-eyebrow">Trabalhe conosco</span>
                <h2>Envie sua candidatura</h2>

                <form className="lead-form lead-form--career" onSubmit={handleCareerSubmit}>
                  <label>
                    Nome
                    <input
                      name="name"
                      type="text"
                      value={careerForm.name}
                      onChange={updateCareerField}
                      required
                    />
                  </label>

                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      value={careerForm.email}
                      onChange={updateCareerField}
                      required
                    />
                  </label>

                  <label>
                    Telefone
                    <input
                      name="phone"
                      type="tel"
                      value={careerForm.phone}
                      onChange={updateCareerField}
                      required
                    />
                  </label>

                  <label>
                    Função
                    <select name="role" value={careerForm.role} onChange={updateCareerField}>
                      {careerRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="lead-form__full">
                    Anexar currículo
                    <input
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={updateCareerField}
                    />
                  </label>

                  <button className="lead-form__submit" type="submit">
                    enviar candidatura
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      )}
    </section>
  );
}

export default Home;
