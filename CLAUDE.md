# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektüberblick

Dieses Repository ist das **Plugin-Bündel** für die `DnDWiki`-Repo-Familie
(`DnDWiki`-Vorlage + Kampagnen wie `DnDWiki-Vandalia`/`DnDWiki-Tyranny`). Es wird von
den Wikis als **eine** npm-Git-Dependency (`tiddlydnd-plugins`) konsumiert, auf einen
Git-Tag gepinnt. Jedes Wiki listet die einzelnen Plugin-Ordner, die es davon nutzen
will, explizit in seiner eigenen `tiddlywiki.info` → `plugins`.

Details zur Repo-Familie, Versionierung und Konsum-Modell: siehe `README.md`
(hier) sowie `CLAUDE.md` in den Wiki-Repos (kanonisch gepflegt in `DnDWiki`).

## Enthaltene Plugins (`plugins/`)

| Plugin | Zweck | Bezug zum D&D-Datenmodell |
|---|---|---|
| `dndwiki-core` | Formatschicht: Makros, Filter, ViewTemplates, Styles, Index-Hubs, tw5-graph-Schema | ja, eng gekoppelt |
| `staticfiles` | liefert `images/`+`data/` im Dev-Server aus (server-only) | nein |

Jedes Plugin ist ein eigenständiges **Ordner-Plugin** (Way A, kein Build) mit eigener
`plugin.info`/`version`.

> Ein generisches, D&D-unabhängiges „Tiddler anheften"-Plugin (`pin-tiddler`) wurde
> testweise als eigenes Plugin gebaut, dann aber wieder verworfen: Scope auf den
> einen konkreten Bedarf reduziert (`Abenteuer`-Hub dauerhaft sichtbar, kein
> Close-Button), dafür zurück in `dndwiki-core` — siehe Core-Overrides unten.

## Core-Overrides — Liste & Update-Prozedur

Manche Plugin-Tiddler **überschreiben** einen TiddlyWiki-Core-Shadow (1:1-Kopie des
Core-Originals + gezielte Änderung), weil es dafür keinen Hook/Extension-Point gibt.
Das ist bewusst die **letzte Wahl** — vorher immer prüfen, ob ein offizieller
Erweiterungspunkt (z. B. das `condition`-Feld bei ViewToolbar-Buttons, Tags wie
`$:/tags/AboveStory`) ausreicht.

Aktuelle Liste:

| Datei | Überschreibt | Plugin | Warum kein Hook reicht |
|---|---|---|---|
| `dndwiki-core/$__core_ui_ViewTemplate_body.tid` | `$:/core/ui/ViewTemplate/body` | `dndwiki-core` | Core kann nur *welches* Body-Template gewählt wird beeinflussen, nicht *ob* der Body abhängig vom eingeloggten Spieler (`$:/state/Spieler`) überhaupt gerendert wird. |
| `dndwiki-core/$__core_ui_PageTemplate_story.tid` | `$:/core/ui/PageTemplate/story` | `dndwiki-core` | `handleCloseAllTiddlersEvent` in Core-JS (`navigator.js`) leert `$:/StoryList` hart, ohne Hook. Einzige Möglichkeit, dass der `Abenteuer`-Hub-Tiddler (Tag `$:/tags/Pinned`) das übersteht: der Story-River-Filter selbst muss ihn unabhängig von `$:/StoryList` mit anzeigen. |
| `dndwiki-core/$__core_ui_Buttons_close.tid` | `$:/core/ui/Buttons/close` | `dndwiki-core` | Das `condition`-Feld ist zwar ein offizieller Erweiterungspunkt, erfordert aber trotzdem eine volle Neudeklaration des Buttons (Felder lassen sich nicht einzeln nachrüsten). Blendet den (×)-Button beim `Abenteuer`-Hub aus (Tag `$:/tags/Pinned`), damit er nicht geschlossen werden kann. |

Bewusst **kein** generischer Anheften-Mechanismus (Toggle-Button für beliebige
Tiddler) mehr — nur der eine konkrete Fall `Abenteuer` (dauerhaft per Tag
`$:/tags/Pinned` markiert, kein UI-Weg zum Ändern). Eine generische Variante wurde
gebaut und funktionierte, hatte aber eigene Problemklassen (Story-River-Reihenfolge
bei `pushTop`, „Alle schließen" + Entpinnen ließ offene Tiddler verschwinden,
zusätzliche Overrides für Sidebar/PageControls nötig) — für den tatsächlichen Bedarf
nicht im Verhältnis zum Nutzen.

**Namenskonvention:** Dateien, die einen Core-Titel überschreiben, heißen
`$__core_ui_<Pfad>_<Name>.tid` (Punkte/Slashes im Titel → Unterstriche) — signalisiert
auf den ersten Blick "diese Datei überschreibt Core", unabhängig davon, in welchem
Plugin-Ordner sie liegt.

**Prozedur bei jedem Anheben der `tiddlywiki`-Engine-Version** (in `package.json`
hier, danach mittelbar auch in den Wikis, sobald sie ihrerseits ihre eigene
`tiddlywiki`-Version anheben):

1. `npm install` (neue Engine ziehen).
2. Für jede Zeile obiger Tabelle: die überschriebene Datei gegen das neue Original in
   `node_modules/tiddlywiki/core/ui/<entsprechender Pfad>.tid` diffen.
3. Bei Abweichungen: prüfen, ob die eigene Änderung noch sauber draufpasst
   (übernehmen, dann erneut lokal in einer Kampagne verifizieren) oder ob sich durch
   die Core-Änderung ein Hook/Extension-Point ergeben hat, der den Override jetzt
   überflüssig macht.
4. Diese Tabelle bei Bedarf aktualisieren (neue Overrides ergänzen, obsolete
   entfernen).

(Analoges Diff-Verfahren wie beim Template-Update für `DnDWiki`, siehe dort
„Vorlagen-Version & Template-Update" in `CLAUDE.md`.)

## Neue Version veröffentlichen

Siehe `README.md` → „Neue Version veröffentlichen". Der Git-Tag versioniert das
**ganze Bündel** (alle Plugin-Ordner); jedes einzelne Plugin trägt zusätzlich seine
eigene `version` in seiner `plugin.info`.
