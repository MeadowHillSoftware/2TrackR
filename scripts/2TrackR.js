"use strict";

var o2TrackR = {};

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
    $('#field-radio').on('change', o2TrackR.handleRadioChange);
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

o2TrackR.arePartialsNeeded = function(aExacts, aPartials) {
	var bNeeded = false;
	if (aExacts.length === 0 && aPartials.length !== 0) {
		bNeeded = true;
	} else if (aExacts.length !== 0 && aPartials.length !== 0) {
		if (aPartials[0] >= 1.0) {
			bNeeded = true;
		}
	}
	return bNeeded;
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
        if (sArtist === o2TrackR.sVarious) {
			var oAlbum = oArtist[sAlbum];
			var aCompArtists = Object.keys(oAlbum);
			var oSongs = {};
			for (var ca = 0; ca < aCompArtists.length; ca++) {
				var sCompArtist = aCompArtists[ca];
				var oCompArtist = oAlbum[sCompArtist];
				var aArtistSongs = Object.keys(oCompArtist);
				for (var as = 0; as < aArtistSongs.length; as++) {
					var sTrack = aArtistSongs[as];
					var sReview = oCompArtist[sTrack];
					oSongs[sTrack] = sReview;
				}
			}
		} else {
			var oSongs = oArtist[sAlbum];
		}
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

o2TrackR.calculateRelevance = function(sScore, iDivisor) {
	var aStrings = sScore.split(" ");
	var iFirst = Number(aStrings[0]);
	var iSecond = Number(aStrings[1]);
	var iQuotient = iSecond / iDivisor;
	var iRelevance = iFirst + iQuotient;
	return iRelevance;
};

o2TrackR.deduplicateExacts = function(oResults) {
	var aArtists = Object.keys(oResults);
	if (aArtists.indexOf(o2TrackR.sVarious) !== -1) {
		var aCompilations = oResults[o2TrackR.sVarious];
		var oMusic = o2TrackR.oCurrentReviews;
		for (var c = 0; c < aCompilations.length; c++) {
			var sCompilation = aCompilations[c];
			var oCompilation = oMusic[o2TrackR.sVarious][sCompilation];
			var aCompArtists = Object.keys(oCompilation);
			for (var ca = 0; ca < aCompArtists.length; ca++) {
				var sCompArtist = aCompArtists[ca];
				var aDiscography = oResults[sCompArtist];
				var iIndex = aDiscography.indexOf(sCompilation);
				oResults[sCompArtist].splice(iIndex, 1);
			}
		}
	}
	return oResults;
};

o2TrackR.deduplicatePartials = function(oResults) {
	var aScores = Object.keys(oResults);
	var oMusic = o2TrackR.oCurrentReviews;
	for (var s = 0; s < aScores.length; s++) {
		var iScore = aScores[s];
		var oScoreObject = oResults[iScore];
		var aArtists = Object.keys(oScoreObject);
		if (aArtists.indexOf(o2TrackR.sVarious) !== -1) {
			var aCompilations = oScoreObject[o2TrackR.sVarious];
			for (var c = 0; c < aCompilations.length; c++) {
				var sCompilation = aCompilations[c];
				var oCompilation = oMusic[o2TrackR.sVarious][sCompilation];
				var aCompArtists = Object.keys(oCompilation);
				for (var ca = 0; ca < aCompArtists.length; ca++) {
					var sCompArtist = aCompArtists[ca];
					var aDiscography = oResults[iScore][sCompArtist];
					var iIndex = aDiscography.indexOf(sCompilation);
					var aAlbumList = oResults[iScore][sCompArtist];
					aAlbumList.splice(iIndex, 1);
					if (aAlbumList.length === 0) {
						delete oResults[iScore][sCompArtist];
					}
				}
			}
		}
	}
	return oResults;
};

o2TrackR.deduplicatePercentages = function(oResults) {
	var aArtists = Object.keys(oResults);
	var oMusic = o2TrackR.oCurrentReviews;
	var oVarious = oMusic[o2TrackR.sVarious];
	var aCompilations = Object.keys(oVarious);
	var oNewAlbums = {};
	for (var a = 0; a < aArtists.length; a++) {
		var sArtist = aArtists[a];
		var aDiscography = oResults[sArtist];
		for (var d = 0; d < aDiscography.length; d++) {
			var aNewArtists = Object.keys(oNewAlbums);
			var sAlbum = aDiscography[d];
			if (aCompilations.indexOf(sAlbum) !== -1) {
				var oCompilation = oVarious[sAlbum];
				var aTrackArtists = Object.keys(oCompilation);
				if (aTrackArtists.indexOf(sArtist) === -1) {
					if (aNewArtists.indexOf(sArtist) === -1) {
						oNewAlbums[sArtist] = [];
					}
					oNewAlbums[sArtist].push(sAlbum);
				}
			} else {
				if (aNewArtists.indexOf(sArtist) === -1) {
					oNewAlbums[sArtist] = [];
				}
				oNewAlbums[sArtist].push(sAlbum);
			}
		}
	}
	return oNewAlbums;
};

o2TrackR.deduplicateSongExacts = function(oResults) {
	var aArtists = Object.keys(oResults);
	if (aArtists.indexOf(o2TrackR.sVarious) !== -1) {
		var aCompilations = Object.keys(oResults[o2TrackR.sVarious]);
		var oMusic = o2TrackR.oCurrentReviews;
		for (var c = 0; c < aCompilations.length; c++) {
			var sCompilation = aCompilations[c];
			var oCompilation = oMusic[o2TrackR.sVarious][sCompilation];
			var aCompArtists = Object.keys(oCompilation);
			for (var ca = 0; ca < aCompArtists.length; ca++) {
				var sCompArtist = aCompArtists[ca];
				if (aArtists.indexOf(sCompArtist) !== -1) {
					var aDiscography = Object.keys(oResults[sCompArtist]);
					delete oResults[sCompArtist][sCompilation];
				}
			}
		}
	}
	return oResults;
};

o2TrackR.deleteUnneededPartials = function(oPartials) {
    var aFloats = Object.keys(oPartials);
    aFloats.sort(function(a, b){return b-a});
    if (aFloats[0] >= 1.0) {
		for (var r = 0; r < aFloats.length; r++) {
			var iRelevance = aFloats[r];
			if (iRelevance < 1.0) {
				delete oPartials[iRelevance];
			}
		}
	}
	return oPartials
};

o2TrackR.determineRelevance = function(sLowInput, sLowResult) {
	var aLowInput = o2TrackR.removeArticles(sLowInput);
	var aLowResult = o2TrackR.removeArticles(sLowResult);
	var iExacts = 0;
	var iPartials = 0;
	for (var i = 0; i < aLowInput.length; i++) {
		var sInputWord = aLowInput[i];
		for (var r = 0; r < aLowResult.length; r++) {
			var sResultWord = aLowResult[r];
			if (sInputWord === sResultWord) {
				iExacts++;
			} else {
				if (sResultWord.indexOf(sInputWord) !== -1) {
					iPartials++;
				} else if (sInputWord.indexOf(sResultWord) !== -1) {
					iPartials++;
				}
			}
		}
	}
	var sRelevance = "0";
	if (iExacts !== 0 || iPartials !== 0) {
		sRelevance = String(iExacts) + " " + String(iPartials);
	}
	return sRelevance;
};

o2TrackR.displayAlbum = function(aNumbers, sArtist, sAlbum) {
    var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
    var artist = $('<td></td>').append(sArtist)
		.addClass('results-table')
		.addClass('link-cell')
		.hover(o2TrackR.handleLinkHover)
		.on('click', o2TrackR.handleArtistClick);
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percentage</th>').addClass('results-table');
    var oMusic = o2TrackR.oCurrentReviews;
    var oAlbum = oMusic[sArtist][sAlbum];
    if (sArtist !== o2TrackR.sVarious) {
		var aSongs = Object.keys(oAlbum);
	} else {
		var titleTA = $(o2TrackR.sContributor).addClass('results-table');
		var aSongs = o2TrackR.getCompilationSongs(oAlbum);
	}
    var titleSong = $(o2TrackR.sWork).addClass('results-table');
    var titleReview = $('<th>Review</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleAlbum)
        .append(titlePercent);
    if (sArtist === o2TrackR.sVarious) {
		headerRow.append(titleTA);
	}
	headerRow.append(titleSong)
        .append(titleReview);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var table = $('<table></table>')
        .addClass('results-table');
	for (var s = 0; s < aSongs.length; s++) {
		var sSong = aSongs[s];
		var row = $('<tr></tr>');
		var one = $('<td></td>').addClass('results-table');
		var two = $('<td></td>').addClass('results-table');
		var three = $('<td></td>').addClass('results-table');
		var album = $('<td></td>')
			.addClass('results-table')
			.append(sAlbum);
		var percent = $('<td></td>')
			.addClass('results-table')
			.addClass('link-cell')
			.hover(o2TrackR.handleLinkHover)
			.on('click', o2TrackR.handlePercentageClick)
			.append(sPercent);
	    if (sArtist === o2TrackR.sVarious) {
			var sTrackArtist = o2TrackR.getTrackArtist(oAlbum, sSong);
			var ta = $('<td></td>')
				.append(sTrackArtist)
				.addClass('results-table')
				.addClass('link-cell')
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handleArtistClick);
		}
		var song = $('<td></td>')
			.addClass('results-table')
			.addClass('link-cell')
			.hover(o2TrackR.handleLinkHover)
			.on('click', o2TrackR.handleSongClick)
			.append(sSong);
		var sReview = o2TrackR.getReview(sArtist, oAlbum, sSong);
		var review = $('<td></td>')
			.addClass('results-table')
			.append(sReview);
		if (s === 0) {
			row.append(artist)
				.append(album)
				.append(percent);
		    if (sArtist === o2TrackR.sVarious) {
				row.append(ta);
			}
			row.append(song)
				.append(review);
		} else {
			row.append(one)
				.append(two)
				.append(three);
		    if (sArtist === o2TrackR.sVarious) {
				row.append(ta);
			}
			row.append(song)
				.append(review);
		}
		table.append(row);
	}
    var lineBreak = $('</br>');
    $('#results-div').empty()
		.append(lineBreak)
		.append(table);
    table.append(header)
        .append(row);
    var lineBreak = $('</br>');
    var div = $('#results-div');
    div.append(lineBreak).append(table);
};

o2TrackR.displayAll = function() {
    var aNumbers = o2TrackR.allSuccessRate();
    var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
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
    total.append(sPercent)
		.addClass('link-cell')
		.hover(o2TrackR.handleLinkHover)
		.on('click', o2TrackR.handlePercentageClick)
		.addClass('results-table');
    var row = $('<tr></tr>');
    row.append(artist)
        .append(total);
    var table = $('<table></table>')
        .addClass('results-table');
    table.append(header)
        .append(row);
    var lineBreak = $('</br>');
    $('#results-div').append(lineBreak).append(table);
};

o2TrackR.displayArtist = function(sArtist) {
	var sLowInput = sArtist.toLowerCase();
    var oMusic = o2TrackR.oCurrentReviews;
    var aNumbers = o2TrackR.artistSuccessRate(sArtist);
    var sOverall = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
    var titleTotal = $('<th>Percent</th>').addClass('results-table');
    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
    var titlePercent = $('<th>Percent</th>').addClass('results-table');
    if (sArtist === o2TrackR.sVarious) {
		var titleTA = $('<th>Track Artist</th>').addClass('results-table');
	}
    var titleSong = $(o2TrackR.sWork).addClass('results-table');
    var titleReview = $('<th>Review</th>').addClass('results-table');
    var headerRow = $('<tr></tr>');
    headerRow.append(titleArtist)
        .append(titleTotal)
        .append(titleAlbum)
        .append(titlePercent);
    if (sArtist === o2TrackR.sVarious) {
		headerRow.append(titleTA);
	}
    headerRow.append(titleSong)
        .append(titleReview);
    var header = $('<thead></thead>');
    header.append(headerRow);
    var artist = $('<td></td>');
    artist.append(sArtist)
		.addClass('results-table')
		.attr('id', 'displayed-artist');
    var total = $('<td></td>');
    total.append(sOverall).addClass('results-table')
		.addClass('link-cell')
		.hover(o2TrackR.handleLinkHover)
		.on('click', o2TrackR.handlePercentageClick);
    var row = $('<tr></tr>');
    var one = $('<td></td>').addClass('results-table');
    var two = $('<td></td>').addClass('results-table');
    var three = $('<td></td>').addClass('results-table');
    var four = $('<td></td>').addClass('results-table');
    if (sArtist === o2TrackR.sVarious) {
		var five = $('<td></td>').addClass('results-table');
	}
    row.append(artist)
        .append(total)
        .append(one)
        .append(two)
        .append(three)
        .append(four);
    if (sArtist === o2TrackR.sVarious) {
		row.append(five);
	}
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
            if (aCompArtists.indexOf(sArtist) !== -1 || sArtist === o2TrackR.sVarious) {
                aNumbers = o2TrackR.albumSuccessRate(o2TrackR.sVarious, sAlbum);
            }
        } else {
            aNumbers = o2TrackR.albumSuccessRate(sArtist, sAlbum);
        }
        var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
        var oAlbum = oArtist[sAlbum];
	    if (sArtist !== o2TrackR.sVarious) {
			var aSongs = Object.keys(oAlbum);
		} else {
			var aSongs = o2TrackR.getCompilationSongs(oAlbum);
		}
        for (var s = 0; s < aSongs.length; s++) {
            var sSong = aSongs[s];
            var row = $('<tr></tr>');
            one = $('<td></td>').addClass('results-table');
            two = $('<td></td>').addClass('results-table');
            three = $('<td></td>').addClass('results-table');
            four = $('<td></td>').addClass('results-table');
            var album = $('<td></td>')
                .append(sAlbum)
                .addClass('results-table')
				.addClass('link-cell')
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handleAlbumClick);
            var percent = $('<td></td>')
                .addClass('results-table')
				.addClass('link-cell')
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handlePercentageClick)
                .append(sPercent);
		    if (sArtist === o2TrackR.sVarious) {
				var sTrackArtist = o2TrackR.getTrackArtist(oAlbum, sSong);
				var ta = $('<td></td>')
					.append(sTrackArtist)
					.addClass('results-table')
					.addClass('link-cell')
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleArtistClick);
			}
            var song = $('<td></td>')
                .addClass('results-table')
				.addClass('link-cell')
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handleSongClick)
                .append(sSong);
			var sReview = o2TrackR.getReview(sArtist, oAlbum, sSong);
            var review = $('<td></td>')
                .addClass('results-table')
                .append(sReview);
            if (s === 0) {
                row.append(one)
                    .append(two)
                    .append(album)
                    .append(percent);
			    if (sArtist === o2TrackR.sVarious) {
					row.append(ta);
				}
                row.append(song)
                    .append(review);
            } else {
                row.append(one)
                    .append(two)
                    .append(three)
                    .append(four)
			    if (sArtist === o2TrackR.sVarious) {
					row.append(ta);
				}
                row.append(song)
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
	var oResults = o2TrackR.returnAlbum(sAlbum);
	var oExacts = oResults["exact"];
	oExacts = o2TrackR.deduplicateExacts(oExacts);
	var oPartials = oResults["partial"];
	oPartials = o2TrackR.deduplicatePartials(oPartials);
    var titleResult = $('<th>Exact Matches</th>')
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
    var oMusic = o2TrackR.oCurrentReviews;
    var aExacts = Object.keys(oExacts);
	if (aExacts.length === 0) {
		resultRow.append(titleResult);
		resultHeader.append(resultRow);
		var emptyRow = $('<tr></tr>');
		var emptyCell = $('<td>no exact matches</td>').addClass('results-table');
		emptyRow.append(emptyCell);
		tbody.append(emptyRow);
		table.append(tbody);
	} else if (aExacts.length !== 0) {
	    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
	    var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
	    var titlePercent = $('<th>Percent</th>').addClass('results-table');
	    var headerRow = $('<tr></tr>');
	    headerRow.append(titleArtist)
			.append(titleAlbum)
	        .append(titlePercent);
	    titleResult.attr('colspan', 3);
	    resultRow.append(titleResult);
	    resultHeader.append(resultRow);
	    resultHeader.append(headerRow);
	    for (var e = 0; e < aExacts.length; e++) {
			var sArtist = aExacts[0];
			var aDiscography = oExacts[sArtist];
			for (var d = 0; d < aDiscography.length; d++) {
				var sDisc = aDiscography[d];
				var aNumbers = o2TrackR.albumSuccessRate(sArtist, sDisc);
				var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
				var exactMatch = $('<tr></tr>');
			    var artist = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.append(sArtist)
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleArtistClick);
				var album = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.append(sDisc)
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleAlbumClick);
			    var percentage = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handlePercentageClick)
					.append(sPercent);
			    exactMatch.append(artist)
					.append(album)
					.append(percentage);
				tbody.append(exactMatch);
			}
		}
	}
    table.append(resultHeader);
    table.append(tbody);
    var lineBreak1 = $('</br>');
    $('#results-div').append(lineBreak1);
    $('#results-div').append(table);
    var lineBreak2 = $('</br>');
    $('#results-div').append(lineBreak2);
	var aPartials = Object.keys(oPartials);
	aPartials.sort(function(a, b){return b-a});
    if (o2TrackR.arePartialsNeeded(aExacts, aPartials) === false) {
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		var partialEmptyRow = $('<tr></tr>');
		var partialEmptyCell = $('<td>no partial matches</td>').addClass('results-table');
		partialEmptyRow.append(partialEmptyCell);
		partialTbody.append(partialEmptyRow);
		partialTable.append(partialTbody);
	} else if (o2TrackR.arePartialsNeeded(aExacts, aPartials) === true) {
		var partialArtist = $(o2TrackR.sCreator)
			.addClass('results-table');
		var partialAlbum = $(o2TrackR.sCollection)
			.addClass('results-table');
		var partialPercent = $('<th>Percent</th>')
			.addClass('results-table');
		var fieldsRow = $('<tr></tr>');
		fieldsRow.append(partialArtist)
			.append(partialAlbum)
			.append(partialPercent);
		partialResult.attr('colspan', 3);
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		partialHeader.append(fieldsRow);
		partialTable.append(partialHeader);
		for (var p = 0; p < aPartials.length; p++) {
			var iScore = aPartials[p];
			var aArtists = Object.keys(oPartials[iScore]);
			aArtists.sort();
			for (var a = 0; a < aArtists.length; a++) {
	            var sArtist = aArtists[a];
	            var aDiscography = oPartials[iScore][sArtist];
	            aDiscography.sort();
	            for (var d = 0; d < aDiscography.length; d++) {
					var sDisc = aDiscography[d]
					var aNumbers = o2TrackR.albumSuccessRate(sArtist, sDisc);
					var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
					var partialMatch = $('<tr></tr>');
				    var artist = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.append(sArtist)
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handleArtistClick);
					var album = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.append(sDisc)
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handleAlbumClick);
				    var percentage = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handlePercentageClick)
						.append(sPercent);
				    partialMatch.append(artist)
						.append(album)
						.append(percentage);
					partialTbody.append(partialMatch);
				}
			}
		}
	}
	partialTable.append(partialHeader);
	partialTable.append(partialTbody);
    var lineBreak3 = $('</br>');
    $('#results-div').append(lineBreak3);
    $('#results-div').append(partialTable);
};

