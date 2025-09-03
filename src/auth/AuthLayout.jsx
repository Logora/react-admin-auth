import React from "react";
import styles from "./AuthLayout.module.scss";
import logo from "../../images/logo-responsive.png";
import logoLegiwatch from "../../images/legiwatch_dark.png";
import cx from "classnames";

export const AuthLayout = ({ children, title }) => {
	const isParliamentHost = () => {
		const hostname = window.location.hostname;
		if (
			hostname.includes("legiwatch.fr") ||
			process.env.REACT_APP_THEME === "parliament"
		) {
			return true;
		}
		return false;
	}

  const isParliament = isParliamentHost();

	return (
		<div className={cx(styles.main, { [styles.mainDark]: isParliament })}>
			<div className={styles.formContainer}>
				<div className={styles.header}>
					{logo && (
						<img
							className={styles.logo}
							src={isParliament ? logoLegiwatch : logo}
							height={60}
							alt={"Logo plateforme"}
						/>
					)}
					{title && <div className={styles.title}>{title}</div>}
				</div>
				{children}
			</div>
		</div>
	);
};
