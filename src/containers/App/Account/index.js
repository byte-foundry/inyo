import React, {Component} from 'react';
import {Query} from 'react-apollo';
import {Redirect, Link} from 'react-router-dom';
import styled from 'react-emotion';
import {H3, P} from '../../../utils/content';
import {GET_USER_INFOS} from '../../../utils/queries';

const AccountMain = styled('div')``;

class Account extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Query query={GET_USER_INFOS}>
				{({
					client, loading, error, data,
				}) => {
					if (loading) return <p>Loading...</p>;
					if (data && data.me) {
						const {me} = data;
						const {
							firstName, lastName, email, company,
						} = me;

						return (
							<AccountMain>
								<button
									onClick={() => {
										window.localStorage.removeItem('authToken');
										client.resetStore();
									}}
								>
									Log out
								</button>
								<P>
									Hello {firstName} {lastName}, your email is {email}
								</P>
								{company.name ? (
									<div>
										<H3>Your company</H3>
										<P>{company.name}</P>
										<P>
											<Link to="/app/company/edit">Edit company details</Link>
										</P>
									</div>
								) : (
									<P>
										You do not have your company registered right now. Register
										it to fill your quotes faster{' '}
										<Link to="/app/company/create">Register my company</Link>
									</P>
								)}
							</AccountMain>
						);
					}
					return <Redirect to="/app/auth" />;
				}}
			</Query>
		);
	}
}

export default Account;
