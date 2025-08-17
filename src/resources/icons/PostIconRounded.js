import { SVGProps } from 'react';

const PostIconRounded = (props: SVGProps<SVGSVGElement>) => (
  
    <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
  >
    <circle cx={13.5} cy={8.5} r={1.5} fill="#000" />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="M13 12h4M13 15h4"
    />
    <path
      stroke="#000"
      strokeWidth={2}
      d="M9 17.333A2.667 2.667 0 0 0 11.667 20H18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-6.333A2.667 2.667 0 0 0 9 6.667"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="m6 8 3.922 3.922a.12.12 0 0 1 .007.162v0M6 16l3.929-3.915m0 0c-.07.082-4.648.034-6.929 0"
    />
  </svg>
);


export default PostIconRounded;

