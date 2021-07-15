from django.urls import path
from django.urls.resolvers import URLPattern
from .views import apiOverview, taskCreate, taskDelete, taskDetail, taskList, taskUpdate

urlpatterns = [
    path('', apiOverview, name="api_overview"),
    path('tasklist', taskList, name="task_list"),
    path('task-detail/<str:pk>/', taskDetail, name="task_detail"),
    path('task-create', taskCreate, name="task-create"),
    path('task-delete/<str:pk>/', taskDelete, name="task-delete"),
    path('task-update/<str:pk>', taskUpdate, name="task-update"),

]
