import json
from django.shortcuts import render
from django.http import HttpResponse
from maps.models import Event

def index(request):
    return render(request, 'map.html', {'Test': True})

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
