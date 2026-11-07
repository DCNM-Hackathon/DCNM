/**
 * DC&M 로고 (인라인 SVG)
 * 남색 D·M 부분은 CSS 변수 --logo-ink 를 따라가서
 * 라이트/다크 모드에 맞게 자동으로 색이 바뀝니다. (이미지 파일 2개가 필요 없음)
 * gradientId: 한 페이지에 로고가 여러 개 있을 때 겹치지 않도록 서로 다른 값을 넘겨주세요.
 */
export default function Logo({
  width,
  height,
  label,
  gradientId = "dcm-logo-gradient",
}: {
  width: number;
  height: number;
  label?: string;
  gradientId?: string;
}) {
  return (
    <svg
      className="logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 340 380"
      width={width}
      height={height}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="90"
          y1="0"
          x2="270"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#13a7ad" />
          <stop offset="1" stopColor="#00999c" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M170 20 310 101 277 121 170 60 90 106 55 85ZM55 264l115 67v40L20 284Zm45-42 70 41 98-57 35 20-133 77-105-61Z"
      />
      <path
        fill="var(--logo-ink, #0a2c4d)"
        fillRule="evenodd"
        d="m20 108 65-38c65-36 111 7 97 69-6 25-25 45-51 60L20 264V108Zm35 20v76l65-38c39-23 29-92-14-68l-51 30Z"
      />
      <path
        fill="var(--logo-ink, #0a2c4d)"
        d="m170 211 35-20 39 52 66-134v162l-36 21v-77l-26 58-22 13-20-29v93l-36 21V211Z"
      />
    </svg>
  );
}
