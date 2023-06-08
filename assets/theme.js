/**
 * Module to add a shipping rates calculator to cart page.
 *
 * Copyright (c) 2011-2016 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Modified by David Little, 2016
 */

// "object"==typeof Countries&&(Countries.updateProvinceLabel=function(e,t){if("string"==typeof e&&Countries[e]&&Countries[e].provinces){if("object"!=typeof t&&(t=document.getElementById("address_province_label"),null===t))return;t.innerHTML=Countries[e].label;var r=jQuery(t).parent();r.find("select");r.find(".custom-style-select-box-inner").html(Countries[e].provinces[0])}}),"undefined"==typeof Shopify.Cart&&(Shopify.Cart={}),Shopify.Cart.ShippingCalculator=function(){var _config={submitButton:"Calculate shipping",submitButtonDisabled:"Calculating...",templateId:"shipping-calculator-response-template",wrapperId:"wrapper-response",customerIsLoggedIn:!1,moneyFormat:"$"},_render=function(e){var t=jQuery("#"+_config.templateId),r=jQuery("#"+_config.wrapperId);if(t.length&&r.length){var templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var n=Handlebars.compile(jQuery.trim(t.text())),a=n(e);if(jQuery(a).appendTo(r),"undefined"!=typeof Currency&&"function"==typeof Currency.convertAll){var i="";jQuery("[name=currencies]").size()?i=jQuery("[name=currencies]").val():jQuery("#currencies span.selected").size()&&(i=jQuery("#currencies span.selected").attr("data-currency")),""!==i&&Currency.convertAll(shopCurrency,i,"#wrapper-response span.money, #estimated-shipping span.money")}}},_enableButtons=function(){jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)},_disableButtons=function(){jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled","disabled").addClass("disabled")},_getCartShippingRatesForDestination=function(e){var t={type:"POST",url:"/cart/prepare_shipping_rates",data:jQuery.param({shipping_address:e}),success:_pollForCartShippingRatesForDestination(e),error:_onError};jQuery.ajax(t)},_pollForCartShippingRatesForDestination=function(e){var t=function(){jQuery.ajax("/cart/async_shipping_rates",{dataType:"json",success:function(r,n,a){200===a.status?_onCartShippingRatesUpdate(r.shipping_rates,e):setTimeout(t,500)},error:_onError})};return t},_fullMessagesFromErrors=function(e){var t=[];return jQuery.each(e,function(e,r){jQuery.each(r,function(r,n){t.push(e+" "+n)})}),t},_onError=function(XMLHttpRequest,textStatus){jQuery("#estimated-shipping").hide(),jQuery("#estimated-shipping em").empty(),_enableButtons();var feedback="",data=eval("("+XMLHttpRequest.responseText+")");feedback=data.message?data.message+"("+data.status+"): "+data.description:"Error : "+_fullMessagesFromErrors(data).join("; ")+".","Error : country is not supported."===feedback&&(feedback="We do not ship to this destination."),_render({rates:[],errorFeedback:feedback,success:!1}),jQuery("#"+_config.wrapperId).show()},_onCartShippingRatesUpdate=function(e,t){_enableButtons();var r="";if(t.zip&&(r+=t.zip+", "),t.province&&(r+=t.province+", "),r+=t.country,e.length){"0.00"==e[0].price?jQuery("#estimated-shipping em").html("FREE"):jQuery("#estimated-shipping em").html(_formatRate(e[0].price));for(var n=0;n<e.length;n++)e[n].price=_formatRate(e[n].price)}_render({rates:e,address:r,success:!0}),jQuery("#"+_config.wrapperId+", #estimated-shipping").fadeIn()},_formatRate=function(e){function t(e,t){return"undefined"==typeof e?t:e}function r(e,r,n,a){if(r=t(r,2),n=t(n,","),a=t(a,"."),isNaN(e)||null==e)return 0;e=(e/100).toFixed(r);var i=e.split("."),o=i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n),s=i[1]?a+i[1]:"";return o+s}if("function"==typeof Shopify.formatMoney)return Shopify.formatMoney(e,_config.moneyFormat);"string"==typeof e&&(e=e.replace(".",""));var n="",a=/\{\{\s*(\w+)\s*\}\}/,i=_config.moneyFormat;switch(i.match(a)[1]){case"amount":n=r(e,2);break;case"amount_no_decimals":n=r(e,0);break;case"amount_with_comma_separator":n=r(e,2,".",",");break;case"amount_no_decimals_with_comma_separator":n=r(e,0,".",",")}return i.replace(a,n)};return _init=function(){new Shopify.CountryProvinceSelector("address_country","address_province",{hideElement:"address_province_container"});var e=jQuery("#address_country"),t=jQuery("#address_province_label").get(0);"undefined"!=typeof Countries&&(Countries.updateProvinceLabel(e.val(),t),e.change(function(){Countries.updateProvinceLabel(e.val(),t)})),jQuery(".get-rates").click(function(){_disableButtons(),jQuery("#"+_config.wrapperId).empty().hide();var e={};e.zip=jQuery("#address_zip").val()||"",e.country=jQuery("#address_country").val()||"",e.province=jQuery("#address_province").val()||"",_getCartShippingRatesForDestination(e)}),_config.customerIsLoggedIn&&jQuery(".get-rates:eq(0)").trigger("click")},{show:function(e){e=e||{},jQuery.extend(_config,e),jQuery(function(){_init()})},getConfig:function(){return _config},formatRate:function(e){return _formatRate(e)}}}();


