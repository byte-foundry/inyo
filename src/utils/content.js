import styled from 'react-emotion';
import Shevy from 'shevyjs';

const shevy = new Shevy();
const {
	body, content, h1, h2, h3, h4, h5, h6,
} = shevy;

export const Body = styled('div')`
	${body};
`;
export const H1 = styled('h1')`
	${h1};
`;
export const H2 = styled('h2')`
	${h2};
`;
export const H3 = styled('h3')`
	${h3};
`;
export const H4 = styled('h4')`
	${h4};
`;
export const H5 = styled('h5')`
	${h5};
`;
export const H6 = styled('h6')`
	${h6};
`;
export const P = styled('p')`
	${content};
`;
export const Ol = styled('ol')`
	${content};
`;
export const Ul = styled('ul')`
	${content};
`;
