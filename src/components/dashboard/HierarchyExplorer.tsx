import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, Image, LayoutGrid, MapPin } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useLevels, usePhases, useProjects, useTowers } from '../../hooks/useProject';
import { PROJECT_STATUS_LABELS, STATUS_LABELS } from '../../utils/constants';
import { HIERARCHY_CARD_GRID } from '../../utils/layout';
import { AssetCard } from '../common/AssetCard';
import { Loader } from '../common/Loader';
import { SelectionPanel } from '../common/SelectionPanel';

export function HierarchyExplorer() {
  const { navigation, updateNavigation } = useNavigation();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: phases, isLoading: phasesLoading } = usePhases(navigation.projectId);
  const { data: towers, isLoading: towersLoading } = useTowers(navigation.phaseId);
  const { data: levels, isLoading: levelsLoading } = useLevels(navigation.towerId);

  if (projectsLoading) return <Loader fullScreen text="Loading projects..." />;

  return (
    <div className="space-y-3 overflow-y-auto pb-3 scrollbar-auto-hide">
      <SelectionPanel
        title="Projects"
        subtitle="One project per category — select a project to view its phases"
      >
        <div className={HIERARCHY_CARD_GRID}>
          {projects?.map((project, index) => (
            <AssetCard
              key={project.id}
              title={project.name}
              mapLocation={project.location}
              status={project.status}
              statusLabel={PROJECT_STATUS_LABELS[project.status]}
              isActive={navigation.projectId === project.id}
              isDimmed={!!navigation.projectId && navigation.projectId !== project.id}
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
      </SelectionPanel>

      <AnimatePresence>
        {navigation.projectId && (
          <motion.div
            key="phases-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SelectionPanel
              title="Phases"
              subtitle="Select a phase to view towers in this project"
            >
              {phasesLoading ? (
                <Loader text="Loading phases..." />
              ) : (
                <div className={HIERARCHY_CARD_GRID}>
                  {phases?.map((phase, index) => (
                      <AssetCard
                        key={phase.id}
                        phaseOrder={phase.order}
                        title={phase.name}
                        status="active"
                        statusLabel="Active"
                        isActive={navigation.phaseId === phase.id}
                        isDimmed={!!navigation.phaseId && navigation.phaseId !== phase.id}
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
                          {
                            icon: Building2,
                            label: 'Towers',
                            value: `${phase.towers.length} towers`,
                          },
                          { icon: Calendar, label: 'Order', value: `Phase ${phase.order}` },
                        ]}
                      />
                  ))}
                </div>
              )}
            </SelectionPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navigation.phaseId && (
          <motion.div
            key="towers-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SelectionPanel title="Towers" subtitle="Select a tower to view its levels">
              {towersLoading ? (
                <Loader text="Loading towers..." />
              ) : (
                <div className={HIERARCHY_CARD_GRID}>
                  {towers?.map((tower, index) => (
                      <AssetCard
                        key={tower.id}
                        towerOrder={tower.order}
                        title={tower.name}
                        status="active"
                        statusLabel="Active"
                        isActive={navigation.towerId === tower.id}
                        isDimmed={!!navigation.towerId && navigation.towerId !== tower.id}
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
                          {
                            icon: LayoutGrid,
                            label: 'Levels',
                            value: `${tower.levels.length} levels`,
                          },
                          { icon: Calendar, label: 'Order', value: `Tower ${tower.order}` },
                        ]}
                      />
                  ))}
                </div>
              )}
            </SelectionPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {navigation.towerId && (
          <motion.div
            key="levels-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SelectionPanel title="Levels" subtitle="Select a level to open details">
              {levelsLoading ? (
                <Loader text="Loading levels..." />
              ) : (
                <div className={HIERARCHY_CARD_GRID}>
                  {levels?.map((level, index) => (
                    <AssetCard
                      key={level.id}
                      levelOrder={level.order}
                      title={level.name}
                      status={level.status}
                      statusLabel={STATUS_LABELS[level.status]}
                      isActive={navigation.levelId === level.id}
                      isDimmed={!!navigation.levelId && navigation.levelId !== level.id}
                      index={index}
                      onClick={() =>
                        updateNavigation({
                          levelId: level.id,
                          activeTab: 'autocad',
                        })
                      }
                      meta={[
                        { icon: Briefcase, label: 'Level ID', value: level.id },
                        {
                          icon: Image,
                          label: 'Images',
                          value: `${level.images.captured.length} captured`,
                        },
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
              )}
            </SelectionPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
