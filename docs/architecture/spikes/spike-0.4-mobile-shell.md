> **OBSOLÈTE 2026-11-11** — pas d'apps natives mobile (ADR-0015 supersede ADR-0008). Ce spike n'est plus à exécuter ; seule la mesure canvas sur navigateur Android d'entrée de gamme est conservée (spike 0.4b).

# Spike 0.4 — Coque mobile Tauri 2 (ADR-0008) + signature des 4 cibles

Statut : protocole prêt · Durée : 5 j (2 j builds/signature, 2 j mesures, 1 j rapport) · Décideur : Jean Balin (ADR-0008). Dépend de : bench canvas (`spike-0.4b`, scène 1k/5k/10k) et de la fiche IME du spike 0.5.

## 1. Appareils
| Id | Appareil | Rôle |
|---|---|---|
| D1 | Android 10, 4 Go, Mali-G52 (classe Tecno/Infinix/Samsung A) | plancher Android (marché cible) |
| D2 | Android 12, 3 Go, Adreno 610 (édition Go si possible) | plancher bas |
| D3 | Android milieu de gamme 6 Go | référence « normale » |
| D4 | iPhone SE 2/3 | plancher iOS |
| (+) | Chrome PWA sur D1 et D2 | comparaison option B/C ADR-0008 |
Compléter pour chaque appareil : modèle, SoC/GPU, RAM, version OS, **version Android System WebView / Chrome / iOS**, mode économie d'énergie désactivé, batterie > 80 %, secteur débranché pour la mesure batterie, température ambiante.
Si un appareil manque en S0 : le noter, mesurer ce qui est disponible, **ne pas déduire** ; signaler au mainteneur (achat/prêt d'un D1/D2, ~100–150 USD d'occasion).

