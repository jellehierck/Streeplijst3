from django.urls import path

from streeplijst import views

app_name = 'streeplijst'
urlpatterns = [
    path('members/', views.members, name='members'),
    path('members/<str:username>', views.members_by_username, name='member_by_username'),
    path('products/', views.products, name='products'),
    path('products/<int:folder_id>', views.products_by_folder_id, name='products_by_folder_id'),
    path('sales/<str:username>', views.sales_by_username, name='sales_by_username'),
    path('sales/', views.sales, name='post_sale'),
]
