# Intelligent μWave Energy Center

서울시립대학교 전자전기컴퓨터공학부 **지능형 전파-에너지 연구센터(IMEC)** 홈페이지.

**https://mwuos.github.io/**

> 학교 도메인(`iuec.uos.ac.kr`)은 신청 예정입니다.

---

# 콘텐츠 수정하기

**코드를 몰라도 됩니다.** 논문·구성원·소식은 `content/` 폴더의 JSON 파일에만 들어 있습니다.
이 파일들만 고치면 사이트가 따라옵니다. 화면을 만드는 코드는 건드릴 필요가 없습니다.

| 고치고 싶은 것 | 파일 |
|---|---|
| 논문 목록 | `content/publications.json` |
| 구성원·졸업생 | `content/members.json` |
| 소식·공지 | `content/news.json` |
| 연구 분야 | `content/research.json` |
| 특허 | `content/patents.json` — 제목·영문 제목·번호는 KIPRIS 기록 그대로. `status`가 `registered`(등록)인 특허만 논문/특허 페이지의 Patents 탭에 나오고, `filed`(출원 중)는 기록으로만 둔다 |
| 연구실 이름·주소·연락처 | `content/site.json` |

## 가장 쉬운 방법 — 브라우저에서 바로 고치기

git을 설치하지 않아도 됩니다.

1. GitHub에서 고칠 파일을 연다 (예: `content/publications.json`)
2. 오른쪽 위 **연필 아이콘**(Edit this file)을 누른다
3. 내용을 고친다
4. 아래 **Commit changes** 를 누른다

커밋하면 자동 검사가 돌아갑니다. **형식이 틀리면 빨간 X가 뜨고 어디가 틀렸는지 알려줍니다.**
초록색 체크가 뜨면 정상입니다.

---

## 논문 추가하기

`content/publications.json` 의 **맨 위**에 항목을 하나 넣습니다. 순서는 상관없지만
(사이트가 연도순으로 정렬합니다) 최근 것을 위에 두면 찾기 쉽습니다.

```json
{
  "id": "hong2026-metasurface",
  "type": "journal",
  "title": "A Reconfigurable Metasurface for Wireless Power Transfer",
  "authors": ["Gildong Hong", "Minsu Kim", "Chulsoo Park"],
  "venue": "IEEE Transactions on Antennas and Propagation",
  "year": 2026,
  "volume": "74",
  "pages": "1234-1240",
  "doi": "10.1109/TAP.2026.1234567",
  "url": "",
  "pdf": "",
  "code": "",
  "award": null,
  "sci": true,
  "highlight": true
}
```

| 항목 | 설명 |
|---|---|
| `id` | 겹치지 않는 아무 문자열. `성2026-키워드` 형태를 권장 |
| `type` | `journal` `conference` `preprint` `patent` `thesis` 중 하나 |
| `authors` | **게재된 순서·표기 그대로.** 모든 저자가 같은 굵기로 표시됩니다 |
| `year` | 따옴표 없는 숫자. `2026` (O) / `"2026"` (X) |
| `volume` | **숫자만.** `"74"` (O) / `"vol. 74"` (X) — `vol.`은 화면에서 자동으로 붙습니다 |
| `pages` | `"1234-1240"` |
| `doi` | **식별자만.** `"10.1109/..."` (O) / `"https://doi.org/10.1109/..."` (X) — 링크는 자동 생성됩니다 |
| `award` | 수상 없으면 `null`, 있으면 `"Best Paper Award"` 처럼 |
| `sci` | 게재 당시 SCI(E) 등재 저널이면 `true`. 논문 목록에 SCI(E) 배지가 붙습니다. 아니면 `false` |
| `highlight` | `true` 면 홈 화면에 노출됩니다. 대표 논문 2~3편만 |

모르는 항목은 `""` 로 비워두면 화면에서 알아서 빠집니다. **없는 정보를 지어내지 마세요.**

---

## 구성원 추가하기

`content/members.json`

```json
{
  "id": "gildong-hong",
  "name": "Gildong Hong",
  "role": "phd",
  "title": "Ph.D. Student",
  "photo": "/images/members/gildong-hong.jpg",
  "email": "hong@uos.ac.kr",
  "interests": ["Wireless Power Transfer", "Metasurfaces"],
  "links": { "scholar": "", "github": "", "linkedin": "", "homepage": "" },
  "joined": "2024-03",
  "left": null
}
```

