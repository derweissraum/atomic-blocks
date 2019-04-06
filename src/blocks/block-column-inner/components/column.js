/**
 * Column wrapper component.
 */

/**
 * WordPress dependencies.
 */
const { Component } = wp.element;

/**
 * Components and dependencies.
 */
import classnames from 'classnames';

/**
 * Create a Columns wrapper Component.
 */
export default class Column extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	getBackgroundColor() {
		return this.props.backgroundColor.color;
	}

	render() {

		const {
			attributes,
			backgroundColor,
			textColor,
		} = this.props;

		/* Setup the margin styles. */
		let marginStyle;

		if ( attributes.marginSync ) {
			marginStyle = {
				marginTop: attributes.margin > 0 ? attributes.margin : null,
				marginBottom: attributes.margin > 0 ? attributes.margin : null
			}
		} else {
			marginStyle = {
				marginTop: attributes.marginTop > 0 ? attributes.marginTop : null,
				marginBottom: attributes.marginBottom > 0 ? attributes.marginBottom : null,
			}
		}

		/* Setup the padding styles. */
		let paddingStyle;

		if ( attributes.paddingSync ) {
			paddingStyle = {
				padding: attributes.padding > 0 ? attributes.padding : null,
			}
		} else {
			paddingStyle = {
				paddingTop: attributes.paddingTop > 0 ? attributes.paddingTop : null,
				paddingRight: attributes.paddingRight > 0 ? attributes.paddingRight : null,
				paddingBottom: attributes.paddingBottom > 0 ? attributes.paddingBottom : null,
				paddingLeft: attributes.paddingLeft > 0 ? attributes.paddingLeft : null,
			}
		}

		/* Misc styles. */
		const styles = {
			backgroundColor: attributes.backgroundColor ? null : attributes.customBackgroundColor,
			color: attributes.textColor ? null : attributes.customTextColor,
			textAlign: attributes.textAlign ? attributes.textAlign : null,
		}

		/* Setup the background color class. */
		let backgroundColorClass;

		if (attributes.customBackgroundColor) {
			backgroundColorClass = 'ab-has-custom-background-color';
		} else {
			backgroundColorClass = attributes.backgroundColor ? 'has-' + attributes.backgroundColor + '-background-color' : null;
		}

		/* Setup the text color class. */
		let textColorClass;

		if (attributes.customTextColor) {
			textColorClass = 'ab-has-custom-text-color';
		} else {
			textColorClass = attributes.textColor ? 'has-' + attributes.textColor + '-color' : null;
		}

		console.log( this.getBackgroundColor() );

		return (
			<div
				className={ classnames(
					'ab-block-layout-column',
				) }
			>
				<div
					className={ classnames(
						'ab-block-layout-column-inner',
						backgroundColorClass,
						textColorClass,
					) }
					// style={ Object.assign( marginStyle, paddingStyle, styles ) }
					//style={{ backgroundColor: this.backgroundColor.color }}
				>
					{ this.props.children }
				</div>
			</div>
		);
	}
}