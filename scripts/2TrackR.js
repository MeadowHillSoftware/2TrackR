"use strict";

var o2TrackR = {};

//REMOVE CASE SENSITIVITY

o2TrackR.addAnthologyAuthors = function() {
    var oLit = o2TrackR.oLit;
    var aAnthologies = Object.keys(oLit["Various Authors"]);
    for (var a = 0; a < aAnthologies.length; a++) {
        var aAuthors = Object.keys(oLit);
        var sAnthology = aAnthologies[a];
        var oAnthology = oLit["Various Authors"][sAnthology];
        var aAnthAuthors = Object.keys(oAnthology);
        for (var aa = 0; aa < aAnthAuthors.length; aa++) {
            var sAnthAuthor = aAnthAuthors[aa];
            if (aAuthors.indexOf(sAnthAuthor) === -1) {
                oLit[sAnthAuthor] = {};
            }
            var oWorks = oAnthology[sAnthAuthor];
            var aWorks = Object.keys(oWorks);
            for (var w = 0; w < aWorks.length; w++) {
                var sWork = aWorks[w];
                var sReview = oWorks[sWork];
                var oBibliography = oLit[sAnthAuthor];
                var aBibliography = Object.keys(oBibliography);
                if (aBibliography.indexOf(sAnthology) === -1) {
                    oLit[sAnthAuthor][sAnthology] = {};
                }
                oLit[sAnthAuthor][sAnthology][sWork] = sReview;
            }
        }
    }
    var sJSON = JSON.stringify(oLit);
    var reviewFile = new Blob([sJSON], {type: 'application/json'});
    var url = URL.createObjectURL(reviewFile);
    var sText = "Exported File: ";
    var span = $('<span></span>').text(sText);
    var link = $('<a />')
        .attr('href', url)
        .attr('download', 'lit-reviews.json')
        .text('lit-reviews.json');
    $('#body')
        .empty()
        .append(span)
        .append(link);
    o2TrackR.oLit = oLit;
};

o2TrackR.parseAnthology = function() {
    var sBook = String.raw``
    var aWorks = sBook.split("; ");
    var oReviews = {};
    for (var i = 0; i < aWorks.length; i++) {
        var sWork  = aWorks[i];
        var aParts = sWork.split("] ");
        console.log(aParts);
        var sAuthor = aParts[0]
        var aAuthor = sAuthor.split("[");
        sAuthor = aAuthor[1];
        var aAuthors = Object.keys(oReviews);
        if (aAuthors.indexOf(sAuthor) === -1) {
            oReviews[sAuthor] = {};
        }
        var sTitle = aParts[1];
        var aTitle = sTitle.split("-- ");
        sTitle = aTitle[0];
        var sReview = aTitle[1];
        oReviews[sAuthor][sTitle] = sReview;
    }
    var sJSON = JSON.stringify(oReviews);
    console.log(sJSON);
};

o2TrackR.parseCollection = function() {
    var sBook = String.raw``;
    var aWorks = sBook.split("; ");
    var oReviews = {};
    for (var i = 0; i < aWorks.length; i++) {
        var sTitle = aWorks[i];
        var aTitle = sTitle.split("-- ");
        sTitle = aTitle[0];
        var sReview = aTitle[1];
        oReviews[sTitle] = sReview;
    }
    var sJSON = JSON.stringify(oReviews);
    console.log(sJSON);
};

o2TrackR.parsePeanuts = function() {
    var sBook = String.raw``;
    var aWorks = sBook.split("; ");
    var oReviews = {};
    for (var i = 0; i < aWorks.length; i++) {
        var sTitle = aWorks[i];
        var aTitle = sTitle.split("-- ");
        sTitle = aTitle[0];
        var sReview = aTitle[1];
        if (sTitle.indexOf("-") !== -1) {
            var aNumbers = sTitle.split("-");
            var iLow = Number(aNumbers[0]);
            var iHigh = Number(aNumbers[1]);
            for (var n = iLow; n < (iHigh + 1); n++) {
                sTitle = String(n);
                oReviews[sTitle] = sReview;
            }
        } else {
            oReviews[sTitle] = sReview;
        }
    }
    var sJSON = JSON.stringify(oReviews);
    console.log(sJSON);
};

