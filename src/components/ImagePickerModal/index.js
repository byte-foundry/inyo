import {useQuery} from '@apollo/react-hooks';
import styled from '@emotion/styled';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import React, {useCallback, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {LoadingLogo, ModalContainer, ModalElem} from '../../utils/content';

const ImageContainer = styled('div')`
	width: ${props => props.width || '100%'};
	padding-top: ${props => props.height || '100%'};
	height: auto;
	position: relative;
	overflow: hidden;

	img {
		display: block;
		position: absolute;
		top: 0;
		object-fit: cover;
		width: 100%;
	}
`;

const Grid = styled('div')`
	display: grid;
	grid-template-columns: repeat(3, 3fr);
	gap: 10px;
`;

const GET_UNSPLASH_PHOTOS = gql`
	query getUnsplashPhotos($keyword: String, $page: Int) {
		unsplashPhotos(keyword: $keyword, page: $page) {
			nextPage
			results {
				id
				description
				urls {
					thumb
				}
			}
		}
	}
`;

const ImagePickerModal = (props) => {
	const [filter, setFilter] = useState('');
	const {data, loading, fetchMore} = useQuery(GET_UNSPLASH_PHOTOS, {
		variables: {keyword: filter},
	});

	const setFilterDebounced = useCallback(debounce(setFilter, 300), [
		setFilter,
	]);

	return (
		<ModalContainer size="small" {...props}>
			<ModalElem>
				<input
					placeholder="Filtrer les images"
					type="text"
					onChange={e => setFilterDebounced(e.target.value)}
				/>

				<InfiniteScroll
					height={300}
					dataLength={
						loading ? 0 : data.unsplashPhotos.results.length
					}
					next={() => fetchMore({
						query: GET_UNSPLASH_PHOTOS,
						variables: {
							page: data.unsplashPhotos.nextPage,
							keyword: filter,
						},
						updateQuery: (
							previousResult,
							{fetchMoreResult},
						) => {
							const previousEntry
									= previousResult.unsplashPhotos;
							const newResults
									= fetchMoreResult.unsplashPhotos.results;
							const {
								nextPage,
							} = fetchMoreResult.unsplashPhotos;

							return {
								unsplashPhotos: {
									nextPage,
									results: [
										...previousEntry.results,
										...newResults,
									],
									__typename: previousEntry.__typename,
								},
							};
						},
					})
					}
					hasMore={loading || data.unsplashPhotos.nextPage !== null}
					loader={<LoadingLogo />}
				>
					<Grid>
						{!loading
							&& data.unsplashPhotos.results.map(photo => (
								<ImageContainer key={photo.id} height="60%">
									<img
										src={photo.urls.thumb}
										alt={photo.description}
									/>
								</ImageContainer>
							))}
					</Grid>
				</InfiniteScroll>
			</ModalElem>
		</ModalContainer>
	);
};

export default ImagePickerModal;