## 2. Checklist signature et builds (Story 0.4 AC « signed dev builds on 4 targets »)
Desktop (2 cibles) : la signature de production relève d'ADR-0009/0011 ; pour 0.4, builds dev.
- [ ] Windows : `tauri build` (NSIS/MSI) ; signature **dev** : certificat auto-signé OK pour test, noter l'alerte SmartScreen ; plan prod : cert OV/EV ou Azure Trusted Signing (coût/entité → ADR-0009). WebView2 Evergreen runtime présent (noter version).
- [ ] macOS : `tauri build` ; signature « Apple Development » ou ad-hoc pour dev local ; notarisation = Developer ID (99 USD/an, ADR-0009) — non requise pour 0.4, notée comme manquante.
Android :
- [ ] `tauri android init` ; SDK/NDK/JDK versions notées ; cibles Rust `aarch64-linux-android` (+ `armv7-linux-androideabi` pour appareils 32 bits anciens — vérifier si D1/D2 sont 32 bits).
- [ ] Keystore debug : `keytool -genkey -v -keystore wiro-dev.jks -alias wiro-dev -keyalg RSA -keysize 2048 -validity 10000` — **le keystore ne va jamais dans le repo** (secrets : variables d'env/CI secret) ; `tauri.conf` `bundle.android` + `gradle signingConfigs` via variables d'env.
- [ ] APK **signé debug/dev** installé par `adb install` sur D1–D3 ; `apksigner verify --print-certs` OK ; taille APK/AAB par ABI relevée (budget < 25 Mo).
- [ ] AAB pour Play : décrire la signature Play App Signing (clé d'upload) — non exécuté en S0.
iOS :
- [ ] `tauri ios init` ; Xcode, compte Apple Developer (gratuit = profil 7 jours sur appareil, TestFlight = payant 99 USD, ADR-0009) ; `development team` en variable d'env ; profil de provisioning dev ; installation sur D4 par Xcode.
- [ ] Noter : `Info.plist` (orientations, `NSAppTransportSecurity`), icônes, entitlements ; WKWebView : **WebGL2 dispo iOS ≥ 15**, WebGPU selon version iOS.
Commun : pour chaque cible, lancer la coque vide et vérifier que le moteur WASM charge et **affiche le backend graphique** (probe : `webgl2` + renderer string + `navigator.gpu`) — critère d'acceptation 2 de la story.
Résultat attendu : tableau cible → {build OK, signature, installé, moteur WASM OK, backend GPU, temps de build, problèmes}.

## 3. Mesures (ADR-0008)
| Mesure | Méthode | Go |
|---|---|---|
| WebGL2 / WebGPU | `getContext('webgl2')`, `navigator.gpu`, `UNMASKED_RENDERER_WEBGL`, `MAX_TEXTURE_SIZE` | WebGL2 sur ≥ 90 % des appareils testés ; sinon CPU (ADR-0004 C) |
| Démarrage à froid → interactif | lancement → moteur prêt (log horodaté ; `adb shell am start -W`) | < 3 s (D3/D4), < 5 s (D1/D2) |
| fps canvas 1k/5k/10k | harnais `bench/canvas` (trace pan+zoom, backend retenu/B/C/E) | ≥ 40 fps @10k D3/D4 ; ≥ 30 fps @5k D1/D2 |
| Mémoire | `adb shell dumpsys meminfo <pkg>` (PSS) toutes les 10 s ; Instruments (Allocations) sur D4 | < 400 Mo @5k ; 0 kill OOM sur soak 10 min |
| Chargement WASM + instanciation | trace performance / logs | < 1,5 s sur D1 |
| Latence de frappe (doc + sticky) | événements horodatés, vérifier par vidéo 240 fps sur 1 appareil | p95 < 80 ms |
| Persistance hors ligne | mode avion, 100 éditions, kill app, relance | 0 perte (NFR-R1) |
| Taille installation / mise à jour | APK/AAB par ABI ; diff entre deux builds | < 25 Mo / < 3 Mo |
| IME & RTL | Gboard / clavier iOS Wolof, Yoruba, Arabe (fiche spike 0.5 §7) | pas de perte de composition |
| Batterie | 30 min d'édition, `adb shell dumpsys batterystats` / Réglages iOS | < 8 % sur D2 |

## 4. Règles de décision (ADR-0008)
- **A (Tauri mobile) = GO** si GO sur D3/D4 **et** « Acceptable » (≤ 1,5 × les seuils) sur D1/D2, builds signés OK sur 4 cibles.
- Sinon : Android → B (PWA) / C (TWA) pour les stores Android ; ré-évaluer A après correctifs. Un échec iOS seul ne bloque pas A Android.
- Blocages durs à signaler immédiatement au mainteneur : build mobile impossible > 1 j de débogage ; WebView < Chrome 90 sur ≥ 2 appareils (WebGL2/WASM threads) ; compte Apple Developer non dispo (bloque TestFlight, pas le test sur appareil) ; absence de D1/D2.
- Ne jamais déclarer « accepted » l'ADR sans Jean Balin.

## 5. Fiche de résultats (à copier en `report-0.4.md`)
Par appareil :
```
Appareil : D_  modèle:        SoC/GPU:        RAM:     OS:      WebView/Chrome:
Date / opérateur / build (git sha):
Build+signature : [ ] OK  taille APK/AAB:   hash apksigner:
WebGL2: oui/non  WebGPU: oui/non  renderer:             maxTex:
Démarrage froid (s) : run1..3 →        médiane:
WASM load (s):
fps 1k / 5k / 10k (p50, p95):
Latence frappe p95 (ms) doc / sticky:
PSS max / steady @5k (Mo):   OOM kill: oui/non
Persistance hors ligne (100 éd.) : 0 perte ? oui/non
Batterie 30 min (%):
IME/RTL : Wolof ok? Yoruba ok? Arabe ok?
Verdict appareil : GO / ACCEPTABLE / NO-GO   Notes/captures:
```
Synthèse : tableau appareils × seuils, décision A/B/C selon §4, risques, demande de décision.
