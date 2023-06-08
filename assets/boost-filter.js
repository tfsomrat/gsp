boost_filter_data.current_page = 1;

function getStatus(url, callback) {
    let xhr = new XMLHttpRequest;
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let regexStatus = /(\w+ state:.*?)</g,
                response = xhr.responseText;
            response = JSON.parse(response);
            if (callback) callback(response);
        } else {
            if (xhr.response) {
                // console.log('test - ', JSON.parse(xhr.response));
            }
        };
    }
};

const queryString = window.location.search;
if (queryString != "") {
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('page') != undefined) {
        boost_filter_data.current_page = urlParams.get('page')
    }
}

// Get the selected filters from the panels 
function getFilters() {
    let searchParams = new URLSearchParams(window.location.search);
    let selected_filters = searchParams.get('filters');
    selected_filters = JSON.parse(decodeURIComponent(selected_filters));
    return selected_filters;
}

function comparator(a, b) {
    if (a.dataset.sort_tag < b.dataset.sort_tag)
        return -1;
    if (a.dataset.sort_tag > b.dataset.sort_tag)
        return 1;
    return 0;
}

function productsTotal(response) {
    document.querySelector('.sort_total span').innerHTML = response.total_product;
}

function getPriceRange() {
    const lowerPrice = document.querySelector('#lower').value;
    const higherPrice = document.querySelector('#higher').value;
    document.querySelector('#show-price-min').innerHTML = Math.round(lowerPrice);
    document.querySelector('#show-price-max').innerHTML = Math.round(higherPrice);
}

function renderProducts(response, way) {

    //---------------------------

    let product_page = document.createElement('DIV'),
        productGrid = document.getElementById('collection-grid');
    let current_page = boost_filter_data.current_page;

    if (boost_filter_data.current_page == 1) {
        product_page.setAttribute('data-url', window.location.pathname);
    } else {
        product_page.setAttribute('data-url', window.location.pathname + '?page=' + current_page.toString());
    }

    product_page.classList.add('collection_grid');
    product_page.classList.add('collection_page_items');

    //----------------------------

    if (response.total_product == 0) {
        document.getElementById('collection-grid').classList.remove('collection_grid');
        document.getElementById('collection-grid').innerHTML = "<span class='filters-message'>Your selected filters did not return any products</span>"
        document.getElementById('collection-grid').style.display = "block";
    } else {
        document.getElementById('collection-grid').classList.add('collection_grid');
        document.getElementById('collection-grid').style.display = "grid";
        let productGrid = document.getElementById('collection-grid'),
            productItems = response.products,
            template = document.getElementById('product-grid-item-template').innerHTML;

        if (way == 'clear') {
            productGrid.innerHTML = '';
        }

        for (const productItem of productItems) {
            let product_price;
            let product_url = '/products/' + productItem.handle;

            var productImage = productItem.images[1];

            if (productImage == null) {
                var ResizedProductImage = '{{ settings.placeholder_image | img_url: "master" }}';
            } else {
                if (productImage.includes('.jpg')) {
                    var ResizedProductImage = productImage.replace('.jpg', '_300x.progressive.jpg');
                } else if (productImage.includes('.png')) {
                    var ResizedProductImage = productImage.replace('.png', '_300x.progressive.png.jpg');
                } else {
                    var ResizedProductImage = productImage;
                }
            }

            var secondProductImage = productItem.images[2];

            if (secondProductImage == undefined) {
                var ResizedSecondProductImage = null;
            } else {
                if (secondProductImage.includes('.jpg')) {
                    var ResizedSecondProductImage = secondProductImage.replace('.jpg', '_300x.progressive.jpg');
                } else if (secondProductImage.includes('.png')) {
                    var ResizedSecondProductImage = secondProductImage.replace('.png', '_300x.progressive.png.jpg');
                }
            }

            let applyProductTag;
            const productTags = productItem.tags;
            for (const productTag of productTags) {
                if (productTag.includes('pfs:label-')) {
                    applyProductTag = productTag.replace('pfs:label-', '');
                }
            }

            const rendered = Mustache.render(template, {
                title: productItem.title,
                url: product_url,
                product_id: productItem.id,
                vendor: productItem.vendor,
                price: productItem.price_min.toFixed(2),
                second_image: ResizedSecondProductImage,
                image: ResizedProductImage,
                tag: applyProductTag
            });
            productGrid.innerHTML += rendered;
        }
        if (localStorage.getItem('collection_page')) {
            var selectedPage = parseInt(localStorage.getItem('collection_page')) + 1;
            localStorage.setItem('collection_page', selectedPage);
        } else {
            localStorage.setItem('collection_page', 2);
        }

        //-------------------------
        if (way == 'previous') {
            productGrid.prepend(product_page);
        } else {
            productGrid.appendChild(product_page);
        }
    }
}

