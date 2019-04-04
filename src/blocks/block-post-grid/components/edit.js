/**
 * External dependencies
 */

import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';
import Inspector from './inspector';

import compact from 'lodash/compact';
import map from 'lodash/map';
import get from 'lodash/get';

import GridImageSize from './image';

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const {
	withSelect,
} = wp.data;

const {
	Placeholder,
	Spinner,
	Toolbar,
} = wp.components;

const {
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;

class LatestPostsBlock extends Component {

	// need two functions to do this. one function should return the label and slug
	// for use in the inspector, the other should use the slug to grab the right
	// image size for use in the editor.

	// need to figure out how to pass the featured image into this.

	// getImageSizeOptions() {
	// 	const { imageSizes, image } = this.props;

	// 	return compact( map( imageSizes, ( { name, slug } ) => {
	// 		const sizeUrl = get( image, [ 'media_details', 'sizes', slug, 'source_url' ] );
	// 		if ( ! sizeUrl ) {
	// 			return null;
	// 		}
	// 		return {
	// 			value: sizeUrl,
	// 			label: name,
	// 		};
	// 	} ) );
	// }

	// try making this into a <ImageSize> component and passing in the featured image id

	getImageSize( imageID ) {
		const getSizeURL = get( wp.data.select( 'core' ).getMedia( imageID ), [ 'media_details', 'sizes', this.props.attributes.imageSize, 'source_url' ] );

		return {
			value: getSizeURL
		};
	}

	render() {
		const {
			attributes,
			setAttributes,
			latestPosts,
		} = this.props;

		// Check the image orientation
		const isLandscape = attributes.imageCrop === 'landscape';

		// Check if there are posts
		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;

		// Check the post type
		const isPost = attributes.postType === 'post';

		if ( ! hasPosts ) {
			return (
				<Fragment>
					<Inspector
						{ ...{ setAttributes, ...this.props } }
					/>
					<Placeholder
						icon="admin-post"
						label={ __( 'Atomic Blocks Post and Page Grid', 'atomic-blocks' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.', 'atomic-blocks' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > attributes.postsToShow ?
			latestPosts.slice( 0, attributes.postsToShow ) :
			latestPosts;

		// Add toolbar controls to change layout
		const layoutControls = [
			{
				icon: 'grid-view',
				title: __( 'Grid View', 'atomic-blocks' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: attributes.postLayout === 'grid',
			},
			{
				icon: 'list-view',
				title: __( 'List View', 'atomic-blocks' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: attributes.postLayout === 'list',
			},
		];

		// Get the section tag
		const SectionTag = attributes.sectionTag ? attributes.sectionTag : "section"

		// Get the section title tag
		const SectionTitleTag = attributes.sectionTitleTag ? attributes.sectionTitleTag : "h2"

		// Get the post title tag
		const PostTag = attributes.postTitleTag ? attributes.postTitleTag : "h3"

		const imageSize = this.getImageSize(8201);

		return (
			<Fragment>
				<Inspector
					{ ...{ setAttributes, ...this.props } }
				/>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ attributes.align }
						onChange={ ( value ) => {
							setAttributes( { align: value } );
						} }
						controls={ [ 'center', 'wide' ] }
					/>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<SectionTag
					className={ classnames(
						this.props.className,
						'ab-block-post-grid',
					) }
				>
					{ attributes.displaySectionTitle && attributes.sectionTitle &&
						<SectionTitleTag className="ab-post-grid-section-title">{ attributes.sectionTitle }</SectionTitleTag>
					}

					<div
						className={ classnames( {
							'is-grid': attributes.postLayout === 'grid',
							'is-list': attributes.postLayout === 'list',
							[ `columns-${ attributes.columns }` ]: attributes.postLayout === 'grid',
							'ab-post-grid-items' : 'ab-post-grid-items'
						} ) }
					>
						{ displayPosts.map( ( post, i ) =>
							<article
								key={ i }
								id={ 'post-' + post.id }
								className={ classnames(
									'post-' + post.id,
									post.featured_image_src && attributes.displayPostImage ? 'has-post-thumbnail' : null
								) }
							>

							{/* { console.log(post.featured_media) } */}

							{/* { this.getImageSize( post.featured_media ) } */}

							{/* { console.log( this.getImageSizeOptions() ) } */}

							{/* { console.log(this.getImageSize(8201)) } */}

							{ console.log( imageSize.value ) }

							{/* { console.log( post.featured_media ) } */}

							{/* { console.log( get( wp.data.select( 'core' ).getMedia( post.featured_media ), [ 'media_details', 'sizes', this.props.attributes.imageSize, 'source_url' ] ) ) } */}

								{
									attributes.displayPostImage && post.featured_image_src !== undefined && post.featured_image_src ? (
										<div className="ab-block-post-grid-image">
											<a href={ post.link } target="_blank" rel="bookmark">
												<img
													src={ isLandscape ? post.featured_image_src : post.featured_image_src_square }
													alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'atomic-blocks' ) }
												/>
											</a>
										</div>
									) : (
										null
									)
								}

								{/* { <GridImageSize
									url={ imageSize.value }
								></GridImageSize> } */}

								<div className="ab-block-post-grid-text">
									<header className="ab-block-post-grid-header">
										{ attributes.displayPostTitle &&
											<PostTag className="ab-block-post-grid-title"><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'atomic-blocks' ) }</a></PostTag>
										}

										{ isPost &&
											<div className="ab-block-post-grid-byline">
												{ attributes.displayPostAuthor && post.author_info.display_name &&
													<div className="ab-block-post-grid-author"><a className="ab-text-link" target="_blank" href={ post.author_info.author_link }>{ post.author_info.display_name }</a></div>
												}

												{ attributes.displayPostDate && post.date_gmt &&
													<time dateTime={ moment( post.date_gmt ).utc().format() } className={ 'ab-block-post-grid-date' }>
														{ moment( post.date_gmt ).local().format( 'MMMM DD, Y', 'atomic-blocks' ) }
													</time>
												}
											</div>
										}
									</header>

									<div className="ab-block-post-grid-excerpt">
										{ attributes.displayPostExcerpt && post.excerpt &&
											<div dangerouslySetInnerHTML={ { __html: truncate( post.excerpt.rendered, attributes.excerptLength ) } } />
										}

										{ attributes.displayPostLink &&
											<p><a className="ab-block-post-grid-more-link ab-text-link" href={ post.link } target="_blank" rel="bookmark">{ attributes.readMoreText }</a></p>
										}
									</div>
								</div>
							</article>
						) }
					</div>
				</SectionTag>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		// Latest Posts
		const {
			order,
			categories,
		} = props.attributes;

		const { getEntityRecords } = select( 'core', 'atomic-blocks' );

		const latestPostsQuery = pickBy( {
			categories,
			order,
			orderby: props.attributes.orderBy,
			per_page: props.attributes.postsToShow,
			offset: props.attributes.offset,
		}, ( value ) => ! isUndefined( value ) );

		const categoriesListQuery = {
			per_page: 100,
		};

		// Media
		const { getMedia } = select( 'core' );
		const { getEditorSettings } = select( 'core/editor' );
		const { id } = props.attributes;
		const { imageSizes } = getEditorSettings();

		return {
			// Latest posts
			latestPosts: getEntityRecords( 'postType', props.attributes.postType, latestPostsQuery ),
			categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
			// Media
			// Hardcoding a image id in here for testing
			image: 8201 ? getMedia( 8201 ) : null,
			imageSizes,
		};
	} ),
] )( LatestPostsBlock );

// Truncate excerpt
function truncate(str, no_words) {
	return str.split(" ").splice(0,no_words).join(" ");
}
