from django.db import models

class Organization(models.Model):
    name = models.CharField(max_length=100)
    
    def __unicode__(self):
        return self.name

class Event(models.Model):
    longitude = models.DecimalField(max_digits=20, decimal_places=18)
    latitude = models.DecimalField(max_digits=20, decimal_places=18)
    name = models.CharField(max_length=100)
    organization = models.ForeignKey(Organization)
  
    def as_json(self):
    	return dict(
    		latitude = str(self.latitude),
    		longitude = str(self.longitude),
    		name = self.name,
   			id = str(self.id),
   			organization = str(self.organization)
    	)

    def __unicode__(self):
        return self.name

class Account(models.Model):
	username = models.CharField(max_length=100)
	password = models.CharField(max_length=100)
	organization = models.ForeignKey(Organization)

class User(models.Model):
	phone = models.CharField(max_length=11)
	organizations = models.ManyToManyField('Organization')

	def __unicode__(self):
		return str(self.organizations)


