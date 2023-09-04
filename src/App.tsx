import { GlobalStyles } from './components/GlobalStyles';
import Screen from './components/Screen';
import Trackpad from './components/Trackpad';

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div>
        <Screen />
        <Trackpad />
      </div>
    </>
  );
};

export default App;
