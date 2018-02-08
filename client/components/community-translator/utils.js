/** @format */

/**
 * External dependencies
 */
import request from 'superagent';
import { head, find } from 'lodash';

/**
 * Internal dependencies
 */
import userSettings from 'lib/user-settings';
import { isMobile } from 'lib/viewport';

export function canDisplayCommunityTranslator( locale = userSettings.getSetting( 'language' ) ) {
	// restrict mobile devices from translator for now while we refine touch interactions
	if ( isMobile() ) {
		return false;
	}

	if ( 'en' === locale || ! locale ) {
		return false;
	}

	return true;
}

export function isCommunityTranslatorEnabled() {
	if ( ! userSettings.getSettings() || ! userSettings.getOriginalSetting( 'enable_translator' ) ) {
		return false;
	}

	// restrict mobile devices from translator for now while we refine touch interactions
	if ( ! canDisplayCommunityTranslator() ) {
		return false;
	}

	return true;
}

export function getTranslationData( locale, originalStringData ) {
	// TODO: glotPressUrl & project should be constants and vary depending on NODE_ENV
	const glotPressUrl = 'https://translate.wordpress.com/api/translations/-query-by-originals';
	const project = 'wpcom'; //test
	const originalStringsValue = {
		project,
		locale_slug: locale,
		original_strings: originalStringData,
	};
	const postFormData = `project=${ project }&locale_slug=${ locale }&original_strings=${ encodeURIComponent(
		JSON.stringify( originalStringsValue )
	) }`;

	return request
		.post( glotPressUrl )
		.withCredentials()
		.send( postFormData )
		.then( response => normalizeDetailsFromTranslationData( head( response.body ) ) );
}

export function normalizeDetailsFromTranslationData( glotPressData ) {
	if ( glotPressData ) {
		const translationDetails = find( glotPressData.translations, {
			original_id: glotPressData.original_id,
		} );
		return {
			originalId: glotPressData.original_id,
			translatedString: translationDetails.translation_0,
			lastModified: translationDetails.date_modified,
		};
	}
	return {};
}
