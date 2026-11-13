# Runbook : lancement du développement (vendredi 13 nov 2026)

Objectif : premier jour de dev où des agents pilotés par un modèle local (Qwen sur **ws300**) exécutent des stories de S0, sous revue humaine. Statut : brouillon, à valider par Jean.

## 1. Prérequis (J-1, jeudi 12 nov)
| # | Contrôle | Commande / action | Si KO |
|---|---|---|---|
| 1 | Joignabilité modèle | `curl -s -m5 http://192.168.31.99:8000/v1/models` et idem `:8001` depuis le poste de dev | voir §9 (bascule) |
| 2 | Le modèle répond | requête de chat courte, latence et contexte maximal notés | réduire la taille des stories |
| 3 | Outil agent configuré | `opencode.json` pointe vers le bon endpoint ; test `opencode` sur un prompt trivial | corriger le provider |
| 4 | Toolchain | `rustup show` (stable), `cargo-deny`, `pnpm`, `node` LTS, `git` | installer |
| 5 | Dépôt propre | branche de départ à jour, `chore/pre-dev-closure` fusionnée ou rebasée, CI verte | corriger |
| 6 | Décisions S0 | voir `implementation-readiness.md` : autorisation `Unicode-3.0`, ADR-0004 (non bloquant pour 0.1 à 0.3 ; ADR-0008 superseded by 0015) | décider ou reporter 0.4/0.5 |
| 7 | Stories | `_bmad-output/implementation-artifacts/stories/` contient les stories S0 prêtes à lancer (créé par un autre agent) | lancer `bmad-create-story` à la main |

Note : au moment de la rédaction, `192.168.31.99:8000/8001` n'était **pas joignable** depuis la session de travail ; à tester depuis le poste réel (réseau local 192.168.31.x, VPN/pare-feu éventuels).

## 2. Exécuter une story par agent
Principe : **une story = un agent = une branche = une PR.** L'agent ne lit que : AGENTS.md, la story, les fichiers cités dans la story.
1. Choisir la story dans `sprint-status.yaml` (statut `ready-for-dev`) ; ouvrir le fichier de la story dans `_bmad-output/implementation-artifacts/stories/`.
2. Créer la branche : `git switch -c feat/story-0-1-monorepo-scaffold` (format `feat/story-<epic>-<n>-<slug>`).
3. Lancer l'agent (skill `bmad-agent-dev` / build) avec le prompt type :
   > Implémente la story `<chemin>`. Respecte AGENTS.md (clean-room, licences, pas de tirets cadratins). Ne touche que les fichiers de la story. Exécute les portes (§4) et corrige jusqu'au vert. Résume les écarts.
4. L'agent commit en Conventional Commits (`feat(scaffold): ...`) avec `-s` (DCO).
5. Ouvrir la PR avec le template, lier la story ; statut story → `review`.

Contraintes pour un modèle local : stories courtes (un livrable vérifiable), critères d'acceptation explicites, commandes de test données, pas plus de 3 à 5 fichiers modifiés par tâche quand c'est possible, sinon découper en sous-tâches séquentielles.

## 3. Branches, PR, commits
- Jamais de commit direct sur `main`. PR obligatoire, CI verte, squash merge.
- Conventional Commits ; scope = crate ou zone (`feat(canvas):`, `chore(ci):`).
- Une PR = une story. PR de plus de ~400 lignes utiles : découper.
- Les ADR changent par PR séparée, validée par le mainteneur.

## 4. Portes (toutes obligatoires avant revue)
1. `cargo fmt --all -- --check`
2. `cargo clippy --workspace --all-targets -- -D warnings`
3. `cargo deny check` (licences, advisories, bans, sources)
4. `cargo test --workspace`
5. Côté JS : `pnpm lint`, `pnpm typecheck`, `pnpm test`, contrôle de licences
6. Garde clean-room (revue de l'agent `clean-room-guard` ou script, cf. `ci-proposals.md`)
7. Markdown lint sur `docs/**`
Tant que Story 0.1/0.2 n'ont pas livré ces portes en CI, les exécuter localement et coller la sortie dans la PR.

## 5. Revue humaine
Jean relit chaque PR : conformité à la story et aux ADR, licences des dépendances ajoutées, absence de code copié, tests qui testent vraiment quelque chose (un modèle local peut produire des tests triviaux), sécurité (secrets, entrées). Budget : 20 à 30 minutes par PR. Refus = commentaire précis, l'agent reprend sur la même branche.

## 6. Ordre S0 → S1 → S2
- **S0 (16-29 nov)** : 0.1 scaffold → 0.2 gate licences/clean-room → 0.3 tokens (indépendant) → 0.4 shells Tauri → 0.5 spike Loro + ProseMirror (go/no-go).
- **S1** (après go du spike 0.5) : modèle, CRDT, stockage WAL, chrome, CRUD hors ligne.
- **S2** (après décision ADR-0004 sur la base du banc de perf) : moteur canvas v1 + banc de perf en CI.
Le vendredi 13 : viser **0.1 seule**, puis 0.2 si le premier cycle est sain. Pas plus : calibrer le modèle local d'abord.

## 7. Parallélisme
- Au plus **2 agents en parallèle** au départ (capacité de relecture = goulot), 3 plus tard.
- Parallèle sûr : 0.3 (tokens) avec 0.2 (CI/licences) une fois 0.1 mergée ; deux crates indépendants.
- Séquentiel obligatoire : tout ce qui touche la racine du workspace, `Cargo.toml`, CI, `deny.toml`.
- Un `git worktree` par agent pour éviter les collisions.
- Une seule instance du modèle local : vérifier le débit avant de lancer deux agents.

## 8. Critères d'arrêt (stop immédiat et retour à Jean)
- Porte rouge après 3 itérations de correction sur la même story.
- Dépendance dont la licence est absente de la liste autorisée ou douteuse.
- Soupçon de code copié depuis un projet non MIT (tldraw, AFFiNE, etc.).
- Story qui exige une décision d'architecture non prise (ADR proposed).
- Modification hors périmètre de la story, ou de fichiers non possédés (ADR, AGENTS.md).
- Modèle qui boucle, hallucine des API (crate inexistante), ou latence > seuil convenu (à fixer au premier test, par exemple 2 min par réponse).
- Secret ou donnée personnelle dans un diff.

## 9. Modèle local indisponible
1. Vérifier réseau (ping, même sous-réseau, VPN), puis service sur ws300 (processus, ports 8000 et 8001, mémoire GPU).
2. Tunnel SSH vers ws300 si pare-feu : `ssh -L 8000:localhost:8000 ws300` et pointer l'outil sur `localhost`.
3. Bascule temporaire : autre modèle local plus petit, ou modèle hébergé via l'outil agent (Claude Code, Codex, OpenCode) **uniquement pour du code non sensible**, avec les mêmes portes.
4. Si aucune bascule : vendredi consacré aux tâches humaines (décisions des ADR proposés, revue des stories, tokens/Penpot) ; ne pas dégrader les règles qualité.
Dans tous les cas, noter dans le journal de session le modèle utilisé par PR (traçabilité).

## 10. Métriques de suivi
Par story : temps agent, itérations avant vert, taille du diff, temps de revue humaine, défauts trouvés en revue. Par jour : stories mergées, PR rejetées, taux de portes rouges au premier essai, incidents licences/clean-room (objectif 0). Seuil d'alerte : plus de 2 itérations en moyenne ou plus de 30 min de revue par PR : découper davantage les stories. Suivi dans `sprint-status.yaml` + un journal `docs/plan/dev-log.md` (à créer au besoin).
