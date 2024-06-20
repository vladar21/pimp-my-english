# users/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.auth.decorators import login_required


def some_view(request):
    messages.debug(request, 'This is a debug message.')
    return render(request, 'some_template.html')


@login_required
def profile(request):
    return render(request, 'users/profile.html')


# def signup(request):
#     if request.method == 'POST':
#         print('we in signup')
#         form = UserRegisterForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             print('We created user')
#             login(request, user)
#             messages.success(request, 'You have successfully registered!')
#             return redirect('profile')
#         else:
#             for field in form.errors:
#                 for error in form.errors[field]:
#                     print(error)
#                     messages.error(request, f"{field}: {error}")
#     else:
#         form = UserRegisterForm()
#     return render(request, 'account/signup.html', {'form': form})
