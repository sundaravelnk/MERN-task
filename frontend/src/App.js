import './App.css';
import ResponsiveDrawer from './components/Drawer';
import AgGridComponent from './components/AgGrid';

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <ResponsiveDrawer />
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px',marginTop:'200px' }}>
        <AgGridComponent />
      </div>
    </div>
  );
}

export default App;
