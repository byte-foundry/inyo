import styled from '@emotion/styled';
import React, {useRef, useState} from 'react';
import {useMutation} from 'react-apollo-hooks';
import useOnClickOutside from 'use-onclickoutside';

import {FINISH_ITEM, UNFINISH_ITEM} from '../../utils/mutations';
import {primaryGrey, primaryPurple} from '../../utils/new/design-system';
import BistableButton from '../BistableButton';
import UnitInput from '../UnitInput';

const SetTimeContainer = styled('div')`
	display: flex;
	margin-left: 1rem;
`;

const SetTimeInfos = styled('div')`
	display: flex;
	flex-flow: column nowrap;
	margin-right: 10px;
	text-align: right;
`;

const SetTimeHeadline = styled('div')`
	color: ${primaryPurple};
	font-size: 12px;
	font-weight: 500;
	line-height: 1.3;
`;

const SetTimeCaption = styled('div')`
	color: ${primaryGrey};
	font-size: 12px;
	font-style: italic;
	line-height: 1.3;
`;

const TaskStatusButton = ({
	item,
	customerToken,
	isFinished,
	disabled,
	white,
	primary,
}) => {
	const [setTimeItTook, setSetTimeItTook] = useState(false);
	const finishItem = useMutation(FINISH_ITEM);
	const unfinishItem = useMutation(UNFINISH_ITEM);
	const setTimeItTookRef = useRef();

	useOnClickOutside(setTimeItTookRef, () => {
		setSetTimeItTook(false);
	});

	function finishItemCallback(unit) {
		finishItem({
			variables: {
				itemId: item.id,
				token: customerToken,
				timeItTook: unit,
			},
			optimisticResponse: {
				finishItem: {
					...item,
					status: 'FINISHED',
					timeItTook: unit,
				},
			},
		});
		setSetTimeItTook(false);
	}

	return setTimeItTook ? (
		<SetTimeContainer ref={setTimeItTookRef}>
			<SetTimeInfos>
				<SetTimeHeadline>Temps réellement passé</SetTimeHeadline>
				<SetTimeCaption>Uniquement visible par vous</SetTimeCaption>
			</SetTimeInfos>
			<UnitInput
				unit={item.unit}
				onBlur={() => {}}
				onSubmit={finishItemCallback}
				withButton
				cancel={() => setSetTimeItTook(false)}
			/>
		</SetTimeContainer>
	) : (
		<BistableButton
			value={isFinished}
			disabled={disabled}
			trueLabel="Fait"
			trueTooltip="Ré-ouvrir la tâche"
			falseLabel="Marquer comme fait"
			falseTooltip="Cliquer si cette tâche a été réalisée"
			commit={() => {
				if (customerToken) {
					finishItem({
						variables: {itemId: item.id, token: customerToken},
					});
				}
				else {
					setSetTimeItTook(true);
				}
			}}
			reverse={() => unfinishItem({
				variables: {itemId: item.id, token: customerToken},
			})
			}
			white={white}
			primary={primary}
		/>
	);
};

export default TaskStatusButton;
