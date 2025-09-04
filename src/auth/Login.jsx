import { GoogleLoginButton } from "@logora/debate.auth.google_login_button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TextField, IconButton, InputAdornment, Button, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import styles from "./Login.module.scss";

export const Login = ({ isLoading, onSubmit, googleClientId, callbackUrl }) => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const translate = useTranslate();
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState("");
	const [userEmail, setUserEmail] = useState(urlParams.get("email") || "");

	useEffect(() => {
		localStorage.removeItem("currentUser");
		localStorage.removeItem("currentApplication");
	}, []);

	const handleSubmit = (event, code = null) => {
		event?.preventDefault();
		if (code) {
			const userParams = {
				grant_type: "assertion",
				assertion_type: "google",
				assertion: code,
			};
			onSubmit(userParams);
		} else {
			const userParams = {
				grant_type: "password",
				username: userEmail,
				password: password,
			};
			onSubmit(userParams);
		}
	};

	return (
		<>
			<div className={styles.socialLogin}>
				<GoogleLoginButton
					text={translate("pos.login.google_login")}
					googleClientId={googleClientId}
					redirectUri={callbackUrl}
					onCode={(code) => handleSubmit(null, code)}
				/>
			</div>
			<div className={styles.separationContainer}>
				<div>{translate("pos.login.or_login")}</div>
			</div>
			<form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
				<TextField
					required
					className={styles.formInput}
					id="email"
					type="email"
					label={translate("pos.login.email")}
					value={userEmail}
					onChange={(e) => setUserEmail(e.target.value)}
				/>
				<TextField
					required
					type={showPassword ? "text" : "password"}
					className={styles.formInput}
					id="password"
					label={translate("pos.login.password")}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									title={
										showPassword
											? translate("pos.login.hide_password")
											: translate("pos.login.show_password")
									}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				{isLoading ? (
					<div className={styles.submitButton}>
						<CircularProgress />
					</div>
				) : (
					<Button
						type="submit"
						className={styles.submitButton}
						variant="contained"
					>
						{translate("pos.login.login")}
					</Button>
				)}
			</form>
		</>
	);
};
