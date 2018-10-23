import React, {Component} from 'react';
import styled from 'react-emotion';
import {Query} from 'react-apollo';

import {GET_COMMENTS_BY_ITEM} from '../../utils/queries';

class CommentModal extends Component {
	render() {
		const {itemId, customerToken} = this.props.match.params;

		return (
			<Query
				query={GET_COMMENTS_BY_ITEM}
				variables={{itemId, token: customerToken}}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Chargement...</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;

					console.log(data);

					return <div>comment</div>;
				}}
			</Query>
		);
	}
}

export default CommentModal;
