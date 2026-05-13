import React, { useRef, useEffect, useCallback } from "react";
import { Clock, Settings, Zap, Rocket, Users, GitMerge, Trophy } from "lucide-react";
import { trackEvent } from "../utils/analytics";

const STAGE_ICONS = {
  onboarding: <Settings className="w-4 h-4" />,
  learning_sprint: <Zap className="w-4 h-4" />,
  project_kickoff: <Rocket className="w-4 h-4" />,
  real_workflow: <Users className="w-4 h-4" />,
  ci_cd: <GitMerge className="w-4 h-4" />,
  demo_day: <Trophy className="w-4 h-4" />,
};

// ── StageItem ─────────────────────────────────────────────────────────────────
const StageItem = ({
  index,
  titleAR,
  keyEN,
  longDescAR,
  descKeyEN,
  durationLabel,
  weekKey,
  highlight,
  isLast,
  onClick,
}) => {
  const itemRef = useRef(null);
  const titleId = `stage-title-${index}`;
  const descId = `stage-desc-${index}`;

  // stage_view analytics
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("stage_view", { stageKey: keyEN, stageIndex: index });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [keyEN, index]);

  return (
    <div
      ref={itemRef}
      className="flex gap-0"
      data-aos="fade-up"
      data-aos-duration="200"
      data-aos-delay={index * 80}
    >
      {/* Timeline connector column */}
      <div className="flex flex-col items-center me-3 sm:me-4 shrink-0 pt-1">
        {/* Number dot */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 z-10 ${
            highlight
              ? "shadow-[0_0_12px_rgba(30,64,175,0.4)] bg-gradient-to-br from-deep-blue to-emerald"
              : "bg-gradient-to-br from-deep-blue to-emerald"
          }`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {/* Vertical line */}
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 bg-gradient-to-b from-blue-200 to-emerald-100 min-h-[12px]"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card */}
      <div
        tabIndex={0}
        role="article"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-key={keyEN}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
        className={`group relative flex-1 mb-3 p-3 sm:p-4 rounded-xl border cursor-pointer
          transition-all duration-200 select-none overflow-y-auto
          focus:outline-none focus:ring-2 focus:ring-blue-400/40
          min-h-[160px] max-h-[220px]
          ${
            highlight
              ? "bg-gradient-to-br from-white to-blue-50/40 border-blue-200/60 shadow-[0_2px_16px_rgba(30,64,175,0.1)] hover:shadow-[0_4px_20px_rgba(30,64,175,0.2)]"
              : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
          }`}
      >
        {/* EN key tooltip */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 start-2 whitespace-nowrap text-[11px] bg-gray-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 z-20"
        >
          {keyEN}
        </span>

        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                highlight ? "bg-blue-100 text-deep-blue" : "bg-gray-100 text-gray-500"
              }`}
              aria-hidden="true"
            >
              {STAGE_ICONS[keyEN]}
            </span>
            <h3
              id={titleId}
              data-key={keyEN}
              className="text-[17px] sm:text-[18px] font-bold text-gray-900 leading-snug"
            >
              {titleAR}
            </h3>
          </div>
          {highlight && (
            <span className="shrink-0 text-[10px] font-semibold text-deep-blue bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
              ✦ أساسي
            </span>
          )}
        </div>

        {/* Long description */}
        <p
          id={descId}
          data-desc-key={descKeyEN}
          className="text-[14px] sm:text-[15px] text-gray-500 leading-[1.5] mb-2"
        >
          {longDescAR}
        </p>

        {/* Duration */}
        <div
          className="flex items-center gap-1 text-[12px] text-deep-blue font-semibold"
          data-duration-key={weekKey}
        >
          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
          {durationLabel}
        </div>
      </div>
    </div>
  );
};

// ── VerticalTimeline ──────────────────────────────────────────────────────────
const VerticalTimeline = ({ stages, onStageClick }) => (
  <div
    className="max-w-2xl mx-auto lg:max-w-3xl"
    role="list"
    aria-label="مراحل رحلة المتدرب"
  >
    {stages.map((stage, i) => (
      <div key={stage.keyEN} role="listitem">
        <StageItem
          index={i}
          titleAR={stage.title}
          keyEN={stage.keyEN}
          longDescAR={stage.longDesc}
          descKeyEN={stage.descKeyEN}
          durationLabel={stage.duration}
          weekKey={stage.weekKey}
          highlight={stage.highlight}
          isLast={i === stages.length - 1}
          onClick={() => onStageClick(stage, i)}
        />
      </div>
    ))}
  </div>
);

// ── JourneySection (TraineeJourney) ───────────────────────────────────────────
const JourneySection = ({ t }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("journey_view");
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleStageClick = useCallback(
    (stage, index) =>
      trackEvent("stage_click", { stageKey: stage.keyEN, stageIndex: index }),
    []
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className="text-[28px] sm:text-[34px] font-bold mb-3 gradient-text leading-tight">
            {t.journey.title}
          </h2>
          <p className="text-[15px] text-gray-500 max-w-xl mx-auto leading-relaxed">
            {t.journey.subtitle}
          </p>
        </div>

        <VerticalTimeline
          stages={t.journey.stages}
          onStageClick={handleStageClick}
        />
      </div>
    </section>
  );
};

export default JourneySection;
