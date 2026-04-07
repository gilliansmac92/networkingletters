// dropdown menu
$(document).ready(function() {
    $('.dropdown-toggle').dropdown();
});

// buttons
document.querySelectorAll('.btn').forEach(buttonElement => {
    const button = bootstrap.Button.getOrCreateInstance(buttonElement)
    button.toggle()
});

// D3 Network Visualization Data and Functions
const RAW = {"nodes":[{"id":"Major General Kirk","type":"Person","degree":10},{"id":"Master of Forbes","type":"Person","degree":10},{"id":"Shrewsbury","type":"Person","degree":8},{"id":"Archibald Hamilton","type":"Person","degree":12},{"id":"George Skirving","type":"Person","degree":9},{"id":"Tweeddale","type":"Person","degree":15},{"id":"Schomberg","type":"Person","degree":12},{"id":"Perth","type":"Person","degree":37},{"id":"Hill","type":"Place","degree":17},{"id":"Melfort","type":"Person","degree":23},{"id":"David Nairne","type":"Person","degree":9},{"id":"John Summerville","type":"Person","degree":10},{"id":"Robert Webb","type":"Person","degree":8},{"id":"John Clark","type":"Person","degree":28},{"id":"London","type":"Place","degree":395},{"id":"Madam Harcourt","type":"Person","degree":35},{"id":"Fyvie","type":"Place","degree":9},{"id":"David Crawford","type":"Person","degree":71},{"id":"Hew Wood","type":"Person","degree":11},{"id":"Duart","type":"Place","degree":9},{"id":"Melville","type":"Person","degree":464},{"id":"Inverary","type":"Place","degree":13},{"id":"Countess of Sunderland","type":"Person","degree":8},{"id":"Kensington Court","type":"Place","degree":38},{"id":"Dunfermline","type":"Person","degree":25},{"id":"Dublin Castle","type":"Place","degree":15},{"id":"Duchess of Hamilton","type":"Person","degree":85},{"id":"Inverlochie","type":"Place","degree":32},{"id":"Kensington","type":"Place","degree":8},{"id":"James Hamilton","type":"Person","degree":11},{"id":"Hamilton","type":"Person","degree":706},{"id":"Privy Council","type":"Organization","degree":92},{"id":"Edward Hungerford","type":"Person","degree":10},{"id":"Mackay","type":"Person","degree":38},{"id":"R. Jevon","type":"Person","degree":8},{"id":"John Hamilton","type":"Person","degree":29},{"id":"Hampton Court","type":"Place","degree":31},{"id":"Breadalbane","type":"Person","degree":108},{"id":"Gilbert Eliot","type":"Person","degree":12},{"id":"William Hamilton","type":"Person","degree":35},{"id":"Countess of Arran","type":"Person","degree":12},{"id":"Buchan","type":"Place","degree":9},{"id":"Hague","type":"Place","degree":15},{"id":"Argyll","type":"Person","degree":41},{"id":"Lady Gerard","type":"Person","degree":62},{"id":"Kirke","type":"Person","degree":13},{"id":"Robert Darloe","type":"Person","degree":14},{"id":"Portland","type":"Person","degree":19},{"id":"Robert Murray","type":"Person","degree":8},{"id":"Nottingham","type":"Place","degree":10},{"id":"Canon","type":"Person","degree":30},{"id":"Captain George Rooke","type":"Person","degree":17},{"id":"Balcarres","type":"Person","degree":8},{"id":"Ross","type":"Person","degree":8},{"id":"Leven","type":"Person","degree":38},{"id":"Viscount Tarbat","type":"Person","degree":39},{"id":"Arran","type":"Person","degree":163},{"id":"Balloch","type":"Place","degree":31},{"id":"Edinburgh","type":"Place","degree":838},{"id":"Carwhin","type":"Place","degree":20},{"id":"Glasgow","type":"Place","degree":15},{"id":"John Dalrymple","type":"Person","degree":101},{"id":"Cardross","type":"Person","degree":39},{"id":"John Buchan","type":"Person","degree":8},{"id":"Feversham","type":"Person","degree":33},{"id":"Whitehall","type":"Place","degree":55},{"id":"Holyrood House","type":"Place","degree":192},{"id":"Dublin","type":"Place","degree":16},{"id":"Lockhart","type":"Person","degree":40},{"id":"Stirling","type":"Place","degree":11},{"id":"Carmichael","type":"Person","degree":9},{"id":"King William","type":"Person","degree":183},{"id":"Scrimgeour","type":"Person","degree":8},{"id":"Thomas Livingston","type":"Person","degree":19},{"id":"Queen Mary","type":"Person","degree":14},{"id":"Tarbat House","type":"Place","degree":22},{"id":"Lady Dunfermline","type":"Person","degree":14},{"id":"Dundee","type":"Person","degree":15},{"id":"Crawford","type":"Person","degree":98},{"id":"Sunderland","type":"Person","degree":21},{"id":"Major General Mackay","type":"Person","degree":23},{"id":"Selkirk","type":"Person","degree":78},{"id":"Atholl","type":"Person","degree":9},{"id":"Rooke","type":"Person","degree":17},{"id":"Robert Lloyd","type":"Person","degree":9},{"id":"Polwarth","type":"Person","degree":32},{"id":"Church of Scotland","type":"Organization","degree":11},{"id":"James Dalrymple","type":"Person","degree":21},{"id":"King James","type":"Person","degree":44},{"id":"Salisbury","type":"Place","degree":12},{"id":"Alexander McDowall","type":"Person","degree":18},{"id":"Stroan","type":"Place","degree":9}],"links":[{"source":"King James","target":"Dublin","weight":5,"types":["FROM_PLACE"]},{"source":"Lady Dunfermline","target":"Dunfermline","weight":7,"types":["WROTE LETTER TO"]},{"source":"Lady Dunfermline","target":"Fyvie","weight":7,"types":["FROM_PLACE"]},{"source":"King James","target":"Dundee","weight":3,"types":["Intercepted Letter","WROTE LETTER TO"]},{"source":"King James","target":"Dublin Castle","weight":7,"types":["FROM_PLACE"]},{"source":"Alexander McDowall","target":"Canon","weight":6,"types":["WROTE LETTER TO"]},{"source":"Alexander McDowall","target":"Dunfermline","weight":1,"types":["WROTE LETTER TO"]},{"source":"Alexander McDowall","target":"Duart","weight":3,"types":["FROM_PLACE"]},{"source":"Buchan","target":"Canon","weight":2,"types":["WROTE LETTER TO"]},{"source":"Buchan","target":"Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"Canon","target":"Melfort","weight":1,"types":["WROTE LETTER TO"]},{"source":"Balcarres","target":"King James","weight":1,"types":["Discourse"]},{"source":"Buchan","target":"Breadalbane","weight":1,"types":["Agreement"]},{"source":"Edinburgh","target":"Perth","weight":15,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"London","weight":2,"types":["Letter"]},{"source":"London","target":"Robert Murray","weight":1,"types":["FROM_PLACE"]},{"source":"Perth","target":"London","weight":1,"types":["Letter"]},{"source":"Holyrood House","target":"Hamilton","weight":42,"types":["FROM_PLACE"]},{"source":"Stroan","target":"Dundee","weight":6,"types":["FROM_PLACE"]},{"source":"Stirling","target":"Mackay","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Privy Council","weight":23,"types":["FROM_PLACE"]},{"source":"London","target":"John Dalrymple","weight":4,"types":["FROM_PLACE"]},{"source":"Dublin Castle","target":"King James","weight":4,"types":["FROM_PLACE"]},{"source":"Inverary","target":"Argyll","weight":2,"types":["FROM_PLACE"]},{"source":"London","target":"Glasgow","weight":1,"types":["Letter"]},{"source":"London","target":"Edinburgh","weight":4,"types":["Letter"]},{"source":"Balloch","target":"Edinburgh","weight":2,"types":["Letter"]},{"source":"Balloch","target":"Breadalbane","weight":25,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Carwhin","weight":13,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Breadalbane","weight":5,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"John Dalrymple","weight":38,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Argyll","weight":8,"types":["FROM_PLACE"]},{"source":"Perth","target":"Mackay","weight":1,"types":["FROM_PLACE"]},{"source":"London","target":"Breadalbane","weight":54,"types":["FROM_PLACE"]},{"source":"London","target":"Carwhin","weight":6,"types":["Letter"]},{"source":"Whitehall","target":"Nottingham","weight":10,"types":["FROM_PLACE"]},{"source":"Balloch","target":"Carwhin","weight":1,"types":["FROM_PLACE"]},{"source":"Hampton Court","target":"King William","weight":4,"types":["FROM_PLACE"]},{"source":"London","target":"James Dalrymple","weight":4,"types":["FROM_PLACE"]},{"source":"Hampton Court","target":"Portland","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Atholl","weight":3,"types":["FROM_PLACE"]},{"source":"Hampton Court","target":"James Dalrymple","weight":1,"types":["FROM_PLACE"]},{"source":"Whitehall","target":"Portland","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Hamilton","weight":3,"types":["FROM_PLACE"]},{"source":"London","target":"Melville","weight":30,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Crawford","weight":81,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Polwarth","weight":15,"types":["FROM_PLACE"]},{"source":"Tarbat House","target":"Viscount Tarbat","weight":11,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"David Nairne","weight":6,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Lockhart","weight":23,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Ross","weight":2,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Cardross","weight":11,"types":["FROM_PLACE"]},{"source":"Perth","target":"Cardross","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"James Dalrymple","weight":7,"types":["FROM_PLACE"]},{"source":"Whitehall","target":"Shrewsbury","weight":2,"types":["FROM_PLACE"]},{"source":"Glasgow","target":"Argyll","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Carmichael","weight":8,"types":["FROM_PLACE"]},{"source":"Kensington Court","target":"King William","weight":16,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Melville","weight":11,"types":["FROM_PLACE"]},{"source":"Whitehall","target":"King William","weight":1,"types":["FROM_PLACE"]},{"source":"Kensington Court","target":"Portland","weight":3,"types":["FROM_PLACE"]},{"source":"Dublin","target":"Hill","weight":1,"types":["FROM_PLACE"]},{"source":"Holyrood House","target":"Melville","weight":5,"types":["FROM_PLACE"]},{"source":"London","target":"Lockhart","weight":14,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Viscount Tarbat","weight":22,"types":["FROM_PLACE"]},{"source":"Whitehall","target":"Queen Mary","weight":5,"types":["FROM_PLACE"]},{"source":"Inverlochie","target":"Hill","weight":16,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Church of Scotland","weight":1,"types":["FROM_PLACE"]},{"source":"Edinburgh","target":"Thomas Livingston","weight":8,"types":["FROM_PLACE"]},{"source":"Hague","target":"John Dalrymple","weight":2,"types":["FROM_PLACE"]},{"source":"Whitehall","target":"Melville","weight":2,"types":["FROM_PLACE"]},{"source":"Crawford","target":"Hamilton","weight":2,"types":["WROTE LETTER TO","FROM_PLACE"]},{"source":"King William","target":"Leven","weight":9,"types":["Warrant","Commission","WROTE LETTER TO"]},{"source":"King William","target":"Melville","weight":9,"types":["Warrant","Memorandum","WROTE LETTER TO"]},{"source":"King James","target":"Canon","weight":2,"types":["WROTE LETTER TO"]},{"source":"Melville","target":"Mackay","weight":2,"types":["Warrant","Instructions"]},{"source":"King William","target":"Church of Scotland","weight":5,"types":["Remarks","WROTE LETTER TO"]},{"source":"Queen Mary","target":"Melville","weight":2,"types":["Attestation","WROTE LETTER TO"]},{"source":"Privy Council","target":"Glasgow","weight":1,"types":["Warrant"]},{"source":"Cardross","target":"Privy Council","weight":2,"types":["WROTE LETTER TO"]},{"source":"Crawford","target":"Privy Council","weight":1,"types":["WROTE LETTER TO"]},{"source":"King William","target":"Privy Council","weight":17,"types":["Letter","Draft Letter","WROTE LETTER TO"]},{"source":"Privy Council","target":"King William","weight":2,"types":["WROTE LETTER TO","Oath"]},{"source":"Privy Council","target":"Melville","weight":2,"types":["Representation","WROTE LETTER TO"]},{"source":"Melville","target":"Cardross","weight":1,"types":["Warrant"]},{"source":"Privy Council","target":"Leven","weight":4,"types":["Warrant","Order"]},{"source":"Tweeddale","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Leven","target":"Melville","weight":1,"types":["Notebook"]},{"source":"David Nairne","target":"Leven","weight":1,"types":["WROTE LETTER TO"]},{"source":"Scrimgeour","target":"Leven","weight":1,"types":["WROTE LETTER TO"]},{"source":"Church of Scotland","target":"Melville","weight":2,"types":["Proceedings","Memorial"]},{"source":"Church of Scotland","target":"King William","weight":2,"types":["Address","WROTE LETTER TO"]},{"source":"Crawford","target":"Melville","weight":5,"types":["WROTE LETTER TO"]},{"source":"Polwarth","target":"Melville","weight":2,"types":["WROTE LETTER TO"]},{"source":"Cardross","target":"Melville","weight":13,"types":["Letter","WROTE LETTER TO"]},{"source":"Melville","target":"Crawford","weight":1,"types":["WROTE LETTER TO"]},{"source":"Melville","target":"Hamilton","weight":74,"types":["Letter","WROTE LETTER TO"]},{"source":"Shrewsbury","target":"Melville","weight":2,"types":["WROTE LETTER TO"]},{"source":"David Nairne","target":"Melville","weight":2,"types":["WROTE LETTER TO"]},{"source":"Lockhart","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Argyll","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Master of Forbes","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Ross","target":"Melville","weight":2,"types":["WROTE LETTER TO"]},{"source":"John Dalrymple","target":"Melville","weight":7,"types":["Letter","WROTE LETTER TO"]},{"source":"Viscount Tarbat","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Scrimgeour","target":"Melville","weight":1,"types":["WROTE LETTER TO"]},{"source":"Melville","target":"Leven","weight":1,"types":["WROTE LETTER TO"]},{"source":"Crawford","target":"Cardross","weight":2,"types":["Letter"]},{"source":"Thomas Livingston","target":"Mackay","weight":2,"types":["Letter"]},{"source":"John Buchan","target":"Melville","weight":4,"types":["Letter"]},{"source":"Mackay","target":"Melville","weight":3,"types":["Letter"]},{"source":"Melville","target":"Scrimgeour","weight":2,"types":["Warrant"]},{"source":"Thomas Livingston","target":"Melville","weight":6,"types":["Letter"]},{"source":"Sunderland","target":"Arran","weight":8,"types":["WROTE LETTER TO"]},{"source":"Sunderland","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"Breadalbane","target":"Arran","weight":1,"types":["WROTE LETTER TO"]},{"source":"Breadalbane","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"John Hamilton","target":"Hamilton","weight":4,"types":["FROM_PLACE","WROTE LETTER TO"]},{"source":"John Hamilton","target":"Edinburgh","weight":2,"types":["FROM_PLACE"]},{"source":"Melfort","target":"Dublin Castle","weight":1,"types":["FROM_PLACE"]},{"source":"Feversham","target":"Major General Kirk","weight":2,"types":["WROTE LETTER TO"]},{"source":"Feversham","target":"Salisbury","weight":12,"types":["FROM_PLACE"]},{"source":"Feversham","target":"Arran","weight":10,"types":["Letter","WROTE LETTER TO"]},{"source":"Feversham","target":"London","weight":2,"types":["FROM_PLACE"]},{"source":"King James","target":"Feversham","weight":2,"types":["Letter","WROTE LETTER TO"]},{"source":"King James","target":"Whitehall","weight":3,"types":["FROM_PLACE"]},{"source":"Robert Webb","target":"Hamilton","weight":2,"types":["FROM_PLACE","WROTE LETTER TO"]},{"source":"Robert Webb","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"George Skirving","target":"Arran","weight":2,"types":["WROTE LETTER TO"]},{"source":"Robert Webb","target":"David Crawford","weight":4,"types":["WROTE LETTER TO"]},{"source":"James Hamilton","target":"Arran","weight":2,"types":["WROTE LETTER TO"]},{"source":"James Hamilton","target":"Edinburgh","weight":3,"types":["FROM_PLACE"]},{"source":"William Hamilton","target":"Arran","weight":13,"types":["WROTE LETTER TO"]},{"source":"William Hamilton","target":"Edinburgh","weight":8,"types":["FROM_PLACE"]},{"source":"Sunderland","target":"Hamilton","weight":3,"types":["WROTE LETTER TO"]},{"source":"Sunderland","target":"Whitehall","weight":2,"types":["FROM_PLACE"]},{"source":"Hamilton","target":"Sunderland","weight":1,"types":["WROTE LETTER TO"]},{"source":"Hamilton","target":"Holyrood House","weight":90,"types":["FROM_PLACE"]},{"source":"John Dalrymple","target":"Arran","weight":2,"types":["WROTE LETTER TO"]},{"source":"John Dalrymple","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Melfort","target":"Perth","weight":2,"types":["Intercepted Letter"]},{"source":"Melfort","target":"Dublin","weight":4,"types":["FROM_PLACE"]},{"source":"Tweeddale","target":"Hamilton","weight":5,"types":["Letter","WROTE LETTER TO"]},{"source":"Tweeddale","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"Shrewsbury","target":"Hamilton","weight":2,"types":["Letter","WROTE LETTER TO"]},{"source":"Shrewsbury","target":"London","weight":2,"types":["FROM_PLACE"]},{"source":"Viscount Tarbat","target":"Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"Viscount Tarbat","target":"Privy Council","weight":1,"types":["Petition"]},{"source":"Schomberg","target":"Hamilton","weight":4,"types":["Letter","WROTE LETTER TO"]},{"source":"Major General Kirk","target":"Hamilton","weight":3,"types":["WROTE LETTER TO"]},{"source":"Captain George Rooke","target":"Hamilton","weight":9,"types":["Instructions","WROTE LETTER TO"]},{"source":"James Dalrymple","target":"Hamilton","weight":4,"types":["Letter","WROTE LETTER TO"]},{"source":"James Dalrymple","target":"Hampton Court","weight":2,"types":["FROM_PLACE"]},{"source":"John Dalrymple","target":"Hamilton","weight":17,"types":["Letter","WROTE LETTER TO"]},{"source":"John Dalrymple","target":"London","weight":10,"types":["FROM_PLACE"]},{"source":"John Dalrymple","target":"Hague","weight":6,"types":["FROM_PLACE"]},{"source":"Argyll","target":"Hamilton","weight":12,"types":["Letter","WROTE LETTER TO"]},{"source":"Argyll","target":"Glasgow","weight":3,"types":["FROM_PLACE"]},{"source":"Argyll","target":"Inverary","weight":3,"types":["FROM_PLACE"]},{"source":"Master of Forbes","target":"Hamilton","weight":4,"types":["Letter","WROTE LETTER TO"]},{"source":"Polwarth","target":"Hamilton","weight":7,"types":["Letter","WROTE LETTER TO"]},{"source":"Polwarth","target":"Edinburgh","weight":7,"types":["FROM_PLACE"]},{"source":"Hamilton","target":"Melville","weight":64,"types":["Letter","WROTE LETTER TO"]},{"source":"Hamilton","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Major General Mackay","target":"Hamilton","weight":12,"types":["Paper","WROTE LETTER TO"]},{"source":"Major General Mackay","target":"Stirling","weight":2,"types":["FROM_PLACE"]},{"source":"Major General Mackay","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Melville","target":"London","weight":50,"types":["FROM_PLACE"]},{"source":"King William","target":"Hampton Court","weight":15,"types":["FROM_PLACE"]},{"source":"King William","target":"Hamilton","weight":17,"types":["Warrant","Letter","WROTE LETTER TO"]},{"source":"King William","target":"Whitehall","weight":3,"types":["FROM_PLACE"]},{"source":"Melville","target":"Hampton Court","weight":1,"types":["FROM_PLACE"]},{"source":"King William","target":"Kensington","weight":4,"types":["FROM_PLACE"]},{"source":"Melville","target":"Whitehall","weight":3,"types":["FROM_PLACE"]},{"source":"King William","target":"Hague","weight":1,"types":["FROM_PLACE"]},{"source":"John Hamilton","target":"David Crawford","weight":9,"types":["WROTE LETTER TO"]},{"source":"John Hamilton","target":"Arran","weight":1,"types":["FROM_PLACE"]},{"source":"Privy Council","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Arran","target":"David Crawford","weight":2,"types":["WROTE LETTER TO"]},{"source":"Robert Murray","target":"Arran","weight":2,"types":["WROTE LETTER TO"]},{"source":"Robert Murray","target":"London","weight":3,"types":["FROM_PLACE"]},{"source":"Robert Murray","target":"Selkirk","weight":1,"types":["WROTE LETTER TO"]},{"source":"Tweeddale","target":"Edinburgh","weight":5,"types":["FROM_PLACE"]},{"source":"Robert Darloe","target":"David Crawford","weight":7,"types":["WROTE LETTER TO"]},{"source":"Robert Darloe","target":"Hamilton","weight":7,"types":["FROM_PLACE"]},{"source":"Duchess of Hamilton","target":"Hamilton","weight":5,"types":["FROM_PLACE"]},{"source":"Hew Wood","target":"David Crawford","weight":6,"types":["WROTE LETTER TO"]},{"source":"Hew Wood","target":"Hamilton","weight":5,"types":["FROM_PLACE"]},{"source":"John Dalrymple","target":"David Crawford","weight":1,"types":["WROTE LETTER TO"]},{"source":"William Hamilton","target":"David Crawford","weight":7,"types":["WROTE LETTER TO"]},{"source":"John Hamilton","target":"Holyrood House","weight":4,"types":["FROM_PLACE"]},{"source":"Selkirk","target":"David Crawford","weight":1,"types":["WROTE LETTER TO"]},{"source":"Selkirk","target":"London","weight":31,"types":["FROM_PLACE"]},{"source":"John Hamilton","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"Gilbert Eliot","target":"Hamilton","weight":6,"types":["WROTE LETTER TO"]},{"source":"Gilbert Eliot","target":"Edinburgh","weight":6,"types":["FROM_PLACE"]},{"source":"William Hamilton","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"Hamilton","target":"John Dalrymple","weight":1,"types":["WROTE LETTER TO"]},{"source":"Hamilton","target":"King William","weight":15,"types":["Letter","WROTE LETTER TO"]},{"source":"Hamilton","target":"Duchess of Hamilton","weight":43,"types":["WROTE LETTER TO"]},{"source":"James Hamilton","target":"David Crawford","weight":1,"types":["WROTE LETTER TO"]},{"source":"James Hamilton","target":"Hamilton","weight":2,"types":["WROTE LETTER TO","FROM_PLACE"]},{"source":"Duchess of Hamilton","target":"Arran","weight":11,"types":["WROTE LETTER TO"]},{"source":"Hamilton","target":"Arran","weight":19,"types":["WROTE LETTER TO"]},{"source":"Arran","target":"Hamilton","weight":4,"types":["FROM_PLACE","WROTE LETTER TO"]},{"source":"Hamilton","target":"London","weight":39,"types":["FROM_PLACE"]},{"source":"Selkirk","target":"Arran","weight":10,"types":["WROTE LETTER TO"]},{"source":"Countess of Arran","target":"Arran","weight":8,"types":["WROTE LETTER TO"]},{"source":"Countess of Arran","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"Arran","target":"Duchess of Hamilton","weight":3,"types":["WROTE LETTER TO"]},{"source":"Countess of Sunderland","target":"Arran","weight":4,"types":["WROTE LETTER TO"]},{"source":"Duchess of Hamilton","target":"Holyrood House","weight":1,"types":["FROM_PLACE"]},{"source":"Archibald Hamilton","target":"Arran","weight":2,"types":["WROTE LETTER TO"]},{"source":"Archibald Hamilton","target":"London","weight":2,"types":["FROM_PLACE"]},{"source":"Arran","target":"Robert Murray","weight":1,"types":["WROTE LETTER TO"]},{"source":"Arran","target":"Whitehall","weight":2,"types":["FROM_PLACE"]},{"source":"Archibald Hamilton","target":"Duchess of Hamilton","weight":2,"types":["WROTE LETTER TO"]},{"source":"Argyll","target":"Arran","weight":1,"types":["WROTE LETTER TO"]},{"source":"King William","target":"London","weight":4,"types":["FROM_PLACE"]},{"source":"Countess of Arran","target":"Duchess of Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"Duchess of Hamilton","target":"Countess of Arran","weight":1,"types":["WROTE LETTER TO"]},{"source":"Schomberg","target":"Arran","weight":1,"types":["WROTE LETTER TO"]},{"source":"Melfort","target":"Balcarres","weight":2,"types":["Intercepted Letter","WROTE LETTER TO"]},{"source":"Melfort","target":"Dundee","weight":2,"types":["Intercepted Letter","WROTE LETTER TO"]},{"source":"John Summerville","target":"Hamilton","weight":4,"types":["FROM_PLACE","WROTE LETTER TO"]},{"source":"John Summerville","target":"Edinburgh","weight":2,"types":["FROM_PLACE"]},{"source":"John Summerville","target":"Perth","weight":2,"types":["WROTE LETTER TO"]},{"source":"Perth","target":"Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"Perth","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Thomas Livingston","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"David Crawford","target":"Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"David Crawford","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Robert Lloyd","target":"Madam Harcourt","weight":3,"types":["WROTE LETTER TO"]},{"source":"King James","target":"Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"Hamilton","target":"King James","weight":1,"types":["WROTE LETTER TO"]},{"source":"Queen Mary","target":"Hamilton","weight":2,"types":["Letter","WROTE LETTER TO"]},{"source":"Queen Mary","target":"Kensington","weight":2,"types":["FROM_PLACE"]},{"source":"Hamilton","target":"Queen Mary","weight":2,"types":["Letter","WROTE LETTER TO"]},{"source":"Crawford","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Melville","target":"Privy Council","weight":1,"types":["WROTE LETTER TO"]},{"source":"George Skirving","target":"Glasgow","weight":3,"types":["FROM_PLACE"]},{"source":"Portland","target":"Hamilton","weight":5,"types":["Letter","WROTE LETTER TO"]},{"source":"Portland","target":"Kensington","weight":1,"types":["FROM_PLACE"]},{"source":"Hamilton","target":"Portland","weight":3,"types":["WROTE LETTER TO"]},{"source":"Portland","target":"Whitehall","weight":1,"types":["FROM_PLACE"]},{"source":"Selkirk","target":"Hamilton","weight":28,"types":["WROTE LETTER TO"]},{"source":"Selkirk","target":"Kensington","weight":1,"types":["FROM_PLACE"]},{"source":"Selkirk","target":"Hague","weight":2,"types":["FROM_PLACE"]},{"source":"R. Jevon","target":"Lady Gerard","weight":4,"types":["WROTE LETTER TO"]},{"source":"Edward Hungerford","target":"Lady Gerard","weight":1,"types":["WROTE LETTER TO"]},{"source":"Edward Hungerford","target":"London","weight":1,"types":["FROM_PLACE"]},{"source":"R. Jevon","target":"London","weight":2,"types":["FROM_PLACE"]},{"source":"Robert Lloyd","target":"Lady Gerard","weight":2,"types":["WROTE LETTER TO"]},{"source":"Archibald Hamilton","target":"John Clark","weight":2,"types":["WROTE LETTER TO"]},{"source":"Archibald Hamilton","target":"Hamilton","weight":2,"types":["FROM_PLACE"]},{"source":"John Clark","target":"Hamilton","weight":1,"types":["FROM_PLACE"]},{"source":"William Hamilton","target":"John Clark","weight":1,"types":["WROTE LETTER TO"]},{"source":"William Hamilton","target":"Hamilton","weight":1,"types":["FROM_PLACE"]},{"source":"Countess of Sunderland","target":"Duchess of Hamilton","weight":1,"types":["WROTE LETTER TO"]},{"source":"King James","target":"Atholl","weight":1,"types":["WROTE LETTER TO"]},{"source":"King James","target":"Balcarres","weight":2,"types":["Intercepted Letter","WROTE LETTER TO"]},{"source":"George Skirving","target":"John Clark","weight":3,"types":["WROTE LETTER TO"]},{"source":"John Hamilton","target":"John Clark","weight":2,"types":["WROTE LETTER TO"]},{"source":"Mackay","target":"Hamilton","weight":10,"types":["Letter"]},{"source":"Mackay","target":"Stirling","weight":2,"types":["FROM_PLACE"]},{"source":"Mackay","target":"Edinburgh","weight":1,"types":["FROM_PLACE"]},{"source":"Rooke","target":"Hamilton","weight":6,"types":["Letter"]},{"source":"Kirke","target":"Hamilton","weight":3,"types":["Account","Letter"]},{"source":"Rooke","target":"Kirke","weight":2,"types":["Letter"]},{"source":"Feversham","target":"Kirke","weight":2,"types":["Letter"]}]};

