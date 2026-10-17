export function Icon({ name, size = 22, ...props }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    receipt: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 7h6M9 11h6M9 15h3" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    arrow: <path d="m14 6-6 6 6 6M8 12h13" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    heart: (
      <path d="M20.5 5.5a5 5 0 0 0-8.5 2 5 5 0 0 0-8.5-2C0 10 6 15 12 20c6-5 12-10 8.5-14.5Z" />
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    flame: (
      <path d="M13 3c1 5-4 5-2 9 2 0 4-2 4-4 7 7 3 13-3 13-7 0-11-7-5-13 0 3 1 4 2 4-2-5 4-6 4-9Z" />
    ),
    burger: (
      <>
        <path d="M4 10a8 8 0 0 1 16 0H4ZM3 14h18M4 17h16l-1 4H5l-1-4Z" />
        <path d="M9 6h.01M14 7h.01" />
      </>
    ),
    drink: (
      <>
        <path d="M6 8h12l-2 13H8L6 8ZM13 8l2-6h5M5 8h14" />
      </>
    ),
    snack: <path d="M12 3C10 8 3 12 4 17c1 6 15 6 16 0 1-5-6-9-8-14Z" />,
    sweet: (
      <>
        <path d="m6 13 2 8h8l2-8H6Z" />
        <path d="M6 13a4 4 0 0 1 2-7 4 4 0 0 1 8 0 4 4 0 0 1 2 7" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="8" cy="6" r="2" fill="currentColor" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="10" cy="18" r="2" fill="currentColor" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    chat: <path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z" />,
    bell: (
      <>
        <path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H4v16h6M9 12h12m-4-4 4 4-4 4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.bag}
    </svg>
  );
}
