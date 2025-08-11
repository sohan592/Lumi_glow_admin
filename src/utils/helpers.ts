export const getBreakpoint = () => {
  const width = window.innerWidth;

  if (width >= 1536) {
    return '2xl';
  } else if (width >= 1280) {
    return 'xl';
  } else if (width >= 1024) {
    return 'lg';
  } else if (width >= 768) {
    return 'md';
  } else if (width >= 640) {
    return 'sm';
  } else {
    return 'xs';
  }
};

export const capitalize = (s: string) => {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};
