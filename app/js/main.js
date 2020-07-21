$(function () {

});


// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle


(function () {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint,
                        "type": daType
                    };
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = el.type;

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }

    //Основная функция
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                //Перебрасываем элементы
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }

    //Функция получения индекса внутри родителя
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }

    //Функция получения массива индексов элементов внутри родителя
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }

    //Сортировка объекта
    function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) {
                return -1
            } else {
                return 1
            }
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) {
                return 1
            } else {
                return -1
            }
        });
    }

    //Дополнительные сценарии адаптации
    function customAdapt() {
        //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

}());

/*--------click--------*/
document.addEventListener('click', e => {
    const headerProfileMobile = document.querySelector('.header__profile-mobile'),
        sidebar = document.querySelector('.sidebar__menu'),
        ratingItem = document.querySelectorAll('.feedback__rating-item');

    catalogMenu(e, sidebar);
    catalog(e, sidebar);
    openProfile(e, headerProfileMobile);
    closeProfile(e, headerProfileMobile);
    dropDawnMenu(e);
    menuBurgerActive(e);
    submenuActive(e);
    openInput(e);
    feedBackItemSwitcher(e);
    ratingClick(e);
    detailsSwitcher(e);

    /*open popup*/
    //loginPopupOpen(e);
    loginClosePopup(e);
});

/*------rating---------*/
/*------наведение мыши-------*/

const ratingItem = document.querySelectorAll('.rating-item');

/*   click event   */

function ratingClick(e) {
    const target = e.target;

    if (target.classList.contains('rating-item')) {
        removeClass(ratingItem, 'currant-active');
        target.classList.add('rating-item-active', 'currant-active');
    }
}

/*    mouseover event    */
document.addEventListener('mouseover', e => {
    ratingMouseOver(e)
});

function ratingMouseOver(e) {
    const target = e.target;

    if (target.classList.contains('rating-item')) {
        removeClass(ratingItem, 'rating-item-active');
        target.classList.add('rating-item-active');
        mouseOverActiveClass(ratingItem);
    }
}

document.addEventListener('mouseout', e => {
    addClass(ratingItem, 'rating-item-active');
    mouseOutActiveClass(ratingItem);
});

/*   function for remove active class   */
function removeClass(arr) {
    for (let i = 0, aLen = arr.length; i < aLen; i++) {
        for (let j = 1; j < arguments.length; j++) {
            ratingItem[i].classList.remove(arguments[j]);
        }
    }
}

function addClass(arr) {
    for (let i = 0, aLen = arr.length; i < aLen; i++) {
        for (let j = 1; j < arguments.length; j++) {
            ratingItem[i].classList.add(arguments[j]);
        }
    }
}

function mouseOverActiveClass(arr) {
    for (let i = 0, aLen = arr.length; i < aLen; i++) {
        if (arr[i].classList.contains('rating-item-active')) {
            break
        } else {
            arr[i].classList.add('rating-item-active');
        }
    }
}

function mouseOutActiveClass(arr) {
    for (let i = arr.length - 1; i >= 1; i--) {
        if (arr[i].classList.contains('currant-active')) {
            break
        } else {
            arr[i].classList.remove('rating-item-active');
        }
    }
}

/*------rating finished---------*/

function catalogMenu(e, elem) {
    const menu = e.target.closest('.main-menu__catalog');

    if (!menu) {
        return
    }
    elem.classList.toggle('active');
}

function catalog(e, elem) {
    const sidebarTop = e.target.closest('.sidebar__top');

    if (!sidebarTop) {
        return
    }
    elem.classList.toggle('sidebar__menu-active');
}

function openProfile(e, elem) {
    const loginBtn = e.target.closest('.header__login-btn');


    if (!loginBtn) {
        return;
    }

    elem.classList.add('active-profile');
}

function closeProfile(e, elem) {
    const close = e.target.closest('.close');

    if (!close) {
        return;
    }

    elem.classList.remove('active-profile');
}

function dropDawnMenu(e) {
    const mobileMenu = e.target.closest('.mobile-menu__title'),
        menuOpen = document.querySelector('.mobile-menu');

    if (!mobileMenu) {
        return;
    }
    menuOpen.classList.toggle('open');
}

function menuBurgerActive(e) {
    const burgerBtn = e.target.closest('.menu-burger__btn'),
        menuBurger = document.querySelector('.menu-burger'),
        catalogSubmenu = document.querySelector('.catalog .catalog__submenu'),
        catalogTitle = document.querySelector('.catalog__title');

    if (!burgerBtn) {
        return
    }

    menuBurger.classList.toggle('menu-burger-active');

    if (!menuBurger.classList.contains('menu-burger-active')) {
        catalogSubmenu.classList.remove('catalog__submenu-active');
        catalogTitle.classList.remove('catalog__title-active');
    }
}

