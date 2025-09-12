import { OAuth2Button } from "@logora/debate.auth.oauth2_button";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import styles from "./SSOAuth.module.scss";

export const SSOAuth = ({ isLoading, onSubmit, callbackUrl }) => {
	const dataProvider = useDataProvider();
	const translate = useTranslate();
	const [userEmail, setUserEmail] = useState("");
	const [isChecked, setIsChecked] = useState(false);
	const [ssoSettings, setSsoSettings] = useState();
	const [error, setError] = useState(false);

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
										alt={ssoSettings?.display_name || "SSO Provider Logo"}
									/>
									{translate("auth.sso.login_with", {
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
					aria-label={translate("auth.sso.title")}
					autoComplete="on"
				>
					<TextField
						required
						className={styles.formInput}
						id="email"
						type="email"
						label={translate("auth.sso.labels.email")}
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						inputProps={{
							"aria-required": true,
							"aria-label": translate("auth.sso.labels.email"),
							"autoComplete": "email"
						}}
					/>
					<Button type="submit" className={styles.submitButton} aria-label={translate("auth.sso.submit")}>
						{translate("auth.sso.submit")}
					</Button>
					{error && (
						<p className={styles.error} role="alert" aria-live="assertive" tabIndex={0}>
							{translate("auth.sso.error")}
						</p>
					)}
				</form>
			)}
		</>
	);
};
