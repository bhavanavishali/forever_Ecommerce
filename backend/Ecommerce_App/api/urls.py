from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'product_offers',views.ProductOfferViewSet)
router.register(r'category_offers',views.CategoryOfferViewSet)




urlpatterns = [
    path('',include(router.urls)),
    path('index/',views.index,name="index"),
    path('token/refresh/', views.refresh_token),
    path('add_product/',views.add_product,name="add_product"),
    path('edit_product/<int:id>/',views.edit_product,name="edit_product"),
    path('login/',views.login,name='login'),
    path('admin_login/',views.admin_login,name='admin_login'),
    path('register/',views.register,name='register'),
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/',views.verify_otp,name="verify-otp"),
    path('google-login/', views.google_login, name='google_login'),
    path('products/',views.get_products,name="products"),
    path('filter_product/',views.filter_product,name="filter_product"),
    path('users/',views.get_all_users,name="users"),
    path('edit_user/<int:id>/',views.edit_user,name="edit_user"),
    path('product_details/<int:id>/',views.product_details,name="product_details"),
    path('related_products/<int:id>/',views.related_products,name="related_products"),
    path('block_unblock_user/<int:id>/',views.block_unblock_user,name="block_unblock_user"),
    
    # categories
    path('categories/',views.get_all_categories,name="categories"),
    path('list_unlist_category/<int:id>',views.list_unlist_category,name="list_unlist_category"),
    path('edit-category/<int:id>',views.edit_category,name="edit_category"),
    path('add_category/',views.add_category,name="add_category"),
    path('get_all_listed_categories/',views.get_all_listed_categories,name="get_all_listed_categories"),
    
    path('get_all_products/',views.get_all_products,name="get_all_products"),
    path('list_unlist_product/<int:id>/',views.list_unlist_product,name="list_unlist_product"),
    
    # user profile
    path('user_profile/',views.user_profile,name="user_profile"),
    path('edit_user_profile/',views.edit_user_profile,name="edit_user_profile"),
    path('reset_password/',views.reset_password,name="reset_password"),
    path('update_profile_picture/',views.update_profile_picture,name="update_profile_picture"),
    
    # address 
    path('get_all_addresses/',views.get_all_addresses,name="get_all_addresses"),
    path('add_address/',views.add_address,name="add_address"),
    path('edit_address/<int:id>/',views.edit_address,name="edit_address"),
    path('delete_address/<int:id>/',views.delete_address,name="delete_address"),

    # cart
    path('add_to_cart/',views.add_to_cart,name="add_to_cart"),
    path('get_all_cart_products/',views.get_all_cart_products,name="get_all_cart_products"),
    path('update_cart/<int:id>/',views.update_cart,name="update_cart"),
    path('remove_cartitem/<int:id>/',views.remove_cartitem,name="remove_cartitem"),

    # order
    path('place_order/',views.place_order,name="place_order"),
    path('update_order_payment/',views.update_order_payment,name="update_order_payment"),
    path('get_all_orders/',views.get_all_orders,name="get_all_orders"),
    path('order_details/<int:id>/',views.order_details,name="order_details"),
    path('cancel_order/<int:id>/',views.cancel_order,name="cancel_order"),
    path('cancel_order_item/<int:id>/',views.cancel_order_item,name="cancel_order_item"),
    path('update_order_status/<int:id>/',views.update_order_status,name="update_order_status"),
    path('return_order_item/<int:order_item_id>/',views.return_order_item,name="return_order_item"),
    path('return_reasons/<int:order_item_id>/',views.return_reasons,name="return_reasons"),
    path('handle_return_approval/<int:order_item_id>/',views.handle_return_approval,name="handle_return_approval"),
    path('retry_payment/<int:order_id>/',views.retry_payment,name="retry_payment"),
    path('verify_retry_payment/',views.verify_retry_payment,name="verify_retry_payment"),

    # razor pay 
    path('create_order/',views.create_order,name="create_order"),
    path('verify_payment/',views.verify_payment,name="verify_payment"),

    # coupon
    path('apply_coupon/',views.apply_coupon,name="apply_coupon"),
    path('remove_coupon/',views.remove_coupon,name="remove_coupon"),
    path('get_all_valid_coupons/',views.get_all_valid_coupons,name="get_all_valid_coupons"),

    path('coupons/', views.coupon_list, name='coupon-list'),
    path('coupons/<int:pk>/', views.coupon_detail, name='coupon-detail'),


    # wishlist
    path('add_to_wishlist/',views.add_to_wishlist,name="add_to_wishlist"),
    path('remove_from_wishlist/<int:product_variant_id>/',views.remove_from_wishlist,name="remove_from_wishlist"),
    path('is_product_in_wishlist/<int:product_variant_id>/',views.is_product_in_wishlist,name="is_product_in_wishlist"),
    path('get_all_wishlist_products/',views.get_all_wishlist_products,name="get_all_wishlist_products"),
    
    # wallet
    path('get_wallet_data/',views.get_wallet_data,name="get_wallet_data"),
    path('add_money_to_wallet/',views.add_money_to_wallet,name="add_money_to_wallet"),


    # sales report
    # =============

     path('sales-report/', views.generate_sales_report, name='sales_report'),

     path('best_selling_products/',views.best_selling_products),
     path('best_selling_categories/',views.best_selling_categories),

    # forgot password
    # =================

    path('forgot_password_send_otp/',views.forgot_password_send_otp),
    path('forgot_password_verify_otp/',views.forgot_password_verify_otp),
    path('reset_forgot_password/',views.reset_forgot_password),

    # reviews
    # ========

    path('add-review/', views.AddReviewView.as_view(), name='add-review'),
    path('reviews/<int:product_variant_id>/', views.ListReviewView.as_view(), name='list-reviews'),
    path('get_total_rating/', views.get_total_rating),


    path('get-product-colors/',views.get_product_colors),

    path('logout/',views.logout),
    path('check-auth/',views.check_auth),
    path('check-admin-auth/',views.check_admin_auth),

]