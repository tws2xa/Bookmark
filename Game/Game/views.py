from django.shortcuts import render, render_to_response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse


"""-----user creation/authentication-----"""
def login_page(request):
	return render(request, 'login.html')

def register(request):
	return render(request, 'register.html')

def new_user(request):
	username = request.POST['username']
	email = request.POST['email']
	password = request.POST['password']
	user = User.objects.create_user(username, email, password)
	return render(request, 'student_home.html', {'username':username})


"""-----------student home page-----------"""
def student_home(request):
	username = request.POST['username']
	password = request.POST['password']

	if not username or not password:
		return render(request, 'login.html')

	user = authenticate(username=username, password=password)

	if user is not None:
		login(request, user)
		if user.is_active:
			return render(request, 'student_home.html', {'username':username})
	else:
		return render(request, 'login.html')