o2TrackR.findArtist = function(sArtist) {
	var oResults = o2TrackR.returnArtist(sArtist);
	var aExacts = oResults["exact"];
	var oPartials = oResults["partial"];
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
			.hover(o2TrackR.handleLinkHover)
			.on('click', o2TrackR.handleArtistClick);
	    var percentage = $('<td></td>').addClass('results-table')
			.addClass('link-cell')
			.hover(o2TrackR.handleLinkHover)
			.on('click', o2TrackR.handlePercentageClick);
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
    var aScores = Object.keys(oPartials);
    if (aScores.length === 0) {
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		var partialEmptyRow = $('<tr></tr>');
		var partialEmptyCell = $('<td>no partial matches</td>').addClass('results-table');
		partialEmptyRow.append(partialEmptyCell);
		partialTbody.append(partialEmptyRow);
		partialTable.append(partialTbody);
	} else if (aScores.length !== 0) {
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
		aScores.sort(function(a, b){return b-a});
		for (var s = 0; s < aScores.length; s++) {
			var sScore = aScores[s];
			var aArtists = oPartials[sScore];
			aArtists.sort();
			for (var a = 0; a < aArtists.length; a++) {
	            var sArtist = aArtists[a];
	            var aNumbers = o2TrackR.artistSuccessRate(sArtist);
	            var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
	            var tempRow = $('<tr></tr>');
	            var partialArtist = $('<td></td>')
	                .addClass('results-table')
	                .addClass('link-cell')
	                .append(sArtist)
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleArtistClick);
	            var partialPercent = $('<td></td>')
	                .addClass('results-table')
					.addClass('link-cell')
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handlePercentageClick)
	                .append(sPercent);
	            tempRow.append(partialArtist)
	                .append(partialPercent)
	            partialTbody.append(tempRow);
			}
		}
	}
	partialTable.append(partialHeader);
	partialTable.append(partialTbody);
	$('#results-div').append(partialTable);
};

