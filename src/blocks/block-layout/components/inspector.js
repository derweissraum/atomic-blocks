/**
 * Inspector Controls
 */

 // Import icons
import icons from './icons';
import map from 'lodash/map';
import layoutColumns from './layout-columns';
import MarginSettings from './../../../utils/components/margin';

// Setup the block
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

// Import block components
const {
	InspectorControls,
} = wp.editor;

// Import Inspector components
const {
	PanelBody,
	RangeControl,
	ButtonGroup,
	Button,
	Tooltip,
	ToggleControl,
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		// Setup the attributes
		const {
			attributes: {
				columns,
				columnsGap,
				layout,
				responsiveToggle,
			},
			attributes,
			setAttributes
		} = this.props;

		let selectedRows = 1;

		if ( columns ) {
			selectedRows = parseInt( columns.toString().split('-') );
		}

		return (
		<InspectorControls key="inspector">
			<Fragment>
				{ layout &&
					// Show the column settings once a layout is selected
					<Fragment>
						<PanelBody
							className="ab-column-select-panel"
						>
							<p>{ __( 'Column Layout', 'atomic-blocks' ) }</p>
							<ButtonGroup aria-label={ __( 'Column Layout', 'atomic-blocks' ) }>
								{ map( layoutColumns[ selectedRows ], ( { name, key, icon, col } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="ab-layout-selector-button"
											isSmall
											onClick={ () => {
												setAttributes( {
													layout: key,
												} );
												this.setState( { 'selectLayout' : false } );
											} }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
						</PanelBody>

						<PanelBody>
							<RangeControl
								label={ __( 'Column Gap', 'atomic-blocks' ) }
								help={ __( 'Adjust the spacing between columns.', 'atomic-blocks' ) }
								value={ columnsGap }
								onChange={ ( value ) => this.props.setAttributes( { columnsGap: value } ) }
								min={ 0 }
								max={ 5 }
								step={ 1 }
							/>
							<ToggleControl
								label={ __( 'Responsive Columns', 'atomic-blocks' ) }
								help={ __( 'Columns will be adjusted to fit on tablets and mobile devices.', 'atomic-blocks' ) }
								checked={ responsiveToggle }
								onChange={ () => this.props.setAttributes( { responsiveToggle: ! responsiveToggle } ) }
							/>
						</PanelBody>
					</Fragment>
				}
				<PanelBody
					title={ __( 'Margin Settings', 'atomic-blocks' ) }
					initialOpen={ false }
				>
					<MarginSettings
						// Top margin
						marginEnableTop={ true }
						marginTop={ attributes.marginTop }
						marginTopMin="0"
						marginTopMax="200"
						onChangeMarginTop={ marginTop => setAttributes( { marginTop } ) }
						// Bottom margin
						marginEnableBottom={ true }
						marginBottom={ attributes.marginBottom }
						marginBottomMin="0"
						marginBottomMax="200"
						onChangeMarginBottom={ marginBottom => setAttributes( { marginBottom } ) }
					/>
				</PanelBody>
			</Fragment>
		</InspectorControls>
		);
	}
}