o2TrackR.addMainEventListeners = function() {
    $('#reviews').on('change', o2TrackR.handleFileUpload);
    $('#search-button').on('click', o2TrackR.handleSearchButtonClick);
    $('#add-button').on('click', o2TrackR.handleAddButtonClick);
};

o2TrackR.albumSuccessRate = function(sArtist, sAlbum) {
    var oMusic = o2TrackR.oCurrentReviews;
    var iTotal = 0;
    var iPassed = 0;
    if (sArtist !== o2TrackR.sVarious) {
        var oTracks = oMusic[sArtist][sAlbum];
        var aSongs = Object.keys(oTracks);
        for (var t = 0; t < aSongs.length; t++) {
            var sSong = aSongs[t];
            var sRating = oTracks[sSong];
            if (sRating === "yes") {
                iPassed++;
                iTotal++;
            } else if (sRating === "no") {
                iTotal++;
            }
        }
    } else {
        var oArtists = oMusic[sArtist][sAlbum];
        var aActs = Object.keys(oArtists);
        for (var a = 0; a < aActs.length; a++) {
            var sAct = aActs[a];
            var oTracks = oArtists[sAct];
            var aSongs = Object.keys(oTracks);
            for (var t = 0; t < aSongs.length; t++) {
                var sSong = aSongs[t];
                var sRating = oTracks[sSong];
                if (sRating === "yes") {
                    iPassed++;
                    iTotal++;
                } else if (sRating === "no") {
                    iTotal++;
                }
            }
        }
    }
    return [iPassed, iTotal];
};

o2TrackR.allSuccessRate = function() {
    var oMusic = o2TrackR.oCurrentReviews;
    var aArtists = Object.keys(oMusic);
    var iPassed = 0;
    var iTotal = 0;
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        if (sArtist !== o2TrackR.sVarious) {
            var aNumbers = o2TrackR.artistSuccessRate(sArtist);
            iPassed += aNumbers[0];
            iTotal += aNumbers[1];
        }
    }
    return [iPassed, iTotal];
};

o2TrackR.artistSuccessRate = function(sArtist) {
    var oMusic = o2TrackR.oCurrentReviews;
    var oArtist = oMusic[sArtist];
    var aAlbums = Object.keys(oArtist);
    var iPassed = 0;
    var iTotal = 0;
    var oTracks = [];
    for (var a = 0; a < aAlbums.length; a++) {
        var sAlbum = aAlbums[a];
        var oSongs = oArtist[sAlbum];
        var aPieces = Object.keys(oSongs);
        for (var s = 0; s < aPieces.length; s++) {
            var sSong = aPieces[s];
            var aKeys = Object.keys(oTracks);
            var sReview = oSongs[sSong];
            if (aKeys.indexOf(sSong) === -1) {
                oTracks[sSong] = sReview;
            }
        }
    }
    aKeys = Object.keys(oTracks);
    var iPassed = 0;
    var iTotal = 0;
    for (var k = 0; k < aKeys.length; k++) {
        sSong = aKeys[k];
        sReview = oTracks[sSong];
        if (sReview === "yes") {
            iPassed++;
            iTotal++;
        } else if (sReview === "no") {
            iTotal++;
        }
    }
    return [iPassed, iTotal];
};

o2TrackR.calculatePercentage = function(iPassed, iTotal) {
    var iProduct = iPassed * 100;
    var iPercent = iProduct / iTotal;
    var sPercent = String(iPercent);
    var aPointless = sPercent.split(".");
    var sWhole = aPointless[0];
    return sWhole;
};

o2TrackR.displayAlbum = function(aNumbers, sArtist, sAlbum) {
    var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
    sPercent = sPercent + "%";
    var artist = $('<td></td>').append(sArtist).addClass('results-table');
    var album = $('<td></td>').append(sAlbum).addClass('results-table');
    var percent = $('<td></td>').append(sPercent).addClass('results-table');
    var row = $('<tr></tr>');
    row.append(artist)
        .append(album)
        .append(percent);
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percentage</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleAlbum)
        .append(titlePercent);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header)
        .append(row);
    var div = $('#results-div');
    div.append(table);
};

