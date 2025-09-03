import { OAuth2Button } from "@logora/debate.auth.oauth2_button";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import styles from "./SSOAuth.module.scss";

const callbackUrl = process.env.REACT_APP_API_AUTH_CALLBACK;

export const SSOAuth = ({ isLoading, onSubmit }) => {
	const dataProvider = useDataProvider();
	const translate = useTranslate();
	const [userEmail, setUserEmail] = useState("");
	const [isChecked, setIsChecked] = useState(false);
	const [ssoSettings, setSsoSettings] = useState();
	const [error, setError] = useState(false);

	useEffect(() => {
		localStorage.removeItem("currentUser");
		localStorage.removeItem("currentApplication");
	}, []);

	const handleSubmit = (event, code = null) => {
		let userParams = {};
		event?.preventDefault();
		if (code) {
			userParams = {
				grant_type: "assertion",
				assertion_type: "oauth2_server_admin",
				sso_provider: ssoSettings?.shortname,
				assertion: code,
			};
			onSubmit(userParams);
		}
	};

	const handleDomainCheck = async (event) => {
		event.preventDefault();
		const domain = userEmail.split("@").pop();
		if (userEmail && domain) {
			dataProvider
				.getSsoSettings(domain)
				.then((response) => {
					setSsoSettings(response.data);
					setIsChecked(true);
					setError(false);
				})
				.catch((error) => {
					setError(true);
				});
		}
	};

	return (
		<>
			{isChecked ? (
				<div className={styles.form}>
					{isLoading ? (
						<CircularProgress />
					) : (
						<>
							<OAuth2Button
								authDialogUrl={ssoSettings?.sso?.authDialogUrl}
								clientId={ssoSettings?.sso?.clientId}
								scope={ssoSettings?.sso?.scope}
								responseType={"code"}
								redirectUri={callbackUrl}
								onCode={(code) => handleSubmit(null, code)}
								onClose={() => null}
								className={styles.oauthButton}
							>
								<div
									style={{
										border: `1px solid ${ssoSettings?.theme?.callPrimaryColor}`,
										padding: "10px 20px",
										borderRadius: "6px",
										backgroundColor: ssoSettings?.theme?.callPrimaryColor,
										color: "#FFF",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
									}}
								>
									<img
										className={styles.providerImg}
										src={ssoSettings?.logo_url}
										alt=""
									/>
									{translate("pos.login.login_with", {
										name: ssoSettings?.display_name,
									})}
								</div>
							</OAuth2Button>
						</>
					)}
				</div>
			) : (
				<form
					className={styles.form}
					onSubmit={(event) => handleDomainCheck(event)}
				>
					<>
						<TextField
							required
							className={styles.formInput}
							id="email"
							type="email"
							label={translate("pos.login.sso_email")}
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
						/>
						   <Button
							   type="submit"
							   className={styles.submitButton}
							   variant="contained"
						   >
							   {translate("pos.login.check_sso")}
						   </Button>
						{error && (
							<p className={styles.error}>
								{translate("resources.update_password.notifications.error_sso")}
							</p>
						)}
					</>
				</form>
			)}
		</>
	);
};
