import Autocomplete from "./components/Autocomplete/Autocomplete";

function App() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Address search</h1>
      <p>Type at least 3 characters to get suggestions</p>
      <Autocomplete />
    </div>
  );
}

export default App;
