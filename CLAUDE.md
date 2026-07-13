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
npm run smoke      # abhängigkeitsarmer Boot-/Ladecheck (kein Wiki-Checkout nötig)
```

`npm run smoke` bootet die Minimal-Edition `editions/smoke` (nur `tiddlywiki.info` mit der
Plugin-Liste, **kein Inhalt**) mit dem Graph-Stack und bricht bei Modul-/Ladefehlern ab -
z. B. nach einem Rename, um zu prüfen, dass alle Tiddler/Module noch laden. Der plattformneutrale
Launcher `scripts/tw.js` baut dafür `TIDDLYWIKI_PLUGIN_PATH` aus `./plugins` + den gepinnten
`node_modules/tw5-*/plugins`. Eine **inhaltliche Vorschau** gibt es hier bewusst nicht - dafür
der IDE-Loop im echten Wiki (s. u.).

**Im echten Wiki prüfen (IDE-Loop statt WYSIWYG):** Die Formatschicht wird bewusst hier
im IDE bearbeitet (versionierte technische Schicht) und im Zusammenspiel mit einem echten
Wiki geprüft - kein Browser-WYSIWYG-Rückspeichern. Dafür im Wiki-Repo (`DnDWiki` oder einer
Kampagne) den Plugin-Dependency **lokal** auf diese Checkout zeigen lassen statt auf den
Release-Pin - per `npm link`:

```bash
# einmalig in TiddlyDnD-Plugins:
npm link
# im Wiki-Repo (DnDWiki oder einer Kampagne):
npm link tiddlydnd-plugins
```

Das legt `node_modules/tiddlydnd-plugins` als Symlink/Junction auf diese Checkout an; der
Wiki-Launcher lädt dann `plugins/dndwiki-core` **live**. Ablauf: Tiddler im IDE ändern ->
`npm start` im Wiki neu starten -> Änderung sichtbar (Ordner-Plugins reloaden nicht hot, daher
Neustart). Der Link lebt rein in `node_modules` (gitignored) - `package.json` bleibt dabei
unverändert, es gibt also nichts zu committen oder vor einem Release zurückzusetzen.
Zurückschalten auf den Release-Pin: `npm unlink tiddlydnd-plugins && npm install`.

**Zeitstempel (`created`/`modified`):** Jedes Plugin-Tiddler (`.tid`, oder das
`.meta`-Sidecar bei JS-Modulen wie Makros/Filtern) trägt diese Felder im
TiddlyWiki-Format (UTC, `JJJJMMTTHHMMSSmmm`). Beim direkten Bearbeiten im IDE
gilt dieselbe Pflege wie in den Wiki-Repos - siehe dort `CLAUDE.md` ->
"Zeitstempel bei Tiddler-Bearbeitung" (neue Datei: `created`=`modified`=jetzt;
inhaltliche Änderung: nur `modified`; mechanische Massenumbenennungen/
-migrationen ausgenommen).

## Erweiterungen (`$:/plugins/dndwiki-core/...`) - Inventar

Inhalt von `dndwiki-core`, damit vor neuen Ergänzungen klar ist, was schon existiert.
Alle Format-Tiddler liegen plugin-scoped unter `$:/plugins/dndwiki-core/<kategorie>/<name>`
(Dateien in gleichnamigen Unterordnern, `kebab-case`). Makros werden weiterhin über ihren
`exports.name` (klein, z. B. `<<bild>>`) aufgerufen - unabhängig vom Tiddler-Titel:

- **Makros** (`macros/*`): `bild` (löst `bild`-Feld gegen `images/<Tag>/` auf), `datum-kurz`/`datum-lang`/`datum-rechner` (In-World-Kalender), `format-link`, `library`, `sub-link`, `sub-tiddler` (rendert `<Titel>/<Sub>`-Subtiddler), `tag-link`, `tot-link`.
- **Filter** (`filters/*`): `ereignis-liste`, `multitag`, `sub-tiddler`.
- **ViewTemplates** (`viewtemplates/*`): `aktivitaet`, `bild`, `ereignis`, `ereignisliste`, `gegenstand` (nur noch Jahr/Preis, kein manueller Beziehungsblock mehr - Zutaten laufen über `komponente` in `relations`), `link`, `ort` (nur noch Karte), `relations` (Tabliste "Graph"/"Liste" via `$:/plugins/flibbles/graph/ui/grouped-tabs`, Graph default-aktiv; Tab-Inhalte `relations/graph`+`relations/list`; ein einziger Typ-Scope-Filter für beide Tabs, Person/Spieler/Organisation/Gott/Ort/Artefakt/Buch/Gegenstand/Material), `spieler`. Reihenfolge über `list-after`; reine Render-Infrastruktur.
- **Snippets** (`snippets/*`, Tag `$:/tags/TextEditor/Snippet`): `offene-punkte`, `spoiler-spieler`.
- **Styles** (`styles/*`): `border`, `gegenstand`, `tot`. **Tag-Template** `tags/ort`. **Template** `templates/bild`.
- **Index-/Hub-Tiddler** (Person, Ort, Organisation, Ereignis, ..., Spieler, TBC/Abenteuer; Titel ohne Präfix, Tag `Index`): Typ-Tags tragen das `color`-Feld, aus dem der Graph die Knotenfarbe zieht.
- **tw5-graph-Schema + Graph-Templates**: Fields-EdgeTypes (`$:/config/flibbles/graph/edges/fields/*`) + Relink-Feldtypen; die Graph-Templates `$:/plugins/dndwiki-core/graph/templates/dnd-graph` (Typfarben aus Tag-`color`, `shape=box`, keine Positionsspeicherung) und `.../dnd-ego`; der Ego-View `$:/plugins/dndwiki-core/graph/ego`. Die dünnen View-Definitionen (`$:/graph/Default`/`Kosmogramm`/`Weltkarte`/`Gegenstände`) liegen bewusst je Wiki, nicht hier.

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
