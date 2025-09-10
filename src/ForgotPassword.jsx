import React, { useState } from "react";
import { useTranslate, useDataProvider } from "react-admin";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthLayout } from "./AuthLayout";
import styles from "./ForgotPassword.module.scss";

export const ForgotPassword = ({ loginUrl = "#/login" }) => {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const dataProvider = useDataProvider();
	const translate = useTranslate();

	const submit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const application = urlParams.get("application");
		const redirectUrl = urlParams.get("redirect_url");
		dataProvider
			.recoverPassword({ email, application, redirectUrl })
			.then(() => true)
			.catch(() => true);
	};

	return (
		<AuthLayout
			title={translate("auth.forgot_password.title")}
		>
			{!submitted ? (
				<form className={styles.container} onSubmit={submit}>
					<TextField
						required
						type="email"
						className={styles.formInput}
						id="email"
						label={translate("auth.forgot_password.labels.email")}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button type="submit" variant="contained" className={styles.submitButton}>
						{translate("auth.forgot_password.submit")}
					</Button>
				</form>
			) : (
				<div className={styles.container}>
					<div>
						{translate("auth.forgot_password.success")}
					</div>
					<Button href={loginUrl} variant="contained" className={styles.submitButton}>
						{translate("auth.reset_password.redirect_to_login")}
					</Button>
				</div>
			)}
		</AuthLayout>
	);
};
