# TGC (The Grateful Camp)

페스티벌 하이브리드 앱 (웹 → Capacitor로 iOS/Android)

## 구조

```
tgc/
├─ app/     사용자 앱 (Vite + React + TypeScript + Tailwind)
└─ admin/   어드민 (React + Refine) — 3단계에서 추가 예정
```

## 실행

```bash
cd app
cp .env.example .env   # Supabase URL / anon key 입력
npm install
npm run dev
```
