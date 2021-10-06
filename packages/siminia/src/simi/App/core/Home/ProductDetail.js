import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { simiUseQuery } from 'src/simi/Network/Query';
import { getCateNoFilter } from 'src/simi/queries/catalog_gql/category.gql';
import Loading from 'src/simi/BaseComponents/Loading';
import { GridItem } from 'src/simi/BaseComponents/GridItem';

const ProductItem = props => {
    const { dataProduct, history } = props;
    const { data } = simiUseQuery(getCateNoFilter, {
        variables: {
            id: Number(dataProduct.category_id),
            pageSize: Number(8),
            currentPage: Number(1),
            stringId: String(dataProduct.category_id),
            filters: { category_id: { eq: String(dataProduct.category_id) } }
        },
        fetchPolicy: 'no-cache'
    });

    const handleAction = location => {
        history.push(location);
    };

    if (!data) return <Loading />;

    const renderProductItem = (item, lastInRow) => {
        const itemData = {
            ...item,
            small_image:
                typeof item.small_image === 'object' &&
                item.small_image.hasOwnProperty('url')
                    ? item.small_image.url
                    : item.small_image
        };
        return (
            <div
                key={`horizontal-item-${item.id}`}
                className={`horizontal-item ${lastInRow ? 'last' : 'middle'}`}
                style={{
                    display: 'inline-block'
                }}
            >
                <GridItem item={itemData} handleLink={handleAction} />
            </div>
        );
    };

    const renderProductGrid = items => {
        const products = items.map((item, index) => {
            return renderProductItem(item, index % 4 === 3);
        });

        return (
            <div
                className="horizontal-flex"
                style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    display: 'flex',
                    direction: Identify.isRtl() ? 'rtl' : 'ltr'
                }}
            >
                {products}
            </div>
        );
    };

    const products = data
        ? data.simiproducts
            ? data.simiproducts
            : data.products
            ? data.products
            : null
        : null;

    if (products.hasOwnProperty('items') && products.total_count > 0) {
        const productItem = products;
        return (
            <div className="product-list">
                <div className="product-horizotal">
                    {renderProductGrid(productItem.items)}
                </div>
            </div>
        );
    }

    return 'Product was found';
};

export default ProductItem;