const COLOR = { Person: '#5c8dd4', Place: '#3aa98a', Organization: '#d47a3a' };
const STROKE = { Person: '#3a6cb2', Place: '#1a7a5a', Organization: '#a05a1a' };

let visTypes = new Set(['Person', 'Place', 'Organization']);
let simulation, svg, g, linkSel, nodeG;

function r(d) {
  const maxDeg = 838;
  return Math.max(5, Math.min(30, 5 + 25 * Math.sqrt(d.degree / maxDeg)));
}

function build() {
  const container = document.getElementById('graph-container');
  const W = container.clientWidth;
  const H = container.clientHeight - 52 - 30;

  d3.select('#graph-svg').selectAll('*').remove();
  svg = d3.select('#graph-svg').attr('width', W).attr('height', H);

  const activeIds = new Set(RAW.nodes.filter(n => visTypes.has(n.type)).map(n => n.id));
  const nodes = RAW.nodes.filter(n => activeIds.has(n.id)).map(n => ({...n}));
  const links = RAW.links.filter(l => {
    const s = l.source?.id || l.source;
    const t = l.target?.id || l.target;
    return activeIds.has(s) && activeIds.has(t) && s !== t;
  }).map(l => ({...l}));

  document.getElementById('stats').textContent = `${nodes.length} nodes · ${links.length} edges`;

  g = svg.append('g');

  const zoom = d3.zoom().scaleExtent([0.2, 5])
    .on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2));

  linkSel = g.append('g').attr('class', 'links')
    .selectAll('line').data(links).join('line')
    .attr('stroke', d => d.types?.includes('FROM_PLACE') ? 'rgba(80,130,170,0.4)' : 'rgba(180,150,90,0.3)')
    .attr('stroke-dasharray', d => d.types?.includes('FROM_PLACE') ? '3 3' : null)
    .attr('stroke-width', d => Math.max(0.5, Math.min(4, 0.4 + d.weight * 0.14)));

  nodeG = g.append('g').attr('class', 'nodes')
    .selectAll('g').data(nodes).join('g')
    .attr('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); }))
    .on('click', (e, d) => { if (d.fx != null) { d.fx = null; d.fy = null; } })
    .on('mouseover', (e, d) => showTip(e, d, links))
    .on('mousemove', moveTip)
    .on('mouseout', hideTip);

  nodeG.append('circle')
    .attr('r', d => r(d) + 3)
    .attr('fill', d => COLOR[d.type] || '#888')
    .attr('opacity', 0.15);

  nodeG.append('circle')
    .attr('r', r)
    .attr('fill', d => COLOR[d.type] || '#888')
    .attr('stroke', d => STROKE[d.type] || '#555')
    .attr('stroke-width', 1);

  nodeG.append('text')
    .attr('dy', '0.32em').attr('text-anchor', 'middle')
    .style('font-size', d => Math.min(10, r(d) * 0.7) + 'px')
    .style('font-family', 'Source Serif 4, Georgia, serif')
    .style('fill', '#fff').style('pointer-events', 'none').style('font-weight', '600')
    .text(d => {
      const ri = r(d);
      if (ri < 11) return '';
      const name = d.id.split(' ').pop();
      return name.length > 9 ? name.slice(0, 8) + '…' : name;
    });

  g.append('g').attr('class', 'labels')
    .selectAll('text').data(nodes.filter(n => n.degree > 60)).join('text')
    .style('font-size', '11px').style('font-family', 'Playfair Display, Georgia, serif')
    .style('fill', 'rgba(200,170,100,0.85)').style('pointer-events', 'none')
    .attr('dy', '-0.7em').attr('text-anchor', 'middle')
    .text(d => d.id);

  if (simulation) simulation.stop();
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => 55 + 70 / (d.weight + 1)))
    .force('charge', d3.forceManyBody().strength(d => -100 - d.degree * 0.55))
    .force('collide', d3.forceCollide().radius(d => r(d) + 5))
    .force('x', d3.forceX(0).strength(0.04))
    .force('y', d3.forceY(0).strength(0.04))
    .on('tick', () => {
      linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodeG.attr('transform', d => `translate(${d.x},${d.y})`);
      g.selectAll('.labels text').attr('x', d => d.x).attr('y', d => d.y);
    });
}

