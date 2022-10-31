import './App.css';
import Collection from './components/collection';
import Chart from "./components/chart";
import {TreeMap} from './components/better-treemap';

const App = () => {
  return (
    <>
      <TreeMap></TreeMap>
      <Chart></Chart>
      <Collection></Collection>
    </>
  );
}

export default App;
