import React from 'react';

interface OnboardingIllustrationProps {
  step?: number;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ step = 4 }) => {
  const isEducationStep = step === 2;
  const isSkillsStep = step === 3;
  const isExperienceStep = step === 4;
  const isReviewStep = step === 5;

  return (
    <div className="relative w-full max-w-[300px] mx-auto py-2 select-none">
      {/* Hand-drawn accented slogan */}
      <div className="absolute -top-3 right-0 z-20 transform rotate-3">
        {isReviewStep ? (
          <div className="text-right">
            <p className="font-hand text-xl sm:text-2xl font-bold text-[#0052cc] leading-none">
              You're<br />
              Almost<br />
              There!
            </p>
            <div className="flex justify-end mt-1 space-x-0.5">
              <span className="text-blue-500 font-bold text-xs">✦</span>
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
              </svg>
            </div>
          </div>
        ) : isExperienceStep ? (
          <div className="text-right">
            <p className="font-hand text-xl sm:text-2xl font-bold text-[#0052cc] leading-none">
              Experience<br />
              Builds<br />
              Opportunities!
            </p>
            <div className="flex justify-end mt-1">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
              </svg>
            </div>
          </div>
        ) : isSkillsStep ? (
          <div className="text-right">
            <p className="font-hand text-xl sm:text-2xl font-bold text-[#0052cc] leading-none">
              Skills<br />
              Today<br />
              Success<br />
              Tomorrow!
            </p>
            <div className="flex justify-end mt-1">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
              </svg>
            </div>
          </div>
        ) : isEducationStep ? (
          <div className="text-right">
            <p className="font-hand text-xl sm:text-2xl font-bold text-[#0052cc] leading-none">
              Education<br />
              Builds<br />
              Opportunities!
            </p>
            <div className="flex justify-end mt-1">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <p className="font-hand text-xl sm:text-2xl font-bold text-[#0052cc] leading-none">
              A<br />
              Skilled You<br />
              A Brighter<br />
              Tomorrow!
            </p>
            <div className="flex justify-end mt-1">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <svg
        viewBox="0 0 340 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-md"
      >
        {/* Soft background glow & floating circle */}
        <circle cx="160" cy="140" r="115" fill="#E8F1FD" />
        <circle cx="260" cy="70" r="28" fill="#DBEAFE" opacity="0.6" />

        {/* Decorative foliage / plant leaves on right */}
        <path
          d="M270 210C270 170 295 140 310 135C310 160 305 195 280 220"
          fill="#34D399"
          opacity="0.7"
        />
        <path
          d="M285 220C295 185 315 165 325 160C325 180 315 205 295 225"
          fill="#10B981"
          opacity="0.8"
        />

        {/* Floating elements for Step 5 (Review Step in 6th phase.png) */}
        {isReviewStep ? (
          <g transform="translate(130, 35)">
            {/* Giant Blue Clipboard */}
            <rect x="15" y="15" width="135" height="180" rx="14" fill="#0052CC" />
            <rect x="20" y="20" width="125" height="170" rx="10" fill="#FFFFFF" />
            <rect x="58" y="10" width="50" height="14" rx="5" fill="#003D99" />
            <circle cx="83" cy="17" r="3.5" fill="#FFFFFF" />

            {/* Header row in clipboard */}
            <rect x="35" y="38" width="70" height="6" rx="3" fill="#93C5FD" />
            <rect x="35" y="48" width="45" height="4" rx="2" fill="#CBD5E1" />

            {/* Checklist item 1 with Green Tick Circle */}
            <g transform="translate(35, 62)">
              <circle cx="10" cy="10" r="9" fill="#10B981" />
              <path d="M6 10L9 13L14 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="26" y="5" width="60" height="4" rx="2" fill="#0A2540" />
              <rect x="26" y="12" width="40" height="3" rx="1.5" fill="#94A3B8" />
            </g>

            {/* Checklist item 2 with Green Tick Circle */}
            <g transform="translate(35, 90)">
              <circle cx="10" cy="10" r="9" fill="#10B981" />
              <path d="M6 10L9 13L14 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="26" y="5" width="55" height="4" rx="2" fill="#0A2540" />
              <rect x="26" y="12" width="35" height="3" rx="1.5" fill="#94A3B8" />
            </g>

            {/* Checklist item 3 with Green Tick Circle */}
            <g transform="translate(35, 118)">
              <circle cx="10" cy="10" r="9" fill="#10B981" />
              <path d="M6 10L9 13L14 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="26" y="5" width="65" height="4" rx="2" fill="#0A2540" />
              <rect x="26" y="12" width="45" height="3" rx="1.5" fill="#94A3B8" />
            </g>

            {/* Potted Plant beside student matching 6th phase.png */}
            <g transform="translate(105, 140)">
              <path d="M12 22L16 42H32L36 22Z" fill="#0052CC" />
              <ellipse cx="24" cy="22" rx="12" ry="3" fill="#003D99" />
              <path d="M24 20C24 10 16 0 10 -4C16 4 24 12 24 20Z" fill="#34D399" />
              <path d="M24 20C24 10 32 0 38 -4C32 4 24 12 24 20Z" fill="#10B981" />
              <path d="M24 20C20 12 22 4 24 -6C26 4 28 12 24 20Z" fill="#059669" />
            </g>
          </g>
        ) : isExperienceStep ? (
          <g transform="translate(130, 40)">
            {/* Giant Blue Clipboard */}
            <rect x="15" y="15" width="135" height="175" rx="14" fill="#0052CC" />
            <rect x="20" y="20" width="125" height="165" rx="10" fill="#FFFFFF" />
            <rect x="58" y="10" width="50" height="14" rx="5" fill="#003D99" />
            <circle cx="83" cy="17" r="3.5" fill="#FFFFFF" />

            {/* Profile Avatar Card inside Clipboard */}
            <circle cx="82" cy="50" r="14" fill="#E0EDFE" />
            <circle cx="82" cy="46" r="6" fill="#0052CC" />
            <path d="M72 60C72 55 76 54 82 54C88 54 92 55 92 60" stroke="#0052CC" strokeWidth="2" strokeLinecap="round" />

            {/* Data / credential bars */}
            <rect x="45" y="74" width="75" height="5" rx="2.5" fill="#93C5FD" />
            <rect x="55" y="83" width="55" height="4" rx="2" fill="#BFDBFE" />
            <rect x="35" y="98" width="95" height="1" fill="#E2E8F0" />

            <rect x="35" y="108" width="60" height="4" rx="2" fill="#CBD5E1" />
            <rect x="35" y="118" width="75" height="4" rx="2" fill="#E2E8F0" />
            <rect x="35" y="128" width="45" height="4" rx="2" fill="#E2E8F0" />

            {/* Floating Gear / Settings Icon badge matching 5th phase.png */}
            <g transform="translate(115, 75)">
              <circle cx="16" cy="16" r="16" fill="#0052CC" />
              <circle cx="16" cy="16" r="6" fill="#FFFFFF" />
              {/* Gear teeth */}
              <rect x="14" y="3" width="4" height="26" rx="2" fill="#0052CC" />
              <rect x="3" y="14" width="26" height="4" rx="2" fill="#0052CC" />
              <rect x="14" y="3" width="4" height="26" rx="2" fill="#0052CC" transform="rotate(45 16 16)" />
              <rect x="14" y="3" width="4" height="26" rx="2" fill="#0052CC" transform="rotate(-45 16 16)" />
              <circle cx="16" cy="16" r="8" fill="#0052CC" />
              <circle cx="16" cy="16" r="4" fill="#FFFFFF" />
            </g>

            {/* Executive Briefcase on right bottom matching 5th phase.png */}
            <g transform="translate(70, 140)">
              <rect x="15" y="12" width="65" height="44" rx="6" fill="#0A2540" />
              <rect x="15" y="24" width="65" height="2" fill="#1E293B" />
              {/* Handle */}
              <path d="M38 12V6C38 4 41 3 47 3C53 3 56 4 56 6V12" stroke="#0A2540" strokeWidth="3" strokeLinecap="round" />
              {/* Metallic clasp */}
              <rect x="44" y="21" width="6" height="8" rx="1.5" fill="#38BDF8" />
            </g>
          </g>
        ) : isSkillsStep ? (
          <g transform="translate(135, 30)">
            {/* Pill 1: Technical Skills */}
            <g transform="translate(10, 20)">
              <rect x="0" y="0" width="105" height="24" rx="12" fill="#0052CC" />
              <circle cx="12" cy="12" r="5" fill="#FFFFFF" opacity="0.9" />
              <text x="24" y="15" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Technical Skills
              </text>
            </g>

            {/* Pill 2: Software Tools */}
            <g transform="translate(30, 50)">
              <rect x="0" y="0" width="100" height="24" rx="12" fill="#E0EDFE" stroke="#93C5FD" strokeWidth="1" />
              <rect x="8" y="7" width="10" height="8" rx="1.5" fill="#0052CC" />
              <text x="23" y="15" fill="#0052CC" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Software Tools
              </text>
            </g>

            {/* Pill 3: Soft Skills */}
            <g transform="translate(25, 80)">
              <rect x="0" y="0" width="85" height="24" rx="12" fill="#E0EDFE" stroke="#93C5FD" strokeWidth="1" />
              <circle cx="12" cy="10" r="3.5" fill="#0052CC" />
              <text x="22" y="15" fill="#0052CC" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Soft Skills
              </text>
            </g>

            {/* Pill 4: Domain Knowledge */}
            <g transform="translate(15, 110)">
              <rect x="0" y="0" width="115" height="24" rx="12" fill="#E0EDFE" stroke="#93C5FD" strokeWidth="1" />
              <circle cx="12" cy="12" r="4" fill="#0052CC" />
              <text x="24" y="15" fill="#0052CC" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                Domain Knowledge
              </text>
            </g>

            {/* Books and plant on bottom right */}
            <g transform="translate(70, 135)">
              <rect x="0" y="20" width="80" height="14" rx="3" fill="#0052CC" />
              <rect x="5" y="10" width="70" height="12" rx="2.5" fill="#38BDF8" />
              <path d="M70 25L73 40H87L90 25Z" fill="#3B82F6" />
              <path d="M80 25C80 15 75 5 70 0C75 5 80 12 80 25Z" fill="#10B981" />
            </g>
          </g>
        ) : isEducationStep ? (
          /* Books stack for step 2 */
          <g transform="translate(155, 75)">
            <rect x="0" y="105" width="105" height="18" rx="4" fill="#0052CC" />
            <rect x="5" y="107" width="95" height="14" rx="2" fill="#FFFFFF" />
            <rect x="8" y="110" width="89" height="8" rx="1" fill="#E2E8F0" />
            <rect x="8" y="85" width="95" height="18" rx="4" fill="#0A2540" />
            <rect x="13" y="87" width="85" height="14" rx="2" fill="#FFFFFF" />
            <rect x="16" y="90" width="79" height="8" rx="1" fill="#E2E8F0" />
            <rect x="16" y="65" width="85" height="18" rx="4" fill="#38BDF8" />
            <rect x="21" y="67" width="75" height="14" rx="2" fill="#FFFFFF" />
            <rect x="24" y="70" width="69" height="8" rx="1" fill="#E2E8F0" />
            <g transform="translate(20, 10)">
              <ellipse cx="40" cy="38" rx="24" ry="12" fill="#0A2540" />
              <polygon points="40,12 82,28 40,44 -2,28" fill="#0A2540" />
              <polygon points="40,15 78,28 40,41 2,28" fill="#1E293B" />
              <circle cx="40" cy="28" r="3" fill="#F59E0B" />
              <path d="M40 28C45 32 55 35 62 44" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="60,42 66,48 58,48" fill="#F59E0B" />
            </g>
            <g transform="translate(95, 80)">
              <path d="M5 25L8 42H22L25 25Z" fill="#3B82F6" />
              <ellipse cx="15" cy="25" rx="10" ry="3" fill="#1D4ED8" />
              <path d="M15 25C15 15 8 5 5 0C10 5 15 12 15 25Z" fill="#10B981" />
              <path d="M15 25C18 15 25 8 28 5C24 10 20 18 15 25Z" fill="#059669" />
            </g>
          </g>
        ) : (
          /* Giant clipboard for step 1 */
          <g transform="translate(20, 20)">
            <rect x="0" y="15" width="135" height="185" rx="14" fill="#0052CC" />
            <rect x="5" y="20" width="125" height="175" rx="10" fill="#FFFFFF" />
            <rect x="42" y="8" width="50" height="16" rx="6" fill="#003D99" />
            <circle cx="67" cy="16" r="4" fill="#FFFFFF" />
            <rect x="20" y="36" width="30" height="30" rx="15" fill="#E0EDFE" />
            <circle cx="35" cy="46" r="6" fill="#0052CC" />
            <path d="M26 62C26 56 30 54 35 54C40 54 44 56 44 62" stroke="#0052CC" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="58" y="42" width="50" height="6" rx="3" fill="#93C5FD" />
            <rect x="58" y="53" width="35" height="5" rx="2.5" fill="#BFDBFE" />
            <rect x="20" y="78" width="95" height="1" fill="#E2E8F0" />
            <path d="M22 93L27 98L36 89" stroke="#0052CC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="44" y="91" width="65" height="6" rx="3" fill="#CBD5E1" />
            <path d="M22 113L27 118L36 109" stroke="#0052CC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="44" y="111" width="50" height="6" rx="3" fill="#CBD5E1" />
            <circle cx="29" cy="132" r="6" fill="#E2E8F0" />
            <rect x="44" y="129" width="58" height="6" rx="3" fill="#E2E8F0" />
            <g transform="translate(10, 140)">
              <circle cx="18" cy="18" r="18" fill="#0052CC" />
              <path d="M13 16V13C13 10.2 15.2 8 18 8C20.8 8 23 10.2 23 13V16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="11" y="16" width="14" height="11" rx="2.5" fill="#FFFFFF" />
              <circle cx="18" cy="21" r="1.5" fill="#0052CC" />
            </g>
          </g>
        )}

        {/* Student with laptop on left */}
        <g transform="translate(30, 80)">
          <path d="M50 35C45 20 60 12 75 14C88 15 95 24 95 36C95 38 88 38 85 36C75 35 70 32 60 36C56 38 52 38 50 35Z" fill="#0F172A" />
          <rect x="68" y="52" width="14" height="12" rx="4" fill="#FBCFE8" />
          <circle cx="75" cy="40" r="16" fill="#FCD34D" />
          <path d="M60 26C62 20 70 18 80 18C88 18 94 22 93 30C90 28 85 27 78 28C72 29 65 30 60 26Z" fill="#0F172A" />
          <circle cx="80" cy="38" r="1.8" fill="#0F172A" />
          <path d="M78 45C80 47 83 47 85 45" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M50 64C56 58 64 56 75 56C86 56 94 58 100 64L110 115H40L50 64Z" fill="#0052CC" />
          <path d="M68 56L75 66L82 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="62" cy="112" rx="8" ry="5" fill="#FCD34D" />
          <ellipse cx="90" cy="112" rx="8" ry="5" fill="#FCD34D" />
          <g transform="translate(30, 96)">
            <path d="M15 5L20 40H75L80 5C80 3 78 2 76 2H19C17 2 15 3 15 5Z" fill="#1E293B" />
            <rect x="22" y="6" width="52" height="30" rx="1.5" fill="#334155" />
            <circle cx="48" cy="20" r="3" fill="#60A5FA" opacity="0.8" />
            <path d="M5 40H90C92 40 93 42 92 44L88 47C87 48 85 49 84 49H11C10 49 8 48 7 47L3 44C2 42 3 40 5 40Z" fill="#0F172A" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default OnboardingIllustration;
