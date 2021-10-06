import React, { useEffect, useState } from 'react'
import Banner from './Banner';
import HomeCat from "./HomeCat";
import LoadingSpiner from 'src/simi/BaseComponents/Loading'
import { withRouter } from 'react-router-dom';
import ProductList from './ProductList';
import Identify from 'src/simi/Helper/Identify';
import * as Constants from 'src/simi/Config/Constants';
import { useWindowSize } from '@magento/peregrine';
import { useHome } from 'src/simi/talons/Home/useHome'
import GET_HOME_DATA from 'src/simi/queries/homeData'
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';

require('./home.scss');
const Home = props => {
    const { history } = props;
    const talonProps = useHome({ queries: { getHomeQuery: GET_HOME_DATA } })
    const { data, error, loading } = talonProps
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    if (!data || error || loading)
        return ''

    const renderContent = (name, data) => {
        let component = null;
        switch (name) {
            case 'banner':
                component = <Banner data={data} history={history} isPhone={isPhone} />
                break;
            case 'category':
                component = <HomeCat catData={data} history={history} isPhone={isPhone} />
                break;
            case 'products':
                component = <ProductList homeData={data} history={history} />
                break;
            default:
                break
        }
        return component;
    }

    return (
        <div className="home-page">
            {renderContent('banner', data)}
            {renderContent('category', data)}
            <LazyLoad placeholder={<LoadingSpiner />}>
                {renderContent('products', data)}
            </LazyLoad>
        </div >
    );
}

export default withRouter(Home);