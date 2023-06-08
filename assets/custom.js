const search_fields = document.querySelectorAll('.header__search-box');
const search_field_overflow = document.querySelector('.predictive-search__overflow');

function fetchPredictiveSearch(search_field, search_results) {
    let predictive_search_input_value = search_field.value;

    if (predictive_search_input_value == "") {
        search_results.innerHTML = "";
        search_field_overflow.classList.remove('is-active');
        document.getElementsByTagName( 'html' )[0].classList.remove('overflow-hidden');
    } else {
        search_field_overflow.classList.add('is-active');
        document.getElementsByTagName( 'html' )[0].classList.add('overflow-hidden');

        search_results.innerHTML = "";

        fetch('https://services.mybcapps.com/bc-sf-filter/search?shop=get-set-pet-store.myshopify.com&q=' + predictive_search_input_value + '&limit=4' )
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {

                if (data.products != undefined) {
                    search_results.innerHTML += '<div class="predictive-search-order-1" ></div>';
                    const product_search_inner = document.querySelector('.predictive-search-order-1');
                    if (document.querySelectorAll('.predictive-search__heading--products').length != 0) {
                        product_search_inner.innerHTML = "";
                    }
                    for (let i = 0; i < data.products.length; i++) {
                        if (i == 0) {
                            product_search_inner.innerHTML += '<h3 id="predictive-search-products" class="predictive-search__heading caption-with-letter-spacing predictive-search__heading--products">Products</h3>'
                        }
                        const product = data.products[i];
                        let item_image;
                        var item_alt = product.title + '- Product Image';
                        var item_price = product.price_min.toFixed(2).replace(".00", "");

                        if (product.images == null || product.images[1] == null) {
                            item_image = window.placeholder.image;
                        } else {
                            item_image = product.images[1];
                        }

                        product_search_inner.innerHTML += '<li class="predictive-search__list-item" role="option">' +
                            '<a href="/products/' + product.handle + '" class="predictive-search__item">' +
                            '<div class="predictive-search__item-content">' +
                            '<span class="predictive-search__item-heading">' + product.title + '</span>' +
                            '<span class="predictive-search__item-heading--price">£' + item_price + '</span>' +
                            '</div>' +
                            '</a>' +
                            '</li>';

                    }
                    if (document.querySelectorAll('.predictive-search__list-item--search').length == 0 & data.products.length != 0 ) {
                        search_results.innerHTML += '<li id="predictive-search-option-search-keywords" class="predictive-search__list-item predictive-search__list-item--search" role="option">' +
                            '<button class="predictive-search__item predictive-search__item--term link link--text h5 animate-arrow" >' +
                            '<strong>View all ' + data.total_product + ' products</strong>' +
                            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5858 13H3V11H17.5858L11.2929 4.70711L12.7071 3.29289L21.4142 12L12.7071 20.7071L11.2929 19.2929L17.5858 13Z" fill="var(--color_primary)"></path></g></svg>' +
                            '</button>'
                        '</li>'
                    }
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });


            fetch('https://services.mybcapps.com/bc-sf-filter/search/collections?shop=get-set-pet-store.myshopify.com&q=' + predictive_search_input_value + '&limit=4')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                search_results.innerHTML += '<div class="predictive-search-order-2" ></div>';
                const product_search_inner = document.querySelector('.predictive-search-order-2');
                if (data.collections != undefined) {
                    if (document.querySelectorAll('.predictive-search__heading--collections').length != 0) {
                        product_search_inner.innerHTML = "";
                    }
                    for (let i = 0; i < data.collections.length; i++) {
                        if (i == 0) {
                            product_search_inner.innerHTML += '<h3 id="predictive-search-products" class="predictive-search__heading caption-with-letter-spacing predictive-search__heading--collections">Brand</h3>'
                        }
                        const collection = data.collections[i];
                        let item_alt = collection.title + '- Collection Image';

                        const collectionTitle = String(collection.title).toLowerCase();
                        const searchTerm = predictive_search_input_value.toLowerCase();
                        const regex = new RegExp(searchTerm, "g");
                        const boldString = "<b>" + searchTerm + "</b>";
                        const boldTitle = collectionTitle.replace(new RegExp(regex, "g"), boldString);

                        product_search_inner.innerHTML += '<li class="predictive-search__list-item" role="option">' +
                            '<a href="/collections/' + collection.handle + '" class="predictive-search__item">' +
                            '<div class="predictive-search__item-content">' +
                            '<span class="predictive-search__item-heading">' + boldTitle + '</span>' +
                            '</div>' +
                            '</a>' +
                            '</li>';
                        
                    }
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });


            fetch('https://services.mybcapps.com/bc-sf-filter/search/pages?shop=get-set-pet-store.myshopify.com&q=' + predictive_search_input_value + '&limit=4')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                search_results.innerHTML += '<div class="predictive-search-order-3" ></div>';
                const product_search_inner = document.querySelector('.predictive-search-order-3');
                if (document.querySelectorAll('.predictive-search__heading--pages').length != 0) {
                    product_search_inner.innerHTML = "";
                }
                if (data.pages != undefined) {
                    for (let i = 0; i < data.pages.length; i++) {
                        if (i == 0) {
                            product_search_inner.innerHTML += '<h3 id="predictive-search-products" class="predictive-search__heading caption-with-letter-spacing predictive-search__heading--pages">Blog & Pages</h3>'
                        }
                        const page = data.pages[i];
                        let item_alt = page.title + '- Collection Image';

                        const pageTitle = String(page.title).toLowerCase();
                        const searchTerm = predictive_search_input_value.toLowerCase();
                        const regex = new RegExp(searchTerm, "g");
                        const boldString = "<b>" + searchTerm + "</b>";
                        const boldTitle = pageTitle.replace(new RegExp(regex, "g"), boldString);


                        product_search_inner.innerHTML += '<li class="predictive-search__list-item" role="option">' +
                            '<a href="/pages/' + page.handle + '" class="predictive-search__item">' +
                            '<div class="predictive-search__item-content">' +
                            '<span class="predictive-search__item-heading">' + boldTitle + '</span>' +
                            '</div>' +
                            '</a>' +
                            '</li>';
                    }
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }
};

if (search_fields) {
    for (const search_field of search_fields) {
        const search_field_input = search_field.querySelector('.header__search-box__input');
        const search_field_input_results = search_field.querySelector('.header__search-box__predictive');
        search_field_input.addEventListener('keyup', function() {
            search_field_input_results.innerHTML = '';
            //slows don't the search
            const delaySearch = setTimeout(delaySearchFunction, 500);
            function delaySearchFunction() {
                fetchPredictiveSearch(search_field_input, search_field_input_results);
            }
        });
    }
}

if (search_field_overflow) {
    search_field_overflow.addEventListener('click', function() {
        for (const search_field of search_fields) {
            const search_field_input_results = search_field.querySelector('.header__search-box__predictive');
            search_field_input_results.innerHTML = '';
        }
        search_field_overflow.classList.remove('is-active');
        document.getElementsByTagName( 'html' )[0].classList.remove('overflow-hidden');
    })
}