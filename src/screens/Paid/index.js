import React from 'react';

import {Button} from '../../utils/new/design-system';

function Paid({user}) {
	if (user && user.me) {
		return (
			<div>
				Merci pour votre achat..
				<Button>Retourner au dashboard</Button>
			</div>
		);
	}

	return (
		<div>
			Merci pour votre achat. Pour utiliser Inyo vous devez vous
			connecter.
			<Button>Se connecter</Button>
		</div>
	);
}

export default Paid;
