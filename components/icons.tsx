// Minimal inline icon set (stroke-based, currentColor) to avoid an icon dependency.
type P = { className?: string };

export const PencilIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const ChevronDown = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronUp = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const UploadIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
  </svg>
);

export const LinkIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export const DotsIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
  </svg>
);

export const MutedIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m22 9-6 6" /><path d="m16 9 6 6" />
  </svg>
);

export const PlusIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
);

export const ClockIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1Z" />
  </svg>
);

export const UserIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// Tabler-style pin (matches Figma "tabler-icon-pin")
export const PinAngleIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4.5l-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4" /><path d="M9 15l-4.5 4.5" /><path d="M14.5 4L20 9.5" />
  </svg>
);

export const PinOffIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" /><path d="M15 4.5l-3.249 3.249M9.5 9.5L7 10l-1.5 1.5 7 7L14 17l.5-2.5" /><path d="M9 15l-4.5 4.5" /><path d="M14.5 4L20 9.5" />
  </svg>
);

export const TrashIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

export const CodeIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" />
  </svg>
);

export const CheckCircleIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const MegaphoneIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

export const ArrowLeftIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
  </svg>
);

export const SendIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);

export const SunIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const CalendarIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

// DailyWire wordmark (emblem + "DAILYWIRE"), exported from Figma. Uses currentColor
// so it inherits the surrounding text color.
export const DailyWireLogo = ({ className }: P) => (
  <svg className={className} viewBox="0 0 157 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.9257 2.55859H7.6748C8.34733 3.16923 9.06937 3.93253 9.78728 4.86912H21.9216L22.8871 2.55859H21.9257Z" />
    <path d="M10.6119 6.02631C10.3396 5.61372 10.0631 5.23 9.78668 4.87105C9.06465 3.93446 8.34673 3.17116 7.67421 2.56052C5.76391 0.823501 4.23319 0.274756 4.15893 0.25H0V2.56052V4.87105V7.18157H11.4123C11.1482 6.81436 10.88 6.42653 10.6119 6.02631Z" />
    <path d="M11.416 7.17969C12.039 8.03376 12.6703 8.80532 13.2809 9.49022H21.9247L22.8902 7.17969H21.9247V7.18382H11.416V7.17969Z" />
    <path d="M13.2813 9.49219H0V11.8027H15.596C14.8863 11.1756 14.0983 10.4081 13.2813 9.49219Z" />
    <path d="M18.7198 14.1152H21.9256L22.8911 11.8047H21.9256H15.6006C17.3458 13.3478 18.6208 14.0616 18.7198 14.1152Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M39.9103 1.27807C38.59 0.535402 36.8571 0.164062 34.5878 0.164062C33.7627 0.164062 33.02 0.164065 32.1948 0.205324C31.3696 0.205324 30.7507 0.287842 30.3381 0.287842V0.452883C30.5857 0.576661 30.5857 1.19555 30.5857 5.98164V7.92083C30.5857 13.0782 30.5857 13.7384 30.2969 13.9034V14.0685C30.7507 14.1097 31.3696 14.1097 31.906 14.151C32.5661 14.151 33.4738 14.1923 34.299 14.1923C36.527 14.1923 38.4662 13.7797 39.9103 12.8307C41.932 11.5516 43.1697 9.52994 43.1697 6.9306C43.211 4.7026 42.2208 2.51585 39.9103 1.27807ZM38.0949 10.8502C37.2284 11.4691 36.0319 11.758 34.8354 11.758C34.4641 11.758 34.0102 11.758 33.7214 11.7167C33.6389 11.7167 33.5976 11.6754 33.5976 11.5929V2.59837C33.9689 2.55711 34.4228 2.51585 34.8766 2.51585C36.2382 2.51585 37.3935 2.84592 38.2186 3.38229C39.3739 4.16622 40.034 5.48652 40.034 7.01312C40.034 8.78727 39.2501 10.0251 38.0949 10.8502Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M56.1663 7.96306L52.3705 0H51.9166L48.0383 7.96306C45.4802 13.1617 45.1089 13.9044 44.8613 14.0282V14.152H46.6767H48.4509V14.0282C48.2446 13.9044 48.5747 13.203 49.3998 11.3876H54.516C55.3412 13.203 55.63 13.9457 55.4237 14.0282V14.152H57.4454H59.2195V14.0282C59.0545 13.9044 58.6832 13.1617 56.1663 7.96306ZM50.3075 9.2421V9.20084C51.5041 6.56024 51.7929 5.81757 51.9992 5.2812C52.1642 5.77631 52.453 6.56024 53.6083 9.2421H50.3075Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M64.831 0.25H66.6052V0.373773C66.3576 0.538811 66.3576 1.19897 66.3576 6.02631V7.9655H66.3164C66.3164 13.1229 66.3164 13.7831 66.6052 13.9894V14.1131H64.831H63.0156V13.9894C63.3044 13.7831 63.3044 13.1642 63.3044 8.00676V6.02631C63.3044 1.19897 63.3044 0.538811 63.0569 0.373773V0.25H64.831Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M80.5087 11.6788H80.6737C80.6737 12.7516 80.6737 13.2054 80.6324 14.1544H76.7128H72.2568V14.0306C72.5044 13.9069 72.5044 13.2054 72.5044 8.04802V6.02631H72.5456C72.5456 1.19897 72.5457 0.538811 72.2981 0.373773V0.25H74.1135H75.8464V0.373773C75.5988 0.58007 75.5988 1.19897 75.5988 6.02631V7.9655V11.7201C75.5988 11.8439 75.6401 11.8851 75.7639 11.8851H79.0233C79.4772 11.8851 79.7247 11.8851 79.9723 11.8439C80.1786 11.8026 80.4674 11.7201 80.5087 11.6788Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M93.6715 0.25H95.3218V0.373773C95.0743 0.497551 94.7029 1.1577 91.4435 6.31513L90.0407 8.37809V8.87321C90.0407 13.1229 90.0407 13.8656 90.3295 14.0306V14.1544H88.5553H86.7399V14.0306C87.0287 13.9069 87.0287 13.1642 87.0287 8.95572V8.58439L85.5847 6.31513C82.3664 1.19896 81.9539 0.538811 81.665 0.373773V0.25H83.6455H85.5434V0.373773C85.3371 0.497551 85.791 1.24022 86.905 3.09689C87.4826 4.08712 88.1427 5.15986 88.5553 5.86127H88.5966C88.9679 5.1186 89.5868 4.16964 90.247 3.13816C91.4022 1.24022 91.8973 0.456292 91.691 0.373773V0.25H93.6715Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M115.918 0.207031H117.61V0.330811C117.363 0.495848 117.156 1.15599 115.671 5.73578L112.783 14.359H112.37C108.616 7.17987 108.12 6.10712 107.749 5.24067C107.378 6.14838 106.883 7.26238 103.046 14.359H102.633L99.7861 5.73578C98.2595 1.19725 98.0532 0.454589 97.8057 0.330811V0.207031H99.6211H101.436V0.330811C101.189 0.454589 101.436 1.156 102.509 4.62178C103.004 6.2309 103.293 7.13861 103.541 8.17009H103.582C103.995 7.22113 104.448 6.27216 105.274 4.58053C106.181 2.93015 107.048 1.48607 107.625 0.330811H108.038C108.657 1.44481 109.441 2.84763 110.472 4.62178C111.215 6.14838 111.71 7.17987 112.123 8.08757H112.164C112.453 7.01483 112.7 6.14838 113.113 4.7043C114.186 1.11473 114.474 0.454589 114.227 0.330811V0.207031H115.918Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M123.839 0.25H125.613V0.373773C125.365 0.538811 125.365 1.19897 125.365 6.02631V7.9655H125.324C125.324 13.1229 125.324 13.7831 125.613 13.9894V14.1131H123.839H122.023V13.9894C122.312 13.7831 122.312 13.1642 122.312 8.00676V6.02631C122.312 1.19897 122.312 0.538811 122.065 0.373773V0.25H123.839Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M141.746 12.5831C138.735 8.8698 138.363 8.4572 138.116 8.08587V8.0446C138.446 7.92083 138.9 7.67327 139.271 7.42571C140.014 6.97186 140.963 5.89912 140.963 4.24874C140.963 1.89696 139.23 0.865473 137.992 0.494139C137.084 0.246582 136.135 0.164062 134.98 0.164062C134.444 0.164062 133.577 0.164065 133.082 0.205324C132.504 0.205324 131.968 0.246586 131.597 0.246586V0.370359C131.844 0.452878 131.844 1.19555 131.844 6.0229V7.96209C131.844 13.1195 131.844 13.9034 131.597 13.986V14.1097H133.288H134.939V13.986C134.732 13.8622 134.691 13.1195 134.691 9.32364V8.62223H135.227C136.837 10.6852 138.198 12.5006 139.353 14.0272C139.56 14.0685 139.807 14.1097 140.014 14.1097H141.293H143.025V13.986C142.819 13.9034 142.2 13.202 141.746 12.5831ZM136.795 6.35297C136.383 6.55926 135.846 6.72431 135.269 6.72431C135.062 6.72431 134.856 6.72431 134.691 6.72431V2.43333C134.856 2.43333 135.145 2.39207 135.516 2.39207C137.002 2.39207 137.951 3.176 137.951 4.45504C137.951 5.44527 137.373 6.06415 136.795 6.35297Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M155.981 11.6376H156.105C156.105 12.7103 156.105 13.288 156.105 14.1131H152.185H147.688V13.9894C147.935 13.8656 147.935 13.1229 147.935 7.9655C147.935 7.9655 147.894 6.02631 147.894 6.02631C147.894 1.19897 147.894 0.456292 147.646 0.373773V0.25H151.814H155.898C155.898 1.03393 155.898 1.65282 155.898 2.72556H155.775C155.651 2.51927 154.743 2.478 153.505 2.478H150.906V5.98505H153.464C154.702 5.98505 155.114 5.98505 155.238 5.86127H155.321V7.0578V8.33683H155.238C155.114 8.21306 154.702 8.1718 153.505 8.1718H150.906V11.5138C150.906 11.6788 150.906 11.7614 151.03 11.8439C152.061 11.8439 153.464 11.8439 154.413 11.8439C155.279 11.8439 155.816 11.8026 155.981 11.6376Z" />
  </svg>
);

export const ImagePlusIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="M16 5h6M19 2v6" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </svg>
);