o2TrackR.findPercentage = function(sPercentage) {
	var oMusic = o2TrackR.oCurrentReviews;
	var aArtists = Object.keys(oMusic);
	var aCreators = [];
	var oAlbums = {};
	for (var a = 0; a < aArtists.length; a++) {
		var sArtist = aArtists[a];
		var aNumbers = o2TrackR.artistSuccessRate(sArtist);
		var sArtistPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
		if (sArtistPercent === sPercentage) {
			aCreators.push(sArtist);
		}
		var oDiscography = oMusic[sArtist];
		var aAlbums = Object.keys(oDiscography);
		for (var r = 0; r < aAlbums.length; r++) {
			var sAlbum = aAlbums[r];
			var aIntegers = o2TrackR.albumSuccessRate(sArtist, sAlbum);
			var sAlbumPercent = o2TrackR.calculatePercentage(aIntegers[0], aIntegers[1]);
			if (sAlbumPercent === sPercentage) {
				var aKeys = Object.keys(oAlbums);
				if (aKeys.indexOf(sArtist) === -1) {
					oAlbums[sArtist] = [];
				}
				oAlbums[sArtist].push(sAlbum);
			}
		}
	}
	oAlbums = o2TrackR.deduplicatePercentages(oAlbums);
    var artistResult = $('<th>Artist Percentages</th>')
        .addClass('results-table');
	var artistRow = $('<tr></tr>');
    var artistHeader = $('<thead></thead>');
    var artistTable = $('<table></table>')
        .addClass('results-table');
    var artistTbody = $('<tbody></tbody>');
	if (aCreators.length === 0) {
		artistRow.append(artistResult);
		artistHeader.append(artistRow);
		var emptyRow = $('<tr></tr>');
		var emptyCell = $('<td>no matches</td>').addClass('results-table');
		emptyRow.append(emptyCell);
		artistTbody.append(emptyRow);
		artistTable.append(artistTbody);
	} else {
		aCreators.sort();
	    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
	    var titlePercent = $('<th>Percent</th>').addClass('results-table');
	    var headerRow = $('<tr></tr>');
	    headerRow.append(titleArtist)
	        .append(titlePercent);
	    artistResult.attr('colspan', 2);
	    artistRow.append(artistResult);
	    artistHeader.append(artistRow);
	    artistHeader.append(headerRow);
	    for (var c = 0; c < aCreators.length; c++) {
			var artistMatch = $('<tr></tr>');
			var sCreator = aCreators[c];
			var artistRow = $('<tr></tr>');
		    var creator = $('<td></td>').addClass('results-table')
				.addClass('link-cell')
				.append(sCreator)
				.attr('id', 'displayed-artist')
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handleArtistClick);
		    var percentage = $('<td></td>').addClass('results-table')
				.addClass('link-cell')
				.append(sPercentage)
				.hover(o2TrackR.handleLinkHover)
				.on('click', o2TrackR.handlePercentageClick);
			artistMatch.append(creator)
				.append(percentage);
			artistTbody.append(artistMatch);
		}
	}
    artistTable.append(artistHeader);
    artistTable.append(artistTbody);
    var lineBreak1 = $('</br>');
    $('#results-div').append(lineBreak1);
    $('#results-div').append(artistTable);
    var lineBreak2 = $('</br>');
    $('#results-div').append(lineBreak2);
    var albumResult = $('<th>Album Percentages</th>')
	    .addClass('results-table');
	var albumRow = $('<tr></tr>');
	var albumHeader = $('<thead></thead>');
    var albumTable = $('<table></table>')
        .addClass('results-table');
    var albumTbody = $('<tbody></tbody>');
	var aCreators = Object.keys(oAlbums);
	if (aCreators.length === 0) {
		albumRow.append(albumResult);
		albumHeader.append(albumRow);
		var emptyAlbumRow = $('<tr></tr>');
		var emptyAlbumCell = $('<td>no matches</td>').addClass('results-table');
		emptyAlbumRow.append(emptyAlbumCell);
		albumTbody.append(emptyAlbumRow);
		albumTable.append(albumTbody);
	} else {
		aCreators.sort();
	    var titleArtist = $(o2TrackR.sCreator).addClass('results-table');
		var titleAlbum = $(o2TrackR.sCollection).addClass('results-table');
	    var titlePercent = $('<th>Percent</th>').addClass('results-table');
	    var headerRow = $('<tr></tr>');
	    headerRow.append(titleArtist)
			.append(titleAlbum)
	        .append(titlePercent);
	    albumResult.attr('colspan', 3);
	    albumRow.append(albumResult);
	    albumHeader.append(albumRow);
	    albumHeader.append(headerRow);
		for (var c = 0; c < aCreators.length; c++) {
			var sCreator = aCreators[c];
			var aDiscography = oAlbums[sCreator];
			aDiscography.sort(function(a, b){return b-a});
			for (var d = 0; d < aDiscography.length; d++) {
				var sDisc = aDiscography[d];
				var albumMatch = $('<tr></tr>');
			    var creator = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.append(sCreator)
					.attr('id', 'displayed-artist')
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleArtistClick);
				var album = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.append(sDisc)
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handleAlbumClick);
			    var percentage = $('<td></td>').addClass('results-table')
					.addClass('link-cell')
					.append(sPercentage)
					.hover(o2TrackR.handleLinkHover)
					.on('click', o2TrackR.handlePercentageClick);
				albumMatch.append(creator)
					.append(album)
					.append(percentage);
				albumTbody.append(albumMatch);
			}
	    }
	}
	albumTable.append(albumHeader);
	albumTable.append(albumTbody);
    var lineBreak3 = $('</br>');
    $('#results-div').append(lineBreak3);
    $('#results-div').append(albumTable);
};

