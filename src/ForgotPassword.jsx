import React, { useState } from "react";
import { useTranslate, useAuthProvider } from "react-admin";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthLayout } from "./AuthLayout";
import styles from "./ForgotPassword.module.scss";

export const ForgotPassword = ({ 
	loginUrl = "#/login",
	applicationParam = "application",
	redirectUrlParam = "redirect_url",
	className = ""
}) => {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const authProvider = useAuthProvider();
	const translate = useTranslate();

    const getParam = (name) => {
        if (typeof window === "undefined") return undefined;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(name);
    };

	const submit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		const application = getParam(applicationParam);
		const redirectUrl = getParam(redirectUrlParam);
		authProvider
			.recoverPassword({ email, application, redirectUrl })
			.then(() => true)
			.catch(() => true);
	};

	return (
		<AuthLayout
			title={translate("auth.forgot_password.title")}
			className={className}
		>
			{!submitted ? (
				<form className={styles.container} onSubmit={submit} aria-label={translate("auth.forgot_password.title")}
					autoComplete="on"
				>
					<TextField
						required
						type="email"
						className={styles.formInput}
						id="email"
						label={translate("auth.forgot_password.labels.email")}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						inputProps={{
							"aria-required": true,
							"aria-label": translate("auth.forgot_password.labels.email"),
							"autoComplete": "email"
						}}
					/>
					<Button type="submit" variant="contained" className={styles.submitButton} aria-label={translate("auth.forgot_password.submit")}
					>
						{translate("auth.forgot_password.submit")}
					</Button>
				</form>
			) : (
				<div className={styles.container}>
					<div role="status" aria-live="polite" tabIndex={0} style={{ outline: "none" }}>
						{translate("auth.forgot_password.success")}
					</div>
					<Button href={loginUrl} variant="contained" className={styles.submitButton} aria-label={translate("auth.reset_password.redirect_to_login")}
						autoFocus
					>
						{translate("auth.reset_password.redirect_to_login")}
					</Button>
				</div>
			)}
		</AuthLayout>
	);
};
