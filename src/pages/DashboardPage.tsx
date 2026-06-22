import { DetailView } from '../components/dashboard/DetailView/DetailView';
import { HierarchyExplorer } from '../components/dashboard/HierarchyExplorer';
import { useNavigation } from '../hooks/useNavigation';

export function DashboardPage() {
  const { navigation } = useNavigation();

  if (navigation.levelId) return <DetailView />;

  return <HierarchyExplorer />;
}
