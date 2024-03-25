from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import Task

def main(request) -> HttpResponse:
    return render(request, 'home.html')

def app(request) -> HttpResponse:
    return render(request, 'app.html')