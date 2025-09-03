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
	useRedirect,
	useTranslate,
} from "react-admin";
import { useSearchParams } from "react-router-dom";
import slugify from "slugify";
import { AuthLayout } from "./AuthLayout";
import styles from "./Onboarding.module.scss";

const allowedAppTypes = ["debateSpace", "parlement", "socialModeration"];

export const Onboarding = () => {
	const translate = useTranslate();
	const dataProvider = useDataProvider();
	const authProvider = useAuthProvider();
	const redirectTo = useRedirect();
	const [searchParams] = useSearchParams();
	let appType =
		(allowedAppTypes.includes(searchParams.get("appType")) &&
			searchParams.get("appType")) ||
		"debateSpace";
	if (window.location.hostname.includes("legiwatch.fr")) {
		appType = "parlement";
	}
	const [applicationUrl, setApplicationUrl] = useState("");
	const [shortname, setShortname] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [allowedDomains, setAllowedDomains] = useState([]);
	const [language, setLanguage] = useState("fr");
	const [finalStep, setFinalStep] = useState(appType !== "debateSpace");
	const [isLoading, setIsLoading] = useState(false);

	const getAllowedDomains = (url) => {
		const parsedUrl = new URL(url);
		return [`${parsedUrl.protocol}//${parsedUrl.hostname}`];
	};

	const generateShortname = (name) => {
		const randomWords = generate({
			exactly: 1,
			wordsPerString: 2,
			separator: "-",
			maxLength: 5,
		});

		return `${slugify(name)}-${randomWords}`;
	};

	const validateUrl = (event) => {
		event?.preventDefault();
		const parsedUrl = new URL(applicationUrl);
		const name = parsedUrl.host.split(".").slice(-2)[0] || "";
		const displayName = name.charAt(0).toUpperCase() + name.slice(1);
		const allowedDomains = getAllowedDomains(applicationUrl);

		setShortname(generateShortname(name));
		setDisplayName(displayName);
		setAllowedDomains(allowedDomains);
		setFinalStep(true);
	};

	const handleSubmit = (event) => {
		event?.preventDefault();
		const adminId = JSON.parse(localStorage.getItem("currentUser")).id;
		setIsLoading(true);

		const initSettings = {
			...(appType !== "debateSpace" && {
				modules: {
					...(appType === "parlement" && {
						parliament: true,
						debateSpace: false,
						sources: false,
					}),
					...(appType === "socialModeration" && {
						socialModeration: true,
						debateSpace: false,
						sources: false,
					}),
				},
			}),
		};

		dataProvider
			.create("applications", {
				data: {
					name:
						appType === "debateSpace"
							? shortname
							: generateShortname(displayName),
					display_name: displayName,
					url: applicationUrl,
					allowed_domains: allowedDomains,
					init_settings: initSettings,
					admin_id: adminId,
					language: language,
				},
			})
			.then(() => {
				authProvider.getIdentity().then((identity) => {
					setIsLoading(false);
					redirectTo("/#");
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
			title={translate("pos.login.onboarding_title")}
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
						label={translate("pos.login.application_url")}
						value={applicationUrl}
						onChange={(e) => setApplicationUrl(e.target.value)}
					/>
					   <Button
						   type="submit"
						   className={styles.submitButton}
						   variant="contained"
					   >
						   {translate("pos.login.validate")}
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
						label={translate("pos.login.display_name")}
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
					{appType === "debateSpace" && (
						<TextField
							required
							className={styles.formInput}
							id="shortname"
							type="string"
							label={translate("pos.login.shortname")}
							value={shortname}
							onChange={(e) => setShortname(e.target.value)}
						/>
					)}
					<FormControl variant="outlined" className={styles.formInput}>
						<Select
							id="language_select"
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							fullWidth
						>
							{LANGUAGES.map((lang, index) => (
								<MenuItem key={lang} value={lang.name}>
									{lang.name.toUpperCase() + lang.icon}{" "}
								</MenuItem>
							))}
						</Select>
					</FormControl>
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
							   {translate("pos.login.create")}
						   </Button>
					)}
				</form>
			)}
		</AuthLayout>
	);
};
