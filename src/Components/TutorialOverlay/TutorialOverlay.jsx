import { useState, useLayoutEffect } from "react";
import "./TutorialOverlay.css";

const STORAGE_KEY = "moondreamer_tutorial_v2_seen";

function getTutorialStorageKey(user) {
  // Keep key stable across sessions by preferring Mongo _id when available.
  // _id is consistent even if Firebase user shape varies during hydration.
  const userId = user?._id || user?.firebaseUid || "anonymous";
  return `${STORAGE_KEY}_${userId}`;
}

function getLegacyTutorialStorageKeys(user) {
  const keys = [];
  if (user?.firebaseUid) {
    keys.push(`${STORAGE_KEY}_${user.firebaseUid}`);
  }
  if (user?._id) {
    keys.push(`${STORAGE_KEY}_${user._id}`);
  }
  keys.push(STORAGE_KEY);
  return [...new Set(keys)];
}

function hasSeenTutorialForUser(user) {
  const stableKey = getTutorialStorageKey(user);
  if (localStorage.getItem(stableKey)) {
    return true;
  }

  return getLegacyTutorialStorageKeys(user).some((key) =>
    Boolean(localStorage.getItem(key))
  );
}

const STEPS = [
  {
    selector: ".navbar__add-dream",
    title: "Log a Dream",
    description: "Tap here to catch your dream before it drifts away.",
  },
  {
    selector: [".zodiac-sidebar__filters", ".social-feed__filters"],
    title: "Moon Sign Filters",
    description:
      "These moon sign charms sort your dreams by cosmic mood. Pick All Dreams to open the full night sky again.",
  },
  {
    selector: ".navbar__home",
    title: "Social Feed",
    description: "Wander through the dream stream and see what others are dreaming tonight.",
  },
  {
    selector: ".navbar__user-profile",
    title: "Your Profile",
    description: "This is your dream sanctuary, where your journal and moon magic live.",
  },
  {
    selector: ".navbar__menu",
    title: "Menu",
    description: "Need more moon tools? Open this for profile edits, dream actions, and sign out.",
  },
];

function TutorialOverlay({ onFinish, storageKey = STORAGE_KEY }) {
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState(null);

  const currentStep = STEPS[step];

  // Recalculate spotlight rect whenever step changes or on resize.
  // Retries until the target element appears in the DOM (handles navigation delays).
  useLayoutEffect(() => {
    let retryId = null;
    let attempts = 0;
    let isDisposed = false;

    function getTargetElement() {
      const selectors = Array.isArray(currentStep.selector)
        ? currentStep.selector
        : [currentStep.selector];
      return selectors
        .map((selector) => document.querySelector(selector))
        .find(Boolean);
    }

    function measure() {
      if (isDisposed) return;

      const el = getTargetElement();
      if (!el) {
        // If the current step target doesn't exist on this page, move on.
        if (attempts >= 180) {
          if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
          } else {
            finish();
          }
          return;
        }

        attempts += 1;
        // Element not yet in DOM — retry on next animation frame.
        retryId = requestAnimationFrame(measure);
        return;
      }

      const rect = el.getBoundingClientRect();
      const pad = 10;
      setSpotlight({
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      });
    }

    function onResize() {
      cancelAnimationFrame(retryId);
      attempts = 0;
      measure();
    }

    setSpotlight(null);
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      isDisposed = true;
      cancelAnimationFrame(retryId);
      window.removeEventListener("resize", onResize);
    };
  }, [step, currentStep.selector]);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function finish() {
    localStorage.setItem(storageKey, "true");
    onFinish();
  }

  if (!spotlight) return null;

  // Place tooltip above or below the spotlight depending on vertical position
  const tooltipBelow = spotlight.centerY < window.innerHeight * 0.6;

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="App tutorial">
      {/* SVG mask creates the spotlight cutout */}
      <svg
        className="tutorial-overlay__mask"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={spotlight.left}
              y={spotlight.top}
              width={spotlight.width}
              height={spotlight.height}
              rx="12"
              ry="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Highlight ring around the target */}
      <div
        className="tutorial-overlay__ring"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
        }}
      />

      {/* Tooltip card */}
      <div
        className={`tutorial-overlay__tooltip ${tooltipBelow ? "tutorial-overlay__tooltip--below" : "tutorial-overlay__tooltip--above"}`}
        style={{
          left: Math.min(
            Math.max(spotlight.centerX - 140, 12),
            window.innerWidth - 292
          ),
          ...(tooltipBelow
            ? { top: spotlight.top + spotlight.height + 16 }
            : { bottom: window.innerHeight - spotlight.top + 16 }),
        }}
      >
        <p className="tutorial-overlay__step-count">
          {step + 1} / {STEPS.length}
        </p>
        <h3 className="tutorial-overlay__title">{currentStep.title}</h3>
        <p className="tutorial-overlay__description">{currentStep.description}</p>
        <div className="tutorial-overlay__actions">
          <button
            className="tutorial-overlay__skip"
            onClick={finish}
          >
            Skip
          </button>
          <button
            className="tutorial-overlay__next"
            onClick={handleNext}
          >
            {step < STEPS.length - 1 ? "Next" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialOverlay;
export {
  STORAGE_KEY,
  getTutorialStorageKey,
  getLegacyTutorialStorageKeys,
  hasSeenTutorialForUser,
};
