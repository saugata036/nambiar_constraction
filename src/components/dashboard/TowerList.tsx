import { Briefcase, Calendar, LayoutGrid } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useTowers } from '../../hooks/useProject';
import { AssetCard } from '../common/AssetCard';
import { FilterBar } from '../common/FilterBar';
import { ListPageLayout } from '../common/ListPageLayout';
import { Loader } from '../common/Loader';

export function TowerList() {
  const { navigation, searchQuery, setSearchQuery, updateNavigation } = useNavigation();
  const { data: towers, isLoading } = useTowers(navigation.phaseId);

  const filtered = towers?.filter(
    (t) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Loader fullScreen text="Loading towers..." />;

  return (
    <ListPageLayout
      filter={
        <FilterBar
          searchPlaceholder="Search for towers"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
        />
      }
    >
      <div className="grid gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered?.map((tower, index) => {
          const coverImage = tower.levels[0]?.images.captured[0]?.url;
          return (
            <AssetCard
              key={tower.id}
              image={coverImage}
              title={tower.name}
              status="active"
              statusLabel="Active"
              isActive={navigation.towerId === tower.id}
              index={index}
              onClick={() =>
                updateNavigation({
                  towerId: tower.id,
                  levelId: null,
                  activeTab: 'autocad',
                })
              }
              meta={[
                { icon: Briefcase, label: 'Tower ID', value: tower.id },
                { icon: LayoutGrid, label: 'Levels', value: `${tower.levels.length} levels` },
                { icon: Calendar, label: 'Order', value: `Tower ${tower.order}` },
              ]}
            />
          );
        })}
      </div>
    </ListPageLayout>
  );
}
