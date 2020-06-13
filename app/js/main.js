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
    tabSwitcher(e);
    ratingClick(e, ratingItem);
});

/*------rating---------*/
/*------наведение мыши-------*/
document.addEventListener('mouseover', (e) => {
    const ratingItem = document.querySelectorAll('.feedback__rating-item');
    ratingMouseover(e, ratingItem);
});

document.addEventListener('mouseout', (e) => {
    const ratingItem = document.querySelectorAll('.feedback__rating-item');

    mouseoutActiveClass(ratingItem);
});

function ratingClick(e, elem) {
    let target = e.target;

    if (target.classList.contains('feedback__rating-item')) {
        removeClass(elem, 'currant-active');
        target.classList.add('rating-item-active', 'current-active')
    }
}

function ratingMouseover(e, elem) {
    let target = e.target;
    if (target.classList.contains('feedback__rating-item')) {

        removeClass(elem, 'rating-item-active', 'current-active');
        target.classList.add('rating-item-active');
        mouseoverActiveClass(elem);
    }
}

function removeClass(arr, elem) {
    for (let i = 0, arrLen = arr.length; i < arrLen; i++) {
        for (let j = 1; j < arguments.length; j++) {
            elem[i].classList.remove(arguments[j]);
        }
    }
}

function addClass(arr, elem) {

    for (let i = 0, arrLen = arr.length; i < arrLen; i++) {
        for (let j = 1; j < arguments.length; j++) {
            elem[i].classList.add(arguments[j]);
        }
    }
}

function mouseoverActiveClass(arr, elem) {
    for (let i = 0, arrLen = arr.length; i < arrLen; i++) {
        if (elem[i].classList.contains('rating-item-active')) {
            break
        } else {
            elem[i].classList.add('rating-item-active');
        }
    }
}

function mouseoutActiveClass(arr, elem) {
    for (let i = arr.length - 1; i >= 1; i--) {
        if (elem[i].classList.contains('currant-active')) {
            break
        } else {
            elem[i].classList.remove('rating-item-active');
        }
    }
    addClass(elem, 'rating-item-active');
}

function catalogMenu(e, elem) {
    const menu = e.target.closest('.main-menu__catalog');

    if (!menu) {
        return
    }
    elem.classList.toggle('active');
}
/*------rating finished---------*/

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

let menuElem = document.getElementById('sweeties');
let titleElem = menuElem.querySelector('.title');

titleElem.onclick = function () {
    menuElem.classList.toggle('open');
};

function dropDawnMenu(e) {
    const mobileMenu = e.target.closest('.mobile-menu__title'),
        menuOpen = document.querySelector('.mobile-menu');

    if (!mobileMenu) {
        return;
    }
    menuOpen.classList.toggle('open');
}

function tabSwitcher(e) {
    const tabSelector = document.querySelectorAll('.feedback__tab-selector'),
        feedbackItem = document.querySelectorAll('.feedback__item');


    const itemsTargetNum = [...tabSelector].indexOf(e.target);

    if (itemsTargetNum === -1) {
        return;
    }

    document.querySelector('.tab-active').classList.remove('tab-active');
    document.querySelector('.feedback-active').classList.remove('feedback-active');

    //e.target.classList.add('tab-active');
    e.target.alert('hello');
    feedbackItem[itemsTargetNum].classList.add('feedback-active');
}