function showTip(e, d, links) {
  const connectedIds = new Set();
  links.forEach(l => {
    const s = l.source?.id || l.source;
    const t = l.target?.id || l.target;
    if (s === d.id) connectedIds.add(t);
    if (t === d.id) connectedIds.add(s);
  });
  const edgeCount = connectedIds.size;
  document.getElementById('tip-name').textContent = d.id;
  document.getElementById('tip-info').textContent = `${d.type} · Degree: ${d.degree} · ${edgeCount} connection${edgeCount !== 1 ? 's' : ''}`;
  document.getElementById('tooltip').style.opacity = '1';
  document.getElementById('info-node').textContent = `${d.id} — ${d.type} — degree ${d.degree}`;
  linkSel
    .attr('stroke-opacity', l => {
      const s = l.source?.id || l.source;
      const t = l.target?.id || l.target;
      return (s === d.id || t === d.id) ? 0.95 : 0.05;
    })
    .attr('stroke-width', l => {
      const s = l.source?.id || l.source;
      const t = l.target?.id || l.target;
      return (s === d.id || t === d.id) ? Math.max(1.5, Math.min(5, 0.5 + l.weight * 0.2)) : 0.3;
    });
  nodeG.selectAll('circle:nth-child(2)')
    .attr('opacity', nd => nd.id === d.id || connectedIds.has(nd.id) ? 1 : 0.2);
}

