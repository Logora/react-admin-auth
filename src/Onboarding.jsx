import { LANGUAGES } from "@logora/debate.util.lang_emojis";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { generate } from "random-words";
import React, { useState } from "react";
import {
	useAuthProvider,
	useDataProvider,
	useTranslate,
} from "react-admin";
import { useNavigate, useSearchParams } from "react-router-dom";
import slugify from "slugify";
import { AuthLayout } from "./AuthLayout";
import styles from "./Onboarding.module.scss";

const generateShortname = (name) => {
	const randomWords = generate({
		exactly: 1,
		wordsPerString: 2,
		separator: "-",
		maxLength: 5,
	});

	return `${slugify(name)}-${randomWords}`;
};

export const Onboarding = ({
	appType,
	showApplicationNameInput = true,
	showApplicationUrlInput = true,
	showLanguageInput = true,
	defaultLanguage = "fr",
	className = "",
	defaultRedirect = "/"
}) => {
	const translate = useTranslate();
	const dataProvider = useDataProvider();
	const authProvider = useAuthProvider();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [applicationUrl, setApplicationUrl] = useState("");
	const [applicationName, setApplicationName] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [allowedDomains, setAllowedDomains] = useState([]);
	const [language, setLanguage] = useState(defaultLanguage);
	const [finalStep, setFinalStep] = useState(!showApplicationUrlInput);
	const [isLoading, setIsLoading] = useState(false);
	const redirectParam = searchParams.get("redirect") || defaultRedirect;

	const getAllowedDomains = (url) => {
		const parsedUrl = new URL(url);
		return [`${parsedUrl.protocol}//${parsedUrl.hostname}`];
	};

	const validateUrl = (event) => {
		event?.preventDefault();
		const parsedUrl = new URL(applicationUrl);
		const name = parsedUrl.host.split(".").slice(-2)[0] || "";
		const displayName = name.charAt(0).toUpperCase() + name.slice(1);
		const allowedDomains = getAllowedDomains(applicationUrl);

		setApplicationName(generateShortname(name));
		setDisplayName(displayName);
		setAllowedDomains(allowedDomains);
		setFinalStep(true);
	};

	const handleSubmit = (event) => {
		event?.preventDefault();
		const adminId = JSON.parse(localStorage.getItem("currentUser")).id;
		setIsLoading(true);
		dataProvider
			.create("applications", {
				data: {
					name: showApplicationNameInput
						? applicationName
						: generateShortname(displayName),
					display_name: displayName,
					url: applicationUrl,
					allowed_domains: allowedDomains,
					app_type: appType,
					admin_id: adminId,
					language: language,
				},
			})
			.then(() => {
				authProvider.getIdentity().then((identity) => {
					setIsLoading(false);
					navigate(redirectParam, { replace: true });
				});
			})
			.catch((e) => {
				console.log(e);
				// Erreur mauvais mail 401
				// Rediriger vers onboarding
			});
	};

	return (
		<AuthLayout
			title={translate("auth.onboarding.title")}
			className={className}
		>
			{!finalStep ? (
				<form
					className={styles.form}
					onSubmit={(event) => validateUrl(event)}
				>
					<TextField
						required
						className={styles.formInput}
						id="applicationUrl"
						type="url"
						label={translate("auth.onboarding.labels.application_url")}
						value={applicationUrl}
						onChange={(e) => setApplicationUrl(e.target.value)}
					/>
					<Button type="submit" className={styles.submitButton}>
						{translate("auth.onboarding.validate")}
					</Button>
				</form>
			) : (
				<form
					className={styles.form}
					onSubmit={(event) => handleSubmit(event)}
				>
					<TextField
						required
						className={styles.formInput}
						id="displayName"
						type="string"
						label={translate("auth.onboarding.labels.display_name")}
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
					{showApplicationNameInput && (
						<TextField
							required
							className={styles.formInput}
							id="applicationName"
							type="string"
							label={translate("auth.onboarding.labels.shortname")}
							value={applicationName}
							onChange={(e) => setApplicationName(e.target.value)}
						/>
					)}
					{showLanguageInput && (
						<FormControl variant="outlined" className={styles.formInput}>
							<Select
								id="language_select"
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								fullWidth
							>
								{LANGUAGES.map((lang) => (
									<MenuItem key={lang} value={lang.name}>
										{lang.name.toUpperCase() + lang.icon}{" "}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
					{isLoading ? (
						<CircularProgress />
					) : (
						<Button type="submit" className={styles.submitButton}>
							{translate("auth.onboarding.submit")}
						</Button>
					)}
				</form>
			)}
		</AuthLayout>
	);
};