o2TrackR.displayAll = function() {
    var aNumbers = o2TrackR.allSuccessRate();
    var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
    sPercent = sPercent + "%";
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleTotal = $('<th>Percent</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleTotal);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var artist = $('<td>All Artists</td>');
    artist.addClass('results-table');
    var total = $('<td></td>');
    total.append(sPercent).addClass('results-table');
    var row = $('<tr></tr>');
    row.append(artist)
        .append(total);
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header)
        .append(row);
    $('#results-div').append(table);
};

o2TrackR.displayArtist = function(sArtist) {
	var sLowInput = sArtist.toLowerCase();
    var oMusic = o2TrackR.oCurrentReviews;
	var aArtists = Object.keys(oMusic);
    var aNumbers = o2TrackR.artistSuccessRate(sArtist);
    var sOverall = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
    sOverall = sOverall + "%";
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleTotal = $('<th>Percent</th>').addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percent</th>').addClass('results-table');
    var titleSong = $(o2TrackR.sWork).addClass('results-table');
    var titleReview = $('<th>Review</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleTotal)
        .append(titleAlbum)
        .append(titlePercent)
        .append(titleSong)
        .append(titleReview);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var artist = $('<td></td>');
    artist.append(sArtist).addClass('results-table');
    var total = $('<td></td>');
    total.append(sOverall).addClass('results-table');
    var row = $('<tr></tr>');
    var one = $('<td></td>').addClass('results-table');
    var two = $('<td></td>').addClass('results-table');
    var three = $('<td></td>').addClass('results-table');
    var four = $('<td></td>').addClass('results-table');
    row.append(artist)
        .append(total)
        .append(one)
        .append(two)
        .append(three)
        .append(four);
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header)
        .append(row);
    var oArtist = oMusic[sArtist];
    var aAlbums = Object.keys(oArtist);
    var oVarious = oMusic[o2TrackR.sVarious];
    var aCompilations = Object.keys(oVarious);
    for (var a = 0; a < aAlbums.length; a++) {
        var sAlbum = aAlbums[a];
        if (aCompilations.indexOf(sAlbum) !== -1) {
            var oCompilation = oVarious[sAlbum];
            var aCompArtists = Object.keys(oCompilation);
            if (aCompArtists.indexOf(sArtist) !== -1) {
                aNumbers = o2TrackR.albumSuccessRate(o2TrackR.sVarious, sAlbum);
            }
        } else {
            aNumbers = o2TrackR.albumSuccessRate(sArtist, sAlbum);
        }
        var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
        sPercent = sPercent + "%";
        var oAlbum = oArtist[sAlbum];
        var aSongs = Object.keys(oAlbum);
        for (var s = 0; s < aSongs.length; s++) {
            var sSong = aSongs[s];
            var row = $('<tr></tr>');
            one = $('<td></td>').addClass('results-table');
            two = $('<td></td>').addClass('results-table');
            three = $('<td></td>').addClass('results-table');
            four = $('<td></td>').addClass('results-table');
            var album = $('<td></td>')
                .addClass('results-table')
                .append(sAlbum);
            var percent = $('<td></td>')
                .addClass('results-table')
                .append(sPercent);
            var song = $('<td></td>')
                .addClass('results-table')
                .append(sSong);
            var sReview = oAlbum[sSong];
            var review = $('<td></td>')
                .addClass('results-table')
                .append(sReview);
            if (s === 0) {
                row.append(one)
                    .append(two)
                    .append(album)
                    .append(percent)
                    .append(song)
                    .append(review);
            } else {
                row.append(one)
                    .append(two)
                    .append(three)
                    .append(four)
                    .append(song)
                    .append(review);
            }
            table.append(row);
        }
    }
    var lineBreak = $('</br>');
    $('#results-div').append(lineBreak)
		.append(table);
};

