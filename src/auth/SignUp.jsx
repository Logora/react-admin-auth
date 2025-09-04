import { GoogleLoginButton } from "@logora/debate.auth.google_login_button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import { v4 as uuidv4 } from "uuid";
import styles from "./SignUp.module.scss";

const PASSWORD_MIN_LENGTH = 7;

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const callbackUrl = process.env.REACT_APP_API_AUTH_CALLBACK;

const isPasswordValid = (password) => {
	return password.length >= PASSWORD_MIN_LENGTH;
};

export const SignUp = ({ isLoading, onSubmit }) => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const translate = useTranslate();
	const [showPassword, setShowPassword] = useState("");
	const [password, setPassword] = useState("");
	const [userFirstName, setUserFirstName] = useState(
		urlParams.get("first_name") || "",
	);
	const [userLastName, setUserLastName] = useState(
		urlParams.get("last_name") || "",
	);
	const [userEmail, setUserEmail] = useState(urlParams.get("email"));
	const [error, setError] = useState("");

	useEffect(() => {
		localStorage.removeItem("currentUser");
		localStorage.removeItem("currentApplication");
	}, []);

	const handleSubmit = (event, code = null) => {
		event?.preventDefault();

		if (!isPasswordValid(password)) {
			setError(
				translate("pos.login.invalid_password", {
					minLength: PASSWORD_MIN_LENGTH,
				}),
			);

			return;
		}

		if (code) {
			const userParams = {
				grant_type: "assertion",
				assertion_type: "google",
				assertion: code,
			};
			onSubmit(userParams);
		} else {
			const userParams = {
				uid: uuidv4(),
				email: userEmail,
				first_name: userFirstName,
				last_name: userLastName,
				password: password,
				is_admin: true,
			};
			const assertion = window.btoa(JSON.stringify(userParams));
			const assertionParams = {
				grant_type: "assertion",
				assertion: assertion,
				assertion_type: "form",
			};
			onSubmit(assertionParams);
		}
	};

	return (
		<>
			<div className={styles.socialLogin}>
				<GoogleLoginButton
					text={translate("pos.login.google_signup")}
					googleClientId={googleClientId}
					redirectUri={callbackUrl}
					onCode={(code) => handleSubmit(null, code)}
				/>
			</div>
			<div className={styles.separationContainer}>
				<div>{translate("pos.login.or_signup")}</div>
			</div>

			<form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
				{error && <div className={styles.error}>{error}</div>}

				<div className={styles.nameContainer}>
					<TextField
						required
						type="string"
						className={styles.formInput}
						id="firstName"
						label={translate("pos.login.first_name")}
						value={userFirstName}
						onChange={(e) => setUserFirstName(e.target.value)}
					/>
					<TextField
						required
						type="string"
						className={styles.nameInput}
						id="lastName"
						label={translate("pos.login.last_name")}
						value={userLastName}
						onChange={(e) => setUserLastName(e.target.value)}
					/>
				</div>
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
				       {translate("pos.login.signup")}
			       </Button>
		       )}
			</form>
		</>
	);
};
