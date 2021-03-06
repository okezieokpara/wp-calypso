/** @format */

/**
 * External dependencies
 */

import { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import CustomDomainPurchaseDetail from './custom-domain-purchase-detail';
import GoogleAppsDetails from './google-apps-details';
import { isEnabled } from 'config';
import { isBusiness, isGoogleApps } from 'lib/products-values';
import PurchaseDetail from 'components/purchase-detail';

function trackOnboardingButtonClick() {
	analytics.tracks.recordEvent( 'calypso_checkout_thank_you_onboarding_click' );
}

const BusinessPlanDetails = ( { selectedSite, sitePlans, selectedFeature, purchases } ) => {
	const plan = find( sitePlans.data, isBusiness );
	const googleAppsWasPurchased = purchases.some( isGoogleApps );

	return (
		<div>
			{ googleAppsWasPurchased && <GoogleAppsDetails isRequired /> }

			<CustomDomainPurchaseDetail
				selectedSite={ selectedSite }
				hasDomainCredit={ plan && plan.hasDomainCredit }
			/>

			<PurchaseDetail
				icon={ <img src="/calypso/images/illustrations/support.svg" /> }
				title={ i18n.translate( 'Get personalized help' ) }
				description={ i18n.translate(
					'Schedule a one-on-one orientation with a Happiness Engineer to set up ' +
						'your site and learn more about WordPress.com.'
				) }
				buttonText={ i18n.translate( 'Schedule a session' ) }
				href={ `/me/concierge/${ selectedSite.slug }/book` }
				onClick={ trackOnboardingButtonClick }
			/>

			{ ! selectedFeature && (
				<PurchaseDetail
					icon={ <img src="/calypso/images/upgrades/customize-theme.svg" /> }
					title={ i18n.translate( 'Try a New Theme' ) }
					description={ i18n.translate(
						"You've now got access to every premium theme, at no extra cost - that's hundreds of new options. " +
							'Give one a try!'
					) }
					buttonText={ i18n.translate( 'Browse premium themes' ) }
					href={ '/themes/' + selectedSite.slug }
				/>
			) }

			{ ! selectedFeature &&
				isEnabled( 'manage/plugins/upload' ) && (
					<PurchaseDetail
						icon={ <img src="/calypso/images/upgrades/plugins.svg" /> }
						title={ i18n.translate( 'Add a Plugin' ) }
						description={ i18n.translate(
							'Search and add plugins right from your dashboard, or upload a plugin ' +
								'from your computer with a drag-and-drop interface.'
						) }
						buttonText={ i18n.translate( 'Upload a plugin now' ) }
						href={ '/plugins/upload/' + selectedSite.slug }
					/>
				) }

			<PurchaseDetail
				icon={ <img src="/calypso/images/upgrades/adwords.svg" /> }
				title={ i18n.translate( 'Connect to Google Analytics' ) }
				description={ i18n.translate(
					"Complement WordPress.com's stats with Google's in-depth look at your visitors and traffic patterns."
				) }
				buttonText={ i18n.translate( 'Connect Google Analytics' ) }
				href={ '/settings/analytics/' + selectedSite.slug }
			/>
		</div>
	);
};

BusinessPlanDetails.propTypes = {
	selectedSite: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ).isRequired,
	selectedFeature: PropTypes.object,
	sitePlans: PropTypes.object.isRequired,
};

export default BusinessPlanDetails;