o2TrackR.displayFoundAlbums = function(oResults) {
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percent</th>').addClass('results-table');
    var titleSong = $(o2TrackR.sWork).addClass('results-table');
    var titleReview = $('<th>Review</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleAlbum)
        .append(titlePercent)
        .append(titleSong)
        .append(titleReview);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var one = $('<td></td>').addClass('results-table');
    var two = $('<td></td>').addClass('results-table');
    var three = $('<td></td>').addClass('results-table');
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header);
    $('#results-div').append(table);
    var aArtists = Object.keys(oResults);
    var oMusic = o2TrackR.oCurrentReviews;
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var artist = $('<td></td>')
            .addClass('results-table')
            .append(sArtist);
        var aRecords = oResults[sArtist];
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            var aNumbers = o2TrackR.albumSuccessRate(sArtist, sRecord);
            var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
            var oRecord = oMusic[sArtist][sRecord]
            if (sArtist === o2TrackR.sVarious) {
                var aCompArtists = Object.keys(oRecord);
                var aSongs = [];
                for (var ca = 0; ca < aCompArtists.length; ca++) {
                    var sCompArtist = aCompArtists[ca];
                    var aTracks = Object.keys(oRecord[sCompArtist]);
                    for (var t = 0; t < aTracks.length; t++) {
                        var sTrack = aTracks[t];
                        aSongs.push(sTrack);
                    }
                }
            } else {
                var aSongs = Object.keys(oRecord);
            }
            var record = $('<td></td>')
                .addClass('results-table')
                .append(sRecord);
            var percent = $('<td></td>')
                .addClass('results-table')
                .append(sPercent);
            for (var s = 0; s < aSongs.length; s++) {
                var one = $('<td></td>').addClass('results-table');
                var two = $('<td></td>').addClass('results-table');
                var three = $('<td></td>').addClass('results-table');
                var sSong = aSongs[s];
                if (sArtist === o2TrackR.sVarious) {
                    for (var ca = 0; ca < aCompArtists.length; ca++) {
                        var sCompArtist = aCompArtists[ca];
                        var oTracks = oRecord[sCompArtist];
                        var aTracks = Object.keys(oTracks);
                        if (aTracks.indexOf(sSong) !== -1) {
                            var sReview = oTracks[sSong];
                        }
                    }
                } else {
                    var sReview = oRecord[sSong];
                }
                var song = $('<td></td>')
                    .addClass('results-table')
                    .append(sSong);
                var review = $('<td></td>')
                    .addClass('results-table')
                    .append(sReview);
                var row = $('<tr></tr>');
                if (r === 0 && s === 0) {
                    row.append(artist)
                        .append(record)
                        .append(percent)
                        .append(song)
                        .append(review);
                } else if (r !== 0 && s === 0) {
                    row.append(one)
                        .append(record)
                        .append(percent)
                        .append(song)
                        .append(review);
                } else {
                    row.append(one)
                        .append(two)
                        .append(three)
                        .append(song)
                        .append(review)
                }
                table.append(row);
            }
        }
    }
};

o2TrackR.displayFoundSongs = function(oResults) {
    var titleSong = $(o2TrackR.sWork).addClass('results-table');
    var titleReview = $('<th>Review</th>').addClass('results-table');
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percent</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleSong)
        .append(titleReview)
        .append(titleArtist)
        .append(titleAlbum)
        .append(titlePercent);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header);
    $('#results-div').append(table);
    var aArtists = Object.keys(oResults);
    aArtists.sort();
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var oDiscography = oResults[sArtist];
        var aRecords = Object.keys(oDiscography);
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            var aNumbers = o2TrackR.albumSuccessRate(sArtist, sRecord);
            var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
            var oRecord = oResults[sArtist][sRecord];
            var aSongs = Object.keys(oRecord);
            for (var s = 0; s < aSongs.length; s++) {
                var sSong = aSongs[s];
                var sReview = oRecord[sSong];
                var artist = $('<td></td>')
                    .addClass('results-table')
                    .append(sArtist);
                var record = $('<td></td>')
                    .addClass('results-table')
                    .append(sRecord);
                var percent = $('<td></td>')
                    .addClass('results-table')
                    .append(sPercent);
                var song = $('<td></td>')
                    .addClass('results-table')
                    .append(sSong);
                var review = $('<td></td>')
                    .addClass('results-table')
                    .append(sReview);
                var row = $('<tr></tr>');
                row.append(song)
                    .append(review)
                    .append(artist)
                    .append(record)
                    .append(percent);
                table.append(row);
            }
        }
    }
};

