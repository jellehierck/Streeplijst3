from django.urls import path

from streeplijst import views

app_name = 'streeplijst'
urlpatterns = [
    path('', views.ping, name='ping'),  # TODO: Replace with more sensible index function instead of ping
    path('ping', views.ping, name='ping'),
    path('<str:version>', views.ping, name='ping'),
    path('<str:version>/ping', views.ping, name='ping'),

    path('<str:version>/members', views.members, name='members'),
    path('<str:version>/members/username/<str:username>', views.member_by_username, name='member_by_username'),
    path('<str:version>/members/id/<int:id>', views.member_by_id, name='member_by_id'),  # TODO: remove this?

    path('<str:version>/products', views.products, name='products'),
    path('<str:version>/products/folder/<int:folder_id>', views.products_by_folder_id, name='products_by_folder_id'),
    path('<str:version>/folders', views.folders, name='folders'),

    path('<str:version>/sales/<str:username>', views.sales_by_username, name='sales_by_username'),
    path('<str:version>/sales', views.sales, name='post_sale'),

    # Old versions of the paths (not used anyxmore)
    # path('members', views.members, name='members'),
    # path('members/username/<str:username>', views.member_by_username, name='member_by_username'),
    # path('members/id/<int:id>', views.member_by_username, name='member_by_username'),
    # path('products', views.products, name='products'),
    # path('products/<int:folder_id>', views.products_by_folder_id, name='products_by_folder_id'),
    # path('sales/<str:username>', views.sales_by_username, name='sales_by_username'),
    # path('sales', views.sales, name='post_sale'),

]
