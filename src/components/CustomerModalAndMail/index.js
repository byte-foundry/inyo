import React, {useState} from 'react';

import CustomerIntroMail from '../CustomerIntroMail';
import CustomerModal from '../CustomerModal';

function CustomerModalAndMail({onDismiss, onValidate, ...rest}) {
	const [createdCustomer, setCreatedCustomer] = useState(false);

	return createdCustomer ? (
		<CustomerIntroMail
			customer={createdCustomer}
			onDismiss={() => {
				onValidate(createdCustomer);
				onDismiss();
			}}
		/>
	) : (
		<CustomerModal
			{...rest}
			onDismiss={onDismiss}
			onValidate={onValidate}
			onCustomerWasCreated={setCreatedCustomer}
		/>
	);
}

export default CustomerModalAndMail;
