
import { gql } from '@apollo/client';



export const ADD_CONFIGURABLE_PRODUCT_TO_CART = gql`
mutation AddProductsToCart(
    $cartId: String!
    $cartItems: [CartItemInput!]!
) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
        cart {
            items {
                product {
                    name
                    sku
                }
                quantity
            }
        }
    }
}
`;
export default {
    addConfigurableProductToCartMutation : ADD_CONFIGURABLE_PRODUCT_TO_CART,
}