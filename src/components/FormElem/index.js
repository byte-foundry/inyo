import React, { Component } from 'react';
import styled from 'react-emotion';

import { P } from '../../utils/content';


const Label = styled('label')`
    display: block;
`;


class FormElem extends Component {
  render() {
    const {name, label, placeholder, type, values, handleChange, handleBlur, errors, touched} = this.props;
    return (
        <P>
            <Label htmlFor={name}>
                {label}
            </Label>
            <input
                id={name}
                placeholder={placeholder}
                type={type}
                value={values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                    errors[name] && touched[name] ? 'text-input error' : 'text-input'
                }
            />
            {errors[name] &&
            touched[name] && <div className="input-feedback">{errors[name]}</div>}
        </P>
    );
  }
}

export default FormElem;
