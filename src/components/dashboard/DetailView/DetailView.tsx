import { AnimatePresence, motion } from 'framer-motion';
import { useNavigation } from '../../../hooks/useNavigation';
import { useLevelDetails } from '../../../hooks/useProject';
import { DETAIL_TABS } from '../../../utils/constants';
import { Loader } from '../../common/Loader';
import { AutoCADSection } from './AutoCADSection';
import { ImageSection } from './ImageSection';
import { ONPSection } from './ONPSection';
import { RecheckSection } from './RecheckSection';
import { ScheduleSection } from './ScheduleSection';
import { StatusSection } from './StatusSection';

export function DetailView() {
  const { navigation, updateNavigation } = useNavigation();
  const { data: level, isLoading } = useLevelDetails(navigation.levelId);

  if (isLoading) return <Loader fullScreen text="Loading level details..." />;
  if (!level) return <p className="text-gray-500">Level not found.</p>;

  const renderTab = () => {
    switch (navigation.activeTab) {
      case 'autocad':
        return <AutoCADSection level={level} />;
      case 'images':
        return <ImageSection level={level} />;
      case 'onp':
        return <ONPSection level={level} />;
      case 'status':
        return <StatusSection level={level} />;
      case 'recheck':
        return <RecheckSection level={level} />;
      case 'schedule':
        return (
          <ScheduleSection
            level={level}
            onPhotosCaptured={() => updateNavigation({ activeTab: 'images' })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => updateNavigation({ activeTab: tab.id })}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                navigation.activeTab === tab.id
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {navigation.activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-3 scrollbar-auto-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={navigation.activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
