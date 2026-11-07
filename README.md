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

페이지: `/`, `/members`, `/projects`, `/apply`. 지원 API(필드 + 첨부파일 전체 처리): `POST /api/apply`.

## Google Sheets 설정

API 키만으로는 비공개 시트에 지원서를 쓸 수 없습니다. Google 서비스 계정 인증을 사용합니다. [Google Sheets 쓰기 API 공식 문서](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)를 기준으로 구현했습니다.

1. Google Cloud 프로젝트에서 Google Sheets API를 활성화합니다.
2. 서비스 계정과 키를 생성합니다. 키 파일을 저장소에 추가하지 마세요.
3. 대상 스프레드시트를 서비스 계정 이메일에 편집자 권한으로 공유합니다.
4. `Applications` 탭을 만들고 첫 행에 다음 열을 넣습니다.
   `접수일시 | 이름 | 학번 | 학과 | 연락처 | 이메일 | 분야 | 지원동기 | 포트폴리오 | 개인정보동의 | 검토상태 | 첨부파일명 | 첨부파일링크`
5. Vercel 프로젝트의 Settings → Environment Variables에 다음 값을 등록합니다. 로컬은 `.env.local`에 설정합니다.

| 변수                         | 값                                                    |
| ---------------------------- | ----------------------------------------------------- |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | 서비스 계정 이메일                                    |
| GOOGLE_PRIVATE_KEY           | 서비스 계정 private_key. 줄바꿈 또는 리터럴 `\n` 지원 |
| GOOGLE_SHEETS_ID             | 스프레드시트 URL의 ID                                 |
| GOOGLE_SHEETS_TAB            | 선택. 기본값 Applications                             |
| GOOGLE_DRIVE_FOLDER_ID       | 첨부파일을 저장할 Drive 폴더 ID (아래 참고)           |
| GOOGLE_DRIVE_CLIENT_ID       | Drive 업로드용 OAuth 클라이언트 ID (아래 참고)        |
| GOOGLE_DRIVE_CLIENT_SECRET   | 위 OAuth 클라이언트 secret                            |
| GOOGLE_DRIVE_REFRESH_TOKEN   | 동아리 Gmail 계정으로 1회 발급받은 refresh token      |

인증값은 서버에서만 사용하며 브라우저에 노출하지 않습니다. `RAW` 쓰기로 수식 실행을 방지합니다. 서버/클라이언트 검증, 동일 출처 확인, 숨김 봇 필드를 적용했습니다. 설정 누락은 503, 저장 실패는 502를 반환하며 성공으로 표시하지 않습니다. 외부 API 호출 전까지 입력을 로그나 로컬에 저장하지 않습니다.

## 첨부파일(Google Drive) 설정

지원자는 `/apply` 페이지에서 지원서 양식(`public/downloads/DCM_지원서양식.doc`)을 다운로드해 작성한 뒤, 완성된 파일(pdf/doc/docx/hwp, 최대 4MB)을 업로드합니다. 구글 시트는 바이너리 파일을 저장할 수 없으므로 파일은 Google Drive에 저장하고, 시트에는 파일명과 열람 링크만 기록합니다.

브라우저는 지원서 필드와 첨부파일을 하나의 `multipart/form-data` 요청으로 `POST /api/apply`에 보냅니다. 서버가 그 파일을 받아 Drive에 업로드하고, 성공하면 같은 요청 안에서 시트에도 기록합니다(별도 업로드 API 없음).

Vercel의 Node.js Serverless Function은 요청 본문 크기에 하드 제한(약 4.5MB)이 있습니다. 브라우저에서 Google Drive로 직접 업로드하는 방식도 검토했지만, Drive 재개 가능 업로드(resumable upload)는 YouTube API 등과 달리 브라우저 간 교차 출처(CORS) 직접 업로드를 지원하지 않아 그 방식은 쓸 수 없었습니다. 그래서 서버를 경유하는 대신 **첨부파일 최대 용량을 4MB로 제한**해 Vercel 한도 안에 들어오도록 했습니다. 더 큰 파일을 지원해야 하면 Google Drive 대신 Vercel Blob처럼 브라우저 직접 업로드(CORS)를 지원하는 저장소로 바꾸는 것을 고려하세요.

### 왜 서비스 계정이 아니라 OAuth인가

Drive API 호출에는 Sheets와 다른 인증을 씁니다. 일반 서비스 계정은 자체 저장 용량이 0이라, 공유 드라이브(Shared Drive) 없이는 업로드가 `storageQuotaExceeded`로 실패합니다. 공유 드라이브는 Google Workspace 전용 기능이라 개인 Gmail 계정(`@gmail.com`)으로는 만들 수 없습니다. 따라서 동아리가 일반 Gmail 계정을 쓰는 경우, **그 계정 본인 명의로 OAuth 인증해 그 계정의 내 드라이브(My Drive)에 업로드**하는 방식을 씁니다(Sheets 쓰기는 기존 서비스 계정 인증을 그대로 사용합니다).

