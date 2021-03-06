

import React, { useState, useRef, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
// import Logo from './partials/Logo';
import { useAppContext } from "../../libs/contextLib";
import LogInDialogue from '../auth/Login';

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool
}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {

  const [isActive, setIsactive] = useState(false);
  const { isAuthenticated } = useAppContext();

  const [loginDialogueOpen, setLoginDialogueOpen] = useState(false);
  const handleLoginDialogueOpen = () => {
    setLoginDialogueOpen(true);
  };

  const handleLoginDialogueClose = () => {
    setLoginDialogueOpen(false);
  };

  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.addEventListener('click', clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
    setIsactive(true);
  }

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  }

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  }

  const clickOutside = (e) => {
    if (!nav.current) return
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  }

  const classes = classNames(
    'site-header',
    bottomOuterDivider && 'has-bottom-divider',
    className
  );

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            'site-header-inner',
            bottomDivider && 'has-bottom-divider'
          )}>
            <h3 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              <Link to="/">Aux<span className="text-color-primary">Me</span></Link>
            </h3>
          {!hideNav &&
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    'header-nav',
                    isActive && 'is-active'
                  )}>
                <div className="header-nav-inner">
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    <li>
                      <Link to="/about" onClick={closeMenu}>About</Link>
                    </li>
                  </ul>
                  { isAuthenticated === true && 
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    <li>
                      <Link to="/rooms" onClick={closeMenu}>Rooms</Link>
                    </li>
                  </ul>
                  }
                  {!hideSignin &&
                    <ul
                      className="list-reset text-xs header-nav-right"
                    >
                      <li>
                        { isAuthenticated === true ? (
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        ) : (
                          <Button variant="contained" color="primary" onClick={handleLoginDialogueOpen}>
                          Log In
                        </Button>
                          )
                      }
                      </li>
                    </ul>}
                    <LogInDialogue className="button button-primary button-wide-mobile button-sm" open={loginDialogueOpen} handleClose={handleLoginDialogueClose}/>
                </div>
              </nav>
            </>}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;