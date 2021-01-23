import React from "react";
import { Switch } from "react-router-dom";

// Custom Route Wrapper -- also dont need this. 
import AppRoute from './utils/AppRoute';

// Layout Components -- we dont necessarily need this though
import LayoutDefault from './layouts/LayoutDefault';

// Routing Components
import Home from './components/pages/home/Home';
import About from './components/pages/about/About';
import Room from './components/pages/room/Room';
import Rooms from './components/pages/rooms/Rooms';
import NotFound from './components/pages/NotFound';

const Routes = ({ location }) => {
    return (
        <div>
            {/* Move NavBar and Footer to be global (not included in router switch) */}
            <Switch>
                <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
                <AppRoute exact path="/about" component={About} layout={LayoutDefault} />
                <AppRoute exact path="/rooms" component={Rooms} layout={LayoutDefault} />
                <AppRoute exact path="/room/:id" component={Room} layout={LayoutDefault} />
                
                {/* Default Page for when nothing hits */}
                <AppRoute exact path="*" component={NotFound} />
            </Switch>
        </div>
    )

};

export default Routes;
