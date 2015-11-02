/**
Function to check userid & password
**/
function check(form) {
    // The following code checkes whether the entered userid and password are matching*/
	loginResults = checkLogin(form.username.value, form.password.value);
	if(loginResults != null) {
		sessionStorage.studentId = loginResults;
		return true;
	}
	else {
		alert("Check your login and try again!"); // Displays error message
		return false;
    }
}