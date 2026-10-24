# ✦ TGC (The Grateful Camp)

> **Be Grateful. Be Yourself.**
> 신안 짱뚱어해수욕장에서 열리는 캠핑 뮤직 페스티벌 **The Grateful Camp**의 모바일 앱입니다.

라인업과 타임테이블을 보고, 보고 싶은 공연을 저장하고, 현장 파트너(F&B·액티비티·셀러)와 공지를 한 곳에서 확인할 수 있어요.
웹으로 먼저 만들고, 나중에 iOS/Android 앱으로 감싸서 출시하는 **하이브리드 앱**입니다.

🔗 **https://tgc-1ga.pages.dev** — 폰으로 열어 보세요

## ✨ 주요 기능

### 🏠 홈 (`/`)
- 페스티벌 메인 카드, 관람권·캠핑권 예매와 공식 MD 스토어 바로가기
- 최근 공지 3개 (고정 공지 먼저)

### 🎤 프로그램 (`/program`)
- **Line Up / Experience** 로 나눠 보는 아티스트·체험 프로그램
- 아티스트 상세에서 **Apple Music · Spotify · YouTube** 바로 듣기 (링크가 없으면 검색 결과로 연결)
- 타임테이블에 잡힌 공연 일정 표시

### 🕒 타임테이블 (`/timetable`)
- 날짜별 · **스테이지별 그리드** (BIG BIRD / PARADISE POOL / COSMOS / BEACHSIDE)
- 자정이 넘는 공연은 포스터처럼 `25:00` 으로 표시, 페스티벌 중엔 **현재 시각 빨간 줄**
- ⭐ **내 타임테이블**: 공연을 눌러 별로 저장하고, MY 보기로 저장한 공연만 모아 보기

### 🛖 파트너스 (`/partners`)
- **F&B / Activity / Seller** 목록과 상세 (인스타그램 연결)

### ☰ 더보기 (`/more`)
- 공지사항 목록·상세, Q&A (카테고리 필터 아코디언), 공식 사이트 News

## 🛠 기술 스택

| 영역 | 사용 |
|---|---|
| 사용자 앱 | React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router |
| 백엔드 | **Supabase** (PostgreSQL + RLS) — 별도 서버 없이 앱에서 바로 조회 |
| 배포 | **Cloudflare Pages** (`main` push 시 자동 배포, 브랜치마다 미리보기 주소) |
| 앱 전환 (예정) | Capacitor 또는 React Native 웹뷰 |
| 푸시 (예정) | FCM |

## 📁 프로젝트 구조

```text
tgc/
├─ app/                     사용자 앱
│  ├─ public/_redirects     새로고침해도 404 안 나게 (SPA 라우팅)
│  └─ src/
│     ├─ pages/             화면 (Home, Timetable, Program…, Partner…, Notice…, Faq, More)
│     ├─ components/        공통 부품 (TabBar, PageHeader, CardGrid, BottomSheet, Toast…)
│     └─ lib/               Supabase 조회 함수, 날짜·시간 계산, 내 타임테이블 저장
├─ db/                      Supabase 테이블 만드는 SQL
└─ admin/                   어드민 (React + Refine) — 3단계에서 추가 예정
```

## 🚀 시작하기

### 1. 패키지 설치 · 환경 변수

```bash
cd app
npm install
cp .env.example .env   # Supabase 대시보드 > Project Settings > API 에서 URL, publishable key 복사
```

| 변수 | 설명 |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` (뒤에 `/rest/v1/` 붙이지 않기) |
| `VITE_SUPABASE_ANON_KEY` | publishable(anon) 키 — **service_role 키는 절대 X** |

### 2. 데이터베이스 준비

Supabase **SQL Editor** 에서 아래 순서대로 실행합니다. (⚠️ 처음 한 번만 — 다시 실행하면 테이블이 초기화돼요)

| 순서 | 파일 | 테이블 |
|---|---|---|
| 1 | `db/notice.sql` | 공지사항 |
| 2 | `db/faq.sql` | Q&A |
| 3 | `db/partner.sql` | 파트너스 (F&B·액티비티·셀러) |
| 4 | `db/program.sql` | 프로그램 (라인업·익스피리언스) |
| 5 | `db/timetable.sql` | 스테이지 · 공연 (`program` 이 먼저 있어야 함) |

모든 테이블은 **RLS** 가 켜져 있어서 앱(publishable 키)에서는 **읽기만** 가능합니다.
데이터 추가·수정은 Supabase Table Editor에서 (어드민 만들기 전까지).

### 3. 개발 서버

```bash
npm run dev            # http://localhost:5173
npm run dev -- --host  # 같은 와이파이의 폰에서 접속
npm run build          # 타입 검사 + 빌드
npm run lint           # oxlint
```

## 🌐 배포

GitHub `main` 에 push하면 Cloudflare Pages가 자동으로 빌드·배포합니다.

- 설정: Root `app` · Build `npm run build` · Output `dist`
- 환경 변수는 Cloudflare **Settings → Variables and Secrets** 에 Production / Preview 각각 입력
- Vite는 환경 변수를 **빌드할 때** 넣기 때문에, 변수를 바꾸면 다시 배포해야 반영돼요

작업은 `feat/…` 브랜치에서 하고 `main` 에 합칩니다. 브랜치를 push하면 `https://<브랜치이름>.tgc-1ga.pages.dev` 미리보기가 생겨요.

## 🗺 로드맵

- [x] **1단계** 뼈대 — 프로젝트 세팅, 탭바, Supabase 연결, Cloudflare 배포
- [x] **2단계** 핵심 화면 — 공지, Q&A, 프로그램, 파트너스, 타임테이블, 내 타임테이블 *(홈 "오늘의 공연" 남음)*
- [ ] **3단계** 어드민 — 관리자 로그인, 콘텐츠 관리, 매장 직원용 호출 화면
- [ ] **4단계** 앱 전환 & 알림 — iOS/Android, 공연 10분 전 알림, 공지 푸시, 카카오/애플 로그인
- [ ] **5단계** 실시간 — 셔틀 위치, **F&B 음식 나오면 호출 알림**
- [ ] **6단계** 출시 준비 — 오프라인 대응, 부하 테스트, 스토어 심사
