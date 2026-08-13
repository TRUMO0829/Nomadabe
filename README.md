# Nomadabe Travel

Улаанбаатарт төвтэй аяллын компанийн вебсайт. Бизнес аялал, олон улсын үзэсгэлэн
(expo), амралт зугаалга, захиалгат аялал болон виллагийн хүсэлтийг нэг дороос
хүлээн авч, админ самбараас удирддаг.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase · Resend

## Ажиллуулах

```bash
npm ci
cp .env.example .env.local   # утгуудыг бөглөнө
npm run dev                  # http://localhost:3000
```

Supabase тохируулаагүй үед сайт `data/` доторх локал JSON файлаар ажиллана
(зөвхөн хөгжүүлэлтэд). Production-д Supabase заавал шаардлагатай.

## Скриптүүд

| Команд | Үүрэг |
| --- | --- |
| `npm run dev` | Хөгжүүлэлтийн сервер |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (нэг удаа) |
| `npm run test:watch` | Vitest watch горим |
| `npm run kb:import` | Мэдлэгийн санг Supabase руу импортлох |

## Өгөгдлийн сан

Supabase SQL Editor дээр `supabase/schema.sql`-ийг ажиллуулна. Файл нь
idempotent — шинэчлэл гарах бүрд бүтнээр нь дахин ажиллуулж болно.

**Чухал:** уг файл бүх хүснэгтэд Row Level Security идэвхжүүлдэг. Сайт бүх
хандалтаа service role key-ээр, зөвхөн сервер талаас хийдэг тул policy
нэмэх шаардлагагүй. RLS-г унтраавал браузерт ил байдаг anon key-ээр админы
нэвтрэх код болон хэрэглэгчийн мэдээлэл задарна.

## Орчны хувьсагчид

Бүрэн жагсаалт `.env.example`-д. Хамгийн чухлууд:

| Хувьсагч | Тайлбар |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Өгөгдлийн сан. Гурвуулаа байхгүй бол Supabase унтарсанд тооцно |
| `ADMIN_EMAILS` | Админ эрхтэй и-мэйлүүд (таслалаар) |
| `ADMIN_SESSION_SECRET` | Production-д **заавал**. Админ session-ийг гарын үсэглэнэ |
| `ADMIN_SESSION_VERSION` | Нэмэгдүүлбэл олгогдсон бүх админ session хүчингүй болно |
| `RESEND_API_KEY`, `MAIL_FROM` | И-мэйл илгээлт. Байхгүй бол мэйл зөвхөн логт бичигдэнэ |
| `INQUIRY_NOTIFICATION_EMAILS` | Шинэ хүсэлт ирэхэд мэдэгдэл очих хаягууд |
| `NEXT_PUBLIC_SITE_URL` | sitemap, robots, OpenGraph-д хэрэглэх домэйн |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Serverless instance хооронд нийтлэг rate limit. Байхгүй бол instance тус бүрд |

## Бүтэц

```
src/app/          Хуудас ба API route-ууд (App Router)
  admin/          Админ самбар — server action дээр суурилсан
  api/            JSON API. Хариулт бүр { ok, data } | { ok, error }
src/components/   UI компонентууд (ихэнх нь "use client")
src/lib/          Домэйн логик
  server/         Зөвхөн сервер талд ажиллах модулиуд (Supabase, мэйл, auth)
supabase/         schema.sql
```

### Хэд хэдэн зарчим

- **Supabase-д зөвхөн серверээс ханддаг.** Service role key браузерт хэзээ ч
  гардаггүй. Хөтөч дээрх anon key нь зөвхөн `/auth/v1/*` эцсийн цэгүүдэд.
- **Админ эрх и-мэйлийн нэг удаагийн кодоор.** Хэрэглэгчийн нууц үг админ
  session олгодоггүй.
- **Сэтгэгдэл модерацтай.** Нэвтрэлтгүйгээр илгээгддэг тул админ баталтал
  нүүр хуудсанд харагдахгүй.
- **Бичилт нь мөр тус бүрээр.** Нэг аялал засахад бүх хүснэгт дахин
  бичигддэггүй — зэрэг ажиллаж буй админуудын өөрчлөлт үл алдагдана.
- **Кэш.** Нийтийн хуудсууд ISR (5 мин), админ үйлдэл бүр `revalidatePath`
  дуудаж шууд шинэчилдэг.

## Deploy

Vercel дээр. Deploy хийхээс өмнө:

1. `supabase/schema.sql`-ийн сүүлийн хувилбарыг ажиллуулсан эсэх
2. Дээрх орчны хувьсагчдыг тохируулсан эсэх
3. `npm run lint && npm test && npm run build` амжилттай өнгөрсөн эсэх

`/api/health` нь тохиргооны төлөвийг (Supabase, мэйл, rate limit) буцаана.