o2TrackR.findSong = function(sSong) {
	var oResults = o2TrackR.returnSong(sSong);
	console.log(oResults);
	var oExacts = oResults["exact"];
	oExacts = o2TrackR.deduplicateSongExacts(oExacts);
	var oPartials = oResults["partial"];
	oPartials = o2TrackR.deduplicatePartials(oPartials);
    var titleResult = $('<th>Exact Matches</th>')
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
    var oMusic = o2TrackR.oCurrentReviews;
    var aExacts = Object.keys(oExacts);
	if (aExacts.length === 0) {
		resultRow.append(titleResult);
		resultHeader.append(resultRow);
		var emptyRow = $('<tr></tr>');
		var emptyCell = $('<td>no exact matches</td>').addClass('results-table');
		emptyRow.append(emptyCell);
		tbody.append(emptyRow);
		table.append(tbody);
	} else if (aExacts.length !== 0) {
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
	    titleResult.attr('colspan', 5);
	    resultRow.append(titleResult);
	    resultHeader.append(resultRow);
	    resultHeader.append(headerRow);
	    for (var e = 0; e < aExacts.length; e++) {
			var sArtist = aExacts[e];
			var aDiscography = Object.keys(oExacts[sArtist]);
			for (var d = 0; d < aDiscography.length; d++) {
				var sDisc = aDiscography[d];
				var aNumbers = o2TrackR.albumSuccessRate(sArtist, sDisc);
				var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
				var exactMatch = $('<tr></tr>');
				var aSongs = Object.keys(oExacts[sArtist][sDisc]);
				for (var s = 0; s < aSongs.length; s++) {
					var sSong = aSongs[s];
					var sReview = oExacts[sArtist][sDisc][sSong];
				    var artist = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.append(sArtist)
						.attr('id', 'displayed-artist')
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handleArtistClick);
					var album = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.append(sDisc)
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handleAlbumClick);
				    var percentage = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handlePercentageClick)
						.append(sPercent);
					var song = $('<td></td>').addClass('results-table')
						.addClass('link-cell')
						.hover(o2TrackR.handleLinkHover)
						.on('click', o2TrackR.handleSongClick)
						.append(sSong);
					var review = $('<td></td>').addClass('results-table')
						.append(sReview);
				    exactMatch.append(artist)
						.append(album)
						.append(percentage)
						.append(song)
						.append(review);
					tbody.append(exactMatch);
				}
			}
		}
	}
    table.append(resultHeader);
    table.append(tbody);
    var lineBreak1 = $('</br>');
    $('#results-div').append(lineBreak1);
    $('#results-div').append(table);
    var lineBreak2 = $('</br>');
    $('#results-div').append(lineBreak2);
	var aPartials = Object.keys(oPartials);
	aPartials.sort(function(a, b){return b-a});
    if (o2TrackR.arePartialsNeeded(aExacts, aPartials) === false) {
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		var partialEmptyRow = $('<tr></tr>');
		var partialEmptyCell = $('<td>no partial matches</td>').addClass('results-table');
		partialEmptyRow.append(partialEmptyCell);
		partialTbody.append(partialEmptyRow);
		partialTable.append(partialTbody);
	} else if (o2TrackR.arePartialsNeeded(aExacts, aPartials) === true) {
		var partialArtist = $(o2TrackR.sCreator)
			.addClass('results-table');
		var partialAlbum = $(o2TrackR.sCollection)
			.addClass('results-table');
		var partialPercent = $('<th>Percent</th>')
			.addClass('results-table');
		var partialSong = $('<th>Song</th>')
			.addClass('results-table');
		var partialReview = $('<th>Review</th>')
			.addClass('results-table');
		var fieldsRow = $('<tr></tr>');
		fieldsRow.append(partialArtist)
			.append(partialAlbum)
			.append(partialPercent)
			.append(partialSong)
			.append(partialReview);
		partialResult.attr('colspan', 5);
		partialRow.append(partialResult);
		partialHeader.append(partialRow);
		partialHeader.append(fieldsRow);
		partialTable.append(partialHeader);
		for (var p = 0; p < aPartials.length; p++) {
			var iScore = aPartials[p];
			var aArtists = Object.keys(oPartials[iScore]);
			aArtists.sort();
			for (var a = 0; a < aArtists.length; a++) {
	            var sArtist = aArtists[a];
	            var aDiscography = Object.keys(oPartials[iScore][sArtist]);
	            aDiscography.sort();
	            for (var d = 0; d < aDiscography.length; d++) {
					var sDisc = aDiscography[d];
					var aNumbers = o2TrackR.albumSuccessRate(sArtist, sDisc);
					var sPercent = o2TrackR.calculatePercentage(aNumbers[0], aNumbers[1]);
					var aSongs = Object.keys(oPartials[iScore][sArtist][sDisc]);
					for (var s = 0; s < aSongs.length; s++) {
						var partialMatch = $('<tr></tr>');
						var sSong = aSongs[s];
						var sReview = oPartials[iScore][sArtist][sDisc][sSong];
					    var artist = $('<td></td>').addClass('results-table')
							.addClass('link-cell')
							.append(sArtist)
							.hover(o2TrackR.handleLinkHover)
							.on('click', o2TrackR.handleArtistClick);
						var album = $('<td></td>').addClass('results-table')
							.addClass('link-cell')
							.append(sDisc)
							.hover(o2TrackR.handleLinkHover)
							.on('click', o2TrackR.handleAlbumClick);
					    var percentage = $('<td></td>').addClass('results-table')
							.addClass('link-cell')
							.hover(o2TrackR.handleLinkHover)
							.on('click', o2TrackR.handlePercentageClick)
							.append(sPercent);
						var song = $('<td></td>').addClass('results-table')
							.addClass('link-cell')
							.append(sSong)
							.hover(o2TrackR.handleLinkHover)
							.on('click', o2TrackR.handleSongClick);
						var review = $('<td></td>').addClass('results-table')
							.append(sReview);
					    partialMatch.append(artist)
							.append(album)
							.append(percentage)
							.append(song)
							.append(review);
						partialTbody.append(partialMatch);
					}
				}
			}
		}
	}
	partialTable.append(partialHeader);
	partialTable.append(partialTbody);
    var lineBreak3 = $('</br>');
    $('#results-div').append(lineBreak3);
    $('#results-div').append(partialTable);
};

