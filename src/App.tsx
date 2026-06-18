import React from 'react';
import { useCarbonFootprint } from './hooks/useCarbonFootprint';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const { state, updateInputs } = useCarbonFootprint();

  return (
    <main className="container">
      <header className="hero">
        <h1>Carbon Footprint</h1>
        <p>Your environmental impact, visualized.</p>
      </header>

      <div className="layout-grid">
        <InputForm
          initialInputs={state.inputs}
          onSubmit={updateInputs}
        />
        <Dashboard
          totalKgCO2e={state.results.totalKgCO2e}
          equivalents={state.results.equivalents}
          insight={state.results.insight}
        />
      </div>
    </main>
  );
};

export default App;