o2TrackR.findAlbum = function(sAlbum) {
    var oMusic = o2TrackR.oCurrentReviews;
    var aArtists = Object.keys(oMusic);
    var sLowInput = sAlbum.toLowerCase();
    var oResults = {};
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var oAlbums = oMusic[sArtist];
        var aRecords = Object.keys(oAlbums);
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            var sLowResult = sRecord.toLowerCase();
            if (sLowResult.indexOf(sLowInput) !== -1) {
                var aKeys = Object.keys(oResults);
                if (aKeys.indexOf(sArtist) === -1) {
                    oResults[sArtist] = [sRecord];
                } else {
                    oResults[sArtist].push(sRecord);
                }
            }
        }
    }
    var aCompilations = oResults[o2TrackR.sVarious];
    if (aCompilations !== undefined) {
        for (var c = 0; c < aCompilations.length; c++) {
            var sCompilation = aCompilations[c];
            var oCompilation = oMusic[o2TrackR.sVarious][sCompilation];
            var aCompArtists = Object.keys(oCompilation);
            for (var ca = 0; ca < aCompArtists.length; ca++) {
                var sCompArtist = aCompArtists[ca];
                var aDiscography = oResults[sCompArtist];
                var aFiltered = [];
                for (var d = 0; d < aDiscography.length; d++) {
                    var sDisc = aDiscography[d];
                    if (sDisc !== sCompilation) {
                        aFiltered.push(sDisc);
                    }
                }
                if (aFiltered.length === 0) {
                    delete oResults[sCompArtist];
                } else {
                    oResults[sCompArtist] = aFiltered;
                }
            }
        }
    }
    o2TrackR.displayFoundAlbums(oResults);
};

o2TrackR.findArtist = function(sArtist) {
	var sLowInput = sArtist.toLowerCase();
    var oMusic = o2TrackR.oCurrentReviews;
	var aArtists = Object.keys(oMusic);
	var aExacts = [];
	var aPartials = [];
	for (var c = 0; c < aArtists.length; c++) {
		var sCreator = aArtists[c];
		var sLowCreator = sCreator.toLowerCase();
		if (sLowCreator === sLowInput) {
			aExacts.push(aArtists[c]);
		} else if (sLowCreator.indexOf(sLowInput) !== -1) {
			aPartials.push(aArtists[c]);
		}
	}
    var titleResult = $('<th>Exact Match</th>')
        .addClass('results-table');
	var resultRow = $('<tr></tr>');
    var resultHeader = $('<thead></thead>');
    var table = $('<table></table>')
        .addClass('results-table');
    var tbody = $('<tbody></tbody>');
    var partialResult = $('<th>Partial Matches</th>')
	    .addClass('results-table');
	var partialRow = $('<tr></tr>');
	var partialHeader = $('<thead></thead>');
    var partialTable = $('<table></table>')
        .addClass('results-table');
    var partialTbody = $('<tbody></tbody>');
	if (aExacts.length === 0) {
		resultRow.append(titleResult);
		resultHeader.append(resultRow);
		var emptyRow = $('<tr></tr>');
		var emptyCell = $('<td>no exact match</td>').addClass('results-table');
		emptyRow.append(emptyCell);
		tbody.append(emptyRow);
		table.append(tbody);
	} else if (aExacts.length !== 0) {
	    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
	    var titlePercent = $('<th>Percent</th>').addClass('results-table');
	    var headerRow = $('<tr></tr>');
	    headerRow.append(titleArtist)
	        .append(titlePercent);
	    titleResult.attr('colspan', 2);
	    resultRow.append(titleResult);
	    resultHeader.append(resultRow);
	    resultHeader.append(headerRow);
	    var aNumbers = o2TrackR.artistSuccessRate(aExacts[0]);
	    var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
	    var artist = $('<td></td>').addClass('results-table')
			.addClass('link-cell')
			.on('click', o2TrackR.handleArtistClick);
	    var percentage = $('<td></td>').addClass('results-table');
	    artist.append(aExacts[0]);
	    percentage.append(sPercent);
	    var exactMatch = $('<tr></tr>');
	    exactMatch.append(artist)
			.append(percentage);
		tbody.append(exactMatch);
	}
    table.append(resultHeader);
    table.append(tbody);
    var lineBreak1 = $('</br>');
    $('#results-div').append(lineBreak1);
    $('#results-div').append(table);
    var lineBreak2 = $('</br>');
    $('#results-div').append(lineBreak2);
    if (aPartials.length === 0) {
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		var partialEmptyRow = $('<tr></tr>');
		var partialEmptyCell = $('<td>no partial matches</td>').addClass('results-table');
		partialEmptyRow.append(partialEmptyCell);
		partialTbody.append(partialEmptyRow);
		partialTable.append(partialTbody);
	} else if (aPartials.length !== 0) {
		var partialArtist = $(o2TrackR.sCreator)
			.addClass('results-table');
		var partialPercent = $('<th>Percent</th>')
			.addClass('results-table');
		var fieldsRow = $('<tr></tr>');
		fieldsRow.append(partialArtist)
			.append(partialPercent);
		partialResult.attr('colspan', 2);
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		partialHeader.append(fieldsRow);
		partialTable.append(partialHeader);
		for (var p = 0; p < aPartials.length; p++) {
            var sArtist = aPartials[p];
            var aNumbers = o2TrackR.artistSuccessRate(sArtist);
            var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
            var tempRow = $('<tr></tr>');
            var partialArtist = $('<td></td>')
                .addClass('results-table')
                .addClass('link-cell')
                .append(sArtist)
				.on('click', o2TrackR.handleArtistClick);
            var partialPercent = $('<td></td>')
                .addClass('results-table')
                .append(sPercent);
            tempRow.append(partialArtist)
                .append(partialPercent)
            partialTbody.append(tempRow);
		}
	}
	partialTable.append(partialHeader);
	partialTable.append(partialTbody);
	$('#results-div').append(partialTable);
};

