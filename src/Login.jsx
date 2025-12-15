import { GoogleLoginButton } from "@logora/debate.auth.google_login_button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useTranslate } from "react-admin";
import styles from "./Login.module.scss";

export const Login = ({
	isLoading,
	onSubmit,
	onAuth,
	googleClientId,
	callbackUrl,
	className = ""
}) => {
	const translate = useTranslate();
	const [showPassword, setShowPassword] = useState(false);
	const getDefaultEmail = () => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			return urlParams.get("email") || "";
		}
		return "";
	};
	const [password, setPassword] = useState("");
	const [userEmail, setUserEmail] = useState(getDefaultEmail());

	const handleSubmit = (event, code = null) => {
		event?.preventDefault();
		if (code) {
			const userParams = {
				grant_type: "assertion",
				assertion_type: "google",
				assertion: code,
			};
			onAuth && onAuth({ type: "login", method: "google" });
			onSubmit(userParams);
		} else {
			const userParams = {
				grant_type: "password",
				username: userEmail,
				password: password,
			};
			onAuth && onAuth({ type: "login", method: "password" });
			onSubmit(userParams);
		}
	};

	return (
		<div className={`${styles.container} ${className}`.trim()}>
			{googleClientId && callbackUrl &&
				<>
					<GoogleLoginButton
						text={translate("auth.login.google_login")}
						googleClientId={googleClientId}
						redirectUri={callbackUrl}
						onCode={(code) => handleSubmit(null, code)}
					/>
					<div className={styles.separator}>{translate("auth.login.separator")}</div>
				</>
			}
			<form className={styles.form} onSubmit={(event) => handleSubmit(event)} aria-label={translate("auth.login.title")}
				autoComplete="on"
			>
				<TextField
					required
					className={styles.formInput}
					id="email"
					type="email"
					label={translate("auth.login.labels.email")}
					value={userEmail}
					onChange={(e) => setUserEmail(e.target.value)}
					inputProps={{
						"aria-required": true,
						"aria-label": translate("auth.login.labels.email"),
						"autoComplete": "email"
					}}
				/>
				<TextField
					required
					type={showPassword ? "text" : "password"}
					className={styles.formInput}
					id="password"
					label={translate("auth.login.labels.password")}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					inputProps={{
						"aria-required": true,
						"aria-label": translate("auth.login.labels.password"),
						"autoComplete": "current-password"
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label={showPassword ? translate("auth.login.hide_password") : translate("auth.login.show_password")}
									title={showPassword ? translate("auth.login.hide_password") : translate("auth.login.show_password")}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				{isLoading ? (
					<CircularProgress />
				) : (
					<Button type="submit" className={styles.submitButton} aria-label={translate("auth.login.submit")}>
						{translate("auth.login.submit")}
					</Button>
				)}
			</form>
		</div>
	);
};
