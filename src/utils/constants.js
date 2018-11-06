export const GRAPHQL_API = `https://prisma${
	process.env.INYO_ENV === 'development' ? '-dev' : ''
}.inyo.me/`;
