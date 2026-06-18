import { DetailView } from '../components/dashboard/DetailView/DetailView';
import { LevelList } from '../components/dashboard/LevelList';
import { PhaseList } from '../components/dashboard/PhaseList';
import { ProjectList } from '../components/dashboard/ProjectList';
import { TowerList } from '../components/dashboard/TowerList';
import { useNavigation } from '../hooks/useNavigation';

export function DashboardPage() {
  const { navigation } = useNavigation();

  if (!navigation.projectId) return <ProjectList />;
  if (!navigation.phaseId) return <PhaseList />;
  if (!navigation.towerId) return <TowerList />;
  if (!navigation.levelId) return <LevelList />;
  return <DetailView />;
}
