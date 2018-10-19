import React, {Component} from 'react';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import styled from 'react-emotion';
import 'react-day-picker/lib/style.css';

import {Input, primaryWhite, primaryNavyBlue} from '../../utils/content';

const WEEKDAYS_SHORT = {
	fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
};
const MONTHS = {
	fr: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	],
};

const WEEKDAYS_LONG = {
	fr: [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Smedi',
	],
};

const FIRST_DAY_OF_WEEK = {
	fr: 1,
};
// Translate aria-labels
const LABELS = {
	ru: {nextMonth: 'следующий месяц', previousMonth: 'предыдущий месяц'},
	it: {nextMonth: 'Prossimo mese', previousMonth: 'Mese precedente'},
};

const formatDate = dateObject => new Date(dateObject).toLocaleDateString('fr-FR');

const parseDate = (dateString) => {
	const dates = dateString.split('/');

	return new Date(`${dates[1]}/${dates[0]}/${dates[2]}`);
};

const SearchQuoteFormMain = styled('div')`
	margin-bottom: 40px;
`;

const DateInput = styled(Input)`
	background: ${primaryNavyBlue};
	border-color: ${primaryNavyBlue};
	color: ${primaryWhite};
	margin-right: 10px;
	&:focus {
		outline: none;
		border-color: transparent;
	}
`;

const SpanLabel = styled('span')`
	background: ${primaryNavyBlue};
	color: ${primaryWhite};
	padding: 15px 0px 16px 18px;
`;

class SearchQuoteForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			from: new Date('01/01/2018'),
			to: new Date('01/01/2019'),
		};
	}

	// initialValues={{
	// 	from: '01/01/2018',
	// 	to: '01/01/2019',
	// }}
	render() {
		const {from, to} = this.state;

		return (
			<SearchQuoteFormMain>
				<SpanLabel>Du :</SpanLabel>
				<DayPickerInput
					formatDate={formatDate}
					parseDate={parseDate}
					dayPickerProps={{
						locale: 'fr',
						months: MONTHS.fr,
						weekdaysLong: WEEKDAYS_LONG.fr,
						weekdaysShort: WEEKDAYS_SHORT.fr,
						firstDayOfWeek: FIRST_DAY_OF_WEEK.fr,
						labels: LABELS.fr,
						selectedDays: from,
					}}
					component={props => <DateInput {...props} />}
					onDayChange={day => this.setState({from: day})}
					value={from}
				/>
				<SpanLabel>Au :</SpanLabel>
				<DayPickerInput
					formatDate={formatDate}
					parseDate={parseDate}
					dayPickerProps={{
						locale: 'fr',
						months: MONTHS.fr,
						weekdaysLong: WEEKDAYS_LONG.fr,
						weekdaysShort: WEEKDAYS_SHORT.fr,
						firstDayOfWeek: FIRST_DAY_OF_WEEK.fr,
						labels: LABELS.fr,
						selectedDays: to,
					}}
					component={props => <DateInput {...props} />}
					onDayChange={day => this.setState({to: day})}
					value={to}
				/>
			</SearchQuoteFormMain>
		);
	}
}

export default SearchQuoteForm;