o2TrackR.findSong = function(sSong) {
    var oMusic = o2TrackR.oCurrentReviews;
    var aArtists = Object.keys(oMusic);
    var sLowInput = sSong.toLowerCase();
    var oResults = {};
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var oAlbums = oMusic[sArtist];
        var aRecords = Object.keys(oAlbums);
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            var oAlbum = oAlbums[sRecord];
            if (sArtist === o2TrackR.sVarious) {
                var aSongs = [];
                var aCompArtists = Object.keys(oAlbum);
                for (var ca = 0; ca < aCompArtists.length; ca++) {
                    var sCompArtist = aCompArtists[ca];
                    var oTracks = oAlbum[sCompArtist];
                    var aTracks = Object.keys(oTracks);
                    for (var t = 0; t < aTracks.length; t++) {
                        var sTrack = aTracks[t];
                        aSongs.push(sTrack);
                    }
                }
            } else {
                var aSongs = Object.keys(oAlbum);
            }
            for (var s = 0; s < aSongs.length; s++) {
                var aResultists = Object.keys(oResults);
                var sSong = aSongs[s];
                var sLowResult = sSong.toLowerCase();
                if (sLowResult.indexOf(sLowInput) !== -1) {
                    if (sArtist !== o2TrackR.sVarious) {
                        var sReview = oAlbum[sSong];
                    } else {
                        for (var ca = 0; ca < aCompArtists.length; ca++) {
                            var sCompArtist = aCompArtists[ca];
                            var oTracks = oAlbum[sCompArtist];
                            var aTracks = Object.keys(oTracks);
                            for (var t = 0; t < aTracks.length; t++) {
                                var sTrack = aTracks[t];
                                if (sTrack === sSong) {
                                    var sReview = oTracks[sTrack];
                                }
                            }
                        }
                    }
                    if (aResultists.indexOf(sArtist) === -1) {
                        oResults[sArtist] = {};
                        oResults[sArtist][sRecord] = {};
                        oResults[sArtist][sRecord][sSong] = sReview;
                    } else {
                        var aDiscography = Object.keys(oResults[sArtist]);
                        if (aDiscography.indexOf(sRecord) === -1) {
                            oResults[sArtist][sRecord] = {};
                            oResults[sArtist][sRecord][sSong] = sReview;
                        } else {
                            oResults[sArtist][sRecord][sSong] = sReview;
                        }
                    }
                }
            }
        }
    }
    var aResultists = Object.keys(oResults);
    if (aResultists.indexOf(o2TrackR.sVarious) !== -1) {
        var aCompilations = Object.keys(oResults[o2TrackR.sVarious]);
        for (var a = 0; a < aResultists.length; a++) {
            var sArtist = aResultists[a];
            if (sArtist !== o2TrackR.sVarious) {
                var oArtist = oResults[sArtist];
                var aDiscography = Object.keys(oArtist);
                for (var d = 0; d < aDiscography.length; d++) {
                    var sDisc = aDiscography[d];
                    if (aCompilations.indexOf(sDisc) !== -1) {
                        var aCompArtists = Object.keys(oMusic[o2TrackR.sVarious][sDisc]);
                        if (aCompArtists.indexOf(sArtist) !== -1) {
                            delete oResults[sArtist][sDisc];
                        }
                    }
                }
            }
        }
    }
    //REMOVE EMPTY ARTIST OBJECTS
    aResultists = Object.keys(oResults);
    for (var a = 0; a < aResultists.length; a++) {
        var sArtist = aResultists[a];
        var oArtist = oResults[sArtist];
        var aDiscography = Object.keys(oArtist);
        if (aDiscography.length === 0) {
            delete oResults[sArtist];
        }
    }
    o2TrackR.displayFoundSongs(oResults);
};

