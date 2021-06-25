import { BrowserRouter, Route, Switch} from 'react-router-dom';
import {AuthContextProvider} from '../src/contexts/AuthContext';
import { AdminRoom } from './pages/AdminRoom';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

function App() {

  return (
    <BrowserRouter>
    <AuthContextProvider>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" exact={true} component={NewRoom} />
        <Route path="/rooms/:id" exact component={Room} />
        <Route path="/admin/:id" exact component={AdminRoom} />
      </Switch>
    </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App;
