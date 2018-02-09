/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import Masterbar from './masterbar';
import { connect } from 'react-redux';
import { getLocaleSlug, localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import Item from './item';
import WordPressLogo from 'components/wordpress-logo';
import WordPressWordmark from 'components/wordpress-wordmark';
import { getCurrentQueryArguments, getCurrentRoute } from 'state/selectors';
import { login } from 'lib/paths';
import { addQueryArgs } from 'lib/route';

function getLoginUrl( redirectUri ) {
	const params = { locale: getLocaleSlug() };

	if ( redirectUri ) {
		params.redirectTo = redirectUri;
	} else if ( typeof window !== 'undefined' ) {
		params.redirectTo = window.location.href;
	}

	return login( { ...params, isNative: config.isEnabled( 'login/native-login-links' ) } );
}

function getSignupUrl( currentRoute, query ) {
	if ( '/log-in/jetpack' === currentRoute ) {
		return addQueryArgs( query, '/jetpack/connect/authorize' );
	}
	return config( 'signup_url' );
}

const MasterbarLoggedOut = ( {
	currentRoute,
	query,
	title,
	sectionName,
	translate,
	redirectUri,
} ) => (
	<Masterbar>
		<Item className="masterbar__item-logo">
			<WordPressLogo className="masterbar__wpcom-logo" />
			<WordPressWordmark className="masterbar__wpcom-wordmark" />
		</Item>
		<Item className="masterbar__item-title">{ title }</Item>
		<div className="masterbar__login-links">
			{ 'signup' !== sectionName ? (
				<Item url={ getSignupUrl( currentRoute, query ) }>
					{ translate( 'Sign Up', {
						context: 'Toolbar',
						comment: 'Should be shorter than ~12 chars',
					} ) }
				</Item>
			) : null }

			{ 'login' !== sectionName ? (
				<Item url={ getLoginUrl( redirectUri ) }>
					{ translate( 'Log In', {
						context: 'Toolbar',
						comment: 'Should be shorter than ~12 chars',
					} ) }
				</Item>
			) : null }
		</div>
	</Masterbar>
);

MasterbarLoggedOut.propTypes = {
	title: PropTypes.string,
	sectionName: PropTypes.string,
	redirectUri: PropTypes.string,
};

MasterbarLoggedOut.defaultProps = {
	title: '',
	sectionName: '',
};

export default connect( state => ( {
	currentRoute: getCurrentRoute( state ),
	query: getCurrentQueryArguments( state ),
} ) )( localize( MasterbarLoggedOut ) );
