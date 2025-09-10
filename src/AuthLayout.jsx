import React from "react";
import styles from "./AuthLayout.module.scss";
import { useTheme } from '@mui/material/styles';

export const AuthLayout = ({ children, title }) => {
	const theme = useTheme();
	const backgroundImage = theme?.auth?.backgroundImage;
	const logo = theme?.auth?.logo;
	const style = backgroundImage
		? { backgroundImage }
		: {};

	return (
		<div
			className={styles.layout}
			style={style}
		>
			<div className={styles.container}>
				<div className={styles.header}>
					{logo && (
						<img
							className={styles.logo}
							src={logo}
							height={60}
							alt={"Logo"}
						/>
					)}
					{title && <div className={styles.title}>{title}</div>}
				</div>
				{children}
			</div>
		</div>
	);
};
