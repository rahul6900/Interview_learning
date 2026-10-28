# 🐙 Git, GitHub & Agile (Scrum/Jira) Master Interview Guide
> **Target:** Junior Engineer Interview Preparation (31st Oct)  
> **Company:** Asaeta Pvt Ltd (Indore)  
> **Topics:** Version Control, Git Commands, Merge vs Rebase, Conflict Resolution, Git Stash, Agile Scrum, Jira Artifacts, Sprint Ceremonies

---

## 📌 Table of Contents
1. [Git vs GitHub (Fundamental Difference)](#1-git-vs-github)
2. [The 3 Stages of Git & Core Everyday Commands](#2-the-3-stages-of-git--core-commands)
3. [Git Merge vs Git Rebase (Classic Interview Trap) ⭐⭐⭐](#3-git-merge-vs-git-rebase)
4. [How to Resolve a Merge Conflict (Step-by-Step Practical) ⭐⭐⭐](#4-how-to-resolve-a-merge-conflict)
5. [Git Reset vs Git Revert (Undo Changes Safely) ⭐⭐](#5-git-reset-vs-git-revert)
6. [Git Stash (Temporary Work Saver)](#6-git-stash)
7. [Pull Request (PR) Workflow & Code Review](#7-pull-request-pr-workflow)
8. [Agile vs Waterfall Methodology](#8-agile-vs-waterfall-methodology)
9. [Scrum Framework & The 4 Sprint Ceremonies ⭐⭐⭐](#9-scrum-framework--sprint-ceremonies)
10. [Jira Terminology: Epic vs Story vs Task vs Bug ⭐⭐](#10-jira-terminology)

---

## 1. Git vs GitHub

| Feature | Git | GitHub |
| :--- | :--- | :--- |
| **Kya hai?** | **Distributed Version Control System (VCS)** tool | **Cloud-based Web Platform** jo Git repositories host karti hai |
| **Kahan chalta hai?** | Aapke **Local Computer / Terminal** par chalta hai | **Internet (Cloud Server)** par chalta hai |
| **Internet zaruri hai?** | ❌ Nahi (Bina internet ke bhi commits aur branches banti hain) | ✅ Haan (Code push, pull, PR banane ke liye internet chahiye) |
| **Alternatives** | SVN, Mercurial | GitLab, Bitbucket |

---

## 2. The 3 Stages of Git & Core Commands

Git me code 3 states se hokar guzarta hai:
```
[ Working Directory ] ──(git add)──> [ Staging Area ] ──(git commit)──> [ Local Repo ] ──(git push)──> [ GitHub Remote ]
```

### 💻 Daily Life Git Commands:
```bash
# 1. Project setup:
git init                     # Naya local git repo initialize karo
git clone <repo-url>         # GitHub se poora project download karo

# 2. Daily changes save karna:
git status                   # Check karo kaun si files modify huyi hain
git add .                    # Saare changes ko Staging Area me daalo
git commit -m "feat: add user login API" # Changes ka snapshot save karo

# 3. Branching:
git branch                   # Saari local branches dekho
git checkout -b feature-auth # Nayi branch banao aur usme switch karo (Modern: git switch -c feature-auth)
git checkout main            # Main branch me wapas aao

# 4. Sync with Cloud:
git pull origin main         # GitHub se latest changes apne local me download karo
git push origin feature-auth # Local branch ko GitHub par upload karo
```

---

## 3. Git Merge vs Git Rebase ⭐⭐⭐

Interviewer ka favorite comparison sawaal! Dono ka kaam do branches ka code jodna hai, lekin tarika bilkul alag hai:

| Feature | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| **History** | **Non-destructive**: Purani branch ki puri history waise ki waise rehti hai. | **Rewrites History**: Commits ko linear sequence me replay karta hai. |
| **Merge Commit** | Ek extra **"Merge Commit"** create karta hai. | **No Merge Commit**: Bilkul saaf-suthri seedhi line (Linear History) banti hai. |
| **Kab use karein?** | Feature branch ko `main` me merge karte waqt (Production standard). | Apni personal local branch ko latest `main` ke sath sync karte waqt. |
| **⚠️ Danger** | Safe hai, koi commit history delete nahi hoti. | ⚠️ **Never rebase a public/main branch!** Doosre developers ka code kharab ho sakta hai. |

### 🗣️ Interviewer Speech (English & Hindi):
* **English:** *"Git merge preserves the complete commit history and creates an explicit merge commit, making it safe and transparent for team collaboration. Git rebase moves the entire feature branch to begin on the tip of the target branch, creating a clean linear history without merge commits, but it rewrites commit hashes."*
* **Hindi:** *"Sir, `git merge` safe hota hai kyunki wo saare commits ki history yaad rakhta hai aur ek merge commit banata hai. Jabki `git rebase` commit history ko rewrite karke ekdum clean aur seedhi line (linear history) bana deta hai bina kisi extra merge commit ke."*

---

### 🔄 Real-World Scenario: *"Agar 'main' aage nikal gayi aur meri branch peeche reh gayi, to kya karenge?"* ⭐⭐⭐

Yeh problem har roz companies me aati hai: Aapne Monday ko `feature/login` branch banayi. Teammates ne Tuesday aur Wednesday ko apna code `main` me merge kar diya. Ab `main` aage nikal gayi aur aapki branch peeche reh gayi!

#### Tarika 1: The Safe & Standard Way (`git merge main`):
Apni branch me `main` ka latest code khinch lo:
```bash
# 1. Apni feature branch par jao:
git checkout feature/login

# 2. Main branch ka latest code apni branch me merge kar lo:
git pull origin main
```
👉 *Isse `main` ke saare naye changes aapki branch me aa jayenge. Agar koi conflict aayega to wo aapki branch me aayega, jise aap locally theek kar sakte ho. `main` branch 100% safe rahegi!*

#### Tarika 2: The Clean Way (`git rebase`):
Agar aapko clean seedhi history chahiye:
```bash
git checkout feature/login
git fetch origin
git rebase origin/main
```
👉 *Isse aapki branch ke commits temporarily hatenge, `main` ka latest code base banega, aur aapke commits uske aage lag jayenge.*

---

### 🚦 Golden Decision Rule: "Kab Rebase, Kab Merge, aur Kab Git Pull?" (Interviewer ka Punchline)

| Situation / Kaam | Kaun Sa Command? | Kyu? |
| :--- | :--- | :--- |
| **1. GitHub se latest code apne computer me laana ho** | **`git pull`** | Ye internally `fetch` + `merge` karta hai aur GitHub ke naye changes aapke local me le aata hai. |
| **2. Feature branch ko `main` me jodna ho (PR Merge)** | **`git merge`** | Industry Standard & 100% Safe! Poori team ki history safe rehti hai aur clear record banta hai. |
| **3. Apni personal local branch ko clean & linear rakhna ho** | **`git rebase`** | Faltu ke dummy merge commits nahi aate, commits ek seedhi line me dikhte hain. |
| **4. Team/Shared branch (`main`, `production`) par kaam karna ho** | ❌ **Rebase KABHI NAHI!**<br>✅ Hamesha **`git merge`** | Shared branch ko rebase karne se doosre developers ka git repo corrupt ho jayega! |

> **💡 Ek Line ka Thumb Rule:**  
> *"Local personal branch ko saaf rakhna ho to **Rebase**, lekin team ke sath share karte waqt aur main me jodte waqt hamesha **Merge**!"*

---

## 4. How to Resolve a Merge Conflict ⭐⭐⭐

### ❓ Conflict kyu hota hai?
Jab do developers ek hi file ki **same line** par alag-alag code likh kar commit kar dete hain, to Git decide nahi kar pata ki kiska code rakhna hai. Git wahan ruk jata hai aur use **Merge Conflict** bolte hain.

### 🛠️ Conflict Resolve karne ke 5 Simple Steps:

1. **Conflict Identify karo:** Terminal me Git bolega: `CONFLICT (content): Merge conflict in server.js`.
2. **File Kholo:** File me Git aisi markers laga deta hai:
   ```javascript
   <<<<<<< HEAD (Current change - Aapka code)
   const PORT = 5000;
   =======
   const PORT = 8080;
   >>>>>>> feature-branch (Incoming change - Teammate ka code)
   ```
3. **Decide & Edit:** Teammate se baat karo ya decide karo ki 5000 chahiye ya 8080. Markers (`<<<<<<<`, `=======`, `>>>>>>>`) ko delete karo aur sahi code rakho.
4. **Stage & Commit:**
   ```bash
   git add server.js
   git commit -m "fix: resolve merge conflict in port configuration"
   ```
5. **Push:**
   ```bash
   git push origin <branch-name>
   ```

---

## 5. Git Reset vs Git Revert ⭐⭐

Agar galti se koi galat commit ho jaye to use wapas kaise lein?

| Feature | `git revert` (Safe ⭐) | `git reset` (Destructive ⚠️) |
| :--- | :--- | :--- |
| **Kaise kaam karta hai?** | Ek **Naya Commit** banata hai jo purane commit ke asar ko ulta (undo) kar deta hai. | Commits ko history se **delete/piche** kar deta hai. |
| **History Par Asar** | History intact rehti hai (Koi commit gayab nahi hota). | History rewrite ho jati hai (Purane commits udd jate hain). |
| **Kab use karein?** | Shared / Remote / Production branch par (Best Practice). | Sirf local branch par jab tak code push na kiya ho. |

```bash
# Revert (Safe):
git revert <commit-hash> # Naya commit banayega aur changes undo kar dega

# Reset (Local only):
git reset --soft HEAD~1  # Commit cancel, changes Staging me rahenge
git reset --hard HEAD~1  # ⚠️ DANGER: Commit aur code sab delete!
```

---

## 6. Git Stash (Emergency Saver)

* **Problem:** Aap ek feature par kaam kar rahe the (code aadha likha hai, commit nahi kar sakte), aur tabhi boss ne bola: *"Jaldi se production ka ek urgent bug fix karo!"*
* **Solution:** **`git stash`** aapke adhure kaam ko ek temporary tijori (shelf) me chupakar working directory ko ekdum clean kar deta hai!

```bash
git stash              # Adhura kaam temporary save karke file saaf kar do
git checkout main      # Dusri branch par jakar urgent kaam karo
git checkout feature   # Wapas apni branch par aao
git stash pop          # Adhura kaam wapas bahar nikaalo aur resume karo!
```

---

## 7. Pull Request (PR) Workflow & Code Review

Industry me koi bhi developer direct `main` branch me code push nahi karta! Real company workflow ye hota hai:

1. **Branch Banao:** `main` se apni feature branch banao (`git checkout -b feature/login`).
2. **Code & Commit:** Kaam karo aur commit karo.
3. **Push to GitHub:** Apni branch GitHub par push karo.
4. **Open PR (Pull Request):** GitHub par jao aur "Create Pull Request" click karo (is request ka matlab hai: *"Mera code `feature/login` se `main` me merge kar do please"*).
5. **Code Review:** Senior developer aapka code review karta hai, comments deta hai, bugs dhoondhta hai.
6. **Merge:** Approval milne ke baad code `main` me merge hota hai aur automatically server par deploy ho jata hai.

---

## 8. Agile vs Waterfall Methodology

| Feature | Waterfall Methodology (Purana) | Agile Methodology (Modern Industry Standard) |
| :--- | :--- | :--- |
| **Approach** | Linear & Sequential (Ek phase khatam hoga tabhi agla shuru hoga) | **Iterative & Incremental** (Chote-chote tukdon me kaam banta hai) |
| **Planning** | Shuruat me 6 mahine sirf planning aur documentation hoti hai | Har 2 hafte me naye requirements adapt hote hain |
| **Delivery** | Client ko software 1 saal baad aakhri me dikhta hai | Client ko har **2 hafte me working software** milta hai |
| **Flexibility** | Beech me changes lana lagbhag impossible hai | High flexibility: Client feedback ke according changes turant hote hain |

---

## 9. Scrum Framework & The 4 Sprint Ceremonies ⭐⭐⭐

Agile ka sabse popular implementation hai **SCRUM**.

* **Sprint:** Ek **1 se 2 hafte ka time-box** jisme team ek specific set of features develop aur test karke deliver karti hai.

### 📅 The 4 Essential Sprint Ceremonies (Meetings):

| Ceremony (Meeting) | Kab hoti hai? | Kya hota hai isme? |
| :--- | :--- | :--- |
| **1. Sprint Planning** | Sprint ke pehle din | Team Product Backlog se high priority tasks uthati hai aur decide karti hai ki agle 2 hafte me kya-kya banayenge. |
| **2. Daily Standup (Scrum)** | Har roz subah (15 minutes) | Har developer 3 sawaalon ka jawab deta hai:<br>1. *Maine kal kya kiya?*<br>2. *Main aaj kya karunga?*<br>3. *Kya koi Blocker (rukawat) hai?* |
| **3. Sprint Review / Demo** | Sprint ke aakhri din | Team client aur stakeholders ko dikhati hai ki unhone 2 hafte me kya working feature banaya (Live Demo). |
| **4. Sprint Retrospective** | Sprint Review ke baad | Team aapas me discuss karti hai:<br>1. *Kya accha hua?*<br>2. *Kya galat hua/dikkat aayi?*<br>3. *Agle sprint me hum kaise behtar kaam kar sakte hain?* |

---

## 10. Jira Terminology (Enterprise Level) ⭐⭐

Jira ek project management software hai jo companies Agile tasks track karne ke liye use karti hain:

* **Epic:** Ek bohot bada goal jo kayi sprints tak chalta hai (e.g. *"User Authentication System"* ya *"Payment Gateway Integration"*).
* **User Story:** Ek specific feature jo user ke perspective se likhi jaati hai.
  * *Template:* **"As a [user], I want to [action] so that [benefit]."**
  * *Example:* *"As a registered customer, I want to filter products by price so that I can find affordable shoes."*
* **Task / Subtask:** Technical developer task jo story ko poora karne ke liye chahiye (e.g. *"Create MongoDB Schema"* ya *"Write JWT verification middleware"*).
* **Bug:** Code me aayi hui koi kharabi ya unexpected behavior.
* **Story Points:** Ek task ki complexity aur effort ka estimation (Fibonacci numbers use hote hain: `1, 2, 3, 5, 8, 13`).
* **Backlog:** Wo saare features aur tasks ki pending list jo aane wale sprints me banaye jayenge.
* **Blocker:** Koi aisi dikkat jiski wajah se kaam aage nahi badh sakta (e.g. *"Backend API down hai, isliye Frontend design integrate nahi ho raha"*).

---

### 🗣️ Complete Ready-to-Speak Agile Interview Answer:
> *"In our development workflow, we follow the Agile Scrum methodology with 2-week sprints. We use Jira to manage our Product Backlog, User Stories, and Tasks. Everyday we have a 15-minute Daily Standup where we discuss yesterday's progress, today's plan, and any blockers. At the end of each sprint, we demonstrate our working software in the Sprint Review and discuss continuous improvements in the Sprint Retrospective."*
