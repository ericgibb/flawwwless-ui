import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from "./Input.scss";
import Icon from "../Icon";
import uid from "uid";
import { primaryColor } from "../../styles";

import ThemeContext from "../../context/themeContext";

const errorColor = "#ff2a2a";


class Input extends Component {
	static propTypes = {
		children: PropTypes.string,
		type: PropTypes.string,
		placeholder: PropTypes.string,
		className: PropTypes.string,
		icon: PropTypes.string,
	}

	state = {
		inputId: "input_" + uid(10),
		fontSize: null,
		iconIsReady: false,
	}

	componentDidMount(){
		const element = document.getElementById(this.state.inputId);
		// Get the necessary padding if the input have an icon
		if(this.props.icon){
			// const element = document.getElementById(this.state.inputId);
			const elementStyle = getComputedStyle(element);
			// Get the font size if there is no size specified
			const fontSize = elementStyle["font-size"];
			this.setState({
				fontSize,
				iconIsReady: true
			});
		} else {
			this.setState({ iconIsReady: true });
		}

		// Add a box styling on focus
		element.addEventListener("focus", (e) => {
			e.target.style.boxShadow = `0 0 0 3px ${ this.props.mainColor }40`;
			e.target.style.borderColor = this.props.mainColor;
		});
		// Remove the styling when the user doesn't focus anymore
		element.addEventListener("blur", (e) => {
		  e.target.style.boxShadow = "";
			e.target.style.borderColor = "";
		});

		if(this.props.autoFocus){
			// Make work the autoFocus properly
			element.style.boxShadow = `0 0 0 3px ${ this.props.mainColor }40`;
			element.style.borderColor = this.props.mainColor;
		}
	}

	render(){
		let { placeholder, type, className, icon, error } = this.props;
		const { fontSize, iconIsReady } = this.state;
		// Add the classNAme to the icon
		className = className ? className : "";
		// Check if it's an input with icon and add style if its the case
		const inputWithIcon = icon ? styles.inputWithIcon : "";

		// // Check if there is a specified font size (to have the right icon size)
		let specifiedFontSize = null;
		if(icon){
			if(this.props.style){
				specifiedFontSize = this.props.style.fontSize;
			}
		}

		// Change the styling if it receive the error props
		let errorClass = this.props.error ? styles.inputError : "";


		return (
			<span
				style={{
					fontSize: specifiedFontSize,
					// opacity: iconIsReady ? 1 : 0,
				}}
				className={ styles.inputWrapper }>
				<input
					{ ...this.props }
					id={ this.state.inputId }
					className={ `${ className } ${ inputWithIcon } ${ styles.input } ${ errorClass }` }
					style={{
						...this.props.style,
						paddingLeft: `${ `calc(${ fontSize } * 1.5)` }`,
					}}
				/>

				{
					icon && (
						<span
							style={{
								paddingTop: `${ `calc(${ fontSize } * 0)` }`,
								fontSize: fontSize,
							}}
							className={ styles.inputIcon }>
							<Icon
								type={ icon }
							/>
						</span>
					)
				}
			</span>
		)
	}
}


const InputWrapper = (props) => {
	// Wrap the input to pass easily the right color depending on whether the developer is using a custom theme or not
	return (
		<ThemeContext.Consumer>
			{ context => {
				// Get the right style for the input
				let mainColor = primaryColor;

				// Check if there is an existing custom theming in the context
				if(context){
					mainColor = context.primaryColor;
				}

				return (
					<Input
						mainColor={ mainColor }
						{ ...props } />
				)
			}}
		</ThemeContext.Consumer>
	)
}

export default InputWrapper;
