dojo.provide('PhotoBrowser.StoredSearchController');

dojo.require('PhotoBrowser.SearchController');
dojo.require('dojox.storage');

(function(d) {
	d.declare('PhotoBrowser.StoredSearchController', [ PhotoBrowser.SearchController ], {
		storedSearches : [],
		localStore : 'storedSearches',
		
		postCreate : function() {
			this.inherited(arguments);
			this.useStorage = true;
			
			this.storedSearches = dojox.storage.get(this.localStore);
			
			if (this.storedSearches && this.storedSearches.length) {
				d.forEach(this.storedSearches, function(term) {
					this.terms[term] || this._makeNewTerm(term);
				}, this);
			} else {
				this.storedSearches = [];
			}
			
			d.subscribe('/term/add', this, '_addToStore');
			d.subscribe('/term/remove', this, '_removeFromStore');
			d.subscribe('/storage', this, '_toggleStorage');
		},
		
		_addToStore : function(term) {
			if (!this.useStorage) { return; }
			this.storedSearches.push(term);
			dojox.storage.put(this.localStore, this.storedSearches, function(status, keyname) {
				if (status == dojox.storage.FAILED) {
					alert("You do not have permission to store data for this web site.");
				} else if (status == dojox.storage.SUCCESS) {
					console.log('storage success at ' + keyname);
				}
			});			
		},
		
		_removeFromStore : function(term) {
			if (!this.useStorage) { return; }
			pos = d.indexOf(term, this.storedSearches);
			(pos > -1) && this.storedSearches.splice(pos, 1);
			this._store();
		},
		
		_toggleStorage : function(on) {
			console.log('storedSearches', on);
			!on && dojox.storage.clear();
			this.useStorage = on;
		}
	});
})(dojo);