"use strict";

// Events
$(window).bind("load", function()
{
	$(document).ready(function()
	{
		// modal
		setDefaultMmodal('در حال پردازش');

		// users tab
		$('a[href="#usersTab"]').on('show.bs.tab', function (e)
		{
			usersList(function (res)
			{
				users = res;
				createUsersList();
			});
		});

		// perms tab
		$('a[href="#perms"]').on('show.bs.tab', function (e)
		{
			$('#nodeId').val(users[$('#usersListDiv .active #nodId').html()]._id);
			createUserPerms(users[$('#usersListDiv .active #nodId').html()].permissions);
		});
		// remove disabled
		$('.nav-tabs .nav-item .disabled').removeClass('disabled');
		$("#myTabs a[href='#usersTab']").tab('show');
	});
});

// Functions
function usersList(cbf)
{
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/WS/permList_WA',
		type: 'POST',
		success: function (res)
		{
			if( res == "-2" )
			{
				console.log('Something Wrong happended' + res);
			}
			else if( res )
			{
				cbf(res);
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in nonArtsTelList post request. message: %s" , err);
		}
	});
}

function editUserPerm(ev, cbf)
{
	ev.preventDefault();
	var form = ev.target;
	var data = $(form).serializeArray();
	data = data.concat
	(
		$('#userpermsForm input[type=checkbox]:not(:checked)').map(
			function()
			{
				return {"name": this.name, "value": 'false'};
			}).get()
	);
	$('#MModal').modal('show');
	$.ajax
	({
		url: $(form).attr('action'),
		type: 'POST',
		data: data,
		success: function (res)
		{
			if( res == "-2" )
			{
				failMmodal("مشکلی پیش امد و احتمالا مراقبت شده!");
			}
			else if(res)
			{
				successMmodal('ثبت شد');
				cbf();
			}
			else
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
		},
		error: function(JXHR , status , err)
		{
			failMmodal("احتمال خطا از مرورگر شما");
		}
	});
}

function DeleteUser()
{
	$('#MModal').modal({show:true});
	$.ajax
	({
		url: '/' + lang + '/panel/adminStuff/WS/delUser_WA',
		type: 'POST',
		data:
		{
			nodeId: users[$('#usersListDiv .active #nodId').html()]._id
		},
		success: function (res)
		{
			if( res == "-2" )
			{
				failMmodal("خطای داخلی سیستم، در اسرع وقت سیستم درست میشود. متاسفیم");
			}
			else if( res )
			{
				successMmodal("کاربر حذف شد");
				setTimeout(function ()
				{
					window.location.href = '';
				}, 1500);			
			}
		},
		error: function(JXHR , status , err)
		{
			console.log("#Ajax. Error in DeleteUser post request. message: %s" , err);
		}
	});
}

function createUsersList()
{
	$('#usersListDiv').empty();
	var html = '<ul class="list-group p-0">';
	users.forEach(function(el , index)
	{
		html+= '<li class="list-group-item list-group-item-action flex-column ';
		if(index == 0){html+= 'active';}
		html += `\
		">\
			<div class="d-flex w-100 align-items-end">\
			<div id="nodId" class="my-auto">${index}</div>\
			<div class="Font18px mr-5 my-auto">${el.name} ${el.family}</div>\
			<div class="Font18px mr-5 my-auto">${el.email}</div>\
			</div>\
		</li>`;
	});
	html+= '</ul>';
	$('#usersListDiv').prepend(html);
}
function createUserPerms(permissions)
{
	$('#permsDiv').empty();	
	Object.keys(permissions).forEach(function(key)
	{
		var html = '<div class="form-group"> <div class="form-check"> <label class="form-check-label switch">';
		html += key;
		html += `<input class="form-check-input" id="${key}" name="${key}" type="checkbox"`;
		
		if(permissions[key] == true)
		{
			html+= "checked>";
		}
		else
		{
			html+= ">";			
		}
		html+= '<span class="slider mr-auto ml-5"></span></label></div></div>';
		$('#permsDiv').prepend(html);
	});
}
// Graphical. view
function usersListClicked(ev)
{
	var listItem = $(ev.target);
	if(listItem.prop('tagName') == 'DIV')
	{
		listItem = listItem.parent();
	}
	if(listItem.prop('tagName') == 'DIV')
	{
		listItem = listItem.parent();
	}
	var listGroup = listItem.parent();
	listGroup.children().each(function()
	{
		$(this).removeClass('active');
	});
	listItem.addClass('active');
	return false;
}