function moveTip(e) {
  const tip = document.getElementById('tooltip');
  const rect = document.getElementById('graph-container').getBoundingClientRect();
  let x = e.clientX - rect.left + 14;
  let y = e.clientY - rect.top + 14;
  if (x + 230 > rect.width) x = e.clientX - rect.left - 235;
  if (y + 100 > rect.height) y = e.clientY - rect.top - 100;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function hideTip() {
  document.getElementById('tooltip').style.opacity = '0';
  document.getElementById('info-node').textContent = 'Hover a node to explore connections';
  if (!linkSel) return;
  linkSel.attr('stroke-opacity', d => d.types?.includes('FROM_PLACE') ? 0.3 : 0.35)
    .attr('stroke-width', d => Math.max(0.5, Math.min(4, 0.4 + d.weight * 0.14)));
  nodeG.selectAll('circle:nth-child(2)').attr('opacity', 1);
}

['cb-person', 'cb-place', 'cb-org'].forEach(id => {
  document.getElementById(id).addEventListener('change', e => {
    const map = { 'cb-person': 'Person', 'cb-place': 'Place', 'cb-org': 'Organization' };
    e.target.checked ? visTypes.add(map[id]) : visTypes.delete(map[id]);
    build();
  });
});

window.addEventListener('resize', build);
build();
