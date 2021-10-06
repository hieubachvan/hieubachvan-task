import React, { useMemo, Suspense, useState, useCallback } from 'react';
import defaultClasses from './item.css';
import { configColor } from 'src/simi/Config';
import { Form } from 'informed';
import { useCartContext } from '/home/hieubachvan/pwa-studio/packages/peregrine/lib/context/cart.js';
import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser';
import { mergeClasses } from 'src/classify';
import { HOPrice } from 'src/simi/Helper/Pricing';
import Price from 'src/simi/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product';
import { Link } from 'src/drivers';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Image from 'src/simi/BaseComponents/Image';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import Identify from 'src/simi/Helper/Identify';
import { useProductFullDetail } from '/home/hieubachvan/pwa-studio/packages/peregrine/lib/talons/ProductFullDetail/useProductFullDetail.js';
import { isProductConfigurable } from '/home/hieubachvan/pwa-studio/packages/peregrine/lib/util/isProductConfigurable.js';
import { fullPageLoadingIndicator } from '/home/hieubachvan/pwa-studio/node_modules/@magento/venia-ui/lib/components/LoadingIndicator';
import defaultOperations from '/home/hieubachvan/pwa-studio/node_modules/@simicart/siminia/src/simi/queries/listProduct_gql/listing.gql.js'


const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

const INITIAL_OPTION_SELECTIONS = new Map();

import {
    productUrlSuffix,
    saveDataToUrl,
    resourceUrl,
    logoUrl
} from 'src/simi/Helper/Url';

