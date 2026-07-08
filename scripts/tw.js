#!/usr/bin/env node
/*
 * Cross-platform TiddlyWiki launcher for the plugin bundle's authoring/preview edition.
 *
 * Assembles TIDDLYWIKI_PLUGIN_PATH from this repo's own `plugins` folder
 * (wkod first-party: dndwiki-core, staticfiles) plus the individually pinned
 * flibbles graph-stack packages in node_modules (each ships under <pkg>/plugins),
 * joined with the OS-specific path delimiter (";" Windows, ":" elsewhere) — which
 * is what TiddlyWiki's boot splits on.
 *
 * Also suppresses Node's DEP0169 (url.parse) deprecation warning that TiddlyWiki's
 * core server still triggers (cross-platform equivalent of NODE_OPTIONS=--no-deprecation).
 */
process.noDeprecation = true;

var path = require("path");
var fs = require("fs");

var root = path.join(__dirname, "..");
var nodeModules = path.join(root, "node_modules");

var pluginPaths = [
	path.join(root, "plugins") // wkod first-party: dndwiki-core, staticfiles
];
["tw5-graph", "tw5-vis-network", "tw5-relink"].forEach(function(pkg) {
	pluginPaths.push(path.join(nodeModules, pkg, "plugins"));
});
pluginPaths = pluginPaths.filter(function(p) { return fs.existsSync(p); });

process.env.TIDDLYWIKI_PLUGIN_PATH = pluginPaths.join(path.delimiter);

var $tw = require("tiddlywiki").TiddlyWiki();
$tw.boot.argv = Array.prototype.slice.call(process.argv, 2);
$tw.boot.boot();
