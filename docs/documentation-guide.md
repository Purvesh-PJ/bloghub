# Documentation Guide

> **Scope:** ye docs set kaise organize hota hai — naming vocabulary, growth ladder, aur
> "ye file kahan rakhun" ka rule.
> **Ye file reusable hai** — kisi bhi naye project mein ise copy karke wahi structure follow
> kar sakte ho.
>
> *(Baaki saare docs English mein hain. Ye file jaan-boojh kar Hinglish mein hai kyunki ye
> team ki internal convention guide hai, product documentation nahi.)*

---

## Ek line ka rule

> **Folder ka naam batata hai "kis liye aaye ho", file ka naam batata hai "kya milega".**

Jo naam kholne se pehle samajh na aaye, wo galat naam hai. Bas yahi ek rule hai — baaki sab
isi ka detail hai.

---

## 1. Naming vocabulary

Ye naam industry mein instantly pehchane jaate hain. **Naye naam invent mat karo** — inhi
mein se uthao.

| File | Kis sawaal ka jawab deti hai |
|------|------------------------------|
| `README.md` | Ye kya hai, chalau kaise |
| `getting-started.md` | Pehli baar setup, step by step |
| `development.md` | Rozana ka workflow, conventions, kahan file rakhun |
| `architecture.md` | System kaise bana hai, aur aisa kyun |
| `api.md` | Har endpoint |
| `configuration.md` | Har env var / setting |
| `database.md` | Schema, relations, indexes |
| `design-system.md` | Tokens, components, UI rules |
| `testing.md` | Kaise test karun, kya test karun |
| `deployment.md` | Ship kaise hota hai |
| `troubleshooting.md` | Symptom → fix |
| `runbook.md` | Production chal raha hai / toot gaya |
| `roadmap.md` | Kya planned hai, kya toota hua hai |
| `code-quality.md` | Lint, format, type tooling |
| `adr/0001-title.md` | Ek decision, ek file |

### Ye naam kabhi mat use karo

`notes.md` · `info.md` · `misc.md` · `general.md` · `technical.md` · `guide.md` ·
`structure.md` · `details.md` · akela `overview.md`

Wajah ek hi hai — inhe **kholna** padta hai tab pata chalta hai andar kya hai. Naam ka kaam
hi yahi hai ki kholna na pade.

---

## 2. Growth ladder

Har baar "kaunsa structure" sochna band karo. Sahi sawaal hai **"main kis stage pe hoon"** —
aur uska trigger mechanical hai, taste nahi.

### Stage 1 — chhota project (1–2 dev, prototype)

`docs/` folder banao hi mat.

```
README.md          ← setup + architecture sketch + API summary, sab isi mein
CONTRIBUTING.md
CHANGELOG.md
LICENSE
```

**Trigger to Stage 2:** README ~300 lines cross kar gaya, ya cheez dhoondhne ke liye scroll
karna pad raha hai.

### Stage 2 — real web app *(90% projects yahin rehte hain)*

**Flat rakho. Folders mat banao.**

```
README.md
CONTRIBUTING.md · CHANGELOG.md · SECURITY.md · LICENSE
docs/
├── README.md              ← index: kaunsi file kis liye
├── getting-started.md
├── architecture.md
├── api.md
├── configuration.md
├── deployment.md
├── testing.md
└── troubleshooting.md
```

Aath files, zero nesting. Koi bhi banda `docs/` khole to turant samajh jaaye.

**Trigger to Stage 3:** koi ek file ~500 lines cross kare, **ya** `docs/` mein 12 se zyada
files ho jaayein.

### Stage 3 — bada / multi-team

Ab folders banao — aur yahi naam:

```
docs/
├── README.md
├── guides/          "mujhe kuch karna hai"
├── reference/       "mujhe kuch dekhna hai"
├── architecture/    "ye aisa kyun bana hai"
└── operations/      "chal raha hai / toot gaya"
```

