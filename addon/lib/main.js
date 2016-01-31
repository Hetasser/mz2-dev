// Import the page-mod API
var mz_pageMod = require("sdk/page-mod");
var mz_self = require("sdk/self"); 
var mz_data = require("sdk/self").data;
var mz_prefs = require('sdk/simple-prefs')
var mz_storage = require("sdk/simple-storage").storage;
var mz_tabs = require("sdk/tabs");
var mz_urls = require("sdk/url")
var mz_io_files = require("sdk/io/file");




/*
 * fonctions pour rajouter gérer à la fois le http et le https
 */
function buildHttpUrl(url) {
return buildUrl('http', url);
}

function buildHttpsUrl(url) {
return buildUrl('https', url);
}

function buildUrl(scheme, url) {
return scheme + '://' + url + '/*';
}

/*
 * Récupération de liste depuis les options de l'addon Manager
 */
 //construction de la liste des serveurs gérés par MZ
var mz_serverListeBrute = mz_prefs.prefs['mz_serveursMH'].split(',');

// Ajout du http:// et https:// au début, et du /* à la fin  
var mz_serverListe = mz_serverListeBrute.map(buildHttpUrl).concat(mz_serverListeBrute.map(buildHttpsUrl));



//debug
console.log("Liste des serveurs gérés : " + mz_serverListe.toString());
/* 
 *début des modifications
 */

// ajout de l'appel aux scripts sur les pages concernées
mz_pageMod.PageMod({
  include: mz_serverListe,
  contentScriptFile: [mz_data.url("libs/mzapi.js"),mz_data.url("js/branching.js")],
  
  onAttach: function(worker) {        
  worker.port.emit("mz_Branching", mz_prefs);
  worker.port.on("mz_Branching", function(mz_data){
      console.log(mz_data);
      console.log("Fin de traitement");
    });
  }
});                                                                  