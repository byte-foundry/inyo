import React, {Component} from 'react';
import {ApolloConsumer} from 'react-apollo';
import {Redirect} from 'react-router-dom';
import styled from 'react-emotion';
import {Formik} from 'formik';
import * as Yup from 'yup';

const SearchQuoteFormMain = styled('div')``;

class SearchQuoteForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldRedirect: false,
		};
	}

	render() {
		const {shouldRedirect} = this.state;
		const from = this.props.from || '/app';

		if (shouldRedirect) {
			return <Redirect to={from} />;
		}
		return (
			<SearchQuoteFormMain>
				<ApolloConsumer>
					{client => (
						<Formik
							initialValues={{
								from: '01/01/2018',
								to: '01/01/2019',
							}}
							validationSchema={Yup.object().shape({
								from: Yup.date().required('Required'),
								to: Yup.date().required('Required'),
								client: Yup.string(),
							})}
							onSubmit={(values, actions) => {
								actions.setSubmitting(false);
								client.writeData({
									data: {
										user: {
											__typename: 'User',
											isLoggedIn: true,
										},
									},
								});
								this.setState({
									shouldRedirect: true,
								});
							}}
						>
							{(props) => {
								const {
									values,
									touched,
									errors,
									dirty,
									isSubmitting,
									handleChange,
									handleBlur,
									handleSubmit,
									handleReset,
								} = props;

								return (
									<form onSubmit={handleSubmit}>
										<label htmlFor="email">from</label>
										<input
											id="from"
											placeholder="01/01/2018"
											type="date"
											value={values.from}
											onChange={handleChange}
											onBlur={handleBlur}
											className={
												errors.from && touched.from
													? 'text-input error'
													: 'text-input'
											}
										/>
										{errors.email
											&& touched.email && (
											<div className="input-feedback">
												{errors.email}
											</div>
										)}
										<label htmlFor="password">to</label>
										<input
											id="to"
											placeholder="01/01/2018"
											type="date"
											value={values.from}
											onChange={handleChange}
											onBlur={handleBlur}
											className={
												errors.to && touched.to
													? 'text-input error'
													: 'text-input'
											}
										/>
										<input
											id="clients"
											placeholder="01/01/2018"
											type="text"
											value={values.from}
											onChange={handleChange}
											onBlur={handleBlur}
											className={
												errors.to && touched.to
													? 'text-input error'
													: 'text-input'
											}
										/>
										{errors.from
											&& touched.to && (
											<div className="input-feedback">
												{errors.from}
											</div>
										)}
									</form>
								);
							}}
						</Formik>
					)}
				</ApolloConsumer>
			</SearchQuoteFormMain>
		);
	}
}

export default SearchQuoteForm;