o2TrackR.handleAddButtonClick = function(event) {
    event.stopPropagation();
    if (o2TrackR.oCurrentReviews === undefined) {
		o2TrackR.oCurrentReviews = {};
	}
    var oReviews = o2TrackR.oCurrentReviews;
    var sSong = $('#song-addition').val();
    var sArtist = $('#artist-addition').val();
    var sAlbum = $('#album-addition').val();
    var sReview = $('input[name=review]:checked').val();
    var sType = $('input[name=type]:checked').val();
	var sMedium = $('input[name=medium]:checked').val();
    if (sSong !== "" && sArtist !== "" && sAlbum !== "" && sType === "regular") {
        var aArtists = Object.keys(oReviews)
        if (aArtists.indexOf(sArtist) === -1) {
            oReviews[sArtist] = {};
        }
        var aAlbums = Object.keys(oReviews[sArtist]);
        if (aAlbums.indexOf(sAlbum) === -1) {
            oReviews[sArtist][sAlbum] = {};
        }
        oReviews[sArtist][sAlbum][sSong] = sReview;
    }
    if (sSong !== "" && sArtist !== "" && sAlbum !== "" && sType === "compilation") {
        if (sMedium === "music") {
            var sVarious = "Various Artists";
        } else {
            var sVarious = "Various Authors";
        }
        var aArtists = Object.keys(oReviews);
        if (aArtists.indexOf(sVarious) === -1) {
            oReviews[sVarious] = {};
        }
        var aCompilations = Object.keys(oReviews[sVarious]);
        if (aCompilations.indexOf(sAlbum) === -1) {
            oReviews[sVarious][sAlbum] = {};
        }
        var aCompArtists = Object.keys(oReviews[sVarious][sAlbum]);
        if (aCompArtists.indexOf(sArtist) === -1) {
            oReviews[sVarious][sAlbum][sArtist] = {};
        }
        oReviews[sVarious][sAlbum][sArtist][sSong] = sReview;
        if (aArtists.indexOf(sArtist) === -1) {
            oReviews[sArtist] = {};
        }
        var aAlbums = Object.keys(oReviews[sArtist]);
        if (aAlbums.indexOf(sAlbum) === -1) {
            oReviews[sArtist][sAlbum] = {};
        }
        oReviews[sArtist][sAlbum][sSong] = sReview;
    }
	var foo = $('#save-button');
	var aFoo = Object.keys(foo);
	if (aFoo.length === 0) {
	    var row = $('<tr></tr>');
	    var textCell = $('<td>Export</td>');
	    var button = $('<button/>')
			.attr('id', 'save-button')
			.text('Save');
	    var buttonCell = $('<td></td>');
	    buttonCell.append(button);
	    row.append(textCell)
			.append(buttonCell);
	    $('#input-table').append(row);
	    $('#save-button').on('click', o2TrackR.handleSaveButtonClick);
	}
};

