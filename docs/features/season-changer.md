# 🔥 **Season Changer**

En enkel regel:

* **Før vintersolverv → vintertema**
* **Etter vintersolverv → sommertema** (eller vårtema, hva du velger)

Det er basically:

```ts
if (today > winterSolsticeDate) {
  setSeason("summer");
} else {
  setSeason("winter");
}
````

Og så bruker du `season` til å styre:

* bakgrunnsfarger
* sol-animasjon
* kanskje litt mer varme tones
* kanskje litt mer “ny energi”-vibe

Alt med én variabel.

---

# 🌱 **Hvordan dette passer personligheten din**

Du liker jo lys og synes årstidsskifte er en hormonell hendelse.
Så appen kan speile det litt:

* vintertema er litt dypere blå-lilla
* etter vintersolverv får du litt mer gyldent lys
* når dagslengden øker nok, så endrer fargene seg litt
* du får en “aaah endelig blir dagene lengre”-følelse bare av å åpne appen

Dette er 100% i tråd med motivasjonen din.

---

# ⚙️ **Den tekniske løsningen (superenkel)**

### 1. Beregn om vi er før eller etter solverv

```ts
const today = new Date();
const winterSolstice = new Date(today.getFullYear(), 11, 21); // 21. desember

const isAfterSolstice = today > winterSolstice;
```

### 2. Sett state

```ts
const [season, setSeason] = useState<"winter" | "summer">(
  isAfterSolstice ? "summer" : "winter"
);
```

### 3. Legg til en klasse i root container

```jsx
<div className={`main-bg ${season}`}>
```

### 4. Lag to temaer i CSS

```css
.main-bg.winter {
  background: linear-gradient(135deg, #191970 0%, #87ceeb 100%);
}

.main-bg.summer {
  background: linear-gradient(135deg, #ffb300 0%, #ffd98e 100%);
}
```

Dette gir deg to moduser som slår inn automatisk.

---

# 🌞 Hva du kan gjøre senere (du trenger ikke nå):

* endre solfargen gradvis basert på årsdagen
* gjøre sollyset høyere/lavere avhengig av dagslengde
* endre fargetoner når du passerer equinox
* bruke “lysvekst” retningen for å justere UI på en sakte, subtil måte
* ha en liten tekst som:

  > “Siden vintersolverv har dagen økt med X timer. 💛”

Men det tar du når du får lyst.

---

# ✔ Oppsummert

Du trenger **ingen knapp**, ingen toggle, ingen store redesigns.

Bare:

1. Finn ut om datoen er før/etter solverv
2. Sett `season` state
3. Bruk CSS-klassene `winter` og `summer`
4. Fargene endrer seg automatisk resten av livet

Appen blir litt mer som kroppen din:
Den reagerer på lys uten at du trenger å trykke på noe.

Hvis du vil, kan jeg gi deg ferdig-kode du kan lime inn – én til én.
