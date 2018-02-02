/** @format */

/**
 * External dependencies
 */
import { moment } from 'i18n-calypso';

const today = moment();

const data = {
	date: today.format( 'YYYY-MM-DD' ),
	quantity: 30,
	unit: 'day',
	fields: [
		'referrer',
		'product_views',
		'add_to_carts',
		'product_purchases',
		'category',
		'gross_sales',
	],
	data: [
		{
			date: today.format( 'YYYY-MM-DD' ),
			data: [
				[ 'm.facebook.com', 14, 4, 2, 'social', 500 ],
				[ 'twitter.com', 24, 7, 3, 'social', 800 ],
				[ 'instagram.com', 2, 1, 1, 'social', 50 ],
				[ 'gmail.com', 7, 2, 1, 'email', 50 ],
				[ '', 24, 4, 2, 'organic', 300 ],
				[ 'google.com', 6, 1, 0, 'search', 0 ],
				[ 'bing.com', 7, 2, 1, 'search', 100 ],
				[ 'toasters.com', 22, 4, 2, 'other', 300 ],
				[ 'bread&jam.co.za', 3, 1, 1, 'other', 100 ],
			],
		},
		{
			date: today.subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
			data: [
				[ 'm.facebook.com', 14, 4, 2, 'social', 450, 50 ],
				[ '', 24, 4, 2, 'organic', 0, 300 ],
				[ 'google.com', 6, 1, 0, 'search', 0, 0 ],
			],
		},
		{
			date: today.subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
			data: [],
		},
	],
};

for ( let i = 0; i < 27; i++ ) {
	data.data.push( {
		date: today.subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
		data: [],
	} );
}

export default data;
