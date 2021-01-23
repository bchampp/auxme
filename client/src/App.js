import About from "./pages/About";
import Profile from "./pages/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Room from "./pages/Room";
import './styles/global.css'
const { default: NotFound } = require('./components/global/NotFound.js');

const { default: Nav } = require("./components/global/Nav");
const { default: Home } = require("./pages/Home");

function App() {
  return (
    <Router>
      <div className="app-container">
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/room/:id" component={Room}>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
