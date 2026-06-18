import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { useProjects } from '../../hooks/useProject';
import type { ProjectStatus } from '../../types/project.types';
import { PROJECT_STATUS_FILTER_OPTIONS, PROJECT_STATUS_LABELS } from '../../utils/constants';
import { AssetCard } from '../common/AssetCard';
import { FilterBar } from '../common/FilterBar';
import { ListPageLayout } from '../common/ListPageLayout';
import { Loader } from '../common/Loader';

const FILTER_TO_STATUS: Record<string, ProjectStatus | null> = {
  'All Status': null,
  Planning: 'planning',
  'Under Construction': 'under_construction',
  Completed: 'completed',
};

export function ProjectList() {
  const { navigation, searchQuery, setSearchQuery, updateNavigation } = useNavigation();
  const { data: projects, isLoading } = useProjects();
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  const filteredProjects = projects?.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const filterStatus = FILTER_TO_STATUS[statusFilter];
    const matchesStatus = !filterStatus || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <Loader fullScreen text="Loading projects..." />;

  return (
    <ListPageLayout
      filter={
        <FilterBar
          searchPlaceholder="Search for projects"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={[...PROJECT_STATUS_FILTER_OPTIONS]}
        />
      }
    >
      <div className="grid gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProjects?.map((project, index) => (
          <AssetCard
            key={project.id}
            image={project.image}
            title={project.name}
            status={project.status}
            statusLabel={PROJECT_STATUS_LABELS[project.status]}
            isActive={navigation.projectId === project.id}
            index={index}
            onClick={() =>
              updateNavigation({
                projectId: project.id,
                phaseId: null,
                towerId: null,
                levelId: null,
                activeTab: 'autocad',
              })
            }
            meta={[
              { icon: Briefcase, label: 'Project ID', value: project.id },
              { icon: MapPin, label: 'City', value: project.location || 'N/A' },
              {
                icon: Calendar,
                label: 'Created',
                value: new Date(project.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
              },
            ]}
          />
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <p className="py-16 text-center text-gray-500">No projects found</p>
      )}
    </ListPageLayout>
  );
}
