import React, {useCallback, useMemo, useState} from 'react';

import {accentGrey, TaskIconText} from '../../utils/new/design-system';
import CustomerDropdown from '../CustomersDropdown';
import MaterialIcon from '../MaterialIcon';
import Tooltip from '../Tooltip';

function TaskCustomerInput({
	disabled,
	editCustomer: editCustomerProp,
	onCustomerSubmit,
	item,
}) {
	const clientName = item.linkedCustomer && item.linkedCustomer.name;
	const [editCustomer, setEditCustomer] = useState(editCustomerProp);
	const defaultCustomer = useMemo(
		() => item.linkedCustomer && {
			value: item.linkedCustomer.id,
			label: item.linkedCustomer.name,
		},
		[item.linkedCustomer],
	);

	const onChangeCustomerDropDown = useCallback(
		(args) => {
			onCustomerSubmit(args);
			setEditCustomer(false);
		},
		[onCustomerSubmit, setEditCustomer],
	);
	const onBlurCustomerDropDown = useCallback(() => {
		setEditCustomer(false);
	}, [setEditCustomer]);

	const onClickElement = useCallback(() => {
		if (!disabled) {
			setEditCustomer(true);
		}
	}, [setEditCustomer, disabled]);

	return (
		<Tooltip label="Personne liée à la tâche">
			<TaskIconText
				inactive={editCustomer}
				icon={
					<MaterialIcon
						icon="person_outline"
						size="tiny"
						color={accentGrey}
					/>
				}
				content={
					!disabled && editCustomer ? (
						<CustomerDropdown
							id="projects"
							defaultMenuIsOpen
							defaultValue={defaultCustomer}
							creatable
							isClearable
							autoFocus
							onChange={onChangeCustomerDropDown}
							onBlur={onBlurCustomerDropDown}
						/>
					) : (
						<div onClick={onClickElement}>
							{clientName || <>&mdash;</>}
						</div>
					)
				}
			/>
		</Tooltip>
	);
}

export default TaskCustomerInput;
