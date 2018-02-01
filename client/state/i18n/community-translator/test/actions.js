/** @format */

/**
 * Internal dependencies
 */
import {
	,
	activateCommunityTranslator,
	deactivateCommunityTranslator
} from '../actions';

import {
	I18N_COMMUNITY_TRANSLATOR_ACTIVATE,
	I18N_COMMUNITY_TRANSLATOR_DEACTIVATE,
} from 'state/action-types';

describe( 'community translator actions', () => {
	test( '#activateCommunityTranslator()', () => {
		expect( activateCommunityTranslator() ).toEqual( {
			type: I18N_COMMUNITY_TRANSLATOR_ACTIVATE,
		} );
	} );

	test( '#deactivateCommunityTranslator()', () => {
		expect( deactivateCommunityTranslator() ).toEqual( {
			type: I18N_COMMUNITY_TRANSLATOR_DEACTIVATE,
		} );
	} );
} );