**`guides/` + `reference/` ka split hi asli industry standard hai** — Docker ("Guides /
Manuals / Reference"), Kubernetes ("Tasks / Concepts / Reference"), Stripe ("Guides / API
reference"), React ("Learn / Reference") sab yahi karte hain. Isko kisi ko samjhaana nahi
padta.

Zaroorat ho to domain folders saath mein add kar sakte ho — jaise `product/` ya `security/`.
Sab kuch upar wale 4 mein fit karne ki koshish mat karo.

---

## 3. "Ye file kahan rakhun" — 4 sawaal

```
Step-by-step kuch karne ka tarika hai?          → guides/
Lookup table hai (endpoints, vars, schema)?     → reference/
"Aisa kyun hai" explain karta hai?              → architecture/
Production chalne/tootne se related hai?        → operations/
```

- **Do mein fit ho raha hai** → file bahut badi hai, todo.
- **Kisi mein fit nahi ho raha** → shayad file ki zaroorat hi nahi.

---

## 4. Maintenance rules

Structure se zyada important ye 5 rules hain. Inke bina koi bhi structure 6 mahine mein sad
jaata hai.

1. **Ek subject, ek file.** Do files ka scope overlap kare to merge kar do. Har subject ka ek
   hi "owner" doc hona chahiye — baaki usse link karein, dobara na likhein.

2. **Har file ki pehli line** batati hai wo kya cover karti hai **aur kya nahi**:

   ```markdown
   > **Scope:** ye doc kya own karta hai.
   > **Excludes:** kya kahin aur hai, uska link.
   ```

   Isse reader ko turant pata chalta hai galat file kholi ya sahi.

3. **Docs code ke same PR mein update.** Alag "docs update karna hai" task banaya to kabhi
   nahi hoga.

4. **Feature delete → uski doc bhi delete.** Purani doc, doc na hone se bhi zyada khatarnak
   hai.

5. **Jo cheez exist nahi karti, uski file mat banao.** Wo `roadmap.md` mein ek line hai,
   poori file nahi. Aspirational documentation sabse kamzor kism hai.

---

## 5. Stable IDs — findings ke liye

Jab bugs ya gaps track karne hon, unhe stable ID do aur **sirf ek jagah** describe karo:

| Prefix | Matlab | Owner file |
|--------|--------|-----------|
| `BUG-xx` | Behaviour galat hai | `roadmap.md` |
| `GAP-xx` | Capability missing hai | `roadmap.md` |
| `SEC-xx` | Security weakness | `security/checklist.md` |

Baaki docs sirf ID se link karein, description dobara mat likho:

```markdown
Ye [BUG-01](../product/roadmap.md#bug-01) ki wajah se hota hai.
```

Commit message mein bhi wahi ID:

```
fix(posts): persist visibility on create and update (BUG-01)
```

Isse ek fix karte waqt 6 files update nahi karni padti — sirf owner file.

---

## 6. Repo root pe kya hona chahiye

Ye effectively non-negotiable hai — GitHub khud "Community Standards" checklist mein check
karta hai:

| File | Kaam |
|------|------|
| `README.md` | Entry point — kya hai, kaise chalao, aage kahan jao |
| `LICENSE` | Legal |
| `CONTRIBUTING.md` | Contribute kaise karein |
| `CHANGELOG.md` | Kya badla — [Keep a Changelog](https://keepachangelog.com/) format |
| `SECURITY.md` | Vulnerability report kaise karein |
| `CODE_OF_CONDUCT.md` | Community rules |
| `.github/` | Issue + PR templates |

README ka pehla paragraph **plain language** mein ho — taki non-dev bhi samajh jaaye ki
product kya karta hai.

---

## 7. Naya project shuru karte waqt — 2 minute ka checklist

- [ ] Stage 2 se shuru karo (8 flat files), Stage 1 se nahi
- [ ] File naam upar wali list se uthao, khud mat socho
- [ ] Har file mein `Scope / Excludes` header daalo
- [ ] `docs/README.md` index banao — kaunsi file kis liye
- [ ] Root community files daalo
- [ ] Ye file (`documentation-guide.md`) copy kar lo

Bas. Ab ye decision 2 minute ka hai, 2 ghante ka nahi.

---

## Is project ki current state

BlogHub abhi **Stage 3** pe hai. Actual layout aur har file kya own karti hai —
[docs/README.md](README.md) dekho.

Core 4 folders (`guides/`, `reference/`, `architecture/`, `operations/`) ke saath do domain
folders hain — `product/` aur `security/` — kyunki wo content in chaaron mein theek se fit
nahi hota.
