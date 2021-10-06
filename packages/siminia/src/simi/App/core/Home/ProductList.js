import React from 'react'
import ProductDetail from './ProductDetail';
import Identify from 'src/simi/Helper/Identify';

const ProductList = props => {
    const { homeData, history} = props;
    const renderListProduct = () => {
        if(
            homeData.hasOwnProperty('simiProductlist')
            && homeData.simiProductlist instanceof Array
            && homeData.simiProductlist.length > 0
        ) {
            const newHomeData = JSON.parse(JSON.stringify(homeData));
            newHomeData.simiProductlist.sort((a, b)=> parseInt(a.sort_order) - parseInt(b.sort_order))
            const productList = newHomeData.simiProductlist.map((item, index) => {
                if (item.category_id)
                    return (
                        <div className="default-productlist-item" key={index}>
                            <div className="default-productlist-title">
                                {item.list_title}
                            </div>
                            <ProductDetail dataProduct={item} history={history}/>
                        </div>
                    )
                return ''
            });
            return (
                <div className="productlist-content">
                    {productList}
                </div>
            )
        }
    }

    return (
        <div className={`default-home-product-list ${Identify.isRtl() ? 'default-home-pd-rtl' : ''}`}>
            <div className="container">
                {renderListProduct()}
            </div>
        </div>
    );
}

export default ProductList;