let filterID;
function renderFilterItems(response) {
    document.getElementById('filter-tabs').innerHTML = '';
    for (let i = 0; i < response.filter.options.length; i++) {
        const element = response.filter.options[i];

        let rendered;
        let filters = getFilters();
        const template = document.getElementById('filter-item-panel').innerHTML;
        const label = element.label;
        const status = element.status;

        if (status == "active") {
            let searchInputBox;
            if (element.showSearchBoxFilterPC == true) {
                searchInputBox = "filter-search";
            }
            rendered = Mustache.render(template, {
                filter_title: label,
                filter_id: element.filterOptionId,
                filter_items: element.values,
                filter_search: searchInputBox,
                key_active: function() {
                    if (filters) {
                        for (let i = 0; i < filters.length; i++) {
                            const filter = filters[i];
                            if (filter.id == element.filterOptionId) {
                                if (this.key == filter.tag) {
                                    return 'is-active';
                                }
                            }
                        }
                    }
                },
                key_count: function () {
                    let key_count = this.doc_count;
                    return this.doc_count;
                },
                key_clean: function () {
                    let key_clean = this.key;
                    let prefix_clean;
                    if (key_clean !== undefined) {
                        if (element.prefix !== undefined && element.prefix !== null) {
                            prefix_clean = element.prefix.replace("\\", "");
                        } else {
                            prefix_clean = element.prefix;
                        }

                        labelLowercase = label.toLowerCase();

                        key_clean_formated = key_clean.replace(labelLowercase, '').replace(prefix_clean, '').replace(':', '');
                        return key_clean_formated;
                    }
                }
            });

            document.getElementById('filter-tabs').innerHTML += rendered;
        }

        if (label == "Price") {
            let maxPrice, minPrice;
            const priceRanges = response.filter.options;
            for (const priceRange of priceRanges) {
                if (priceRange.label == "Price") {
                    maxPrice = priceRange.values.max;
                    minPrice = priceRange.values.min;
                }
            }

            const filters = getFilters();
            let price_filter = '';
            if (filters) {
                for (const filter of filters) {
                    if (filter.id == 'price') {
                        price_filter = filter;
                    }
                }
            }

            const templatePricePanel = document.getElementById('filter-item-panel-price').innerHTML;
            const price_panel = Mustache.render(templatePricePanel, {
                min_price_round: Math.round(minPrice),
                max_price_round: Math.round(maxPrice),
                min_price: minPrice,
                max_price: maxPrice,
                selected_min_price: price_filter != '' ? price_filter.lower : minPrice,
                selected_max_price: price_filter != '' ? price_filter.higher : maxPrice,
                selected_min_price_round: price_filter != '' ? Math.round(price_filter.lower) : Math.round(minPrice),
                selected_max_price_round: price_filter != '' ? Math.round(price_filter.higher) : Math.round(maxPrice)
            });
            document.querySelector('[data-group="Price"]').parentNode.innerHTML = price_panel;
        }

        const templateSort = document.getElementById('filter-sort-item-panel').innerHTML;
        if (i == (response.filter.options.length - 1)) {
            const sort_rendered = Mustache.render(templateSort, {
                filter_title: "Sort",
                filter_id: "sort"
            });
            document.getElementById('sort-tabs').innerHTML += sort_rendered;

            const sortRadios = document.querySelectorAll('input[name="SortBy"]');
            for (const sortRadio of sortRadios) {
                sortRadio.addEventListener('change', function(){
                    document.querySelector('.sort__dropdown__buttons--sort').textContent = document.querySelector('input[name="SortBy"]:checked').getAttribute('data-title');

                    window.history.pushState({ path: getPageURL(true) }, '', getPageURL(true));

                    const filterURL = getFilterURL(false);
                    getStatus(filterURL, function (response) {
                        boost_filter_data.total_pages = Math.ceil(response.total_product / 20);
                        renderProducts(response, 'clear');
                        renderPagination();
                        productsTotal(response);
                    });

                    document.querySelector('.sort__dropdown').classList.remove('sort-opened')
                });
            }
        }
    }
    //After the filters are loaded:
    // Accordion 
    var acc = document.querySelectorAll(".accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    // sortOptions 
    var sortButtons = document.querySelectorAll('.collection-sort-item input');
    for (const sortButton of sortButtons) {
        sortButton.addEventListener('click', function () {
            var sortInput = document.querySelectorAll('.collection-sort-item input');
            for (let i = 0; i < sortInput.length; i++) {
                if (sortInput[i].checked) {
                    sortInput[i].parentNode.parentNode.classList.add('sort-selected');
                } else {
                    sortInput[i].parentNode.parentNode.classList.remove('sort-selected');
                }
            }
        });
    }

    // applyClicks 
    var applyButtons = document.getElementsByClassName('filter-tag');
    for (const applyButton of applyButtons) {
        applyButton.addEventListener('click', function () {
            this.classList.toggle("is-active");

            // Reset the page to 1
            window.history.pushState({ path: getPageURL(true) }, '', getPageURL(true));

            const filterURL = getFilterURL(true);
            getStatus(filterURL, function (response) {
                boost_filter_data.total_pages = Math.ceil(response.total_product / 20);
                renderProducts(response, 'clear');
                renderPagination();
                console.log(response);
                renderFilterItems(response);
                productsTotal(response);
            });

            renderFilterBreakdown();
            clearFilters();
        });
    }

    // searchInputs 
    var searchInputs = document.querySelectorAll('[name="filter-search"]');
    for (const searchInput of searchInputs) {
        searchInput.onkeyup = function () {
            var filter = searchInput.value.toUpperCase();
            var lis = searchInput.parentNode.querySelectorAll('.filter');
            for (var i = 0; i < lis.length; i++) {
                var name = lis[i].getElementsByTagName('span')[0].innerHTML;
                if ((name.toUpperCase().indexOf(filter) > 0) || (name.toUpperCase().indexOf(filter) == 0)) {
                    lis[i].style.display = 'flex';
                } else {
                    lis[i].style.display = 'none';
                }
            }
        }
    }

    const sortDivs = document.querySelectorAll('.accordion-panel');
    for (const sortDiv of sortDivs) {
        // Function to sort Data
        var subjects = sortDiv;
        var subjectsElements = sortDiv.querySelectorAll(".filter");

        var divs = [];
        for (var i = 0; i < subjectsElements.length; ++i) {
            divs.push(subjectsElements[i]);
        }

        var subjectsArray = divs;
        let sorted = subjectsArray.sort(comparator);
        sorted.forEach(e =>
            subjects.appendChild(e));
    }


    document.querySelector('.apply-price').addEventListener('click', function(){
        window.history.pushState({ path: getPageURL(true) }, '', getPageURL(true));

        const filterURL = getFilterURL(true);
        getStatus(filterURL, function (response) {
            boost_filter_data.total_pages = Math.ceil(response.total_product / 20);
            renderProducts(response, 'clear');
            renderPagination();
            renderFilterItems(response);
            productsTotal(response);
            renderFilterBreakdown();
        });
    });
}

//render all products and filters on load
var collectionID = document.getElementById('filter-tabs').dataset.id;
let priceString;

const filterURL = getFilterURL(false);
getStatus(getFilterURL(true), function (response) {
    boost_filter_data.total_product = response.total_product;
    boost_filter_data.total_pages = Math.ceil(response.total_product / 20);
    const returned_products = document.querySelector('#collection-grid')
    if (returned_products != null) {
        returned_products.innerHTML = response.total_product;
    }
    renderFilterItems(response);
    renderPagination(response);
    renderProducts(response, 'clear');
    productsTotal(response);

    if (getFilters()) {
        renderFilterBreakdown();
    }
});

function getFilters() {
    let searchParams = new URLSearchParams(window.location.search);
    let selected_filters = searchParams.get('filters');
    selected_filters = JSON.parse(decodeURIComponent(selected_filters));
    return selected_filters;
}

// Get the page URL not the Boost API URL 
function getPageURL(first_page) {
    let searchParams = new URLSearchParams(window.location.search);
    let selectedSearchString = '';

    var selectedFilters = getCurrentFilters();
    let selectedFiltersString = '?filters=' + encodeURIComponent(JSON.stringify(selectedFilters));

    var selectedSort = document.querySelector('input[name="SortBy"]:checked') != null ? document.querySelector('input[name="SortBy"]:checked').value : 'manual';
    let selectedSortString = '&sort=' + selectedSort;

    let pageNumber;
    if (first_page) {
        searchParams.set('page', '1');
        pageNumber = '&page=1';
        boost_filter_data.current_page = 1;
    } else {
        pageNumber = '&page=' + searchParams.get('page');
    }

    if (searchParams.get('q')) {
        selectedSearchString = '&q=' + searchParams.get('q');
    }

    return window.location.protocol + "//" + window.location.host + window.location.pathname + selectedFiltersString + pageNumber.toString() + selectedSearchString + selectedSortString;
}

// Get the selected filters from the URL 
function getCurrentFilters() {
    const filterTags = document.getElementsByClassName('filter-tag');
    let selectedFilters = [];
    for (let i = 0; i < filterTags.length; i++) {
        const filterTag = filterTags[i];

        if (filterTag.classList.contains('is-active')) {
            selectedFilters.push({
                id: filterTag.dataset.id,
                group: filterTag.dataset.group,
                tag: filterTag.dataset.tag
            });
        }
    }

    const lowerPrice = document.querySelector('#lower').value;
    const higherPrice = document.querySelector('#higher').value;

    let lowerPriceRound = parseInt(document.querySelector('#lower').value);
    lowerPriceRound = Math.round(parseInt(lowerPriceRound));
    let higherPriceRound = parseInt(document.querySelector('#higher').value);
    higherPriceRound = Math.round(parseInt(higherPriceRound));
    let lowestPriceRound = parseInt(document.querySelector('#lower').getAttribute('min'));
    lowestPriceRound = Math.round(parseInt(lowestPriceRound));
    let highestPriceRound = parseInt(document.querySelector('#higher').getAttribute('max'));
    highestPriceRound = Math.round(parseInt(highestPriceRound));

    if (higherPriceRound != highestPriceRound || lowerPriceRound != lowestPriceRound) {
        selectedFilters.push({
            group: 'Price',
            lower: lowerPrice,
            higher: higherPrice,
            id: 'price',
            tag: lowerPrice + ' and ' + higherPrice
        })
    }

    boost_filter_data.filters = selectedFilters;
    return selectedFilters;
}

function renderFilterBreakdown() {
    const filter_container = document.querySelector('#filter-summary');
    const filter_title = document.querySelector('.filter-header--refine');

    function render() {
        document.getElementById('filter-summary').innerHTML = "";
        const current_filters = getFilters();
        filter_container.innerHTML = '';
        if (current_filters.length > 0) {
            for (const current_filter of current_filters) {
                const formatedTag = current_filter.tag;
                const formatedGroup = current_filter.group;
                const formatedGroupLowercase = formatedGroup.toLowerCase();

                let completeTag = formatedTag.replace(formatedGroupLowercase, '');
                if (completeTag.includes(':')) {
                    completeTag = completeTag.split(':')[1];
                }
    
                const template = document.getElementById('filter-heading-item').innerHTML;
                const rendered = Mustache.render(template, {
                    group: current_filter.group,
                    id: current_filter.id,
                    tag: current_filter.tag,
                    tag_clean: completeTag
                });
                filter_container.innerHTML += rendered;
            }
    
            // Show Filters 
            filter_container.style.display = "flex";
            filter_title.style.display = "flex";
            filter_container.style.padding = "15px 0 30px 0";
        } else {
            filter_container.style.display = "none";
            filter_title.style.display = "none";
            filter_container.style.padding = "0";
        }
    }

    render();

    const clears = filter_container.querySelectorAll('.clear');
    if (clears != undefined) {
        for (const clear of clears) {
            clear.addEventListener('click', function(event) {
                event.preventDefault();
                const this_id = this.getAttribute('data-id');
                const this_tag = this.getAttribute('data-tag');
                
                if (this_id == 'price') {
                    document.querySelector('#lower').value = document.querySelector('#lower').getAttribute('min');
                    document.querySelector('#higher').value = document.querySelector('#higher').getAttribute('max');
                } else {
                    const filterTags = document.getElementsByClassName('filter-tag');
                    for (let i = 0; i < filterTags.length; i++) {
                        const filterTag = filterTags[i];
                        if (filterTag.getAttribute('data-id') == this_id && filterTag.getAttribute('data-tag') == this_tag) {
                            filterTag.classList.remove('is-active')
                        }
                    }
                }

                // Reset the page to 1
                window.history.pushState({ path: getPageURL(true) }, '', getPageURL(true));
        
                const filterURL = getFilterURL(false);
                getStatus(filterURL, function (response) {
                    boost_filter_data.total_pages = Math.ceil(response.total_product / 20);
                    renderProducts(response, 'clear');
                    renderPagination();
                    productsTotal(response);

                    render();
                });
            });
        }
    }
}

function clearFilters(callback) {
    var clearFilters = document.querySelectorAll('.show-filters .clear-filter');
    for (const filterClear of clearFilters) {
        filterClear.addEventListener('click', function (event) {
            event.preventDefault();
            const tagToRemove = this.parentNode.querySelector('.filter-tag-summary').dataset.tag_title;
            const currentActiveFilters = document.querySelectorAll('#filter-tabs .is-active');
            for (const currentActiveFilter of currentActiveFilters) {
                if (currentActiveFilter.dataset.tag == tagToRemove) {
                    currentActiveFilter.classList.remove('is-active');
                }
            }
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

            const filterTags = document.getElementsByClassName('filter-tag')
            for (let i = 0; i < filterTags.length; i++) {
                const filterTag = filterTags[i];
                filterTag.classList.remove('is-active');
                if (i == (filterTags.length - 1)) {
                    callback();
                }
            }
            
            document.querySelector('input[name="SortBy"][value="manual"]').checked = true;
        });
    };
}

// Generate the boost filter URL 
function getFilterURL(filters) {
    var selectedFilters;
    var selectedSort = document.querySelector('input[name="SortBy"]:checked') != null ? document.querySelector('input[name="SortBy"]:checked').value : 'manual';
    var filterString = '';
    var filterBuildString = '';
    var sortString = '';
    var collectionString = '';
    var queryString = '';
    var pageString = '';

    // Get the filters from URL on first page load 
    selectedFilters = getFilters();

    // Get sort from filters 
    if (selectedSort) {
        sortString = '&sort=' + selectedSort;
    } else {
        if (boost_filter_data.sort != 'manual') {
            sortString = '&sort=' + boost_filter_data.sort;
        }
    }

    // Get collection id from the pageload object
    if (boost_filter_data.collection_id != undefined) {
        collectionString = '&collection_scope=' + boost_filter_data.collection_id
    }

    // Get the search query from the pageload object 
    if (boost_filter_data.query != undefined) {
        queryString = '&q=' + boost_filter_data.query
    }

    // Get the filter tree 
    if (filters == true) {
        filterBuildString = '&build_filter_tree=true';
        if (boost_filter_data.current_page != undefined) {
            pageString = '&page=' + boost_filter_data.current_page;
        }
    }

    // Generate the URL for Boost 
    if (selectedFilters != undefined && selectedFilters.length != 0) {
        // With filters
        for (let i = 0; i < selectedFilters.length; i++) {
            const element = selectedFilters[i];
            const element_tag = element.tag;

            const tag_stripped = element_tag.replaceAll(' ', '+').replaceAll('£', '').replaceAll('+&+', '%20%26%20');

            if (selectedFilters[i].tag.includes('Black & White')) {
                filterString += '&' + element.id + '[]=' + element_tag.replaceAll(' ', '+').replaceAll('£', '').replaceAll('*', '').replaceAll(',', '').replaceAll('Black+&+White', 'Black&White');
            } else if (element.group == 'Price') {
                filterString += '&pf_p_price[]=' + element.lower + '%3A' + element.higher;
            } else if (element.group == 'Availability') {
                let is_available = tag_stripped == 'in-stock' ? true : false;
                filterString += '&product_available=' + is_available;
            } else {
                filterString += '&' + element.id + '[]=' + tag_stripped;
            }

            if (i == (selectedFilters.length - 1)) {
                filterString = filterString.replace('undefined', '');
                return boost_filter_data.base_url + collectionString + queryString + '&tag_mode=2' + filterString + sortString + pageString + filterBuildString;
            }
        }
    } else {
        // Without filters
        return boost_filter_data.base_url + collectionString + queryString + sortString + pageString + filterBuildString;
    }
}

function renderPagination() {
    // Previous Pagination
    if (document.querySelector('.pagination-previous') != null) {
        document.querySelector('.pagination-previous').remove();
    }
    const prevtemplate = document.getElementById('pagination-previous').innerHTML;
    const prevrendered = Mustache.render(prevtemplate, {
        prev: parseInt(boost_filter_data.current_page) - 1
    });
    //document.querySelector('.boost__page').insertBefore(document.createRange().createContextualFragment(prevrendered), document.querySelector('#boost-results'));

    // Pagination Bar
    const template = document.getElementById('pagination').innerHTML;
    let pages_content = document.createElement('div');
    for (let i = 0; i < boost_filter_data.total_pages; i++) {
        let number = i + 1;
        let page_item = document.createElement('div');
        page_item.setAttribute('data-number', number);
        if (number == boost_filter_data.current_page) {
            page_item.classList.add('is-active');
        }
        let page_item_link = document.createElement('A');

        page_item_link.setAttribute('data-page', number);
        page_item_link.setAttribute('href', '#');
        page_item_link.classList.add('pagination_pages-link');
        page_item_link.classList.add('pagination-navigate');
        page_item_link.innerHTML = number;
        page_item.appendChild(page_item_link);

        pages_content.appendChild(page_item);
    }
    const rendered = Mustache.render(template, {
        pages: pages_content.outerHTML,
        prev: parseInt(boost_filter_data.current_page) - 1,
        next: parseInt(boost_filter_data.current_page) + 1,
    });
    document.querySelector('#collection-pagination').innerHTML = rendered;

    const previous_buttons = document.querySelectorAll('.pagination-navigate');
    if (previous_buttons != null) {
        for (const previous_button of previous_buttons) {
            const previous_page = previous_button.getAttribute('data-page')
            previous_button.addEventListener('click', function (event) {
                event.preventDefault();
                const url = window.location.href;
                var r = new URL(url);
                r.searchParams.set('page', previous_page);
                const newUrl = r.href;
                window.location = newUrl;
            });
        }
    }
    number = boost_filter_data.current_page
    updatePagination(number)
}

function updatePagination(number) {
    var page_number = parseInt(number);
    if (isNaN(page_number)) {
        page_number = 1;
    }
    boost_filter_data.current_page = page_number;
    var pagination_numbers = document.querySelectorAll('.pagination_pages div');
    for (let i = 0; i < pagination_numbers.length; i++) {
        const pagination_number = pagination_numbers[i];
        const pagination_number_value = parseInt(pagination_number.getAttribute('data-number'));
        if (pagination_number_value == page_number) {
            pagination_number.classList.add('is-active');
        } else {
            pagination_number.classList.remove('is-active');
        }
    }

    const next_page = page_number + 1;
    const prev_page = page_number - 1;

    let queryString = '';
    if (boost_filter_data.query != undefined) {
        queryString = '&q=' + boost_filter_data.query;
    }

    if (boost_filter_data.current_page == boost_filter_data.total_pages) {
        if (document.querySelector('.next-prev_next') != null) {
            document.querySelector('.next-prev_next').style.display = 'none';
        }
    } else if (boost_filter_data.current_page == 1) {
        if (document.querySelector('.pagination-previous') != null) {
            document.querySelector('.pagination-previous').style.display = 'none';
        }
        if (document.querySelector('.next-prev_prev') != null) {
            document.querySelector('.next-prev_prev').style.display = 'none';
        }
    } else {
        if (document.querySelector('.next-prev_next') != null) {
            document.querySelector('.next-prev_next').setAttribute('href', '?page=' + next_page + queryString);
            document.querySelector('.next-prev_next').style.display = 'block';
        }
        if (document.querySelector('.pagination-previous') != null) {
            document.querySelector('.pagination-previous').style.display = 'block';
        }
        if (document.querySelector('.next-prev_prev') != null) {
            document.querySelector('.next-prev_prev').setAttribute('href', '?page=' + prev_page + queryString);
            document.querySelector('.next-prev_prev').style.display = 'block';
        }
    }
}

document.querySelector('.sort__dropdown__buttons--sort').addEventListener('click', function(){
    document.querySelector('.sort__dropdown').classList.toggle("sort-opened");
});

document.querySelector('.sort__dropdown__buttons--filters').addEventListener('click', function(){
    document.getElementById('show-filters').classList.toggle("filters-opened");
});

const closeFilters = document.querySelectorAll('.js-close-filters');
for (const closeFilter of closeFilters) {
    closeFilter.addEventListener('click', function() {
        document.getElementById('show-filters').classList.remove("filters-opened");
    })
}