import React, {useCallback, useMemo, useState} from 'react';

import fbt from '../../fbt/fbt.macro';
import {formatName} from '../../utils/functions';
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
	const clientName
		= item.linkedCustomer
		&& `${item.linkedCustomer.name} (${formatName(
			item.linkedCustomer.firstName,
			item.linkedCustomer.lastName,
		)})`;
	const [editCustomer, setEditCustomer] = useState(editCustomerProp);
	const defaultCustomer = useMemo(
		() => item.linkedCustomer && {
			value: item.linkedCustomer.id,
			label: clientName,
		},
		[item.linkedCustomer, clientName],
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

	let hasProjectCustomerLinked = false;

	if (
		!item.linkedCustomer
		|| (item.section
			&& item.section.project.customer
			&& item.section.project.customer.id === item.linkedCustomer.id)
	) {
		hasProjectCustomerLinked = true;
	}

	return (
		<Tooltip
			label={
				<fbt project="inyo" desc="linked customer">
					Personne liée à la tâche
				</fbt>
			}
		>
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
							isClearable={!hasProjectCustomerLinked}
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
