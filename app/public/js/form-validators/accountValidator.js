
function AccountValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf'), $('#height-tf'), $('#weight-tf'), $('#phone-tf')];
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg'), $('#height-cg'), $('#weight-cg'), $('#phone-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateName = function(s)
	{
		return s.length >= 3;
	}
	
	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed their password, return ok
		if ($('#userId').val() && s===''){
			return true;
		}	else{
			return s.length >= 6;
		}
	}
	
	this.validateEmail = function(e)
	{
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
	}

	this.validateHeight = function(e)
	{
		var re = /^[0-9]+\'[ ]?([0-9]{1,2}[\"]?|)$/;
		return re.test(e);
	}

	this.validateWeight = function(e)
	{
		// must be a number
		var re = /^[1-8]{1}([0-9]){1,3}$/;
		return re.test(e);
	}

	this.validatePhone = function(e)
	{
		// must be a number xxx-xxx-xxxx
		var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
		return re.test(e);
	}
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[1].addClass('error');
	this.showErrors(['That email address is already in use.']);
}

AccountValidator.prototype.showInvalidUserName = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That username is already in use.']);
}

AccountValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Please Enter Your Name');
	}
	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); e.push('Please Enter A Valid Email');
	}
	if (window.location.href.indexOf('admin') < 0){
		if (this.validateHeight(this.formFields[4].val()) == false) {
			this.controlGroups[4].addClass('error'); e.push('Please Enter a Valid Height (ft\'in\'\')');
		}
		if (this.validateWeight(this.formFields[5].val()) == false) {
			this.controlGroups[5].addClass('error'); e.push('Please Enter a Valid Weight');
		}
	}
	if (this.validatePhone(this.formFields[6].val()) == false) {
		this.controlGroups[6].addClass('error'); e.push('Please Enter a Valid Phone Number (xxx-xxx-xxxx)');
	}
	if (this.validateName(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('Please Choose A Username');
	}
	if (this.validatePassword(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		e.push('Password Should Be At Least 6 Characters');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	