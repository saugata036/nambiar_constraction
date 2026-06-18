import { Briefcase, Calendar, Image } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useLevels } from '../../hooks/useProject';
import { STATUS_LABELS } from '../../utils/constants';
import { AssetCard } from '../common/AssetCard';
import { FilterBar } from '../common/FilterBar';
import { ListPageLayout } from '../common/ListPageLayout';
import { Loader } from '../common/Loader';

export function LevelList() {
  const { navigation, searchQuery, setSearchQuery, updateNavigation } = useNavigation();
  const { data: levels, isLoading } = useLevels(navigation.towerId);

  const filtered = levels?.filter(
    (l) => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Loader fullScreen text="Loading levels..." />;

  return (
    <ListPageLayout
      filter={
        <FilterBar
          searchPlaceholder="Search for levels"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
        />
      }
    >
      <div className="grid gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered?.map((level, index) => (
          <AssetCard
            key={level.id}
            image={level.images.captured[0]?.url}
            title={level.name}
            status={level.status}
            statusLabel={STATUS_LABELS[level.status]}
            isActive={navigation.levelId === level.id}
            index={index}
            onClick={() =>
              updateNavigation({
                levelId: level.id,
                activeTab: 'autocad',
              })
            }
            meta={[
              { icon: Briefcase, label: 'Level ID', value: level.id },
              { icon: Image, label: 'Images', value: `${level.images.captured.length} captured` },
              {
                icon: Calendar,
                label: 'Last Capture',
                value: level.images.captured[0]
                  ? new Date(level.images.captured[0].capturedAt).toLocaleDateString()
                  : 'N/A',
              },
            ]}
          />
        ))}
      </div>
    </ListPageLayout>
  );
}
