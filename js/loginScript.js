function check(form) { /*function to check userid & password*/
                /*the following code checkes whether the entered userid and password are matching*/
     if(form.username.value == "my" && form.password.value == "password") {
      window.open('play.html')/*opens the target page while Id & password matches*/
                }
      else {
          alert("Check your login and try again!")/*displays error message*/
                }
    }