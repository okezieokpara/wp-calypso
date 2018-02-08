/** @format */
/**
 * External dependencies
 */
//import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { noop, isEmpty } from 'lodash';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import { getTranslationData } from './utils.js';

class Translatable extends Component {
	state = {
		showDialog: false,
		originalData: {},
	};

	hasDataLoaded() {
		return ! isEmpty( this.state.originalData );
	}

	handleTranslationChange = event => {
		const { name, value } = event.target;
		this.setState( {
			originalData: {
				...this.state.translationData,
				[ name ]: value,
			},
		} );
	};

	closeDialog = () => this.setState( { showDialog: false } );

	openDialog = event => {
		event.preventDefault();

		this.setState( { showDialog: true } );

		const { singular, context, plural, locale } = this.props;
		! this.hasDataLoaded() &&
			getTranslationData( locale.langSlug, { singular, context, plural } ).then( originalData =>
				this.setState( { originalData } )
			);
	};

	getDialogButtons = () => {
		const { translate } = this.props;
		return [
			<Button primary onClick={ this.closeDialog }>
				{ translate( 'Close', { textOnly: true } ) }
			</Button>,
			<Button
				primary
				onClick={ noop }
				disabled={ this.state.originalData.translatedSingular === this.props.singular }
			>
				Submit a new translation
			</Button>,
		];
	};

	renderDialogContent() {
		const placeHolderClass = classNames( {
			placeholder: ! this.hasDataLoaded(),
		} );

		return (
			<div className="community-translator__dialog-content">
				<header className="community-translator__dialog-header">
					<h2>Translate to { this.props.locale.name }</h2>
					<nav>
						<a
							target="_blank"
							rel="noopener noreferrer"
							title="Open this translation in translate.wordpress.com"
							href="https://translate.wordpress.com/"
						>
							<Gridicon icon="help" size={ 12 } />
						</a>
					</nav>
				</header>
				<section className="community-translator__dialog-body">
					<fieldset>
						<label htmlFor="community-translator__singular" className={ placeHolderClass }>
							<span>{ this.props.singular }</span>
							<textarea
								className={ placeHolderClass }
								id="community-translator__singular"
								name="translatedSingular"
								value={ this.state.originalData.translatedSingular }
								onChange={ this.handleTranslationChange }
							/>
						</label>
					</fieldset>
				</section>
			</div>
		);
	}

	render() {
		const { untranslated, children } = this.props;

		const classes = classNames( 'translatable community-translator__element', {
			'is-untranslated': untranslated,
		} );

		return (
			<span className={ classes } onContextMenu={ this.openDialog }>
				{ children }

				{ this.state.showDialog && (
					<Dialog
						isVisible={ this.state.showDialog }
						buttons={ this.getDialogButtons() }
						additionalClassNames="community-translator__dialog"
					>
						{ this.renderDialogContent() }
					</Dialog>
				) }
			</span>
		);
	}
}

export default localize( Translatable );