o2TrackR.floatifyAlbumRelevance = function(oPartials) {
	var aScores = Object.keys(oPartials);
	var iDivisor = o2TrackR.getFloatifyDivisor(aScores);
	var oNewPartials = {};
	for (var s = 0; s < aScores.length; s++) {
		var sScore = aScores[s];
		var iRelevance = o2TrackR.calculateRelevance(sScore, iDivisor);
		var aNewScores = Object.keys(oNewPartials);
		oNewPartials[iRelevance] = {};
		var aArtists = Object.keys(oPartials[sScore]);
		for (var a = 0; a < aArtists.length; a++) {
			var sArtist = aArtists[a];
			var aNewArtists = Object.keys(oNewPartials[iRelevance]);
			oNewPartials[iRelevance][sArtist] = [];
			var aRecords = oPartials[sScore][sArtist];
			for (var r = 0; r < aRecords.length; r++) {
				var sRecord = aRecords[r];
				oNewPartials[iRelevance][sArtist].push(sRecord);
			}
		}
	}
	oNewPartials = o2TrackR.deleteUnneededPartials(oNewPartials);
	return oNewPartials;
};

o2TrackR.floatifyArtistRelevance = function(oPartials) {
	var aScores = Object.keys(oPartials);
	var iDivisor = o2TrackR.getFloatifyDivisor(aScores);
	var oNewPartials = {};
	for (var s = 0; s < aScores.length; s++) {
		var sScore = aScores[s];
		var iRelevance = o2TrackR.calculateRelevance(sScore, iDivisor);
		var aNewScores = Object.keys(oNewPartials);
		oNewPartials[iRelevance] = [];
		var aArtists = oPartials[sScore];
		for (var a = 0; a < aArtists.length; a++) {
			var sArtist = aArtists[a];
			oNewPartials[iRelevance].push(sArtist);
		}
	}
	oNewPartials = o2TrackR.deleteUnneededPartials(oNewPartials);
	return oNewPartials;
};

