import React, {cloneElement, Children} from 'react';
import {useTooltip, TooltipPopup} from '@reach/tooltip';
import styled from '@emotion/styled';
import {useTransition, animated} from 'react-spring';

import '@reach/tooltip/styles.css';

const CustomTooltipPopup = styled(TooltipPopup)`
	background: hsla(0, 0%, 0%, 0.75);
	color: white;
	border: none;
	border-radius: 4px;
	padding: 0.5em 1em;
`;

animated.TooltipPopup = animated(CustomTooltipPopup);
animated.TooltipContent = animated(CustomTooltipPopup);

const AnimatedTooltip = ({children, needsWrapper, ...rest}) => {
	const child = Children.only(children);
	const [trigger, tooltip, isVisible] = useTooltip(child.props);

	const transitions = useTransition(isVisible ? tooltip : false, null, {
		from: {opacity: 0},
		enter: {opacity: 1},
		leave: {opacity: 0},
		config: {mass: 1, tension: 500, friction: 40},
	});

	return (
		<>
			{needsWrapper ? (
				<div {...trigger}>{child}</div>
			) : (
				cloneElement(child, trigger)
			)}

			{transitions.map(
				({item: tooltip, props: styles, key}) => tooltip && (
					<animated.TooltipContent
						key={key}
						{...tooltip}
						{...rest}
						style={styles}
					/>
				),
			)}
		</>
	);
};

class PreventCrash extends React.Component {
	state = {
		needsWrapper: false,
	};

	componentDidCatch() {
		this.setState({needsWrapper: true});
		console.warn(
			'The tooltip needs his child to forward his ref. To make it work, an extra <div> has been added. It may be break your style.',
		);
	}

	render() {
		return (
			<AnimatedTooltip
				{...this.props}
				needsWrapper={this.state.needsWrapper}
			/>
		);
	}
}

export default PreventCrash;
