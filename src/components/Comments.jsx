import { useEffect, useState } from "react";

const commentsStorageKey = "studio-cedro-reviews";
const initialCommentForm = {
	name: "",
	rating: 1,
	text: "",
};

function formatCommentDate(createdAt) {
	if (!createdAt) {
		return "Agora";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(new Date(createdAt));
}

function Comments() {
	const maxVisibleReviews = 5;
	const [commentForm, setCommentForm] = useState(initialCommentForm);
	const [comments, setComments] = useState([]);
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isReviewListExpanded, setIsReviewListExpanded] = useState(false);

	const visibleComments = isReviewListExpanded
		? comments
		: comments.slice(0, maxVisibleReviews);
	const hasHiddenComments = comments.length > maxVisibleReviews;

	useEffect(() => {
		const storedComments = window.localStorage.getItem(commentsStorageKey);

		if (storedComments) {
			try {
				setComments(JSON.parse(storedComments));
			} catch {
				window.localStorage.removeItem(commentsStorageKey);
			}
		}
	}, []);

	function updateCommentField(event) {
		const { name, value } = event.target;
		setCommentForm((currentForm) => ({ ...currentForm, [name]: value }));
	}

	function handleCommentSubmit(event) {
		event.preventDefault();

		const name = commentForm.name.trim();
		const text = commentForm.text.trim();

		if (!name || !text) {
			setFeedbackMessage("Preencha seu nome e comentário antes de enviar.");
			setIsFeedbackVisible(true);
			return;
		}

		try {
			setIsSubmitting(true);

			const nextComments = [{
				id: `${Date.now()}-${globalThis.crypto?.randomUUID?.() || Math.random()}`,
				name,
				text,
				rating: Number(commentForm.rating),
				createdAt: new Date().toISOString(),
			}, ...comments];

			setComments(nextComments);
			window.localStorage.setItem(commentsStorageKey, JSON.stringify(nextComments));

			setFeedbackMessage(
				commentForm.rating <= 2
					? "Agradecemos sua opinião e vamos melhorar."
					: "Ficamos super felizes com sua avaliação!",
			);
			setCommentForm(initialCommentForm);
		} catch (error) {
			console.error("Erro ao salvar avaliação:", error);
			setFeedbackMessage("Não foi possível enviar sua avaliação agora.");
		} finally {
			setIsSubmitting(false);
			setIsFeedbackVisible(true);

			window.setTimeout(() => {
				setIsFeedbackVisible(false);
			}, 3000);
		}
	}

	return (
		<section className="container home-review-section" aria-label="Avaliação">
			<div className="home-form-section__intro">
				<span className="page-eyebrow">Avaliação</span>
				<h2>Conte como foi sua experiência</h2>
			</div>

			<form className="lead-form review-form" onSubmit={handleCommentSubmit}>
				<label>
					Nome
					<input
						name="name"
						type="text"
						value={commentForm.name}
						onChange={updateCommentField}
						required
					/>
				</label>

				<fieldset className="review-form__stars">
					<legend>Estrelas</legend>
					<div className="review-form__star-row">
						{[1, 2, 3, 4, 5].map((rating) => (
							<button
								className={`review-form__star ${
									rating <= commentForm.rating ? "review-form__star--active" : ""
								}`}
								key={rating}
								type="button"
								aria-label={`${rating} estrela${rating > 1 ? "s" : ""}`}
								aria-pressed={rating <= commentForm.rating}
								onClick={() =>
									setCommentForm((currentForm) => ({
										...currentForm,
										rating,
									}))
								}
							>
								★
							</button>
						))}
					</div>
				</fieldset>

				<label className="lead-form__full">
					Descreva sua opinião
					<textarea
						name="text"
						rows="5"
						value={commentForm.text}
						onChange={updateCommentField}
						required
					/>
				</label>

				<button className="lead-form__submit" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Enviando..." : "Enviar Sua avaliação"}
				</button>
			</form>

			{feedbackMessage && (
				<p
					className={`review-form__message ${
						isFeedbackVisible ? "review-form__message--visible" : ""
					}`}
					role="status"
				>
					{feedbackMessage}
				</p>
			)}

			{comments.length > 0 && (
				<div className="review-list">
					<h3>Comentários recentes</h3>
					<ul>
						{visibleComments.map((comment) => (
							<li key={comment.id} className="review-list__item">
								<strong>{comment.name}</strong> —{" "}
								<span aria-label={`${comment.rating} estrelas`}>
									{Array.from({ length: 5 }, (_, i) => (
										<span
											key={i}
											style={{
												color: i < comment.rating ? "#FFD700" : "#ccc",
											}}
										>
											★
										</span>
									))}
								</span>
								<div>{comment.text}</div>
								<small>{formatCommentDate(comment.createdAt)}</small>
							</li>
						))}
					</ul>
					{hasHiddenComments && (
						<button
							className="review-list__toggle"
							type="button"
							onClick={() =>
								setIsReviewListExpanded((currentValue) => !currentValue)
							}
						>
							{isReviewListExpanded ? "Ver menos" : "Ver mais..."}
						</button>
					)}
				</div>
			)}
		</section>
	);
}

export default Comments;
