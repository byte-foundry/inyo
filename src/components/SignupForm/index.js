import React from "react";
import { useMutation, useApolloClient } from "react-apollo-hooks";
import ReactGA from "react-ga";
import * as Sentry from "@sentry/browser";
import styled from "@emotion/styled";
import { Formik } from "formik";
import * as Yup from "yup";
import debounce from "debounce-promise";

import { SIGNUP, CHECK_UNIQUE_EMAIL } from "../../utils/mutations";
import { Button, A, primaryPurple } from "../../utils/new/design-system";
import { ErrorInput } from "../../utils/content";
import { INTERCOM_APP_ID } from "../../utils/constants";

import FormElem from "../FormElem";

const SignupFormMain = styled("div")``;

const SignupButton = styled(Button)`
	display: block;
	margin-left: auto;
`;

const CGU = styled("label")`
	padding: 1rem;
	color: ${primaryPurple};
	margin-bottom: 1rem;

	input {
		margin-right: 0.5rem;
	}
`;

const SignupForm = ({ from, history }) => {
	const client = useApolloClient();
	const signup = useMutation(SIGNUP);
	const checkEmailAvailability = useMutation(CHECK_UNIQUE_EMAIL);

	const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

	return (
		<SignupFormMain>
			<Formik
				initialValues={{
					email: "",
					password: "",
					firstname: "",
					lastname: ""
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email("L'email doit être valide")
						.required("Requis")
						.test(
							"unique-email",
							"L'email est déjà utilisé",
							value =>
								debouncedCheckEmail({
									variables: {
										email: value || ""
									}
								}).then(({ data }) => data.isAvailable)
						),
					password: Yup.string().required("Requis"),
					firstname: Yup.string().required("Requis"),
					lastname: Yup.string().required("Requis")
				})}
				onSubmit={async (values, actions) => {
					try {
						const { data } = await signup({
							variables: {
								email: values.email,
								password: values.password,
								firstName: values.firstname,
								lastName: values.lastname
							}
						});

						if (data) {
							window.localStorage.setItem(
								"authToken",
								data.signup.token
							);
							ReactGA.event({
								category: "User",
								action: "Created an account"
							});

							const { user } = data.signup;

							window.Intercom("boot", {
								app_id: INTERCOM_APP_ID,
								email: user.email,
								user_id: user.id,
								name: `${user.firstName} ${user.lastName}`,
								user_hash: user.hmacIntercomId,
								phone: user.company.phone
							});

							await client.resetStore();
							const fromPage = from || "/app/onboarding";

							history.push(fromPage);
						}
					} catch (error) {
						if (
							error.networkError &&
							error.networkError.result &&
							error.networkError.result.errors
						) {
							Sentry.captureException(
								error.networkError.result.errors
							);
						} else {
							Sentry.captureException(error);
						}
						actions.setSubmitting(false);
						actions.setErrors(error);
						actions.setStatus({
							msg: "Quelque chose ne s'est pas passé comme prévu"
						});
					}
				}}
			>
				{props => {
					const { isSubmitting, status, handleSubmit } = props;

					return (
						<form onSubmit={handleSubmit}>
							<FormElem
								{...props}
								name="email"
								type="email"
								label="Adresse email"
								placeholder="jean@dupont.fr"
								required
								big
							/>
							<FormElem
								{...props}
								name="password"
								type="password"
								label="Mot de passe"
								placeholder="***************"
								required
								big
							/>
							<FormElem
								{...props}
								name="firstname"
								type="text"
								label="Prénom"
								placeholder="Jean"
								required
								big
							/>
							<FormElem
								{...props}
								name="lastname"
								type="text"
								label="Nom"
								placeholder="Dupont"
								required
								big
							/>
							{status && status.msg && (
								<ErrorInput>{status.msg}</ErrorInput>
							)}
							<CGU>
								<input name="CGU" type="checkbox" required />
								J'accepte les{" "}
								<b>
									<A
										target="blank"
										href="https://inyo.me/a-propos/cgu/"
									>
										CGU
									</A>
								</b>{" "}
								et consent à recevoir des emails de la part
								d'Inyo.
							</CGU>
							<SignupButton
								type="submit"
								isSubmitting={isSubmitting}
								big
							>
								Commencez
							</SignupButton>
						</form>
					);
				}}
			</Formik>
		</SignupFormMain>
	);
};

export default SignupForm;
