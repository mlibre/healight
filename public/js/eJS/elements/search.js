function googleSearch()
{
	var el = google.search.cse.element.getElement('searchResOnly');
	el.execute(searchInputVal());
	var url = window.location.href;
	url = url.replace('?q=' , 'SEXRECTSTART');
	url = url.replace( /SEXRECTSTART(.*)/gim , '?q=' + searchInputVal());
	window.history.replaceState('' , '', url);
}