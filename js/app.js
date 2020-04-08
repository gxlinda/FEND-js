/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
 */

/**
 * Define Global Variables
 * 
 */
let lastClickedMenuItem = 'nav1';


/**
 * End Global Variables
 * Start Helper Functions
 * 
 */

//Creating an array of section names
const sectionNodeList = document.querySelectorAll('section .landing__container h2');
const menuItemElements = Array.from(sectionNodeList);
let menuItemNamesArray = [];
for (i = 1; i <= menuItemElements.length; i++) {
    let menuItemName = menuItemElements[i - 1].textContent;
    menuItemNamesArray.push(menuItemName);
}

//Setting image float properties
for (i = 0; i < menuItemNamesArray.length; i++) {
    let sectionString = '#section' + (i + 1) + " img";
    let img = document.querySelector(sectionString);
    if ((i + 1) % 2 == 0) {
        img.className = "right";
    } else {
        img.className = "left";
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
 */

// build the nav
const navBar = document.querySelector('#navbar__list');
for (i = 0; i < menuItemNamesArray.length; i++) {
    let num = i + 1;
    const navElement = document.createElement('li');
    navElement.textContent = menuItemNamesArray[i];
    navElement.id = 'nav' + num;
    navElement.className = 'menu__link';
    const anchorElement = document.createElement('a');
    anchorElement.href = "#section" + num;
    anchorElement.appendChild(navElement);
    navBar.appendChild(anchorElement);
}

// Add class 'active' to section when near top of viewport
function setAsActiveClass(sectionId) {
    let sections = document.querySelectorAll('section');
    let sectionHash = '#' + sectionId;
    let mySection = document.querySelector(sectionHash);
    for (i = 0; i < sections.length; i++) {
        if (sections[i].id != sectionId) {
            sections[i].classList.remove('active-class');
        } else {
            mySection.classList.add('active-class');
        }
    }
}

function convertNavToSection(navId) {
    let sectionId = navId.replace('nav', 'section');
    return sectionId;
}

//changes the properties of the actual 'li' item and removes the properties from the non-active others
function menuItemPropertyChange(liString) {
    let chosenNavElement = document.querySelector(liString);
    let numberOfLiElements = chosenNavElement.parentElement.parentNode.childElementCount;
    for (i = 1; i <= numberOfLiElements; i++) {
        let item = '#nav' + i;
        if (item != liString) {
            document.querySelector(item).style.fontWeight = 'normal';
            document.querySelector(item).removeAttribute('style');
        } else {
            chosenNavElement.style.fontWeight = 'bold';
            chosenNavElement.style.background = 'rgb(107, 136, 216)';
        }
    }
}

function menuItemPropertyChangeOnClick(liId) {
    let liString = '#' + liId;
    let lastClickedMenuItemString = '#' + lastClickedMenuItem;
    if (lastClickedMenuItemString != liString) {} else {
        menuItemPropertyChange(liString)
    }
}

function menuItemPropertyChangeOnScroll(liId) {
    let liString = '#' + liId;
    menuItemPropertyChange(liString);
}

/**
 * End Main Functions
 * Begin Events
 * 
 */

// Scroll to anchor ID using event listener
//Source: http://www.javascriptkit.com/javatutors/scrolling-html-bookmark-javascript.shtml
let anchorLinks = document.querySelectorAll('a[href^="#"]')
for (let anchorLink of anchorLinks) {
    anchorLink.addEventListener('click', (e) => {
        let liId = anchorLink.firstChild.id;
        let sectId = convertNavToSection(liId);
        setAsActiveClass(sectId);
        menuItemPropertyChangeOnClick(liId);
        lastClickedMenuItem = liId;
        let hashValue = anchorLink.getAttribute('href')
        let target = document.querySelector(hashValue)
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
        history.pushState(null, null, hashValue)
        e.preventDefault()
    })
}

// Show actual menu item during scroll
/*!
 * source: https://vanillajstoolkit.com/helpers/isinviewport/
 * Determine if an element is in the viewport
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}    elem The element
 * @return {Boolean}      Returns true if element is in the viewport
 */
let isInViewport = function(elem) {
    let distance = elem.getBoundingClientRect();
    return (
        distance.top >= 0 &&
        distance.top <= window.innerHeight * 0.7
    );
};

document.addEventListener('scroll', function() {

    var sections = document.querySelectorAll('section');
    for (i = 0; i < sections.length; i++) {
        isInViewport(sections[i]);
        if (isInViewport(sections[i]) == true) {
            let nav = sections[i].id.replace('section', 'nav');
            menuItemPropertyChangeOnScroll(nav);
        }
    }
});