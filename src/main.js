/**
 * BaseCamp TODO events in iCalendar format.
 *
 * This function will prompt you to create either standard calendar events or TODO events. After that,
 * it will read through the BC TODOs on screen and create an iCalendar ICS file. 
 *
 * NB!!!!! You should be careful where you do this in BaseCamp, and it's probably best to do it on your
 * "me" page. Doing this on a whole task list page will give you a LOT of entries.
 *
 * Only works for entries that have due dates, and does not ignore tasks that may be hidden by the "Due By" filter.
 */
(function($){
	// Main calendar variables
	var cal = {
		todos: ''
	};

	// Do some date stuff for today's date
	var today = new Date();
	var m = today.getMonth() + 1;
	m = ( m < 10 ? '0' + m : m );

	var d = today.getDate();
	d = ( d < 10 ? '0' + d : d );

	var h = today.getHours(); 
	var mi = today.getMinutes();
	mi = ( mi < 10 ? '0' + mi : mi );

	var sc = today.getSeconds();
	sc = ( sc < 10 ? '0' + sc : sc );

	var created_ts = today.getFullYear() + '' + m + d + 'T' + h + mi + sc;

	var bc_item = 'li.todo';

	var caltpl = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//BaseCamp iCal Todos//NONSGML BC TODO//EN',
		'METHOD:PUBLISH',
		'{todos}',
		'END:VCALENDAR'
	].join("\n");

	var todotpl = [
		'BEGIN:VTODO',
		'SEQUENCE:{seq}',
		'UID:{uid}', //todo-1756504-8740996-224831916@webdevstudios.com',
		'DUE:{due}', // 20160104T170000',
		'STATUS:NEEDS-ACTION',
		'SUMMARY: {summary}',
		'DESCRIPTION: {url}', // https://basecamp.com/1756504/projects/8740996/todos/224831916',
		'BEGIN:VALARM',
		'TRIGGER:-PT10M',
		'ACTION:DISPLAY',
		'DESCRIPTION:Reminder',
		'END:VALARM',
		'END:VTODO',
		'' // needed to add a line between todos
	].join("\n");

	var caleventtpl = [
		'BEGIN:VEVENT',
		'CREATED:{created_ts}',
		'SEQUENCE:{seq}',
		'UID:{uid}',
		'DTSTAMP:{created_ts}',
		'DTSTART:{start}',
		'DTEND:{due}',
		'SUMMARY:{summary}',
		'DESCRIPTION:{url}',
		'BEGIN:VALARM',
		'TRIGGER:-PT10M',
		'ACTION:DISPLAY',
		'DESCRIPTION:Reminder',
		'ORGANIZER:donotreply@webdevstudios.com',
		'END:VALARM',
		'END:VEVENT',
		''
	].join("\n");

	var doevent = confirm('Select OK for regular calendar events or Cancel for TODO events');
	var target_tpl = doevent ? target_tpl : todotpl;

	if ( doevent ) {
		target_tpl = caleventtpl;
	}

	$( bc_item ).each(function(index, el){
		$el = $(el);

		if ( ! $el.attr('data-due-datetime') ) {
			return;
		}

		var todo = {
			uid: $el.attr('id').replace(/_/g, '-') + makeUID(),
			due: $el.attr('data-due-datetime').replace(/-/g, '') + 'T170000',
			url: 'https://basecamp.com' + $el.attr('data-url'),
			seq: 2,
			summary: $el.find('div span.content a')[0].innerText,
			created_ts: created_ts + 'Z',
			start: created_ts
		};

		cal.todos += dotpl(target_tpl, todo);
	});

	cal = dotpl( caltpl, cal );

	var data = new Blob([cal], {type: 'text/calendar'});
	var file = window.URL.createObjectURL(data);

	window.location = file;

	var r;

	function dotpl(tpl, params) {
		for ( var k in params ) {
			if ( ! params.hasOwnProperty( k ) ) {
				continue;
			}
			r = new RegExp();
			r.compile( '{' + k + '}', 'g' );

			tpl = tpl.replace( r, params[k] );
		}

		return tpl;
	}

	function makeUID( len ) {
		len = len || 4;

		var parts = [];

		for ( var i = len; i--; ) {
			parts.push( Math.random().toString(36).slice(2) );
		}

		return '-' + parts.join('-');
	}
})(jQuery);