o2TrackR.floatifySongRelevance = function(oPartials) {
	var aScores = Object.keys(oPartials);
	var iDivisor = o2TrackR.getFloatifyDivisor(aScores);
	var oNewPartials = {};
	for (var s = 0; s < aScores.length; s++) {
		var sScore = aScores[s];
		var iRelevance = o2TrackR.calculateRelevance(sScore, iDivisor);
		oNewPartials[iRelevance] = {};
		var aArtists = Object.keys(oPartials[sScore]);
		for (var a = 0; a < aArtists.length; a++) {
			var sArtist = aArtists[a];
			oNewPartials[iRelevance][sArtist] = {};
			var aRecords = Object.keys(oPartials[sScore][sArtist]);
			for (var r = 0; r < aRecords.length; r++) {
				var sRecord = aRecords[r];
				oNewPartials[iRelevance][sArtist][sRecord] = {};
				var aWorks = Object.keys(oPartials[sScore][sArtist][sRecord]);
				for (var w = 0; w < aWorks.length; w++) {
					var sSong = aWorks[w];
					var sReview = oPartials[sScore][sArtist][sRecord][sSong];
					oNewPartials[iRelevance][sArtist][sRecord][sSong] = sReview;
				}
			}
		}
	}
	oNewPartials = o2TrackR.deleteUnneededPartials(oNewPartials);
	return oNewPartials;
};

o2TrackR.getReview = function(sArtist, oAlbum, sSong) {
	if (sArtist !== o2TrackR.sVarious) {
		var sReview = oAlbum[sSong];
	} else {
		var aCompArtists = Object.keys(oAlbum);
		for (var ca = 0; ca < aCompArtists.length; ca++) {
			var sCompArtist = aCompArtists[ca];
			var oTracks = oAlbum[sCompArtist];
			var aTracks = Object.keys(oTracks);
			if (aTracks.indexOf(sSong) !== -1) {
				var sReview = oTracks[sSong];
			}
		}
	}
	return sReview;
};

o2TrackR.getCompilationSongs = function(oAlbum) {
	var aCompArtists = Object.keys(oAlbum);
	var aSongs = [];
	for (var ca = 0; ca < aCompArtists.length; ca++) {
		var sCompArtist = aCompArtists[ca];
		var oCompArtist = oAlbum[sCompArtist];
		var aArtistSongs = Object.keys(oCompArtist);
		for (var as = 0; as < aArtistSongs.length; as++) {
			var sTrack = aArtistSongs[as];
			aSongs.push(sTrack);
		}
	}
	return aSongs;
};

o2TrackR.getFloatifyDivisor = function(aScores) {
	var iDigits = 1;
	for (var s = 0; s < aScores.length; s++) {
		var sScore = aScores[s];
		var aStrings = sScore.split(" ");
		var sSecond = aStrings[1];
		if (sSecond.length > iDigits) {
			iDigits = sSecond.length;
		}
	}
	var iDivisor = 1;
	for (var d = 0; d < iDigits; d++) {
		iDivisor *= 10;
	}
	return iDivisor;
};

