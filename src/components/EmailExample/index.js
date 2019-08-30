import styled from '@emotion/styled/macro';
import React from 'react';

import fbt from '../../fbt/fbt.macro';
import {accentGrey} from '../../utils/new/design-system';

const SubjectAndToElem = styled('div')`
	display: flex;
	${props => (props.noBorder ? '' : `border-bottom: solid 1px ${accentGrey}`)};
	${props => (props.noBorder ? '' : 'padding-bottom: 1rem;')};
	margin-bottom: 1rem;
`;

const SubjectAndToLabel = styled('div')`
	color: ${accentGrey};
	margin-right: 1rem;
`;

const SubjectAndToInfo = styled('div')``;

function EmailExample({
	subject, email, children, userEmail,
}) {
	return (
		<div>
			<SubjectAndToElem noBorder>
				<SubjectAndToLabel>
					<fbt project="inyo" desc="From">
						De
					</fbt>
				</SubjectAndToLabel>
				<SubjectAndToInfo>{userEmail}</SubjectAndToInfo>
			</SubjectAndToElem>
			<SubjectAndToElem>
				<SubjectAndToLabel>
					<fbt project="inyo" desc="To">
						À
					</fbt>
				</SubjectAndToLabel>
				<SubjectAndToInfo>{email}</SubjectAndToInfo>
			</SubjectAndToElem>
			<SubjectAndToElem>
				<SubjectAndToLabel>
					<fbt project="inyo" desc="Subject">
						Sujet
					</fbt>
				</SubjectAndToLabel>
				<SubjectAndToInfo>{subject}</SubjectAndToInfo>
			</SubjectAndToElem>
			{children}
		</div>
	);
}

export default EmailExample;