| 항목 | 설명 |
|---|---|
| `role` | `pi` `postdoc` `phd` `ms` `undergrad` `staff` `alumni` 중 하나. 이 순서대로 화면에 묶입니다 |
| `photo` | 사진이 없으면 `null` (빈 자리에 사람 모양 그림이 나갑니다). 있으면 아래 "사진 넣기" 참고. 세로 3:4로 잘려 보이니 증명사진처럼 얼굴이 위쪽 가운데 오는 사진이 좋습니다 |
| `joined` | `"2024-03"` 형태(YYYY-MM). 모르면 `null` |
| `links` | 없는 것은 `""` 로 두면 화면에서 빠집니다 |

### 졸업 처리

**항목을 지우지 마세요.** 두 곳만 고칩니다.

```json
"role": "alumni",
"left": "2026-02",
"title": "M.S. 2026 — Samsung Electronics"
```

진로 정보는 `title` 에 적습니다. 상단 메뉴의 Alumni(졸업생) 페이지에 따로 모입니다.

---

## 소식 올리기

`content/news.json`

```json
{
  "id": "2026-09-best-paper",
  "date": "2026-09-15",
  "title": "Gildong Hong receives the Best Paper Award at APMC 2026",
  "body": "The award recognizes work on reconfigurable metasurfaces.",
  "link": ""
}
```

`date` 는 반드시 `YYYY-MM-DD` 형태입니다. 최신순으로 자동 정렬됩니다.
`link` 에 URL을 넣으면 제목 아래 링크가 생깁니다.

---

## 연구 분야

`content/research.json` — **큰 주제(연구 분야)** 아래에 **진행 중인 과제**가 들어갑니다.
홈에는 주제만 나오고, 연구 페이지에는 주제마다 그 아래 과제가 나옵니다.

```json
{
  "id": "microwave-plasma",
  "title": { "en": "Microwave Plasma Sources", "ko": "마이크로파 플라즈마" },
  "summary": { "en": "One or two sentences.", "ko": "한두 문장으로 이 분야를 설명합니다." },
  "projects": [
    {
      "id": "microwave-plasma-source",
      "title": { "en": "...", "ko": "화합물 반도체 기반 초고주파 플라즈마 소스 개발" },
      "points": { "en": ["..."], "ko": ["플라즈마 모델링 및 ... 개발"] },
      "image": { "src": "/images/research/microwave-plasma-array.png", "width": 778, "height": 300, "alt": "..." }
    }
  ]
}
```

- 진행 중인 과제가 없는 주제는 `"projects": []` 로 두면 설명만 나옵니다.
  대신 주제에 `"images": [ {...}, {...} ]` 로 사진을 넣으면 연구 페이지 설명 아래에 한 줄로 나오고,
  홈 카드에는 첫 장을 크게, 다음 두 장을 옆에 붙여 보여 줍니다. 주제 사진이 없으면 홈 카드는 첫 과제의 그림을 씁니다.
- **과제가 끝나면** 여기서 빼고 `content/past-projects.json` 에 기간과 함께 옮깁니다. 과거 프로젝트는 최신순으로 자동 정렬됩니다.
- 그림이 없으면 `"image": null`. 있으면 `width`·`height` 에 실제 파일 크기를 적습니다.

---

## 사진 넣기

1. **먼저 크기를 줄입니다.** 구성원 사진은 가로 400px 내외, 배너는 1600px 이하.
   원본 수 MB 파일을 그대로 올리면 사이트가 느려집니다.
2. `public/images/members/` 또는 `public/images/research/` 에 올립니다.
3. JSON의 `photo` / `image` 에 `/images/members/파일명.jpg` 형태로 적습니다.
   (`public` 은 경로에 넣지 않습니다)

브라우저에서 올리려면 해당 폴더에서 **Add file → Upload files**.

---

## 앨범 사진 올리기

학회 참석·연구실 행사 사진은 Album 페이지에 행사 단위로 모입니다.

1. 사진을 **가로 1600px 이하**로 줄입니다. 휴대폰 원본(수 MB)을 그대로 올리지 않습니다.
2. `public/images/album/행사이름/` 폴더를 만들어 올립니다. (예: `public/images/album/2025-apmc/`)
3. `content/album.json` 에 행사를 하나 추가합니다.

```json
{
  "id": "2025-apmc",
  "title": { "en": "APMC 2025", "ko": "APMC 2025 학회 참석" },
  "date": "2025.11",
  "photos": [
    { "src": "/images/album/2025-apmc/poster.jpg", "alt": "A student presenting a poster", "caption": { "en": "Poster session", "ko": "포스터 발표" } },
    { "src": "/images/album/2025-apmc/group.jpg", "alt": "Lab members in front of the venue" }
  ]
}
```

