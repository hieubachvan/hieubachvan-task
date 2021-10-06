import gql from 'graphql-tag';

export const OrderFragment = gql`
    fragment OrderFragment on CustomerOrder {
        order_number
        id
        created_at
        grand_total
        status
        shipping_method
        payment_method
        prices {
            sub_total {
                value
                currency
            }
            grand_total {
                value
                currency
            }
            tax {
                value
                currency
            }
            discount {
                value
                currency
            }
            discounts {
                amount {
                    value
                    currency
                }
                label
            }
        }
        items {
            id
            name
            image
            sku
            url_key
            price
            qty
            discount
            row_total
        }
        billing_address {
            id
            customer_id
            region_id
            country_id
            country_code
            street
            company
            telephone
            fax
            postcode
            city
            firstname
            lastname
            middlename
            prefix
            suffix
            vat_id
            default_shipping
            default_billing
        }
        shipping_address {
            id
            customer_id
            region_id
            country_id
            country_code
            street
            company
            telephone
            fax
            postcode
            city
            firstname
            lastname
            middlename
            prefix
            suffix
            vat_id
            default_shipping
            default_billing
        }
    }
`;
