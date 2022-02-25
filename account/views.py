from django.shortcuts import render, redirect, reverse
from django.contrib.auth import login, authenticate, logout
from .forms import RegistrationForm
from .forms import AccountAuthenticationForm
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import permissions
from rest_framework.response import Response
from django.contrib import auth


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})


@method_decorator(csrf_exempt, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, format=None):
        user = self.request.user

        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})
            else:
                return Response({'isAuthenticated': 'error'})

        except:
            return Response({'error': 'Something went wrong when checking authentication status'})


# @method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        email = data['email']
        password = data['password']

        try:
            user = auth.authenticate(email=email, password=password)
            if user is not None:
                auth.login(request, user)
                print(user.tenant.tenant_uuid)
                tenant_uuid = user.tenant.tenant_uuid
                request.session['tenant_uuid'] = str(tenant_uuid)
                return Response({
                    'success': 'User Authenticated',
                    'tenant_uuid': str(tenant_uuid)
                })
            else:
                return Response({
                    'error': 'Error Authenticating'
                })
        except:
            return Response({'error': 'Something went wrong when logging in'})


class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'Logged Out'})
        except:
            return Response({'error': 'Something went wrong when logging out'})


def registration_view(request):
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(email=email, password=raw_password)
            login(request, account)
            return redirect('account:login')
        else:
            context['registration_form'] = form
    else:
        form = RegistrationForm()
        context['registration_form'] = form
    context['tenant_name'] = request.tenant
    return render(request, 'register.html', context)


def logout_view(request):
    logout(request)
    return redirect('/')


def login_view(request):
    context = {}
    user = request.user
    if user.is_authenticated:
        return HttpResponseRedirect(reverse("chatting:admin_index"))
    if request.POST:
        form = AccountAuthenticationForm(request.POST)
        if form.is_valid():
            email = request.POST['email']
            password = request.POST['password']
            user = authenticate(email=email, password=password)
            if user:
                login(request, user)
                request.session['tenant_uuid'] = str(user.tenant.tenant_uuid)
            # print('login session',request.session)

            return redirect(reverse("account:index"))
    else:
        form = AccountAuthenticationForm()

    context['login_form'] = form
    return render(request, 'login.html', context)


# REDIRECT TO TENANT APPS
def index(request):
    # print('index session',request.session.keys())
    return redirect(reverse("chatting:admin_index"))
