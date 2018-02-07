/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize, translate } from 'i18n-calypso';
import { get, flow, inRange } from 'lodash';
import Gridicon from 'gridicons';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormButton from 'components/forms/form-button';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import FormInputValidation from 'components/forms/form-input-validation';
import ConfirmationDialog from './dialog';
import FormSectionHeading from 'components/forms/form-section-heading';
import { requestSiteRename } from 'state/site-rename/actions';
import { isRequestingSiteRename } from 'state/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

export const getDomainValidationMessage = domain => {
	if ( ! domain.match( /^[a-z0-9]+$/i ) ) {
		return translate( 'Domain can only contain letters and numbers' );
	}

	if ( ! inRange( domain.length, 2, 63 ) ) {
		return translate( 'Domain length should be between 2 and 63' );
	}
};

export class SimpleSiteRenameForm extends Component {
	static defaultProps = {
		currentDomainSuffix: '.wordpress.com',
		currentDomain: {},
	};

	state = {
		showDialog: false,
		domainFieldValue: '',
		domainFieldError: '',
	};

	onConfirm = () => {
		const { selectedSiteId } = this.props;
		// @TODO: Give ability to chose whether or not to discard the original domain name.
		const discard = false;

		this.props.requestSiteRename( selectedSiteId, this.state.domainFieldValue, discard );
	};

	showConfirmationDialog() {
		this.setState( {
			showDialog: true,
		} );
	}

	onSubmit = event => {
		const domainFieldError = getDomainValidationMessage( this.state.domainFieldValue );

		this.setState( { domainFieldError } );
		! domainFieldError && this.showConfirmationDialog();

		event.preventDefault();
	};

	onDialogClose = () => {
		this.setState( {
			showDialog: false,
		} );
	};

	onFieldChange = event => {
		const domainFieldValue = get( event, 'target.value' );

		if ( this.state.domainFieldError ) {
			const domainFieldError = getDomainValidationMessage( domainFieldValue );
			this.setState( { domainFieldError } );
		}

		this.setState( {
			domainFieldValue,
		} );
	};

	render() {
		const { currentDomain, translate, currentDomainSuffix } = this.props;
		const currentDomainPrefix = get( currentDomain, 'name', '' ).replace( '.wordpress.com', '' );
		const isWPCOM = get( currentDomain, 'type' ) === 'WPCOM';
		const isDisabled =
			! isWPCOM ||
			! this.state.domainFieldValue ||
			this.state.domainFieldValue === currentDomainPrefix;

		const { domainFieldError } = this.state;

		return (
			<div className="simple-site-rename-form">
				<ConfirmationDialog
					isVisible={ this.state.showDialog }
					onClose={ this.onDialogClose }
					newDomainName={ this.state.domainFieldValue }
					currentDomainName={ currentDomainPrefix }
					onConfirm={ this.onConfirm }
				/>
				<form onSubmit={ this.onSubmit }>
					<Card className="simple-site-rename-form__content">
						<FormSectionHeading>{ translate( 'Edit Domain Name' ) }</FormSectionHeading>
						<FormTextInputWithAffixes
							type="text"
							value={ this.state.domainFieldValue }
							suffix={ currentDomainSuffix }
							onChange={ this.onFieldChange }
							placeholder={ currentDomainPrefix }
							className={ domainFieldError ? 'is-error' : null }
						/>
						{ domainFieldError && <FormInputValidation isError text={ domainFieldError } /> }
						<div className="simple-site-rename-form__footer">
							<div className="simple-site-rename-form__info">
								<Gridicon icon="info-outline" size={ 18 } />
								<p>
									{ translate(
										'Once changed, previous domain names will no longer be available.'
									) }
								</p>
							</div>
							<FormButton
								disabled={ isDisabled }
								busy={ this.props.isSiteRenameRequesting }
								type="submit"
							>
								{ translate( 'Change Site Address' ) }
							</FormButton>
						</div>
					</Card>
				</form>
			</div>
		);
	}
}

export default flow(
	localize,
	connect(
		state => {
			const siteId = getSelectedSiteId( state );

			return {
				selectedSiteId: siteId,
				isSiteRenameRequesting: isRequestingSiteRename( state, siteId ),
			};
		},
		{
			requestSiteRename,
		}
	)
)( SimpleSiteRenameForm );
