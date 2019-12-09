import './index.css';

import PropTypes from 'prop-types';
import React from 'react';
import WebFont from 'webfontloader';

const sizes = {
	micro: 'md-12',
	tiny: 'md-18',
	small: 'md-24',
	medium: 'md-36',
	large: 'md-48',
};
const light = 'md-light';
const dark = 'md-dark';
const mdInactive = 'md-inactive';

WebFont.load({
	google: {
		families: ['Material+Icons'],
	},
	timeout: 5000,
});

function MaterialIcon(props) {
	const {
		size,
		invert,
		inactive,
		style,
		className,
		color,
		icon,
		...rest
	} = props;

	const sizeMapped = sizes[size] || parseInt(size, 10) || sizes.small;
	const defaultColor = invert && 'invert' ? light : dark;
	const inactiveColor = inactive && 'inactive' ? mdInactive : '';
	const propStyle = style || {};
	const styleOverride = Object.assign(propStyle, {
		color: color || '',
		fontSize: sizeMapped,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	});
	const clsName = `material-icons ${sizeMapped} ${defaultColor} ${inactiveColor} ${className}`;

	return (
		<i {...rest} className={clsName} style={styleOverride}>
			{icon}
		</i>
	);
}

MaterialIcon.propTypes = {
	icon: PropTypes.string.isRequired,
	size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	invert: PropTypes.bool,
	inactive: PropTypes.bool,
};

export default MaterialIcon;
