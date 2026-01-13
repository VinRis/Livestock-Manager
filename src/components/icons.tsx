import type { SVGProps } from "react";

export function CowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18.8 6.2a2.4 2.4 0 0 0-3.2-1.2" />
      <path d="M5.2 6.2a2.4 2.4 0 0 1 3.2-1.2" />
      <path d="M12 2v2.4" />
      <path d="M12 11.2V14" />
      <path d="M10.2 14c-1.2 0-2.4.6-3.2 1.6" />
      <path d="m17 15.6-2-1.6" />
      <path d="M20.5 13.6a9.6 9.6 0 0 1-17 0" />
      <path d="M4 14.6V20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-5.4" />
      <path d="M10 18h4" />
    </svg>
  );
}

export function GoatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M15 5.6L12 3 9 5.6" />
        <path d="M12 3v4" />
        <path d="M10 10c-1.5 0-3.5.5-3.5 2.5" />
        <path d="M14 10c1.5 0 3.5.5 3.5 2.5" />
        <path d="M20 18c0-2-1.5-4-3-4h-1" />
        <path d="M7 14H6c-1.5 0-3 2-3 4" />
        <path d="M18 21a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  );
}