window.slate = window.slate || {};
window.theme = window.theme || {};


/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {

  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '$';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);

    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    stockMessage: '[data-stock-message]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productSku: '[data-product-sku]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    variantInventory: '.var-inventory'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;
      $('[data-product-sku]').html(variant.sku);

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      this.updateProductQty(variant.id);
      console.log(variant);
      if (variant.available) {

        $(".variant-inventory").hide();
        $('.variant-inventory.varstock-' + variant.id ).show();

        $(".varweight").hide();
        $('.varweight.varweight-' + variant.id ).show();

        // if (variant.inventory_quantity < 5) {
        //   $(selectors.stockMessage, this.$container).html('<p class="low-stock"><img src="//cdn.shopify.com/s/files/1/0147/4478/0886/t/90/assets/icon-stock-alert.svg?v=112830873776969275681664275569" alt="Tick"> Low Stock</p>');
        // } else {
        //   $(selectors.stockMessage, this.$container).html('asdasd<p class="in-stock"><img src="//cdn.shopify.com/s/files/1/0147/4478/0886/t/90/assets/in-stock-tick.svg?v=71917211639732204041664275568" alt="Tick"> In Stock</p>');
        // }
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCart, this.$container).removeClass('disabled');
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
        
      } else {

        $(".variant-inventory").hide();
        $('.variant-inventory.varstock-' + variant.id ).show();

        $(".varweight").hide();
        $('.varweight.varweight-' + variant.id ).show();

        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCart, this.$container).addClass('disabled');
        //$(selectors.stockMessage, this.$container).html('<p class="out-of-stock"><img src="//cdn.shopify.com/s/files/1/0147/4478/0886/t/90/assets/out-of-stock-tick.svg?v=85976546842231991931664275567" alt="Tick"> Out Of Stock</p>');
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container).html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));
      $('[data-product-sku]').html(variant.sku);
      //update inventory
      //$(selectors.variantInventory, this.$container).html(inv_qty[ variant.id ]);

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, '500x500');
      var slideNo = $('.product-image-large div[data-image-src=' +  variant.featured_image.id  + ']').data("slick-index");
      $('.product-image-large').slick('slickGoTo', slideNo );
      $('.thumb').removeClass('slick-current');
    },

    /**
     * Updates the DOM with the product inventory quantity
     *
     * @param {string} quantity - Product Quantity
     */

    updateProductQty: function(id) {
      let updatedInv = inv_qty[ id ];
      //$(selectors.variantInventory, this.$container).html(inv_qty[ id ]);

      let options = [];
      let qtyJson;

      console.log("Inventory is " + updatedInv);
      //If inventory is more than 10, limit to 10
      if (updatedInv > 10) {
        updatedInv = 10;
      }

      if (updatedInv == 0){
            qtyJson = {text : 0, value: 0};
            options.push(qtyJson);
            $("#Quantity").prop("disabled", true);
      }
      else {
        for (let i = 1; i <= updatedInv; i++)  {
            qtyJson = {text : i, value: i};
            options.push(qtyJson);
        }
         $("#Quantity").prop("disabled", false);
      }
     
     
      $("#Quantity").replaceOptions(options);
    },


    updateProductSku: function(evt) {
      var variant = evt.variant;
      $('[data-product-sku]').html(variant.sku);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('show');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('show');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

//Change Inventory Quantity select change
(function($, window) {
  $.fn.replaceOptions = function(options) {
    var self, $option;

    this.empty();
    self = this;

    $.each(options, function(index, option) {
      $option = $("<option></option>")
        .attr("value", option.value)
        .text(option.text);
      self.append($option);
    });
  };
})(jQuery, window);

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */

  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


if ($('body.template-cart').length > 0){
   Shopify.Cart.ShippingCalculator.show( {
    submitButton: theme.strings.shippingCalcSubmitButton,
    submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
    customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
    moneyFormat: theme.strings.shippingCalcMoneyFormat
   } );
}








/**
 * Module to ajaxify all add to cart forms on the page.
 *
 * Copyright (c) 2015 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
Shopify.AjaxifyCart = (function($) {

  // Some configuration options.
  // I have separated what you will never need to change from what
  // you might change.

  var _config = {

    // What you might want to change
    addToCartBtnLabel:             'Add to Basket',
    addedToCartBtnLabel:           'Thank you!',
    addingToCartBtnLabel:          'Adding...',
    soldOutBtnLabel:               'Sold Out',
    howLongTillBtnReturnsToNormal: 1000, // in milliseconds.
    cartCountSelector:             '.item_count',
    cartTotalSelector:             '#cart-price',
    // 'aboveForm' for top of add to cart form,
    // 'belowForm' for below the add to cart form, and
    // 'nextButton' for next to add to cart button.
    feedbackPosition:              'nextButton',

    // What you will never need to change
    addToCartBtnSelector:          '[type="submit"]',
    addToCartFormSelector:         'form[action="/cart/add"]',
    shopifyAjaxAddURL:             '/cart/add.js',
    shopifyAjaxCartURL:            '/cart.js'
  };

  // We need some feedback when adding an item to the cart.
  // Here it is.
  var _showFeedback = function(success, html, $addToCartForm) {
    function getFormData($form) {
      var unindexed_array = $form.serializeArray();
      var indexed_array = {};

      $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
      });

      return indexed_array;
    }
    var data = getFormData($addToCartForm);
    console.log(data);
    $('body').css('overflow', 'hidden');
    $('body').on('click', '.ajax-remove-product', function () {
      jQuery.post('/cart/update.js', 'updates[' + data.id + ']=0');
      $('.ajax-modal-overlay').remove();
      $('body').css('overflow', 'auto');
    });
    $('body').on('click', '.ajax-close-modal', function () {
      $('.ajax-modal-overlay').remove();
      $('body').css('overflow', 'auto');
    }); 
    var productJson = $('[data-product-json]').html();  
    var variant = JSON.parse(productJson);
    console.log(variant);
    $('.ajaxified-cart-feedback').remove();
    var feedback = '<div class="ajax-modal-overlay">' +
    '<div class="ajax-modal"> ' +
        '<div class="ajax-modal-header">' +
          '<p class="ajaxified-cart-feedback ' + success + '">' + 
          '<svg width="20px" viewBox="0 0 64 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="margin-right: 10px;fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g id="canvas_background" style="fill:#58b0e3" transform="matrix(1,0,0,1,-8,-16)"> <rect x="-1" y="-1" width="82" height="82"/></g><g id="_Compound_Path_" transform="matrix(1,0,0,1,-8,-16)"> <path d="M29.33,64.23L8,42.94L13.87,37.07L29.33,52.5L66.13,15.77L72,21.64L29.33,64.23" style="fill:#fff;fill-rule:nonzero;"/></g></svg>' +
          'Items added to your basket</p>' +
        '</div>' +
        '<div class="ajax-modal-content">' +
          '<div class="row">' +
            '<div class="col-12 col-sm-3 variant-image-container">' +
              '<img src="' + variant.images[0] + '" alt />' +
            '</div>' +
            '<div class="col-12 col-sm-6">' +
              '<div class="row ajax-modal-container">' +
                '<p class="ajax-product-title">' + variant.title + '</p>' +
              '</div>' +
              '<div class="row ajax-modal-container ajax-price">' + 
                '<p class="ajax-product-price">' + Shopify.formatMoney(variant.price).replace('$', '£') + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="col-12 col-sm-3 remove-icon-container">' + 
              '<a class="ajax-remove-product"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" viewBox="0 0 20 20"><path fill="#444" d="M15.89 14.696l-4.734-4.734 4.717-4.717c.4-.4.37-1.085-.03-1.485s-1.085-.43-1.485-.03L9.641 8.447 4.97 3.776c-.4-.4-1.085-.37-1.485.03s-.43 1.085-.03 1.485l4.671 4.671-4.688 4.688c-.4.4-.37 1.085.03 1.485s1.085.43 1.485.03l4.688-4.687 4.734 4.734c.4.4 1.085.37 1.485-.03s.43-1.085.03-1.485z"/></svg></a>' +
            '</div>' + 
          '</div>' +
        '</div>' +
        '<div class="ajax-modal-footer">' +
          '<div class="row">' +
            '<div class="col-12 col-sm-6 ajax-button-container">' +
              '<a href="#" type="submit" name="add" style="visibility: visible;" class="button secondary ajax-close-modal">' +
                '<span>Continue</span>' +
              '</a>' +
            '</div>' +
            '<div class="col-12 col-sm-6 ajax-button-container">' +
              '<a href="/cart" style="visibility: visible;" class="button primary">' +
                '<span>Checkout</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>';
    switch (_config.feedbackPosition) {
      case 'aboveForm':
        $addToCartForm.before(feedback);
        break;
      case 'belowForm':
        $addToCartForm.after(feedback);
        break;
      case 'nextButton':
      default:
        $addToCartForm.find(_config.addToCartBtnSelector).after(feedback);
        break;
    }


    // If you use animate.css
    // $('.ajaxified-cart-feedback').addClass('animated bounceInDown');
    $('.ajaxified-cart-feedback').slideDown();
  };
  var _setText = function($button, label) {
    if ($button.children().length) {
      $button.children().each(function() {
        if ($.trim($(this).text()) !== '') {
          $(this).text(label);
        }
      });
    }
    else {
      $button.val(label).text(label);
    }
  };
  var _init = function() {
    $(document).ready(function() {
      $(_config.addToCartFormSelector).submit(function(e) {
        e.preventDefault();
        var $addToCartForm = $(this);
        var $addToCartBtn = $addToCartForm.find(_config.addToCartBtnSelector);
        _setText($addToCartBtn, _config.addingToCartBtnLabel);
        $addToCartBtn.addClass('disabled').prop('disabled', true);
        // Add to cart.
        $.ajax({
          url: _config.shopifyAjaxAddURL,
          dataType: 'json',
          type: 'post',
          data: $addToCartForm.serialize(),
          success: function(itemData) {
            // Re-enable add to cart button.
            $addToCartBtn.addClass('inverted');
            _setText($addToCartBtn, _config.addedToCartBtnLabel);
            _showFeedback('success','<i class="fa fa-check"></i> Added to Basket! <a href="/cart">View Basket</a> or <a href="/collections/all">continue shopping</a>.',$addToCartForm);
            window.setTimeout(function(){
              $addToCartBtn.prop('disabled', false).removeClass('disabled').removeClass('inverted');
              _setText($addToCartBtn,_config.addToCartBtnLabel);
            }, _config.howLongTillBtnReturnsToNormal);
            // Update cart count and show cart link.
            $.getJSON(_config.shopifyAjaxCartURL, function(cart) {
              if (_config.cartCountSelector && $(_config.cartCountSelector).size()) {
                var value = $(_config.cartCountSelector).html() || '0';
                var has_collect = false;
                for (let i = 0; i < cart.items.length; i++) {
                  const element = cart.items[i];
                  if (element.title == 'Click & Collect') {
                    has_collect = true;
                  }
                }
                if (has_collect == true) {
                  var cart_amount = cart.item_count - 1;
                } else {
                  var cart_amount = cart.item_count;
                }
                $(_config.cartCountSelector).html(value.replace(/[0-9]+/,cart_amount)).removeClass('hidden-count');
              }
              if (_config.cartTotalSelector && $(_config.cartTotalSelector).size()) {
                if (typeof Currency !== 'undefined' && typeof Currency.moneyFormats !== 'undefined') {
                  var newCurrency = '';
                  if (newCurrency) {
                    $(_config.cartTotalSelector).html('<span class=money>' + Shopify.formatMoney(Currency.convert(cart.total_price, "", newCurrency), Currency.money_format[newCurrency]) + '</span>');
                  }
                  else {
                    $(_config.cartTotalSelector).html(Shopify.formatMoney(cart.total_price, ""));
                  }
                }
                else {
                  $(_config.cartTotalSelector).html(Shopify.formatMoney(cart.total_price, "").replace('$', 'Â£'));
                }
              };
            });
          },
          error: function(XMLHttpRequest) {
            var response = eval('(' + XMLHttpRequest.responseText + ')');
            response = response.description;
            if (response.slice(0,4) === 'All ') {
              _showFeedback('error', response.replace('All 1 ', 'All '), $addToCartForm);
              $addToCartBtn.prop('disabled', false);
              _setText($addToCartBtn, _config.soldOutBtnLabel);
              $addToCartBtn.prop('disabled',true);
            }
            else {
              _showFeedback('error', '<i class="fa fa-warning"></i> ' + response, $addToCartForm);
              $addToCartBtn.prop('disabled', false).removeClass('disabled');
              _setText($addToCartBtn, _config.addToCartBtnLabel);
            }
          }
        });
        return false;
      });
    });
  };
  return {
    init: function(params) {
        // Configuration
        params = params || {};
        // Merging with defaults.
        $.extend(_config, params);
        // Action
        $(function() {
          _init();
        });
    },
    getConfig: function() {
      return _config;
    }
  }
})(jQuery);

Shopify.AjaxifyCart.init();


// Slate on ready stuff


$(document).ready(function() {

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // This button will increment the value
      $('.qtyplus').click(function(e){
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
          fieldName = $(this).attr('field');
          // Get its current value
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // If is not undefined
          if (!isNaN(currentVal)) {
              // Increment
              $('input[name='+fieldName+']').val(currentVal + 1);
          } else {
              // Otherwise put a 0 there
              $('input[name='+fieldName+']').val(0);
          }
      });
      // This button will decrement the value till 0
      $(".qtyminus").click(function(e) {
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
          fieldName = $(this).attr('field');
          // Get its current value
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // If it isn't undefined or its greater than 0
          if (!isNaN(currentVal) && currentVal > 0) {
              // Decrement one
              $('input[name='+fieldName+']').val(currentVal - 1);
          } else {
              // Otherwise put a 0 there
              $('input[name='+fieldName+']').val(0);
          }
      });

 const mobileMenuButton = $('.header__mobile-icon');
 const mobileMenuContainer = $('.mobile-menu');
 const overlayContainer = $('.overlay');
 const overlayCloseButton = $('.mobile-menu-close-button');

 function toggleMobileMenu() {
	mobileMenuContainer.toggleClass('active');
	overlayContainer.toggleClass('active');
 }

 mobileMenuButton.click(toggleMobileMenu);
 overlayCloseButton.click(toggleMobileMenu);


 function navigationMenuPlacement() {
	if ($(window).width() < 720 ) {
		$('.site-nav').appendTo($('.mobile-menu'));
	} else {
		$('.site-nav').appendTo($('.desktop-menu'));
	}
 }

 navigationMenuPlacement();

 $(window).resize(function(){
  navigationMenuPlacement();
 })

 const navigationChevron = $('.navigation-chevron');

 function toggleMobileSubMenu() {
  $(this).parent('.has-sub-menu').find('.sub-menu').slideToggle(500);
 }

 navigationChevron.click(toggleMobileSubMenu);

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	var newsletter_popup = getCookie("newsletter");
	if (newsletter_popup != "") {
		$('.newsletter-overlay').removeClass('active');
	} else {
		setCookie("newsletter", "true", 7);
		$('.newsletter-overlay').addClass('active');
	}
}

$('.newsletter-overlay-close').click(function(){
	$(this).removeClass('active');
});

checkCookie();


  $('body').on('click', '.intercom-click', function () {
      let iframe = $('.intercom-launcher-frame');
      //find button inside iframe
      let button = iframe.contents().find('.intercom-launcher');
      //trigger button click
      button.trigger("click");
  });




  function errorHandling() {
    let allEntered = false;
    $('.el-input.required').each(function(){
        let thisString = $(this).val();
        if(thisString.length > 0) {
            $(this).removeClass('is-invalid');
            allEntered = true;
        } else {
            $(this).addClass('is-invalid');
            allEntered = false;
        }
        if(allEntered == true) {
            $('.contact-form .button').removeClass('disabled');
        } else {
            $('.contact-form .button').addClass('disabled');
        }
    });
}

  $('.el-input').keyup(errorHandling);

  $('body').on('keyup', '.el-input', function() {
    let inputLength = $(this).val().length;
    if(inputLength > 0) {
      $(this).addClass('active');
      $(this).siblings('.el-label').addClass('active');
      $(this).parent().siblings('.el-label').addClass('active');
    } else {
      $(this).removeClass('active');
      $(this).siblings('.el-label').removeClass('active');
      $(this).parent().siblings('.el-label').removeClass('active');
    }
  });
  $('body').on('keyup', '.customr-control', function() {
    let inputLength = $(this).val().length;
    if(inputLength > 0) {
      $(this).addClass('active');
      $(this).siblings('.customr-control-label').addClass('active');
      $(this).parent().siblings('.customr-control-label').addClass('active');
    } else {
      $(this).removeClass('active');
      $(this).siblings('.customr-control-label').removeClass('active');
      $(this).parent().siblings('.customr-control-label').removeClass('active');
    }
  });
  
  // GA Tracking
  $('.contact-us').click(function(){
    ga('send', 'event', 'Contact Us', 'click');
  });


  $('body').on('keyup', 'input.cart__qty', function() {
  //$('input.cart__qty').on('mouseup keyup', function () {
    alert("This works");
    var max = parseInt($(this).attr('max'));
    var min = parseInt($(this).attr('min'));
    console.log("Quantity is being changed");
    if ($(this).val() > max)
    {
        console.log("Quantity value is " + max);
        $(this).val(max);
    }
    else if ($(this).val() < min)
    {
        $(this).val(min);
          console.log("Quantity value is " + min);
    }       
  }); 
});
