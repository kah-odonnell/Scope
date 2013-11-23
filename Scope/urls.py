from django.conf.urls import patterns, include, url
from django.conf import settings
from maps import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Scope.views.home', name='home'),
    # url(r'^Scope/', include('Scope.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index),
    url(r'^add/', views.newEvent),
    url(r'^get/', views.getEvents),
    url(r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.SETTINGS_PATH + '/../static'}),
    url(r'^register/', views.register_organization),
    url(r'^signup/', views.sign_up),
)
