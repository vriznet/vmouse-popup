import { styled } from 'styled-components';
import { GlobalStyles } from './components/GlobalStyles';
import MouseButton from './components/MouseButton';
import Screen from './components/Screen';
import Trackpad from './components/Trackpad';

const Container = styled.div`
  width: 320px;
`;

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Container>
        <Screen />
        <Trackpad />
        <MouseButton />
      </Container>
    </>
  );
};

export default App;