o2TrackR.getTrackArtist = function(oAlbum, sSong) {
	var aCompArtists = Object.keys(oAlbum);
	var sTrackArtist = "";
	for (var ca = 0; ca < aCompArtists.length; ca++) {
		var sCompArtist = aCompArtists[ca];
		var oTracks = oAlbum[sCompArtist];
		var aTracks = Object.keys(oTracks);
		if (aTracks.indexOf(sSong) !== -1) {
			sTrackArtist = sCompArtist;
		}
	}
	return sTrackArtist;
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

o2TrackR.handleAlbumClick = function(event) {
	event.stopPropagation();
	var albumCell = $(event.target);
	var sAlbum = albumCell.text();
	var artistCell = albumCell.prev();
	var sArtist = artistCell.text();
	if (sArtist === "") {
		var correct = $('#displayed-artist');
		sArtist = correct.text();
	}
	var oMusic = o2TrackR.oCurrentReviews;
	var oVarious = oMusic[o2TrackR.sVarious];
	var aCompilations = Object.keys(oVarious);
	if (aCompilations.indexOf(sAlbum) !== -1) {
		var oCompilation = oVarious[sAlbum];
		var aTrackArtists = Object.keys(oCompilation);
		if (aTrackArtists.indexOf(sArtist) !== -1) {
			sArtist = o2TrackR.sVarious;
		}
	}
	var aNumbers = o2TrackR.albumSuccessRate(sArtist, sAlbum);
    o2TrackR.displayAlbum(aNumbers, sArtist, sAlbum);
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
        o2TrackR.sContributor = "<th>Track Artist</th>"
        o2TrackR.sWork = "<th>Song</th>";
    } else if (o2TrackR.sReviewsName === "literature") {
        o2TrackR.sCollection = "<th>Collection</th>";
        o2TrackR.sCreator = "<th>Author</th>";
        o2TrackR.sVarious = "Various Authors";
        o2TrackR.sContributor = "<th>Contributor</th>"
        o2TrackR.sWork = "<th>Work</th>";
    }
    o2TrackR.sFileName = sReviewsName + ".json";
    o2TrackR.reader = new FileReader();
    o2TrackR.reader.readAsText(file);
    if ($(event.target).attr('id') === "reviews") {
        o2TrackR.reader.onload = o2TrackR.handleReviews;
    }
};

o2TrackR.handleLinkHover = function(event) {
	var link = $(event.target);
	link.css('cursor', 'pointer');
};

o2TrackR.handlePercentageClick = function(event) {
	var percent = $(event.target);
	var sPercent = percent.text();
    $('#results-div').empty();
	o2TrackR.findPercentage(sPercent);
};

o2TrackR.handleRadioChange = function(event) {
	event.stopPropagation();
	var sField = $('input[name=field]:checked').val();
	var cell = $('#search-cell');
	if (sField === "percentage") {
		cell.empty();
		var select = $('<select></select>').attr('id', 'search-input');
		var o = 0;
		while (o < 101) {
			var option = $('<option></option>')
				.val(o)
				.html(o);
			select.append(option);
			o++;
		}
		cell.append(select);
	} else {
		var input = $('#search-input');
		var sType = input.attr('type');
		if (sType !== "text") {
			cell.empty();
			var text = $('<input></input>')
				.attr('type', 'text')
				.attr('id', 'search-input');
			cell.append(text);
		}
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
    var input = $('#search-input');
    var sType = input.attr('type');
    if (sType === "text") {
		var sText = input.val();
		if (sText === "") {
			o2TrackR.displayAll();
		} else {
			var sValue = $('input[name=field]:checked').val();
			if (sValue === "creator") {
				o2TrackR.findArtist(sText);
			} else if (sValue === "collection") {
				o2TrackR.findAlbum(sText);
			} else {
				o2TrackR.findSong(sText);
			}
		}
	} else {
		var dropdown = $('#search-input');
		var sPercentage = dropdown.val();
		o2TrackR.findPercentage(sPercentage);
	}
};

o2TrackR.handleSongClick = function(event) {
	event.stopPropagation();
	$('#results-div').empty();
	var cell = $(event.target)
	var sSong = cell.text();
	o2TrackR.findSong(sSong);
};

o2TrackR.removeArticles = function(sString) {
	var aArray = sString.split(" ");
	var aNewArray = [];
	var aArticles = ["a", "an", "the"];
	for (var w = 0; w < aArray.length; w++) {
		var sWord = aArray[w];
		if (aArticles.indexOf(sWord) === -1) {
			aNewArray.push(sWord);
		}
	}
	if (aNewArray.length > 0) {
		return aNewArray;
	} else {
		return aArray;
	}
};

o2TrackR.returnAlbum = function(sAlbum) {
	var sLowInput = sAlbum.toLowerCase();
	var oMusic = o2TrackR.oCurrentReviews;
    var oExacts = {}
    var oPartials = {}
    var aArtists = Object.keys(oMusic);
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var oAlbums = oMusic[sArtist];
        var aRecords = Object.keys(oAlbums);
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            var sLowResult = sRecord.toLowerCase();
            if (sLowResult === sLowInput) {
				var aKeys = Object.keys(oExacts);
				if (aKeys.indexOf(sArtist) === -1) {
					oExacts[sArtist] = [sRecord];
				} else {
					oExacts[sArtist].push(sRecord);
				}
            } else {
				var sRelevance = o2TrackR.determineRelevance(sLowInput, sLowResult);
				if (sRelevance !== "0") {
					var aScores = Object.keys(oPartials);
					if (aScores.indexOf(sRelevance) === -1) {
						oPartials[sRelevance] = {};
						oPartials[sRelevance][sArtist] = [sRecord];
					} else {
						var aRelevantArtists = Object.keys(oPartials[sRelevance])
						if (aRelevantArtists.indexOf(sArtist) === -1) {
							oPartials[sRelevance][sArtist] = [sRecord];
						} else {
							oPartials[sRelevance][sArtist].push(sRecord);
						}
					}
				}
            }
        }
    }
    var oPartials = o2TrackR.floatifyAlbumRelevance(oPartials);
    return {"exact": oExacts, "partial": oPartials};
};

