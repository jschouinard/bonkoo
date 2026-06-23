import { Routes, Route, Navigate } from 'react-router-dom';
import { useBonkoo } from './state/context';
import L1ProfileSelector from './pages/L1ProfileSelector';
import P1Signup from './pages/parent/P1Signup';
import P2Onboarding from './pages/parent/P2Onboarding';
import P3Dashboard from './pages/parent/P3Dashboard';
import P4Approvals from './pages/parent/P4Approvals';
import P5ApplyMalus from './pages/parent/P5ApplyMalus';
import P6Library from './pages/parent/P6Library';
import P7Rewards from './pages/parent/P7Rewards';
import E4MyGame from './pages/child/E4MyGame';
import E5Rewards from './pages/child/E5Rewards';
import E6Family from './pages/child/E6Family';
import E2NewGameReward from './pages/child/E2NewGameReward';
import E3NewGameBonkoo from './pages/child/E3NewGameBonkoo';
import ParentLayout from './components/parent/ParentLayout';
import ChildLayout from './components/child/ChildLayout';

export default function App() {
  const { state } = useBonkoo();
  const hasAccount = state.parents.length > 0;

  return (
    <Routes>
      <Route path="/" element={<L1ProfileSelector />} />
      <Route path="/signup" element={<P1Signup />} />

      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<Navigate to={hasAccount && state.onboarding_terminé ? 'dashboard' : 'onboarding'} replace />} />
        <Route path="onboarding" element={<P2Onboarding />} />
        <Route path="dashboard" element={<P3Dashboard />} />
        <Route path="approvals" element={<P4Approvals />} />
        <Route path="malus" element={<P5ApplyMalus />} />
        <Route path="library" element={<P6Library />} />
        <Route path="rewards" element={<P7Rewards />} />
      </Route>

      <Route path="/child/:childId" element={<ChildLayout />}>
        <Route index element={<Navigate to="today" replace />} />
        <Route path="today" element={<E4MyGame />} />
        <Route path="rewards" element={<E5Rewards />} />
        <Route path="family" element={<E6Family />} />
        <Route path="new-game/reward" element={<E2NewGameReward />} />
        <Route path="new-game/bonkoo" element={<E3NewGameBonkoo />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
