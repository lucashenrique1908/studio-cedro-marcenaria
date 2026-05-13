export function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
	// Keeps the current accepted Brazilian phone formats, including optional country code.
	return /^(\+?\d{2,3})?\s*\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/.test(phone);
}

export function validateBudgetForm(form) {
	const errors = {};

	if (!form.name.trim()) {
		errors.name = "Informe seu nome.";
	}

	if (!form.email.trim()) {
		errors.email = "Informe seu e-mail.";
	} else if (!validateEmail(form.email)) {
		errors.email = "Insira um e-mail válido.";
	}

	if (!form.phone.trim()) {
		errors.phone = "Informe seu telefone.";
	} else if (!validatePhone(form.phone)) {
		errors.phone = "Insira um telefone válido com DDD. Ex: (21) 99999-9999";
	}

	if (!form.service.trim()) {
		errors.service = "Selecione o tipo de serviço.";
	}

	if (!form.location.trim()) {
		errors.location = "Informe sua localidade.";
	}

	if (!form.details.trim()) {
		errors.details = "Descreva o que pretende com a empresa.";
	}

	return errors;
}