o2TrackR.returnArtist = function(sArtist) {
	var sLowInput = sArtist.toLowerCase();
    var oMusic = o2TrackR.oCurrentReviews;
	var aArtists = Object.keys(oMusic);
	var aExacts = [];
	var oPartials = {};
	for (var c = 0; c < aArtists.length; c++) {
		var sCreator = aArtists[c];
		var sLowCreator = sCreator.toLowerCase();
		if (sLowCreator === sLowInput) {
			aExacts.push(aArtists[c]);
		} else {
			var sRelevance = o2TrackR.determineRelevance(sLowInput, sLowCreator);
			if (sRelevance !== "0") {
				var aScores = Object.keys(oPartials);
				if (aScores.indexOf(sRelevance) === -1) {
					oPartials[sRelevance] = [];
					oPartials[sRelevance].push(sCreator);
				} else {
					var aRelevantArtists = oPartials[sRelevance];
					if (aRelevantArtists.indexOf(sCreator) === -1) {
						oPartials[sRelevance].push(sCreator);
					}
				}
			}
		}
	}
	var oPartials = o2TrackR.floatifyArtistRelevance(oPartials);
	return {"exact": aExacts, "partial": oPartials};
};

o2TrackR.returnSong = function(sSong) {
	var sLowInput = sSong.toLowerCase();
	var oMusic = o2TrackR.oCurrentReviews;
    var oExacts = {}
    var oPartials = {}
    var aArtists = Object.keys(oMusic);
    for (var a = 0; a < aArtists.length; a++) {
        var sArtist = aArtists[a];
        var oAlbums = oMusic[sArtist];
        var aRecords = Object.keys(oAlbums);
        for (var r = 0; r < aRecords.length; r++) {
            var sRecord = aRecords[r];
            if (sArtist === o2TrackR.sVarious) {
				var aTrackArtists = Object.keys(oMusic[sArtist][sRecord]);
				for (var ta = 0; ta < aTrackArtists.length; ta++) {
					var sTrackArtist = aTrackArtists[ta];
					var aSongs = Object.keys(oMusic[sArtist][sRecord][sTrackArtist]);
					for (var s = 0; s < aSongs.length; s++) {
						var sSong = aSongs[s];
						var sReview = oMusic[sArtist][sRecord][sTrackArtist][sSong];
						var sLowResult = sSong.toLowerCase();
						if (sLowResult === sLowInput) {
							var aKeys = Object.keys(oExacts);
							if (aKeys.indexOf(sArtist) === -1) {
								oExacts[sTrackArtist] = {};
								oExacts[sTrackArtist][sRecord] = {};
								oExacts[sTrackArtist][sRecord][sSong] = sReview;
							} else {
								var aAlbumKeys = Object.keys(oExacts[sTrackArtist]);
								if (aAlbumsKeys.indexOf(sRecord) === -1) {
									oExacts[sTrackArtist][sRecord] = {};
									oExacts[sTrackArtist][sRecord][sSong] = sReview;
								} else {
									oExacts[sTrackArtist][sRecord][sSong] = sReview;
								}
							}
						} else {
							var sRelevance = o2TrackR.determineRelevance(sLowInput, sLowResult);
							if (sRelevance !== "0") {
								var aScores = Object.keys(oPartials);
								if (aScores.indexOf(sRelevance) === -1) {
									oPartials[sRelevance] = {};
									oPartials[sRelevance][sTrackArtist] = {};
									oPartials[sRelevance][sTrackArtist][sRecord] = {};
									oPartials[sRelevance][sTrackArtist][sRecord][sSong] = sReview;
								} else {
									var aRelevantArtists = Object.keys(oPartials[sRelevance]);
									if (aRelevantArtists.indexOf(sArtist) === -1) {
										oPartials[sRelevance][sTrackArtist] = {};
										oPartials[sRelevance][sTrackArtist][sRecord] = {};
										oPartials[sRelevance][sTrackArtist][sRecord][sSong] = sReview;
									} else {
										var aRelevantAlbums = Object.keys(oPartials[sRelevance][sArtist]);
										if (aRelevantAlbums.indexOf(sRecord) === -1) {
											oPartials[sRelevance][sTrackArtist][sRecord] = {};
											oPartials[sRelevance][sTrackArtist][sRecord][sSong] = sReview;
										} else {
											oPartials[sRelevance][sTrackArtist][sRecord][sSong] = sReview;
										}
									}
								}
							}
						}
					}
				}
			} else {
	            var aSongs = Object.keys(oMusic[sArtist][sRecord]);
	            for (var s = 0; s < aSongs.length; s++) {
					var sSong = aSongs[s];
					var sReview = oMusic[sArtist][sRecord][sSong];
					var sLowResult = sSong.toLowerCase();
					if (sLowResult === sLowInput) {
						var aKeys = Object.keys(oExacts);
						if (aKeys.indexOf(sArtist) === -1) {
							oExacts[sArtist] = {};
							oExacts[sArtist][sRecord] = {};
							oExacts[sArtist][sRecord][sSong] = sReview;
						} else {
							var aAlbumKeys = Object.keys(oExacts[sArtist]);
							if (aAlbumKeys.indexOf(sRecord) === -1) {
								oExacts[sArtist][sRecord] = {};
								oExacts[sArtist][sRecord][sSong] = sReview;
							} else {
								oExacts[sArtist][sRecord][sSong] = sReview;
							}
						}
					} else {
						var sRelevance = o2TrackR.determineRelevance(sLowInput, sLowResult);
						if (sRelevance !== "0") {
							var aScores = Object.keys(oPartials);
							if (aScores.indexOf(sRelevance) === -1) {
								oPartials[sRelevance] = {};
								oPartials[sRelevance][sArtist] = {};
								oPartials[sRelevance][sArtist][sRecord] = {};
								oPartials[sRelevance][sArtist][sRecord][sSong] = sReview;
							} else {
								var aRelevantArtists = Object.keys(oPartials[sRelevance]);
								if (aRelevantArtists.indexOf(sArtist) === -1) {
									oPartials[sRelevance][sArtist] = {};
									oPartials[sRelevance][sArtist][sRecord] = {};
									oPartials[sRelevance][sArtist][sRecord][sSong] = sReview;
								} else {
									var aRelevantAlbums = Object.keys(oPartials[sRelevance][sArtist]);
									if (aRelevantAlbums.indexOf(sRecord) === -1) {
										oPartials[sRelevance][sArtist][sRecord] = {};
										oPartials[sRelevance][sArtist][sRecord][sSong] = sReview;
									} else {
										oPartials[sRelevance][sArtist][sRecord][sSong] = sReview;
									}
								}
							}
						}
					}
				}
			}
        }
    }
    var oPartials = o2TrackR.floatifySongRelevance(oPartials);
    return {"exact": oExacts, "partial": oPartials};
};

//o2TrackR.parseAnthology();
//o2TrackR.parseCollection();
//o2TrackR.parsePeanuts();
//o2TrackR.addAnthologyAuthors();
o2TrackR.addMainEventListeners();
