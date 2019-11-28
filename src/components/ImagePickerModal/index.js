import {useQuery} from '@apollo/react-hooks';
import styled from '@emotion/styled';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import React, {useCallback, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import fbt from '../../fbt/fbt.macro';
import {
	LoadingLogo,
	ModalContainer,
	ModalElem,
	primaryGrey,
} from '../../utils/content';
import {Input, P} from '../../utils/new/design-system';

const ImageContainer = styled('div')`
	width: ${props => props.width || '100%'};
	padding-top: ${props => props.height || '100%'};
	height: auto;
	position: relative;
	overflow: hidden;
	cursor: pointer;
	transition: 200ms all;

	:hover {
		box-shadow: 0 0 5px ${primaryGrey};
	}

	img {
		display: block;
		position: absolute;
		top: 0;
		object-fit: cover;
		min-width: 100%;
		min-height: 100%;
	}
`;

const Grid = styled('div')`
	display: grid;
	grid-template-columns: repeat(3, 3fr);
	gap: 10px;
	padding: 10px;
`;

const Header = styled('div')`
	display: flex;
	align-items: center;

	input {
		flex: 2;
	}

	p {
		flex: 1;
		text-align: right;
		color: ${primaryGrey};
	}
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

const ImagePickerModal = ({onDismiss, onSelectImage}) => {
	const [filter, setFilter] = useState('');
	const {data, loading, fetchMore} = useQuery(GET_UNSPLASH_PHOTOS, {
		variables: {keyword: filter},
	});

	const setFilterDebounced = useCallback(debounce(setFilter, 300), [
		setFilter,
	]);

	return (
		<ModalContainer size="small" onDismiss={onDismiss}>
			<Header>
				<Input
					placeholder={fbt(
						'Filtrer les images',
						'image picker placeholder filter input',
					)}
					type="text"
					onChange={e => setFilterDebounced(e.target.value)}
				/>
				<P>
					<fbt desc="image picker unsplash mention">
						Images par{' '}
						<fbt:param name="unsplashLink">
							<a href="https://unsplash.com/" rel="noopener">
								Unsplash
							</a>
						</fbt:param>
					</fbt>
				</P>
			</Header>

			<InfiniteScroll
				style={{margin: '0 -10px'}}
				height={500}
				dataLength={loading ? 0 : data.unsplashPhotos.results.length}
				next={() => fetchMore({
					query: GET_UNSPLASH_PHOTOS,
					variables: {
						page: data.unsplashPhotos.nextPage,
						keyword: filter,
					},
					updateQuery: (previousResult, {fetchMoreResult}) => {
						const previousEntry = previousResult.unsplashPhotos;
						const newResults
								= fetchMoreResult.unsplashPhotos.results;
						const {nextPage} = fetchMoreResult.unsplashPhotos;

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
							<ImageContainer
								key={photo.id}
								height="60%"
								onClick={() => onSelectImage(photo)}
							>
								<img
									src={photo.urls.thumb}
									alt={photo.description}
								/>
							</ImageContainer>
						))}
				</Grid>
			</InfiniteScroll>
		</ModalContainer>
	);
};

export default ImagePickerModal;
