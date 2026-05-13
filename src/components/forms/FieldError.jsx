function FieldError({ id, message }) {
	if (!message) {
		return null;
	}

	return (
		<span className="lead-form__error" id={id}>
			{message}
		</span>
	);
}

export default FieldError;
