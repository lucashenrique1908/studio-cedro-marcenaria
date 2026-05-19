import { useState } from "react";
import FieldError from "../components/forms/FieldError.jsx";
import casalImg from "../assets/fotoCasal/fotoLogo.jpeg";
import {
	WHATSAPP_NUMBER,
	budgetInitialValues,
	budgetServices,
	careerInitialValues,
	careerRoles,
	reviewInitialValues,
} from "../data/forms.js";
import { validateBudgetForm } from "../utils/formValidation.js";

function buildWhatsAppUrl(message) {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Home() {
	const maxVisibleReviews = 5;
	const [budgetForm, setBudgetForm] = useState(budgetInitialValues);
	const [budgetErrors, setBudgetErrors] = useState({});
	const [isCareerOpen, setIsCareerOpen] = useState(false);
	const [careerForm, setCareerForm] = useState(careerInitialValues);
	const [careerSent, setCareerSent] = useState(false);
	const [reviewForm, setReviewForm] = useState(reviewInitialValues);
	const [reviewMessage, setReviewMessage] = useState("");
	const [isReviewMessageVisible, setIsReviewMessageVisible] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [isReviewListExpanded, setIsReviewListExpanded] = useState(false);
	const visibleReviews = isReviewListExpanded
		? reviews
		: reviews.slice(0, maxVisibleReviews);
	const hasHiddenReviews = reviews.length > maxVisibleReviews;

	function updateBudgetField(event) {
		const { name, value } = event.target;
		setBudgetForm((currentForm) => ({ ...currentForm, [name]: value }));
		setBudgetErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
	}

	function updateCareerField(event) {
		const { name, value, files } = event.target;
		setCareerForm((currentForm) => ({
			...currentForm,
			[name]: files?.[0]?.name || value,
		}));
	}

	function updateReviewField(event) {
		const { name, value } = event.target;
		setReviewForm((currentForm) => ({ ...currentForm, [name]: value }));
	}

	function handleBudgetSubmit(event) {
		event.preventDefault();

		const errors = validateBudgetForm(budgetForm);
		setBudgetErrors(errors);

		if (Object.keys(errors).length > 0) {
			return;
		}

		const message = [
			"Olá estava no seu website",
			`Nome: ${budgetForm.name}`,
			`Email: ${budgetForm.email}`,
			`Telefone: ${budgetForm.phone}`,
			`Serviço desejado: ${budgetForm.service}`,
			`Localidade: ${budgetForm.location}`,
			`Descrição: ${budgetForm.details}`,
		].join("\n");

		window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
	}

	function handleCareerSubmit(event) {
		event.preventDefault();

		const message = [
			"Olá estava no seu website",
			"Candidatura recebida pelo formulário Trabalhe conosco",
			`Nome: ${careerForm.name}`,
			`Email: ${careerForm.email}`,
			`Telefone: ${careerForm.phone}`,
			`Função: ${careerForm.role}`,
			`Currículo anexado: ${careerForm.resume || "Não informado"}`,
		].join("\n");

		window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
		setCareerSent(true);
	}

	function handleReviewSubmit(event) {
		event.preventDefault();

		setReviews((currentReviews) => [
			{
				name: reviewForm.name,
				rating: reviewForm.rating,
				opinion: reviewForm.opinion,
				date: new Date().toISOString(),
			},
			...currentReviews,
		]);

		setReviewMessage(
			reviewForm.rating <= 2
				? "Agradecemos sua opinião e vamos melhorar"
				: "Ficamos super felizes com sua avaliação!",
		);
		setIsReviewMessageVisible(true);

		setReviewForm(reviewInitialValues);

		window.setTimeout(() => {
			setIsReviewMessageVisible(false);
		}, 3000);
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
					Projetos que transformam ambientes em experiências
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
						experiência de Keyson, marceneiro por vocação e empreendedor movido
						por propósito. Após anos transformando projetos em ambientes reais,
						surgiu o desejo de criar uma marcenaria que unisse técnica, inovação
						e cuidado em cada detalhe.
					</p>
					<p>
						Somos especializados em móveis sob medida, desenvolvidos para
						atender com precisão às necessidades de cada cliente. Cada projeto é
						único, pensado para unir funcionalidade, estética e acabamento
						refinado, sempre com respeito ao conceito arquitetônico, aos prazos
						e à qualidade final.
					</p>
					<p>
						Na Studio Cedro, acreditamos que marcenaria vai além da madeira. É
						compromisso, confiança e dedicação. Trabalhamos para transformar
						ideias em soluções personalizadas, entregando ambientes que refletem
						estilo, conforto e personalidade.
					</p>
				</div>
			</section>

			<section
				className="container home-form-section"
				aria-label="Formulário de orçamento"
			>
				<div className="home-form-section__intro">
					<span className="page-eyebrow">Orçamento</span>
					<h2>Conte um pouco sobre o seu projeto</h2>
					<p>
						Preencha os dados e envie direto para o WhatsApp da Studio Cedro
						Marcenaria.
					</p>
				</div>

				<form className="lead-form" onSubmit={handleBudgetSubmit} noValidate>
					<label>
						Nome
						<input
							name="name"
							type="text"
							value={budgetForm.name}
							onChange={updateBudgetField}
							aria-invalid={Boolean(budgetErrors.name)}
							aria-describedby={budgetErrors.name ? "budget-name-error" : undefined}
						/>
						<FieldError id="budget-name-error" message={budgetErrors.name} />
					</label>

					<label>
						Email
						<input
							name="email"
							type="email"
							value={budgetForm.email}
							onChange={updateBudgetField}
							placeholder="seu@email.com"
							title="Digite um e-mail válido"
							aria-invalid={Boolean(budgetErrors.email)}
							aria-describedby={budgetErrors.email ? "budget-email-error" : undefined}
						/>
						<FieldError id="budget-email-error" message={budgetErrors.email} />
					</label>

					<label>
						Telefone
						<input
							name="phone"
							type="tel"
							value={budgetForm.phone}
							onChange={updateBudgetField}
							placeholder="(21) 99999-9999"
							title="Digite um telefone válido com DDD. Ex: (21) 99999-9999"
							aria-invalid={Boolean(budgetErrors.phone)}
							aria-describedby={budgetErrors.phone ? "budget-phone-error" : undefined}
						/>
						<FieldError id="budget-phone-error" message={budgetErrors.phone} />
					</label>

					<label>
						Tipo de serviço desejado
						<select
							name="service"
							value={budgetForm.service}
							onChange={updateBudgetField}
							aria-invalid={Boolean(budgetErrors.service)}
							aria-describedby={
								budgetErrors.service ? "budget-service-error" : undefined
							}
						>
							{budgetServices.map((service) => (
								<option key={service} value={service}>
									{service}
								</option>
							))}
						</select>
						<FieldError id="budget-service-error" message={budgetErrors.service} />
					</label>

					<label>
						Localidade
						<input
							name="location"
							type="text"
							value={budgetForm.location}
							onChange={updateBudgetField}
							aria-invalid={Boolean(budgetErrors.location)}
							aria-describedby={
								budgetErrors.location ? "budget-location-error" : undefined
							}
						/>
						<FieldError id="budget-location-error" message={budgetErrors.location} />
					</label>

					<label className="lead-form__full">
						Descreva o que pretende com a empresa
						<textarea
							name="details"
							rows="5"
							value={budgetForm.details}
							onChange={updateBudgetField}
							aria-invalid={Boolean(budgetErrors.details)}
							aria-describedby={
								budgetErrors.details ? "budget-details-error" : undefined
							}
						/>
						<FieldError id="budget-details-error" message={budgetErrors.details} />
					</label>

					<button className="lead-form__submit" type="submit">
						Quero fazer um orçamento
					</button>
				</form>
			</section>

			<section className="container home-review-section" aria-label="Avaliação">
				<div className="home-form-section__intro">
					<span className="page-eyebrow">Avaliação</span>
					<h2>Conte como foi sua experiência</h2>
				</div>

				<form className="lead-form review-form" onSubmit={handleReviewSubmit}>
					<label>
						Nome
						<input
							name="name"
							type="text"
							value={reviewForm.name}
							onChange={updateReviewField}
							required
						/>
					</label>

					<fieldset className="review-form__stars">
						<legend>Estrelas</legend>
						<div className="review-form__star-row">
							{[1, 2, 3, 4, 5].map((rating) => (
								<button
									className={`review-form__star ${
										rating <= reviewForm.rating
											? "review-form__star--active"
											: ""
									}`}
									key={rating}
									type="button"
									aria-label={`${rating} estrela${rating > 1 ? "s" : ""}`}
									aria-pressed={rating <= reviewForm.rating}
									onClick={() =>
										setReviewForm((currentForm) => ({ ...currentForm, rating }))
									}
								>
									★
								</button>
							))}
						</div>
					</fieldset>

					<label className="lead-form__full">
						Descreva sua opnião
						<textarea
							name="opinion"
							rows="5"
							value={reviewForm.opinion}
							onChange={updateReviewField}
							required
						/>
					</label>

					<button className="lead-form__submit" type="submit">
						Enviar Sua avaliação
					</button>
				</form>

				{reviewMessage && (
					<p
						className={`review-form__message ${
							isReviewMessageVisible ? "review-form__message--visible" : ""
						}`}
						role="status"
					>
						{reviewMessage}
					</p>
				)}

				{reviews.length > 0 && (
					<div className="review-list">
						<h3>Comentários recentes</h3>
						<ul>
							{visibleReviews.map((review) => (
								<li key={`${review.date}-${review.name}`} className="review-list__item">
									<strong>{review.name}</strong> —{" "}
									<span>
										{Array.from({ length: 5 }, (_, i) => (
											<span
												key={i}
												style={{
													color: i < review.rating ? "#FFD700" : "#ccc",
												}}
											>
												★
											</span>
										))}
									</span>
									<div>{review.opinion}</div>
								</li>
							))}
						</ul>
						{hasHiddenReviews && (
							<button
								className="review-list__toggle"
								type="button"
								onClick={() =>
									setIsReviewListExpanded((currentValue) => !currentValue)
								}
							>
								{isReviewListExpanded ? "Ver menos" : "Ver mais…"}
							</button>
						)}
					</div>
				)}
			</section>

			<section className="container home-links" aria-label="Links úteis">
				<a
					href="https://www.instagram.com/studiocedromarcenaria/"
					target="_blank"
					rel="noreferrer"
				>
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
								<h2>
									Sua candidatura foi enviada e iremos avaliar seu currículo,
									Obrigado!
								</h2>
							</div>
						) : (
							<>
								<span className="page-eyebrow">Trabalhe conosco</span>
								<h2>Envie sua candidatura</h2>

								<form
									className="lead-form lead-form--career"
									onSubmit={handleCareerSubmit}
								>
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
										<select
											name="role"
											value={careerForm.role}
											onChange={updateCareerField}
										>
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
