/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/App/localeProvider.js`]: '@simicart/siminia/src/override/localeProvider.js',
    [`@magento/venia-ui/lib/components/ProductOptions/option.css`] : '@simicart/siminia/src/simi/BaseComponents/GridItem/option.css',
    [`@magento/venia-ui/lib/components/ProductOptions/tile.css`]: '@simicart/siminia/src/simi/BaseComponents/GridItem/optionTitle.css',
};