const Griditem = props => {
    const { lazyImage } = props;
    const item = prepareProduct(props.item);
    const logo_url = logoUrl();
    console.log(item);
    const [quantity, setQuantity] = useState(0)
    const [loading, setLoading] = useState(false)
    const product = item
    // const talonProps = useProductFullDetail({ product });

    // const {
    //     mediaGalleryEntries,
    // } = talonProps;
    // console.log("pimageaa",mediaGalleryEntries );

    const deriveOptionSelectionsFromProduct = product => {
        if (!isProductConfigurable(product)) {
            return INITIAL_OPTION_SELECTIONS;
        }

        const initialOptionSelections = new Map();
        for (const { attribute_id } of product.configurable_options) {
            initialOptionSelections.set(attribute_id, undefined);
        }

        return initialOptionSelections;
    };

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );
    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);
            const selectedValue = values.find(
                item => item.value_index === value
            );
          
            if (selectedValue) {
                selectedOptions.push(selectedValue.value_index);
            
            }
        });

        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    // console.log("this is final", selectedOptionsArray);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const findProduct = selectedOptionsArray => {
        let productSku;
        if (selectedOptionsArray.length === 2) {
            product.variants.forEach((variant) => {
                if(variant.attributes[0].value_index === selectedOptionsArray[0] && variant.attributes[1].value_index === selectedOptionsArray[1]) {
                    productSku = variant.product.sku
                }
            })
        }
        return productSku;
    }


    const findImageMatch = (selectedOptionsArray) => {
        let path;
        if(selectedOptionsArray) {
            if(product.variants){

                product.variants.forEach((variant) => {
                    if (variant.attributes[0].value_index === selectedOptionsArray[0]) {
                        path = variant.product.media_gallery_entries[0].file
                    }
                })
            }
        }
        return path
    }

    const urlImage = findImageMatch(selectedOptionsArray)

    console.log("path", urlImage);

    const sku = findProduct(selectedOptionsArray)
    const [{ cartId }] = useCartContext();
    
    const [addConfigurableProductToCart] = useMutation(
        defaultOperations.addConfigurableProductToCartMutation
    );

    const variables = {
        cartId,
        cartItems : [{
            quantity,
            sku,
        }]
    }

    
    // console.log("cariablele", variables);

    // console.log("variants",variables );

    const handleAddToCart = async () => {
    setLoading(true)
       await addConfigurableProductToCart({variables})
    setLoading(false)
       window.location.reload();
    }



    //////////////////////////////////////////////////////

    const options = isProductConfigurable(item) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={item.configurable_options}
            />
        </Suspense>
    ) : null;


    const { classes } = props;
    const itemClasses = mergeClasses(defaultClasses, classes);
    if (!item) return '';
    const {
        name,
        url_key,
        id,
        price,
        type_id,
        small_image,
        rating_summary,
        review_count
    } = item;
    
    

    const product_url = `/${url_key}${productUrlSuffix()}`;

    saveDataToUrl(product_url, item);

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        }
    };
    // let imageUrl = small_image;

    let imageUrl = `${urlImage ? "https://magento.pwa-commerce.com/Store/pub/media/catalog/product/cache/dc95da597646fdf28a646388ec347303"+ urlImage : small_image } `
    //comment out this line when server got issue decoding images
    // imageUrl = resourceUrl(imageUrl, { type: 'image-product', width: 260 });
    console.log("product image", imageUrl);


    const image = (
        <div
            className={itemClasses['siminia-product-image']}
            style={{
                borderColor: configColor.image_border_color,
                backgroundColor: 'white'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    padding: 1
                }}
            >
                <Link to={location}>
                    {/* <Image
                        src={imageUrl}
                        alt={name}
                        fallBackUrl={small_image}
                    /> */}
                    <img className={itemClasses.image} src={imageUrl} alt={name} />
                </Link>
            </div>
        </div>
    );

    return (
        <div
            className={`${itemClasses['product-item']} ${
                itemClasses['siminia-product-grid-item']
            } siminia-product-grid-item`}
        >
            {lazyImage ? (
                <LazyLoad
                    placeholder={
                        <img
                            alt={name}
                            src={logo_url}
                            style={{ maxWidth: 60, maxHeight: 60 }}
                        />
                    }
                >
                    {image}
                </LazyLoad>
            ) : (
                image
            )}
            <div className={itemClasses['siminia-product-des']}>
                {/* <h1>hahahahhaah</h1> */}
                {review_count ? (
                    <div className={itemClasses['item-review-rate']}>
                        <StaticRate
                            rate={rating_summary}
                            classes={itemClasses}
                        />
                        <span className={itemClasses['item-review-count']}>
                            ({review_count}{' '}
                            {review_count
                                ? Identify.__('Reviews')
                                : Identify.__('Review')}
                            )
                        </span>
                    </div>
                ) : (
                    ''
                )}
                <div
                    role="presentation"
                    className={`${itemClasses['product-name']} ${
                        itemClasses['small']
                    }`}
                    onClick={() => props.handleLink(location)}
                >
                    {ReactHTMLParse(name)}
                </div>

                <div className={`${itemClasses['price-each-product']}`}>
                    <div
                        role="presentation"
                        className={`${itemClasses['prices-layout']} ${
                            Identify.isRtl()
                                ? itemClasses['prices-layout-rtl']
                                : ''
                        }`}
                        id={`price-${id}`}
                        onClick={() => props.handleLink(location)}
                    >
                        {type_id === 'configurable' && (
                            <div
                                className={itemClasses['configurable-aslowas']}
                            >
                                {Identify.__('As low as')}
                            </div>
                        )}
                        <Price
                            prices={price}
                            type={type_id}
                            classes={itemClasses}
                        />
                    </div>
                </div>
                {isProductConfigurable(product) ? (

                    <Form className={itemClasses.options} onSubmit={handleAddToCart} >
                    <div className={itemClasses.arrowUp} />
                    {options}
                    <div className={itemClasses.action}>
                    <input className={itemClasses.quantity} type="number" onChange={(e)=>setQuantity(e.target.value)} />
                    <button className={!loading ? itemClasses.btn : itemClasses.btnDis} type="submit">Add to cart</button>
                    </div>
                </Form>
                    ) : null}
            </div>
        </div>
    );
};

Griditem.contextTypes = {
    item: PropTypes.object,
    handleLink: PropTypes.func,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool
};

export default Griditem;