| 항목 | 설명 |
|---|---|
| `date` | `"2025.11"` 또는 `"2025.11.20"`. 최근 행사가 위로 정렬됩니다 |
| `photos` | **첫 번째 사진이 앨범 목록의 표지**가 됩니다. 단체 사진처럼 행사를 대표하는 사진을 맨 앞에 둡니다 |
| `alt` | 사진에 무엇이 보이는지 **영어로** 한 문장 (화면낭독기용) |
| `caption` | 크게 볼 때 아래에 나오는 설명. 없으면 빼도 됩니다 |

사진 순서는 `photos` 에 적은 순서 그대로입니다.

---

## 영어 / 한국어

사이트 상단의 **EN / KO** 버튼으로 언어를 바꿀 수 있습니다. 그래서 화면에 나오는 글은 대부분 두 언어를 함께 적습니다.

```json
"title": { "en": "Research", "ko": "연구" }
```

- 한쪽만 고치면 다른 언어 화면에는 예전 내용이 그대로 남습니다. **두 언어를 같이 고쳐 주세요.**
- 연구실 이름과 논문(`publications.json`)의 제목·저자·게재지는 번역하지 않습니다.
- 구성원 이름은 `name`(영문)과 `nameKo`(한글)에 따로 적습니다.

---

## 아직 안 정해진 값 — `TODO:`

값을 모를 때는 지어내지 말고 이렇게 남깁니다.

```json
"title": { "en": "TODO: 영문 제목", "ko": "TODO: 한글 제목" }
```

`TODO:` 로 시작하는 값은 **사이트 화면에 점선 테두리로 눈에 띄게 표시됩니다.** 일부러 그렇게 만들었습니다.
비어 보이는 사이트가 완성된 척하는 사이트보다 낫고, 무엇을 채워야 하는지 화면만 봐도 보여야 하기 때문입니다.

지금 사이트 곳곳에 노란 표시가 보이는 건 정상입니다. 내용이 들어오면 사라집니다.

---

## 형식이 틀렸을 때

커밋하면 자동 검사가 이런 메시지를 보여줍니다.

```
content/publications.json 형식이 스키마와 맞지 않습니다:
  - 0.type: Invalid option: expected one of "journal"|"conference"|"preprint"|"patent"|"thesis"
  - 0.year: Invalid input: expected number, received string
  - 1.authors: Invalid input: expected array, received undefined
```

`0.` 은 **첫 번째 항목**, `1.` 은 두 번째 항목이라는 뜻입니다 (0부터 셉니다).

가장 흔한 실수:

- 항목 사이 **쉼표** 를 빠뜨리거나, 마지막 항목 뒤에 쉼표를 남김
- 숫자를 따옴표로 감쌈 (`"2026"` → `2026`)
- 큰따옴표 대신 작은따옴표나 한글 따옴표 사용

고치고 다시 커밋하면 됩니다. 형식이 틀리면 **빌드 자체가 실패하므로 잘못된 내용이 사이트에 올라가지는 않습니다.**
배포된 사이트는 마지막으로 성공한 상태를 그대로 유지합니다.

---

# 개발

Node.js 22 이상이 필요합니다.

```bash
git clone https://github.com/MWUOS/mwuos.github.io.git
cd mwuos.github.io
npm install
npm run build     # 최초 1회 필요 (아래 참고)
npm run dev       # http://localhost:3000
```

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 타입 검사 |

> clone 직후에는 `npm run build` 를 한 번 돌려야 `typecheck` 가 통과합니다.
> Next.js 16이 라우트 타입을 빌드할 때 생성하기 때문입니다.

## 구조

```
app/           페이지 (라우트당 1폴더)
components/    재사용 UI
content/       ★ 모든 텍스트·데이터
lib/content.ts 데이터 로더 + 스키마 — 콘텐츠를 읽는 단일 진입점
public/        이미지·첨부파일
```

기술 스택은 Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · zod 입니다.
정적 사이트로 빌드되므로 서버가 필요 없습니다.

## 기여

코드를 고치기 전에 [CLAUDE.md](CLAUDE.md) 를 읽어 주세요. 스택 결정, 콘텐츠 스키마,
커밋 메시지 규칙, 정적 export 제약이 모두 거기 있습니다.

할 일과 결정 사항은 [Issues](https://github.com/MWUOS/mwuos.github.io/issues) 에서 관리합니다.