function submenuActive(e) {
    const catalog = e.target.closest('.catalog'),
        catalogSubmenu = document.querySelector('.catalog .catalog__submenu'),
        catalogTitle = document.querySelector('.catalog__title');

    if (!catalog) {
        return
    }

    catalogSubmenu.classList.toggle('catalog__submenu-active');
    catalogTitle.classList.toggle('catalog__title-active');
}

function openInput(e) {
    const searchBarIcon = e.target.closest('.search-bar__icon'),
        searchBarInput = document.querySelector('.search-bar__input');

    if (!searchBarIcon) {
        return
    }

    searchBarInput.classList.add('open-input');

    if (!searchBarInput) {
        alert('hello')
    }

}

const searchBarInput = document.querySelector('.search-bar__input');
searchBarInput.addEventListener('blur', function () {
    searchBarInput.classList.remove('open-input');
    searchBarInput.value = '';
});

/*   change feedback items   */
function feedBackItemSwitcher(e) {
    const tabSelectors = document.querySelectorAll('.feedback__tab-photo'),
        feedbackTabItems = document.querySelectorAll('.feedback__item');

    const itemsTargetNum = [...tabSelectors].indexOf(e.target);

    if (itemsTargetNum === -1) {
        return;
    }

    document.querySelector('.tab-selected').classList.remove('tab-selected');
    document.querySelector('.feedback__item-active').classList.remove('feedback__item-active');

    e.target.classList.add('tab-selected');
    feedbackTabItems[itemsTargetNum].classList.add('feedback__item-active')
}

function detailsSwitcher(e) {
    const detailsBtnItem = document.querySelectorAll('.details__btn-item'),
        detailsDescrItem = document.querySelectorAll('.details__descr-item');

    const itemsTargetNum = [...detailsBtnItem].indexOf(e.target);

    let detailsBtnItemActive = document.createElement('details__btn-item-active');
    detailsBtnItemActive.type = 'text/css';
    detailsBtnItemActive.innerHTML = '.details__btn-item-active { color: #F00; }';

    detailsBtnItem.className = detailsBtnItemActive;

    if (itemsTargetNum === -1) {
        return;
    }

    document.querySelector('.details__btn-item-active').classList.remove('details__btn-item-active');
    document.querySelector('.details__descr-item-active').classList.remove('details__descr-item-active');

    e.target.classList.add('details__btn-item-active');
    detailsDescrItem[itemsTargetNum].classList.add('details__descr-item-active')
}

/*function loginPopupOpen(e) {
    const openPopup = document.querySelector('.header__profile-login'),
        loginPopup = document.querySelector('.login-popup'),
        loginPopupBody = e.target.closest('.login-popup__body');


    if (!openPopup) {
        return
    }

    loginPopup.classList.add('login-popup__open');



}*/

function loginClosePopup(e) {
    /*const loginPopupBody = e.target.closest('.login-popup__body'),
        loginPopup = document.querySelector('.login-popup');

    if (loginPopupBody) {
        return
    }
    if (loginPopup) {
        loginPopup.classList.remove('login-popup__open');
    }*/

}

/*--------------map-------------*/
var myMap, myMap2;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init() {
    let center = [55.673336, 37.633401],
        icon = {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        },

        coordinates = {
            center: center,
            zoom: 15
        },
        searchControlProvider = {
            searchControlProvider: 'yandex#search'
        };

    let myMap = new ymaps.Map("map", coordinates, searchControlProvider),
        myMap2 = new ymaps.Map("map2", coordinates, searchControlProvider);

    let myPlacemark = new ymaps.Placemark(center, icon),
        myPlacemark2 = new ymaps.Placemark(center, icon);

    myMap.geoObjects.add(myPlacemark);

    myMap2.geoObjects.add(myPlacemark2);
}

function onSubmit(token) {
    document.getElementById("demo-form").submit();
}

function onClick(e) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha.execute('reCAPTCHA_site_key', {action: 'submit'}).then(function (token) {
            // Add your logic to submit to your backend server here.
        });
    });
}

/*----captcha----*/
var onloadCallback = function() {
    var divcaptcha = document.getElementsByClassName('g-recaptcha');
    for (var i = 0; i < divcaptcha.length; i++) {
        grecaptcha.render(divcaptcha[i], {
            'sitekey': '6Lf6KKgZAAAAAACjlC-jiKaHjT5rU0UgH1hkl2aF'
        });
    }
};