### 설정 방법

1. Google Cloud 콘솔에서 Google Drive API를 활성화합니다.
2. **OAuth 동의 화면**을 만듭니다. User type은 External, 앱 게시 상태는 **"프로덕션(In production)"**으로 설정하세요. ("테스트" 상태로 두면 refresh token이 7일마다 만료되어 재인증이 필요합니다. "프로덕션" + 미검증 상태는 Drive 같은 민감 범위에도 허용되며, 이 앱은 동아리 계정 1개만 인증하므로 Google 검증 절차 없이도 충분합니다. 로그인 시 "확인되지 않은 앱" 경고가 뜨는데, 본인 동아리 계정으로 인증하는 것이므로 계속 진행하면 됩니다.)
3. **사용자 인증 정보 → OAuth 클라이언트 ID**를 만듭니다. 애플리케이션 유형은 **웹 애플리케이션**을 선택하고, "승인된 리디렉션 URI"에 `https://developers.google.com/oauthplayground`를 추가합니다(OAuth Playground로 refresh token을 발급받으려면 이 URI가 등록돼 있어야 합니다. "데스크톱 앱" 유형은 Playground에서 `redirect_uri_mismatch` 오류가 납니다). 생성된 클라이언트 ID·secret을 `GOOGLE_DRIVE_CLIENT_ID`, `GOOGLE_DRIVE_CLIENT_SECRET`에 저장합니다.
4. OAuth 동의 화면의 "브랜딩"에 앱 이름/지원 이메일 등 최소 정보를 채우고, "대상"에서 테스트 중인 계정을 **테스트 사용자**로 추가합니다(또는 2번에서 이미 프로덕션으로 게시했다면 생략).
5. Refresh token을 한 번 발급받습니다. [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)를 사용합니다.
   - 우측 상단 톱니바퀴(Settings) → "Use your own OAuth credentials" 체크 → 위에서 만든 Client ID/secret 입력
   - 왼쪽에서 범위(scope)로 `https://www.googleapis.com/auth/drive.file`을 직접 입력해 추가 → **Authorize APIs**
   - 파일을 저장할 그 계정으로 로그인해서 동의합니다(동아리 계정이면 동아리 계정, 테스트면 테스트 계정).
   - "확인되지 않은 앱" 경고가 뜨면 고급 → 이동(안전하지 않음)으로 계속 진행합니다.
   - **Exchange authorization code for tokens** 클릭 → 나온 **Refresh token** 값을 복사해 `GOOGLE_DRIVE_REFRESH_TOKEN`에 저장합니다.
6. 업로드 대상 계정의 내 드라이브에서 지원서를 모아둘 폴더를 하나 만들고, 폴더 URL(`.../folders/<ID>`)에서 ID를 복사해 `GOOGLE_DRIVE_FOLDER_ID`에 설정합니다.
7. 운영진은 주기적으로 해당 Drive 폴더에서 접수된 지원서 파일을 확인·정리합니다. 지원서 접수(시트 기록)에 실패한 경우에도 파일 자체는 Drive에 남을 수 있습니다(고아 파일); 필요 시 수동 정리하세요.
8. refresh token은 그 계정 비밀번호에 준하는 민감정보입니다. 저장소에 커밋하지 말고 Vercel 환경변수/`.env.local`에만 두세요. 유출되면 Google 계정의 [연결된 앱](https://myaccount.google.com/connections)에서 해당 앱 접근 권한을 해제하고 다시 발급하면 됩니다.

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
- `public/downloads/DCM_지원서양식.doc`: 지원자가 다운로드하는 지원서 양식 원본. 양식을 교체하면 이 파일만 같은 이름으로 덮어쓰면 됩니다.
- PC 히어로는 로고를 표시하고 모바일은 이미지를 숨기며 버튼을 세로로 배치합니다. 프로젝트 하단 CTA는 흰색입니다.

원격 배포와 실제 시트 저장 검증은 Vercel 계정 연결 및 Google 인증 설정 후 진행해야 합니다.

## 검증 기록

프로덕션 빌드 및 TypeScript 검사 통과. 검증 스키마와 `/api/apply`(multipart 요청)의 잘못된 출처·본문 크기·악성 body·첨부파일 형식/용량·필드 입력값 거부를 포함한 테스트 12개 통과. 이 실행 환경의 Turbopack 로컬 포트 제한을 피하기 위해 빌드 스크립트는 Webpack을 사용합니다. 로컬 서버에서 실제 브라우저로 `/apply` 폼을 확인했습니다: 양식 다운로드 링크, 파일 선택, 필드별 유효성 오류 표시, 첨부파일 누락/크기초과 오류 메시지, Google 인증 미설정 시 503 메시지까지 정상 동작을 확인했습니다. Google 인증(Sheets·Drive)을 설정한 뒤의 실제 시트 저장·Drive 업로드 성공 경로는 사용자 환경에서 직접 발급한 자격증명으로 검증이 진행 중입니다.
