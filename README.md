# Ақпараттық жүйелер тобының портфолиосы

Қорқыт Ата атындағы Қызылорда университетінің практика жобасы. Next.js 15, TypeScript, Tailwind CSS, NextAuth Credentials, Prisma және MySQL қолданылады.

Қорқыт Ата университетінің логотипі `public/korkyt-logo.jpg` ретінде сақталған.

## Орнату

Node.js 20.9 немесе одан жаңа нұсқасын және MySQL серверін орнатыңыз. MySQL ішінде `portfolio_db` дерекқорын құрып, `.env` файлын толтырыңыз:

```env
DATABASE_URL="mysql://root:ҚҰПИЯСӨЗ@localhost:3306/portfolio_db"
NEXTAUTH_SECRET="ұзын-кездейсоқ-құпия-мән"
NEXTAUTH_URL="http://localhost:3000"
```

`.env` файлын репозиторийге қоспаңыз. Өндірісте бөлек, қауіпсіз `NEXTAUTH_SECRET` пен басқарылатын MySQL қызметін қолданыңыз.

```powershell
npm install
npx prisma db push
npx prisma generate
npm run dev
```

Қосымша: Prisma Studio ашу үшін `npx prisma studio` командасын пайдаланыңыз.

## Студент аккаунтын құру

Қоғамдық тіркелу әдейі қосылмаған: аккаунттарды практика жетекшісі немесе жүйе әкімшісі жасайды. PowerShell-де мәндерді орнатып, аккаунтты хэштелген парольмен құрыңыз:

```powershell
$env:STUDENT_NAME = "Студенттің аты-жөні"
$env:STUDENT_EMAIL = "student@university.kz"
$env:STUDENT_PASSWORD = "кемінде-12-таңбалы-құпиясөз"
npm run user:create
```

Скрипт аккаунт бар болса оны өзгертпейді. Есептік деректерді студентке қауіпсіз арнамен беріңіз.

## Дерекқорсыз жергілікті demo кіру

`.env` ішінде `DEMO_LOGIN_EMAIL` және `DEMO_LOGIN_PASSWORD` орнатылған кезде, олар тек `NODE_ENV=development` режимінде dashboard интерфейсін үздіксіз көруге мүмкіндік береді. Demo аккаунттың жобалары немесе профиль өзгерістері дерекқорға жазылмайды. Бұл кіру тәсілі production-та жұмыс істемейді.

Даму режимінде MySQL қолжетімсіз болса, басты бетте `Үлгі жоба` белгісі бар үлгі карточка көрсетіледі; ол нақты жоба емес және production-та көрсетілмейді.

## Қолданба мүмкіндіктері

- `/` — жария жобалар витринасы; жобаларды атауы, сипаттамасы, авторы немесе технологиясы бойынша іздеуге, технологиямен сүзуге және күні бойынша сұрыптауға болады.
- `/login` — email және құпиясөз арқылы кіру.
- `/dashboard` — жобаларды қосу, өңдеу, өшіру және профильді жаңарту.
- `/api/projects` — ашық `GET`, тек кірген студентке арналған `POST`.
- `/api/projects/[id]` — тек жоба иесіне арналған `PUT` және `DELETE`.
- `/api/profile` — кірген студенттің профилін жаңарту.

Пароль bcryptjs көмегімен хэштеледі. Жоба/API жазбалары серверде тексеріледі; әр студент өз жобаларын ғана өңдей немесе өшіре алады.

## Vercel-де жариялау

GitHub репозиторийді Vercel-ге қосып, `main` тармағын Production Branch ретінде қолданыңыз. Railway-дегі MySQL интернеттен қосылу үшін Public TCP Proxy қолданады; оның `MYSQL_PUBLIC_URL` мәнін Vercel жобасының **Production** Environment Variables бөлімінде `DATABASE_URL` атымен сақтаңыз.

Сол жерде мына мәндерді баптаңыз:

- `DATABASE_URL` — Railway MySQL қызметіндегі `MYSQL_PUBLIC_URL`.
- `NEXTAUTH_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` командасымен жасалған құпия мән.
- `NEXTAUTH_URL` — жарияланған сайттың HTTPS домені.

Құпия мәндерді GitHub-қа немесе чатқа қоспаңыз. Railway дерекқорының схемасын жергілікті PowerShell ортасында `DATABASE_URL` мәнін Railway URL-іне уақытша орнатып, `npx prisma db push` командасымен жасаңыз. Production ортасына `DEMO_LOGIN_EMAIL`, `DEMO_LOGIN_PASSWORD` немесе `DEMO_LOGIN_NAME` қоспаңыз.

## Өндірістік тексеру

```powershell
npm run lint
npm run build
```

Әр push-тен кейін Vercel автоматты түрде жаңа deployment жасайды.
