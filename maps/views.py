import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from maps.models import Event, Organization, Account, User

def index(request):
    return render(request, 'map.html', {'Test': True})

@csrf_exempt
def newEvent(request):
	if request.POST.get('latitude') and request.POST.get('longitude'):
		new_event = Event(
			latitude=request.POST['latitude'],
			longitude=request.POST['longitude'],
			name=request.POST['name']
		)
		new_event.save()
		return HttpResponse('Saved event.')

def getEvents(request):
	if request.method == 'GET':
		events = Event.objects.all()
		print events
		event_list = [event.as_json() for event in events]
		print event_list
		json_string = json.dumps(event_list)
		return HttpResponse(json_string)

def register_organization(request):
	if request.method == "POST":
		if request.POST['password'] != request.POST['confirmpw']:
			return render(request, 'register.html', {
				'failed': True,
			})
		else: 
			try:
				org = Organization.objects.get(name=request.POST['organization'])
			except:
				org = Organization(name=request.POST['organization'])
				org.save()
			account = Account(
				username=request.POST['username'],
				password=request.POST['password'],
				organization=org
			)
			account.save()
			return render(request, 'map.html')
	if request.method == 'GET':
		return render(request, 'register.html', {
			'failed': False
		})

def sign_up(request):
	if request.method == 'GET':
		organizations = Organization.objects.all()
		return render(request, 'signup.html', {
			'organizations': organizations
		})
	if request.method == 'POST':
		new_user = User(phone=request.POST['phone'])
		new_user.save()
		organizations = Organization.objects.all()
		for org in organizations:
			try:
				picked_org = request.POST.get(org.name)
				new_user.add(org)
			except:
				pass
		return HttpResponseRedirect('/')
