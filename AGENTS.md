# Winter Solstice Calculator – Arbeidsnotat

Dette prosjektet har vært gjennom en del merge-/stash-rot som er greit å ha
kort forklart i én fil, slik at jeg (eller AI-verktøy jeg manuelt ber om hjelp) 
kan forholde seg til hva som har skjedd og hvordan det bør løses videre.

Denne filen gir en enkel oversikt over:
- hva som har skjedd
- hva som mangler
- hvor ting ligger
- hva neste steg er
- hvilke filer AI kan hjelpe med, men *ikke* uten at jeg ber om det

---

## 1. Hva som har skjedd

- Jeg jobbet lenge i branch `feat/precise-calculation`
- Denne branchen inneholder:
  - korrekt UI-design (gradient, layout, spacing)
  - den gode versjonen av `App.tsx`
  - sunrise/sunset (precise)
  - alle nye precise-kalkulasjoner
- På `main` lå en eldre versjon:
  - mye enklere UI
  - ingen precise values
  - ingen gradient eller pen layout

### Problemet oppstod slik:
1. Jeg hadde UI-endringer liggende i et stash
2. Jeg poppet stashet mens `main` manglet halve koden
3. Dette skapte duplisert UI, dupliserte `<div>`-blokker og logikk som gikk i surr
4. `main` ble stående med rot, mens den gode versjonen lever videre i feature-branchen

---

## 2. Hva som mangler på `main`

Basert på skjermbilder og diffs mangler `main`:
- hele gradient-bakgrunnen
- layout som sentrerer UI i fullskjerm
- riktig struktur av containerne
- sol-animasjonen / solkomponenten
- sunrise/sunset UI
- precise-kalkulasjoner i output
- ryddet `App.tsx` uten duplikater
- oppdatert CSS

Kort sagt:
**main mangler alt som gjør appen fin og riktig.**

---

## 3. Hva som må skje videre

### Det riktige å gjøre:
**Merge `feat/precise-calculation` inn i main**, og så:
- rydde merge-konflikten i `src/App.tsx`
- velge *feature-branch-versjonen* for UI og logikk
- slette eventuelle duplikate `<div>`-blokker
- fjerne dupliserte result-linjer
- sjekke at `calculateDaylightPrecise.ts` er identisk mellom branches

Dette er mest riktig fordi feature-branchen er den “ekte” versjonen av appen.

---

## 4. Filer som må sjekkes ved videre arbeid

Disse tre er de viktigste:
- `src/App.tsx`  
- `src/utils/calculateDaylightPrecise.ts`  
- `src/App.css` (gradient/sol-ting kan ha endret seg)

---

## 5. Fremgangsmåte når jeg ber AI om hjelp

Når jeg ber om AI-hjelp i dette repoet:
- AI skal *kun* gjøre endringer jeg ber om eksplisitt
- AI skal alltid be om å få se både `main` og `feat/precise-calculation` ved merge-ting
- AI skal aldri gjette seg til store refaktoreringer
- AI skal holde seg til de to filene over med mindre jeg sier noe annet

---

## 6. Fremtidige steg (når merge er ferdig)

Når `main` er ryddet:
- Slette gammelt stash
- Slette `App.tsx.bak` (du kan gjøre det selv når alt fungerer)
- Lage en liten README-seksjon om precise calculation
- Eventuelt lage screenshots

---

## 7. Formålet med denne filen

Dette er *ikke* et agent-system.  
Det er et kort, praktisk arbeidsnotat for:
- meg selv (for å huske lett hva som foregikk)
- AI som hjelper meg *når jeg ber om det*
- å gjøre fremtidige merges mye mindre stress

KISS: Hold det enkelt. Ikke kompliser noe.
