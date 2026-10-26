import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { catalogService } from '../../services/catalogService';
import { workoutsService } from '../../services/workoutsService';
import PlayerHeader from '../../components/player/PlayerHeader';
import VideoStage from '../../components/player/VideoStage';
import CoachNotes from '../../components/player/CoachNotes';
import SyllabusSidebar from '../../components/player/SyllabusSidebar';
import SessionSummaryDock from '../../components/player/SessionSummaryDock';
import { tl } from '../../i18n';

export default function Player() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [starting, setStarting] = useState(false);
  const [logged, setLogged] = useState(false);

  // Enrollments
  const { data: enrollments, loading: enrollmentsLoading } = useApi(
    () => catalogService.enrollments(),
    []
  );

  const activeEnrollment = useMemo(() => {
    if (!Array.isArray(enrollments) || enrollments.length === 0) return null;
    if (courseId) {
      return (
        enrollments.find((e) => e.course?.id === parseInt(courseId)) || enrollments[0]
      );
    }
    return enrollments.find((e) => e.status === 'active') || enrollments[0];
  }, [enrollments, courseId]);

  const targetCourseId = activeEnrollment?.course?.id;

  // Player data
  const {
    data: playerData,
    loading: playerLoading,
    refetch: refetchPlayer,
  } = useApi(
    () => (targetCourseId ? catalogService.coursePlayer(targetCourseId) : null),
    [targetCourseId],
    { immediate: !!targetCourseId, showError: false }
  );

  const course = playerData?.course;
  const trainer = playerData?.trainer;
  const modules = playerData?.modules || [];
  const enrollment = playerData?.enrollment;
  const currentModule = playerData?.current_module;

  const handleStartWorkout = async () => {
    if (!course) {
      toast.error(tl("No active course. Enroll in one from the Courses page."));
      return;
    }

    try {
      setStarting(true);
      await workoutsService.start({
        name: currentModule
          ? `${course.title} — ${currentModule.title}`
          : course.title,
      });

      toast.success(tl("Workout started! Log sets in Machine Guide or here."));
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to start workout');
    } finally {
      setStarting(false);
    }
  };

  const handleCompleteModule = async (moduleId) => {
    if (!enrollment) return;
    try {
      await catalogService.completeModule(enrollment.id, moduleId);
      toast.success(tl("Module completed! 🎉"));
      refetchPlayer();
    } catch (e) {
      toast.error(tl("Failed to mark module complete"));
    }
  };

  const handleBrowseCourses = () => navigate('/dashboard/courses');

  // ============================================
  // EMPTY STATE
  // ============================================
  if (!enrollmentsLoading && (!enrollments || enrollments.length === 0)) {
    return (
      <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-surface-container-low rounded-xl max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-primary-container/15 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">
              play_circle
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide mb-3">
            {tl("No Active Course")}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
            {tl("Enroll in a course to unlock the guided player with workout tracking, exercise videos, and progress monitoring.")}
          </p>
          <button
            onClick={handleBrowseCourses}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(229,25,55,0.4)]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>{tl("Browse Courses")}</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // LOADING
  // ============================================
  if (playerLoading || enrollmentsLoading) {
    return (
      <div className="w-full px-space-xl py-space-xl flex flex-col gap-6">
        <div className="h-32 bg-surface-container rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="h-96 bg-surface-container rounded-xl animate-pulse" />
          <div className="h-96 bg-surface-container rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN PLAYER
  // ============================================
  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-lg pb-space-3xl">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 right-[10%] w-[460px] h-[460px] rounded-full bg-primary-container/10 blur-3xl"
          animate={{ x: [0, 34, 0], y: [0, 26, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <PlayerHeader
        course={course}
        currentModule={currentModule}
        enrollment={enrollment}
        onLog={handleStartWorkout}
        logged={logged}
        starting={starting}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-space-lg items-start">
        {/* LEFT: Video + Coach Notes */}
        <div className="flex flex-col gap-space-md">
          <VideoStage course={course} currentModule={currentModule} />
          <CoachNotes trainer={trainer} course={course} />
        </div>

        {/* RIGHT: Syllabus */}
        <SyllabusSidebar
          modules={modules}
          enrollment={enrollment}
          onCompleteModule={handleCompleteModule}
        />
      </div>

      <SessionSummaryDock
        onLog={handleStartWorkout}
        logged={logged}
      />
    </div>
  );
}