import React from 'react'
import HomeCatItem from './HomeCatItem';

const HomeCat = props => {
    const { catData, history, isPhone} = props;

    const renderCat = () => {
        if(catData.simiCategories && catData.simiCategories instanceof Array && catData.simiCategories.length > 0) {
            const dataCat = JSON.parse(JSON.stringify(catData.simiCategories));
            dataCat.sort((a, b)=> parseInt(a.sort_order) - parseInt(b.sort_order))
            const cate = dataCat.map((item, key) => {
                return (
                    <HomeCatItem isPhone={isPhone} item={item} history={history} key={key}/>
                )
            })
            return (
                <div className="default-list-cate">
                    {cate}
                </div>
            ) 
        }
    }
    const cateRendered = renderCat()
    return cateRendered ? (
        <div className="default-category">
            <div className="container home-container">
                {renderCat()}
            </div>
        </div>
    ) :  ''
}

export default HomeCat;