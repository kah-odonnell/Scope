from django.db import models

class Event(models.Model):
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    name = models.CharField(max_length=100)
    """
    sponsor = models.ForeignKey(Organization)
    """
    def as_json(self):
    	return dict(
    		latitude = str(self.latitude),
    		longitude = str(self.longitude),
    		name = self.name,
   			id = str(self.id)
    	)

    def __unicode__(self):
        return self.name

class Organization(models.Model):
    name = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.name
