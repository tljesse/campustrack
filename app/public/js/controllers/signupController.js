
function SignupController()
{
// redirect to homepage when cancel button is clicked //
	$('#account-form-btn1').click(function(){ window.location.href = '/';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
	$('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
}

function addDashes(f)
{
    f_val = f.value.replace(/\D[^\.]/g, "");
    f.value = f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
}