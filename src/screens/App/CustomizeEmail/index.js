import React from 'react';

import {Container, Content, Main} from '../../../utils/new/design-system';

const CustomizeEmail = () => (
	<Container>
		<Main>
			<Content>
				<Header></Header>
				<CustomEmailSidebar />
				<EmailCustomizer />
			</Content>
		</Main>
	</Container>
);

export default CustomizeEmail;
