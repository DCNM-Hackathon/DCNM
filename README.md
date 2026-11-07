# DC&M 동아리 웹사이트

Next.js App Router · React · TypeScript · Tailwind CSS. Vercel에서 Node.js 런타임으로 배포합니다.

## 실행과 검증

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

페이지: `/`, `/members`, `/projects`, `/apply`. 지원 API: `POST /api/apply`.

## Google Sheets 설정

API 키만으로는 비공개 시트에 지원서를 쓸 수 없습니다. Google 서비스 계정 인증을 사용합니다. [Google Sheets 쓰기 API 공식 문서](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)를 기준으로 구현했습니다.

1. Google Cloud 프로젝트에서 Google Sheets API를 활성화합니다.
2. 서비스 계정과 키를 생성합니다. 키 파일을 저장소에 추가하지 마세요.
3. 대상 스프레드시트를 서비스 계정 이메일에 편집자 권한으로 공유합니다.
4. `Applications` 탭을 만들고 첫 행에 다음 열을 넣습니다.
   `접수일시 | 이름 | 학번 | 학과 | 연락처 | 이메일 | 분야 | 지원동기 | 포트폴리오 | 개인정보동의 | 검토상태`
5. Vercel 프로젝트의 Settings → Environment Variables에 다음 값을 등록합니다. 로컬은 `.env.local`에 설정합니다.

| 변수                         | 값                                                    |
| ---------------------------- | ----------------------------------------------------- |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | 서비스 계정 이메일                                    |
| GOOGLE_PRIVATE_KEY           | 서비스 계정 private_key. 줄바꿈 또는 리터럴 `\n` 지원 |
| GOOGLE_SHEETS_ID             | 스프레드시트 URL의 ID                                 |
| GOOGLE_SHEETS_TAB            | 선택. 기본값 Applications                             |

인증값은 서버에서만 사용하며 브라우저에 노출하지 않습니다. `RAW` 쓰기로 수식 실행을 방지합니다. 서버/클라이언트 검증, 동일 출처 확인, 숨김 봇 필드를 적용했습니다. 설정 누락은 503, 저장 실패는 502를 반환하며 성공으로 표시하지 않습니다. 외부 API 호출 전까지 입력을 로그나 로컬에 저장하지 않습니다.

실서비스 공개 전 Vercel Firewall의 지원 API 요청 제한 규칙을 설정하고, 운영진이 실제 개인정보 보관·파기 절차와 모집 일정을 확정해야 합니다. 현재 예시 보관 문구를 운영 정책에 맞게 검토하세요.

## Vercel 배포

저장소를 Vercel로 Import → Framework Preset: Next.js → 환경변수 등록 → Deploy. 또는 Vercel CLI가 로그인된 환경에서 `npx vercel`로 배포합니다. 별도 vercel.json은 필요하지 않습니다.

## 콘텐츠와 에셋

- `lib/data.ts`: 멤버 12명, 트랙, 프로젝트 예시 데이터. 운영진 예시는 `app/members/page.tsx`에서 수정합니다.
- 모집 일정과 인원은 임의 확정하지 않았습니다. `app/apply/page.tsx`에서 확정 후 수정하세요.
- 첨부 로고 파일이 작업 디렉터리에 제공되지 않아 `public/images/logo.svg`는 첨부 형태를 참고해 재구성한 임시 벡터입니다. 원본 파일로 교체해야 정확한 브랜드 로고가 됩니다.
- 활동 이미지는 Unsplash 외부 URL을 사용하는 예시입니다. 실제 동아리 활동 사진으로 교체를 권장합니다. 외부 네트워크가 필요합니다.
- Noto Sans KR을 Google Fonts에서 불러옵니다. 외부 폰트 요청이 실패하면 시스템 글꼴로 표시됩니다.
- 예시 프로젝트 상세는 대화상자로 열립니다. 필터, 모바일 메뉴, FAQ, 지원서 입력 상태 및 오류 안내를 지원합니다.
- PC 히어로는 로고를 표시하고 모바일은 이미지를 숨기며 버튼을 세로로 배치합니다. 프로젝트 하단 CTA는 흰색입니다.

원격 배포와 실제 시트 저장 검증은 Vercel 계정 연결 및 Google 인증 설정 후 진행해야 합니다.

## 검증 기록

프로덕션 빌드 및 TypeScript 검사 통과. 검증 스키마와 API의 잘못된 출처·JSON·본문 크기·입력값 거부를 포함한 테스트 6개 통과. 이 실행 환경의 Turbopack 로컬 포트 제한을 피하기 위해 빌드 스크립트는 Webpack을 사용합니다. 로컬 서버도 포트 사용이 차단되어 HTTP 및 실제 브라우저 화면 검수는 수행하지 못했습니다. 실제 시트 쓰기도 인증 설정 전이므로 미검증입니다.
