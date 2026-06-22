import { Briefcase, Building2, Calendar } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { usePhases } from '../../hooks/useProject';
import { AssetCard } from '../common/AssetCard';
import { FilterBar } from '../common/FilterBar';
import { ListPageLayout } from '../common/ListPageLayout';
import { Loader } from '../common/Loader';
import { HIERARCHY_CARD_GRID } from '../../utils/layout';

export function PhaseList() {
  const { navigation, searchQuery, setSearchQuery, updateNavigation } = useNavigation();
  const { data: phases, isLoading } = usePhases(navigation.projectId);

  const filtered = phases?.filter(
    (p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Loader fullScreen text="Loading phases..." />;

  return (
    <ListPageLayout
      filter={
        <FilterBar
          searchPlaceholder="Search for phases"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
        />
      }
    >
      <div className={`${HIERARCHY_CARD_GRID} pb-3`}>
        {filtered?.map((phase, index) => (
            <AssetCard
              key={phase.id}
              phaseOrder={phase.order}
              title={phase.name}
              status="active"
              statusLabel="Active"
              isActive={navigation.phaseId === phase.id}
              index={index}
              onClick={() =>
                updateNavigation({
                  phaseId: phase.id,
                  towerId: null,
                  levelId: null,
                  activeTab: 'autocad',
                })
              }
              meta={[
                { icon: Briefcase, label: 'Phase ID', value: phase.id },
                { icon: Building2, label: 'Towers', value: `${phase.towers.length} towers` },
                { icon: Calendar, label: 'Order', value: `Phase ${phase.order}` },
              ]}
            />
        ))}
      </div>
    </ListPageLayout>
  );
}
