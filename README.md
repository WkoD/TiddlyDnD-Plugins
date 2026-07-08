# TiddlyDnD-Plugins

Plugin-Bündel für die **DnDWiki**-Repo-Familie. Ersetzt den früheren
Engine-Fork `WkoD/TiddlyDnD`: Die Wikis nutzen jetzt das **offizielle**
`tiddlywiki` aus npm und beziehen die Plugins von hier.

Dieses Bündel enthält nur noch die **Eigenplugins** (`dndwiki-core`, `staticfiles`). Der **flibbles-Graph-Stack**
(graph/vis-network/relink) wird von jedem Wiki **einzeln als release-gepinnte Git-Dep**
bezogen (nicht mehr als Snapshot hier vendored). `felixhayashi/tiddlymap` (+hotzone/
topstoryview) wurde durch `flibbles/graph` abgelöst und entfernt.

## Inhalt (`plugins/`)

| Plugin | Ordner | Zweck | Herkunft |
|---|---|---|---|
| `$:/plugins/dndwiki-core` | `plugins/dndwiki-core` | **D&D-Formatschicht**: Makros, Filter, ViewTemplates, Styles, Index-Hubs, Graph-Schema | eigen, versioniert |
| `$:/plugins/staticfiles` | `plugins/staticfiles` | liefert `images/`+`data/` im Dev-Server aus (server-only) | eigen |

Der Graph-Stack wird **nicht** hier vendored, sondern per Release-Tag gepinnt:
`flibbles/graph` ([tw5-graph](https://github.com/flibbles/tw5-graph)),
`flibbles/vis-network` ([tw5-vis-network](https://github.com/flibbles/tw5-vis-network)),
`flibbles/relink` ([tw5-relink](https://github.com/flibbles/tw5-relink)).

## Formatschicht bearbeiten

Die Formatschicht lebt als **Ordner-Plugin** unter
`plugins/dndwiki-core/` (kein Build-Schritt — der Ordner *ist* das Plugin).

```bash
npm install
npm start          # Vorschau-/Autoren-Edition unter http://127.0.0.1:8080
```

Bearbeitet werden die Format-Tiddler direkt als Dateien in
`plugins/dndwiki-core/` (im IDE); `npm start` rendert sie mit dem Graph-Stack zur
Vorschau. Der plattformneutrale Launcher `scripts/tw.js` baut den `TIDDLYWIKI_PLUGIN_PATH`
aus `./plugins` + den gepinnten `node_modules/tw5-*/plugins`.

## Neue Version veröffentlichen

1. Format ändern → `version` in `plugins/dndwiki-core/plugin.info` erhöhen
   (semver: patch=Fix, minor=neue Makros/Hubs, major=brechende Änderung).
2. Committen, dann **taggen == Version** und Release setzen:
   ```bash
   git tag 1.1.0 && git push origin master 1.1.0
   gh release create 1.1.0 --generate-notes
   ```
3. Die Konsumenten (DnDWiki-Vorlage + Kampagnen) heben ihren Pin **bewusst** an
   (`#1.0.1` → `#1.1.0`) und laufen `npm install`. Kein Auto-Sync — gewollte
   Stabilität. Dieses Repo kennt die Kampagnen nicht.

## Konsum durch ein Wiki

`package.json` des Wikis pinnt das Bündel **und** den Graph-Stack je Release-Tag:

```json
"devDependencies": {
  "tiddlywiki": "5.4.0",
  "tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#1.1.0",
  "tw5-graph": "git+https://github.com/flibbles/tw5-graph.git#v1.7.1",
  "tw5-vis-network": "git+https://github.com/flibbles/tw5-vis-network.git#v10.6.3",
  "tw5-relink": "git+https://github.com/flibbles/tw5-relink.git#v2.6.0"
}
```

Ein kleiner Launcher (`scripts/tw.js`) im Wiki setzt `TIDDLYWIKI_PLUGIN_PATH`
plattformneutral (`path.delimiter`) aus allen `node_modules/*/plugins` zusammen;
`tiddlywiki.info` listet die Plugins per Ordnername (`dndwiki-core`, `staticfiles`,
`graph`, `vis-network`, `relink`).
