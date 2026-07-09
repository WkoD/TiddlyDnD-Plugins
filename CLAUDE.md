# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektüberblick

Plugin-Bündel für die `DnDWiki`-Repo-Familie. Details zu Inhalt und Einbindung:
siehe `README.md`.

## Dokumentation - Zuständigkeiten

- **CLAUDE.md** (hier): Entwicklungsunterstützung - Regeln, Konventionen,
  Bearbeitungs- und Release-Workflow.
- **README.md**: was das Projekt ist und wie es in `DnDWiki` bzw. andere Wikis
  eingebunden wird.

Neue Inhalte entsprechend einsortieren statt duplizieren. (Analoge Aufteilung in
den Wiki-Repos, kanonisch gepflegt in `DnDWiki`.)

## Formatschicht bearbeiten

`dndwiki-core` ist ein **Ordner-Plugin** unter `plugins/dndwiki-core/` (kein
Build-Schritt - der Ordner *ist* das Plugin, Format-Tiddler dort direkt bearbeiten).

```bash
npm install
npm start          # Vorschau-/Autoren-Edition unter http://127.0.0.1:8080
```

`npm start` rendert Änderungen mit dem Graph-Stack zur Vorschau. Der
plattformneutrale Launcher `scripts/tw.js` baut dafür `TIDDLYWIKI_PLUGIN_PATH` aus
`./plugins` + den gepinnten `node_modules/tw5-*/plugins`.

**Zeitstempel (`created`/`modified`):** Jedes Plugin-Tiddler (`.tid`, oder das
`.meta`-Sidecar bei JS-Modulen wie Makros/Filtern) trägt diese Felder im
TiddlyWiki-Format (UTC, `JJJJMMTTHHMMSSmmm`). Beim direkten Bearbeiten im IDE
gilt dieselbe Pflege wie in den Wiki-Repos - siehe dort `CLAUDE.md` ->
"Zeitstempel bei Tiddler-Bearbeitung" (neue Datei: `created`=`modified`=jetzt;
inhaltliche Änderung: nur `modified`; mechanische Massenumbenennungen/
-migrationen ausgenommen).

## Erweiterungen (`$:/_my/...`) - Inventar

Inhalt von `dndwiki-core`, damit vor neuen Ergänzungen klar ist, was schon existiert:

- **Makros** (`$:/_my/Macro/*`): `Bild` (löst `bild`-Feld gegen `images/<Tag>/` auf), `DatumKurz`/`DatumLang`/`DatumRechner` (In-World-Kalender), `FormatLink`, `Library`, `SubLink`, `SubTiddler` (rendert `<Titel>/<Sub>`-Subtiddler), `TagLink`, `TotLink`.
- **Filter** (`$:/_my/Filter/*`): `EreignisListe`, `Multitag`, `SubTiddler`.
- **ViewTemplates** (`$:/_my/ViewTemplate/*`): `Aktivitaet`, `Bild`, `Connections` (dynamische Verbindungsliste aus den Beziehungsfeldern, unter dem Graphen), `EgoGraph` (eingebetteter 1-Hop-Beziehungsgraph für Person/Spieler/Org/Gott), `Ereignis`, `Ereignisliste`, `Gegenstand`, `Link`, `Ort` (nur noch Karte), `Spieler`. Reihenfolge über `list-after`; reine Render-Infrastruktur.
- **Snippets** (Tag `$:/tags/TextEditor/Snippet`): `OffenePunkte`, `SpoilerSpieler`.
- **Styles**: `Border`, `Gegenstand`, `Tot`. **Tag-Template** `Tag_Ort`. **Template** `Template_Bild`. **App**: `RenameTag`.
- **Index-/Hub-Tiddler** (Person, Ort, Organisation, Ereignis, ..., Spieler, TBC/Abenteuer): Typ-Tags tragen das `color`-Feld, aus dem der Graph die Knotenfarbe zieht.
- **tw5-graph-Schema + Graph-Templates**: Fields-EdgeTypes (`$:/config/flibbles/graph/edges/fields/*`) + Relink-Feldtypen; die Graph-Templates `$:/dndwiki/graph/templates/dnd-graph` (Typfarben aus Tag-`color`, `shape=box`, keine Positionsspeicherung) und `.../dnd-ego`; der Ego-View `$:/dndwiki/graph/Ego`. Die dünnen View-Definitionen (`$:/graph/Default`/`Kosmogramm`/`Weltkarte`/`Gegenstände`) liegen bewusst je Wiki, nicht hier.

## `staticfiles` - Implementierung

