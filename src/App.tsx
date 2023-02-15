import './app.scss';
import { useEagerConnect } from "hooks/useEagerConnect";
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import StakingPage from 'pages/homePage/StakingPage';
import { Toaster } from 'react-hot-toast';
import MintPage from 'pages/homePage/MintPage';

function App() {
  useEagerConnect();
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 },
        }}
      />
      <Switch>
        <Route exact path="/" component={MintPage} />
        <Route exact path="/staking" component={StakingPage} />
      </Switch>
    </Router>
  );
}

export default App;
