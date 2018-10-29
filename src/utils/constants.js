export const GRAPHQL_API = `https://prisma${
	process.env.NODE_ENV === 'development' ? '-dev' : ''
}.inyo.me/`;