`module-type: route`-Modul (Feld `platform: server`), das im `--listen`-Node-Server
die Ordner `images/` und `data/` unter `/images/...` bzw. `/data/...` ausliefert (mit
`..`-Traversal-Schutz) - der Standard-Server bedient sonst nur `/files/`. Durch
`platform: server` schließt TiddlyWikis Offline-Save-Filter das Plugin **aus dem
Build aus**: die gebaute/deployte Seite bleibt unverändert (dort liegt `images/`
ohnehin neben `index.html`). Reines Dev-Hilfsmittel.

## Core-Overrides - Liste & Update-Prozedur

Manche Plugin-Tiddler **überschreiben** einen TiddlyWiki-Core-Shadow (1:1-Kopie des
Core-Originals + gezielte Änderung), weil es dafür keinen Hook/Extension-Point gibt.
Das ist bewusst die **letzte Wahl** - vorher immer prüfen, ob ein offizieller
Erweiterungspunkt (z. B. das `condition`-Feld bei ViewToolbar-Buttons, Tags wie
`$:/tags/AboveStory`) ausreicht.

Aktuelle Liste:

| Datei | Überschreibt | Plugin | Warum kein Hook reicht |
|---|---|---|---|
| `dndwiki-core/$__core_ui_Buttons_close.tid` | `$:/core/ui/Buttons/close` | `dndwiki-core` | Das `condition`-Feld ist zwar ein offizieller Erweiterungspunkt, erfordert aber trotzdem eine volle Neudeklaration des Buttons (Felder lassen sich nicht einzeln nachrüsten). Blendet den (x)-Button beim `Abenteuer`-Hub aus (Tag `$:/tags/Pinned`), damit er nicht geschlossen werden kann. |
| `dndwiki-core/$__core_ui_PageTemplate_story.tid` | `$:/core/ui/PageTemplate/story` | `dndwiki-core` | `handleCloseAllTiddlersEvent` in Core-JS (`navigator.js`) leert `$:/StoryList` hart, ohne Hook. Einzige Möglichkeit, dass der `Abenteuer`-Hub-Tiddler (Tag `$:/tags/Pinned`) das übersteht: der Story-River-Filter selbst muss ihn unabhängig von `$:/StoryList` mit anzeigen. |
| `dndwiki-core/$__core_ui_ViewTemplate_body.tid` | `$:/core/ui/ViewTemplate/body` | `dndwiki-core` | Core kann nur *welches* Body-Template gewählt wird beeinflussen, nicht *ob* der Body abhängig vom eingeloggten Spieler (`$:/state/Spieler`) überhaupt gerendert wird. |

**Namenskonvention:** Dateien, die einen Core-Titel überschreiben, heißen
`$__core_ui_<Pfad>_<Name>.tid` (Punkte/Slashes im Titel -> Unterstriche) - signalisiert
auf den ersten Blick "diese Datei überschreibt Core", unabhängig davon, in welchem
Plugin-Ordner sie liegt.

**Prozedur bei jedem Anheben der `tiddlywiki`-Engine-Version** (in `package.json`
hier, danach mittelbar auch in den Wikis, sobald sie ihrerseits ihre eigene
`tiddlywiki`-Version anheben):

1. `npm install` (neue Engine ziehen).
2. Für jede Zeile obiger Tabelle: die überschriebene Datei gegen das neue Original in
   `node_modules/tiddlywiki/core/ui/<entsprechender Pfad>.tid` diffen.
3. Bei Abweichungen: prüfen, ob die eigene Änderung noch sauber draufpasst
   (übernehmen, dann erneut lokal in einem Wiki verifizieren) oder ob sich durch
   die Core-Änderung ein Hook/Extension-Point ergeben hat, der den Override jetzt
   überflüssig macht.
4. Diese Tabelle bei Bedarf aktualisieren (neue Overrides ergänzen, obsolete
   entfernen).

(Analoges Diff-Verfahren wie beim Template-Update für `DnDWiki`, siehe dort
"Versionierung -> Vorlagen-Update" in `CLAUDE.md`.)

## Neue Version veröffentlichen

1. Format ändern -> `version` in `plugins/dndwiki-core/plugin.info` erhöhen
   (semver: patch=Fix, minor=neue Features, major=brechende Änderung).
2. `version` in `package.json` auf denselben Wert anheben.
3. Committen, dann **taggen == Version** und Release setzen:
   ```bash
   git tag 1.1.0 && git push origin master 1.1.0
   gh release create 1.1.0 --generate-notes
   ```
4. Konsumenten (DnDWiki-Repo-Familie) heben ihren Pin eigenständig an
   (`#1.0.1` -> `#1.1.0`) und laufen `npm install`.
