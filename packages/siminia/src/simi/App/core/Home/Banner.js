import React from 'react'
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Identify from "src/simi/Helper/Identify";
import BannerItem from "./BannerItem";
require('./banner.scss');

const Banner = props => {
    const { history, isPhone } = props;
    const data = props.data.simiBanner ? props.data.simiBanner : [];
    const bannerCount = data.length;
    const slideSettings = {
        autoPlay: false,
        showArrows: false,
        showThumbs: false,
        showIndicators: (bannerCount && bannerCount === 1) || isPhone ? false : true,
        showStatus: false,
        infiniteLoop: true,
        rtl: Identify.isRtl() === true,
        lazyLoad: false,
        dynamicHeight: false, 
        transitionTime: 500
    }

    if (slideSettings.rtl && bannerCount)
        slideSettings.selectedItem = bannerCount - 1

    const bannerData = [];
    let cloneDataForEditing = JSON.parse(JSON.stringify(data));
    const sortData = Identify.isRtl() ?
        cloneDataForEditing.sort((a, b) => parseInt(b.sort_order) - parseInt(a.sort_order)) :
        cloneDataForEditing.sort((a, b) => parseInt(a.sort_order) - parseInt(b.sort_order))
    sortData.forEach((item, index) => {
        if (item.banner_name || item.banner_name_tablet) {
            bannerData.push(
                <div
                    style={{ cursor: 'pointer' }}
                    key={index}
                >
                    <BannerItem item={item} history={history} isPhone={isPhone} />
                </div>
            )
        }

    })

    return (
        <div className={`banner-homepage ${Identify.isRtl() ? 'banner-home-rtl' : ''}`}>
            <div className={`container home-container`}>
                <Carousel {...slideSettings}>
                    {bannerData}
                </Carousel>
            </div>
        </div>
    );
}

export default Banner;
