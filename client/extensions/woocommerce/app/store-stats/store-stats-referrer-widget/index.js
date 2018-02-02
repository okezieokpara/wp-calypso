/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import { getSiteStatsNormalizedData } from 'state/stats/lists/selectors';
import Table from 'woocommerce/components/table';
import TableRow from 'woocommerce/components/table/table-row';
import TableItem from 'woocommerce/components/table/table-item';

class StoreStatsReferrerWidget extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		query: PropTypes.object.isRequired,
		siteId: PropTypes.number,
		statType: PropTypes.string.isRequired,
		selectedDate: PropTypes.string.isRequired,
	};

	categorize( data ) {
		const initialValue = [ 'social', 'email', 'organic', 'search', 'other' ].reduce( ( obj, c ) => {
			obj[ c ] = {
				gross_sales: 0,
			};
			return obj;
		}, {} );
		return data.reduce( ( result, d ) => {
			result[ d.category ].gross_sales += d.gross_sales;
			return result;
		}, initialValue );
	}

	render() {
		const { data, selectedDate } = this.props;
		const selectedData = find( data, d => d.date === selectedDate );
		const categorizedData = this.categorize( selectedData.data );
		const header = (
			<TableRow isHeader>
				<TableItem isHeader>Source</TableItem>
				<TableItem isHeader>Gross Sales</TableItem>
			</TableRow>
		);
		return (
			<Table header={ header } compact>
				{ Object.keys( categorizedData ).map( key => {
					const category = categorizedData[ key ];
					return (
						<TableRow key={ key }>
							<TableItem>{ key }</TableItem>
							<TableItem>{ category.gross_sales }</TableItem>
						</TableRow>
					);
				} ) }
			</Table>
		);
	}
}

export default connect( ( state, { siteId, statType, query } ) => {
	return {
		data: getSiteStatsNormalizedData( state, siteId, statType, query ),
	};
} )( StoreStatsReferrerWidget );
