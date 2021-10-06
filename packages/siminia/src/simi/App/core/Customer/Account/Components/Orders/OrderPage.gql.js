import gql from 'graphql-tag';

import { OrderFragment } from './OrderFragment.gql';
import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';

export const GET_ORDER_LIST = gql`
    query getOrders {
        customerOrders {
            items {
                id
                order_number
                created_at
                grand_total
                status
                order_currency
            }
        }
    }
`;

export const GET_ORDER_DETAIL = gql`
    query getOrderDetail (
        $orderNumber: String!
    ) {
        customerOrder (order_number: $orderNumber) {
            ...OrderFragment
        }
    }
    ${OrderFragment}
`;

export const RE_ORDER_ITEMS = gql`
    mutation reorderItems (
        $orderNumber: String!
    ) {
        reorderItems (orderNumber: $orderNumber) {
            cart {
                ...CartPageFragment
            }
            userInputErrors {
                message
                path
                code
            }
        }
    }
    ${CartPageFragment}
`;
