import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from maps.models import Event, Organization, Account, User
from twilio.rest import TwilioRestClient
from datetime import datetime
from dateutil import parser
import requests
import json

def goo_shorten_url(url):
    post_url = 'https://www.googleapis.com/urlshortener/v1/url'
    payload = {'longUrl': url}
    headers = {'content-type': 'application/json'}
    r = requests.post(post_url, data=json.dumps(payload), headers=headers)
    x = json.loads(r.text)
    return x['id']

def index(request):
	return render(request, 'map.html', {'Test': True})

@csrf_exempt
def newEvent(request):
	try:
		org = Organization.objects.get(name=request.session['organization'])
	except:
		return HttpResponse('Failed to find organization')
	if request.POST.get('latitude') and request.POST.get('longitude'):
		new_event = Event(
			latitude=request.POST['latitude'],
			longitude=request.POST['longitude'],
			name=request.POST['name'],
			organization=org,
			date=datetime.strptime(request.POST['date'], "%m/%d/%Y"),
			time=request.POST['time']
		)
		url = "http://172.27.122.115:8080/mobile/"+request.POST['latitude']+"/"+request.POST['longitude']+"/"
		new_url = goo_shorten_url(url)
		print new_url
		new_event.save()
		interested = User.objects.filter(organizations=org)
		
		#Make Twilio call here
		account_sid = "ACacb8b149f72c6d38c6e789a8dc6dd0d5"
		auth_token  = "48b1149246296d1c61e70d43e770b5a3"
		client = TwilioRestClient(account_sid, auth_token)
		for user in interested:
			phone = "+" + user.phone
			message = org.name+" has created a new event, "+request.POST['name']+"! It's at "+request.POST['time']+" on "+request.POST['date']+"."
			message = message + " Check it: "+new_url
			message = client.messages.create(body=message,
		    	to=phone,
		    	from_= "+17579417098")
			print message.sid
		return HttpResponse('Saved event.')

def getEvents(request):
	if request.method == 'GET':
		events = None
		if not request.GET.get('start'):
			events = Event.objects.all()
		else:
			starttime = parser.parse(request.GET.get('start'))
			endtime = parser.parse(request.GET.get('end'))
			events = Event.objects.filter(date__gt=starttime, date__lt=endtime)

		event_list = [event.as_json() for event in events]
		json_string = json.dumps(event_list)
		return HttpResponse(json_string)

def register_organization(request):
	if request.method == "POST":
		if request.POST['password'] != request.POST['confirmpw']:
			return render(request, 'signup.html', {
				'failed': True,
			})
		else: 
			try:
				org = Organization.objects.get(name=request.POST['organization'])
			except:
				org = Organization(name=request.POST['organization'])
				org.save()
			request.session['organization'] = request.POST['organization']
			account = Account(
				username=request.POST['organization'],
				password=request.POST['password'],
				organization=org
			)
			account.save()
			return HttpResponseRedirect('/addmap/')
	if request.method == 'GET':
		return render(request, 'signup.html', {
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
			if request.POST.get(org.name):
				new_user.organizations.add(org)
		return HttpResponseRedirect('/')

def login(request):
	if request.method == 'POST':
		try:
			m = Account.objects.get(username=request.POST['organization'])
		except:
			return render(request, 'login.html', {
				'failed': True
			})
		if m.password == request.POST['password']:
			request.session['organization'] = m.organization.name
			return HttpResponseRedirect('/addmap/')
		else:
			return render(request, 'login.html', {
				'failed': True
			})
	if request.method == 'GET':
		return render(request, 'login.html', {
			'failed': False
		})

def add_map(request):
	return render(request, 'adminmap.html', {'organization': request.session['organization']})

def mobile(request, lat="", lng=""):
	return render(request, 'mobilemap.html', {
		'lat': lat,
		'lng': lng
	})