o2TrackR.handleArtistClick = function(event) {
	event.stopPropagation();
	$('#results-div').empty();
	var cell = $(event.target)
	var sArtist = cell.text();
	o2TrackR.displayArtist(sArtist);
};

o2TrackR.handleFileUpload = function(event) {
    event.stopPropagation();
    if ($(event.target).attr('id') === "reviews") {
        var aFiles = $('#reviews').prop("files");
    }
    var file = aFiles[0];
    var sFileName = file.name;
    var aFileName = sFileName.split(".json");
    var sReviewsName = "";
    for (var w = 0; w < (aFileName.length - 1); w++) {
        var sWord = aFileName[w];
        sReviewsName += sWord;
    }
    o2TrackR.sReviewsName = sReviewsName;
    if (sReviewsName === "music") {
        o2TrackR.sCollection = "<th>Album</th>";
        o2TrackR.sCreator = "<th>Artist</th>";
        o2TrackR.sVarious = "Various Artists";
        o2TrackR.sWork = "<th>Song</th>";
    } else if (o2TrackR.sReviewsName === "literature") {
        o2TrackR.sCollection = "<th>Collection</th>";
        o2TrackR.sCreator = "<th>Author</th>";
        o2TrackR.sVarious = "Various Authors";
        o2TrackR.sWork = "<th>Work</th>";
    }
    o2TrackR.sFileName = sReviewsName + ".json";
    o2TrackR.reader = new FileReader();
    o2TrackR.reader.readAsText(file);
    if ($(event.target).attr('id') === "reviews") {
        o2TrackR.reader.onload = o2TrackR.handleReviews;
    }
};

o2TrackR.handleReviews = function(event) {
    event.stopPropagation();
    var sReviews = o2TrackR.reader.result;
    o2TrackR.oCurrentReviews = JSON.parse(sReviews);
};

o2TrackR.handleSaveButtonClick = function(event) {
	event.stopPropagation();
    var sJSON = JSON.stringify(o2TrackR.oCurrentReviews);
    var reviewFile = new Blob([sJSON], {type: 'application/json'});
    var url = URL.createObjectURL(reviewFile);
    var sText = "Exported File: ";
    var span = $('<span></span>').text(sText);
	var sMedium = $('input[name=medium]:checked').val();
    var sFileName = sMedium + ".json";
    var link = $('<a />')
        .attr('href', url)
        .attr('download', sFileName)
        .text(sFileName);
    $('#body')
        .append(span)
        .append(link);
};

o2TrackR.handleSearchButtonClick = function(event) {
    event.stopPropagation();
    if (o2TrackR.oCurrentReviews === undefined) {
		o2TrackR.oCurrentReviews = {};
	}
    $('#results-div').empty();
    var sSong = $('#song-text').val();
    var sArtist = $('#artist-text').val();
    var sAlbum = $('#album-text').val();
    if (sSong === "") {
        if (sArtist !== "" && sAlbum !== "") {
            var aNumbers = o2TrackR.albumSuccessRate(sArtist, sAlbum);
            o2TrackR.displayAlbum(aNumbers, sArtist, sAlbum);
        } else if (sArtist !== "" && sAlbum === "") {
            //o2TrackR.displayArtist(sArtist);
            o2TrackR.findArtist(sArtist);
        } else if (sArtist === "" && sAlbum !== "") {
            o2TrackR.findAlbum(sAlbum);
        } else if (sArtist === "" && sAlbum === "") {
            o2TrackR.displayAll();
        }
    } else {
        o2TrackR.findSong(sSong);
    }
};

//o2TrackR.parseAnthology();
//o2TrackR.parseCollection();
//o2TrackR.parsePeanuts();
//o2TrackR.addAnthologyAuthors();
o2TrackR.addMainEventListeners();
