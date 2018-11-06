export const GRAPHQL_API = `https://prisma${
	process.env.REACT_APP_INYO_ENV === 'development' ? '-dev' : ''
}.inyo.me/`;
