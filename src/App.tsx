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
import E1Kanban from './pages/child/E1Kanban';
import E2Rewards from './pages/child/E2Rewards';
import E3Family from './pages/child/E3Family';
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
        <Route path="today" element={<E1Kanban />} />
        <Route path="rewards" element={<E2Rewards />} />
        <Route path="family" element={<E3Family />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
