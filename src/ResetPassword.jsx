import React, { useState } from "react";
import { useTranslate, useDataProvider } from "react-admin";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AuthLayout } from "./AuthLayout";
import styles from "./ResetPassword.module.scss";

export const ResetPassword = ({ loginUrl = "#/login"}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("idle"); // 'idle' | 'success' | 'error' | 'mismatch'
    const [redirectUrl, setRedirectUrl] = useState(loginUrl);
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const submit = (e) => {
        e.preventDefault();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const resetToken = urlParams.get("reset_password_token");
        const redirectUrlParam = urlParams.get("redirect_url");
        if (newPassword !== confirmPassword) {
            setStatus("mismatch");
        } else {
            dataProvider
                .resetPassword({ newPassword, confirmPassword, resetToken })
                .then((response) => {
                    if (response.data) {
                        if (redirectUrlParam) {
                            setRedirectUrl(redirectUrlParam);
                        }
                        setStatus("success");
                    } else {
                        setStatus("error");
                    }
                })
                .catch(() => {
                    setStatus("error");
                });
        }
    };

    return (
        <AuthLayout title={translate("auth.reset_password.title")}>
            {status === "idle" || status === "mismatch" ? (
                <form className={styles.container} onSubmit={submit}>
                    <TextField
                        required
                        type="password"
                        className={styles.formInput}
                        id="newPassword"
                        label={translate("auth.reset_password.labels.new_password")}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        required
                        type="password"
                        className={styles.formInput}
                        id="confirmPassword"
                        label={translate("auth.reset_password.labels.new_password_confirmation")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {status === "mismatch" && (
                        <div style={{ color: "red" }}>
                            {translate("auth.reset_password.notifications.mismatch")}
                        </div>
                    )}
                    <Button type="submit" variant="contained" className={styles.submitButton}>
                        {translate("auth.reset_password.submit")}
                    </Button>
                </form>
            ) : (
                <div className={styles.container}>
                    <div>
                        {status === "success"
                            ? translate("auth.reset_password.success")
                            : translate("auth.reset_password.notifications.error")}
                    </div>
                    <Button
                        href={decodeURIComponent(redirectUrl)}
                        variant="contained"
                        className={styles.submitButton}
                    >
                        {translate("auth.reset_password.redirect_to_login")}
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
};
