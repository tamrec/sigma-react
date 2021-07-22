import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';

import Routes from './Routes'

import PrimeReact from 'primereact/api';

// import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
// import 'primereact/resources/themes/bootstrap4-light-purple/theme.css'
// import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
// import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css'
// import 'primereact/resources/themes/md-light-indigo/theme.css'
// import 'primereact/resources/themes/md-light-deeppurple/theme.css'
// import 'primereact/resources/themes/md-dark-indigo/theme.css'
// import 'primereact/resources/themes/md-dark-deeppurple/theme.css'
// import 'primereact/resources/themes/mdc-light-indigo/theme.css'
// import 'primereact/resources/themes/mdc-light-deeppurple/theme.css'
// import 'primereact/resources/themes/mdc-dark-indigo/theme.css'
// import 'primereact/resources/themes/mdc-dark-deeppurple/theme.css'
// import 'primereact/resources/themes/fluent-light/theme.css'
import 'primereact/resources/themes/saga-blue/theme.css'
// import 'primereact/resources/themes/saga-green/theme.css'
// import 'primereact/resources/themes/saga-orange/theme.css'
// import 'primereact/resources/themes/saga-purple/theme.css'
// import 'primereact/resources/themes/vela-blue/theme.css'
// import 'primereact/resources/themes/vela-green/theme.css'
// import 'primereact/resources/themes/vela-orange/theme.css'
// import 'primereact/resources/themes/vela-purple/theme.css'
// import 'primereact/resources/themes/arya-blue/theme.css'
// import 'primereact/resources/themes/arya-green/theme.css'
// import 'primereact/resources/themes/arya-orange/theme.css'
// import 'primereact/resources/themes/arya-purple/theme.css'
// import 'primereact/resources/themes/nova/theme.css'
// import 'primereact/resources/themes/nova-alt/theme.css'
// import 'primereact/resources/themes/nova-accent/theme.css'
// import 'primereact/resources/themes/luna-amber/theme.css'
// import 'primereact/resources/themes/luna-blue/theme.css'
// import 'primereact/resources/themes/luna-green/theme.css'
// import 'primereact/resources/themes/luna-pink/theme.css'
// import 'primereact/resources/themes/rhea/theme.css'

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(true);
    const sidebar = useRef();

    const history = useHistory();

    let menuClick = false;

    useEffect(() => {
        if (sidebarActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [sidebarActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick && layoutMode === "overlay") {
            setSidebarActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        setSidebarActive((prevState) => !prevState);

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items && layoutMode === "overlay") {
            setSidebarActive(false);
        }
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const isSidebarVisible = () => {
        return sidebarActive;
    };

    const logo = layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-active': sidebarActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenu={onToggleMenu} />

            <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                    <div className="layout-logo" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>
                        <img alt="Logo" src={logo} />
                    </div>
                    <AppProfile />
                    <AppMenu onMenuItemClick={onMenuItemClick} />
                </div>
            </CSSTransition>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <Routes />

            <AppFooter />

        </div>
    );

}

export default App;
