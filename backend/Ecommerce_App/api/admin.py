from django.contrib import admin
from .models import Product,ProductVariant,ProductImage,CustomUser,Category,Wishlist,Address,CartItem,Order,OrderItem,OrderItemReturn,Coupon,Wallet,CouponUsage,Transaction,ProductOffer,CategoryOffer,Review
# Register your models here.

admin.site.register(Product)
admin.site.register(CustomUser)
admin.site.register(ProductVariant)
admin.site.register(ProductImage)
admin.site.register(Category)
admin.site.register(Address)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(OrderItemReturn)
admin.site.register(Coupon)
admin.site.register(Wishlist)
admin.site.register(Wallet)
admin.site.register(CouponUsage)
admin.site.register(Transaction)
admin.site.register(ProductOffer)
admin.site.register(CategoryOffer)
admin.site.register(Review)
