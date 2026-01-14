from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ValidationError
from decimal import Decimal,ROUND_HALF_UP
from django.core.validators import MinValueValidator, MaxValueValidator
import cloudinary
from cloudinary.models import CloudinaryField


# Custom User
class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, phone_number, password=None, password2=None):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, phone_number=phone_number)

        if password and password2 and password != password2:
            raise ValueError("Passwords do not match")

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, phone_number, password=None):
        user = self.create_user(email, first_name, last_name, phone_number, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    profile_picture = CloudinaryField('image')
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
    

# Category
# ========

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True,blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    

# Product
# =======

class Product(models.Model):
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='products') # one category will have many products
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=True) # status
    is_deleted = models.BooleanField(default=False) #soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="created_products")
    
    def __str__(self):
        return self.name


# Product Variants
# ================

class ProductVariant(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="variants")
    size = models.CharField(max_length=100,null=True,blank=True)
    color = models.CharField(max_length=100,null=True,blank=True)
    name = models.CharField(max_length=255)

    price = models.DecimalField(max_digits=10,decimal_places=2)
    product_discount = models.FloatField(default=0)  # final applied discount %
    final_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 

    stock_quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_discount(self):
        """Calculate and store final price with max valid discount."""
        product_offer = self.product.offer if hasattr(self.product, 'offer') and self.product.offer.is_valid() else None
        category_offer = self.product.category.offer if hasattr(self.product.category, 'offer') and self.product.category.offer.is_valid() else None
        product_discount = product_offer.discount_percentage if product_offer else 0
        category_discount = category_offer.discount_percentage if category_offer else 0

        max_discount = max(product_discount, category_discount)

        self.product_discount = max_discount
        discount_amount = self.price * (Decimal(str(max_discount)) / Decimal('100'))
        self.final_price = self.price - discount_amount
        self.save()
    
    def is_offer_valid(self, offer):
        return offer and hasattr(offer, 'is_valid') and offer.is_valid()


    def calculate_discount(self):
        product_offer = self.product.offer if self.is_offer_valid(getattr(self.product, 'offer', None)) else None
        category_offer = self.product.category.offer if self.is_offer_valid(getattr(self.product.category, 'offer', None)) else None

        product_discount = product_offer.discount_percentage if product_offer else 0
        category_discount = category_offer.discount_percentage if category_offer else 0

        max_discount = max(product_discount, category_discount)

        # ✅ Ensure self.price is Decimal
        price = Decimal(str(self.price))  
        discount_amount = price * (Decimal(str(max_discount)) / Decimal('100'))
        final_price = price - discount_amount

        return max_discount, final_price


    def save(self, *args, **kwargs):
        # Automatically calculate discount before saving
        self.product_discount, self.final_price = self.calculate_discount()
        super().save(*args, **kwargs)
    
    
    def __str__(self):
        return f'product:{self.product.name} size:{self.size} color:{self.color}'
    
   
    

# Product Image
# =============

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="product_image")
    variant = models.ForeignKey(ProductVariant,on_delete=models.SET_NULL,null=True,blank=True,related_name="variant_images")
    image = CloudinaryField('image')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.product.name} - Variant : {self.variant.name if self.variant else 'None'}"
    

# Address Model
# ================

class Address(models.Model):
    """
    Model to store address details.
    """
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="addresses",
        verbose_name="User"
    )
    name=models.CharField(max_length=100,verbose_name='name',null=True)
    phone_no = models.CharField(max_length=15, null=True, blank=True, verbose_name="Phone Number")
    street_address = models.CharField(max_length=255, verbose_name="Street Address")
    city = models.CharField(max_length=100, verbose_name="City")
    state = models.CharField(max_length=100, verbose_name="State")
    pin_code = models.CharField(max_length=10, verbose_name="Pin Code")
    country = models.CharField(max_length=100, verbose_name="Country")
    is_primary = models.BooleanField(default=False) 

    def save(self, *args, **kwargs):
        if self.is_primary:
            Address.objects.filter(user=self.user, is_primary=True).update(is_primary=False)
        elif not self.pk and not Address.objects.filter(user=self.user).exists():
            self.is_primary = True
        super().save(*args, **kwargs)

    def _str_(self):
        return f"{self.street_address}, {self.city}, {self.state}, {self.country}"
    


class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=10, blank=True,null=True, default="")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Validate quantity
        if self.quantity > 5:
            raise ValidationError("Maximum 5 items allowed per product variant.")
        if self.quantity > self.product_variant.stock_quantity:
            raise ValidationError("Quantity exceeds available stock.")
        self.total_price = self.product_variant.price * self.quantity
        self.total_discount = (self.product_variant.price * Decimal(str(self.product_variant.product_discount)) / 100) * self.quantity
        
        super().save(*args, **kwargs)

    def get_actual_price(self):
        return self.product_variant.price
    
    def get_offer_amount(self):
        price = Decimal(str(self.product_variant.price))
        discount = Decimal(str(self.product_variant.product_discount))
        offer_amount = (price * discount / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        return offer_amount


    def get_variant_image(self):
        primary_image = self.product_variant.variant_images.filter(is_primary=True).first()
        return primary_image.image.url if primary_image else None

    def _str_(self):
        return f"{self.product_variant.product.name} - {self.product_variant} x {self.quantity}"
    

# Order
# ======

class Order(models.Model):
    STATUS_CHOICES = [

        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELED', 'Canceled'),
        ('RETURN_PENDING', 'Return pending'),
        ('RETURNED','Returned'),
        ('PAYMENT_PENDING', 'Payment Pending'),
    ]
    PAYMENT_CHOICES = [
        ('COD', 'Cash On Delivery'),
        ('RAZORPAY', 'Razorpay'),
        ('WALLET', 'Wallet'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    payment = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='COD')
    shipping_address = models.ForeignKey('Address', on_delete=models.SET_NULL, null=True, blank=True)
    order_date = models.DateField(auto_now_add=True)
    delivery_date = models.DateField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    shipping_chrg = models.FloatField(default=0)
    order_no = models.CharField(max_length=100, unique=True,null=True)

    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    coupon_discount = models.IntegerField(default=0,null=True)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    currency = models.CharField(max_length=10, default='INR')
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_status = models.CharField(max_length=20, default='PENDING')
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    def save(self, *args, **kwargs):
        if not self.pk: 
            # Get coupon discount from session if exists
            request = kwargs.pop('request', None)
            if request and request.session.get('discount_amount'):
                try:
                    # Clear coupon data from session
                    request.session.pop('coupon_id', None)
                    request.session.pop('discount_amount', None)
                    request.session.pop('new_total', None)
                except Exception:
                    pass

        # Handle Razorpay payment status
        if self.razorpay_payment_status != 'CONFIRMED' and self.payment == 'razorpay':
            self.status = 'PAYMENT_PENDING'

        super().save(*args, **kwargs)

    def _str_(self):
        return f"Order {self.order_no} - {self.status}"


# Order Item
# ==========
class OrderItem(models.Model):
    # Fields for the OrderItem model
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELED', 'Canceled'),
        ('RETURN_PENDING', 'Return Pending'),
        ('RETURNED', 'Returned'),
        ('PAYMENT_PENDING', 'Payment Pending'),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_amount = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    def _str_(self):
        return f"Item: {self.product_name} - {self.quantity}"

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"


# OrderItemReturn
# ===============
class OrderItemReturn(models.Model):
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='order_item_return')
    sizing_issues = models.BooleanField(default=False)
    damaged_item = models.BooleanField(default=False)
    incorrect_order = models.BooleanField(default=False)
    delivery_delays = models.BooleanField(default=False)
    other_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:  # If it's a new return request
            self.order_item.status = 'RETURN_PENDING'
            self.order_item.save()
        super().save(*args, **kwargs)

    def _str_(self):
        return f"Return for Order Item #{self.order_item.id} - Created on {self.created_at}"
    

# Coupon
# ======


class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(null=True,blank=True)
    discount_percent = models.IntegerField(default=0)  # or use amount
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    is_listed=models.BooleanField(default=True)

    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to

    def __str__(self):
        return self.code
    


# CouponUsage
class CouponUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    used = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.first_name}-{self.coupon.code}'
    

# WishLish
# =========

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product_variant = models.ForeignKey('ProductVariant', on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product_variant')

    def _str_(self):
        return f"{self.user.username}'s wishlist item: {self.product_variant}"
    

# Wallet
# ======


class Wallet(models.Model):
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='wallet'
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def _str_(self):
        return f"{self.user.email}'s Wallet" 

    def credit(self, amount, description=""):
        """
        Add amount to the wallet balance and log a credit transaction.
        """
        if amount <= 0:
            raise ValueError("Amount must be positive for credit.")
        self.balance += Decimal(str(amount))
        self.save()
        self.transactions.create(
            transaction_type='credit',
            amount=amount,
            description=description
        )

    def debit(self, amount, description=""):
        """
        Deduct amount from the wallet balance and log a debit transaction.
        """
        if amount <= 0:
            raise ValueError("Amount must be positive for debit.")
        if self.balance < amount:
            raise ValueError("Insufficient balance for this transaction.")
        self.balance -= amount
        self.save()
        self.transactions.create(
            transaction_type='debit',
            amount=amount,
            description=description
        )

# Transactions
# ============

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    )

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"{self.transaction_type.capitalize()} - ₹{self.amount}"
    

# ProductOffer
class ProductOffer(models.Model):
    product = models.OneToOneField('Product', on_delete=models.CASCADE, related_name='offer')
    discount_percentage = models.FloatField(help_text="Discount % (0-100)")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)

    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        for variant in self.product.variants.all():
            variant.update_discount()

    def delete(self, *args, **kwargs):
        product = self.product  # Store before deletion
        super().delete(*args, **kwargs)
        # After deleting product offer, apply category offer if exists
        for variant in product.variants.all():
            variant.refresh_from_db()  
            variant.update_discount()

    def __str__(self):
        return f"{self.product.name} - {self.discount_percentage}%"

# CategoryOffer
class CategoryOffer(models.Model):
    category = models.OneToOneField('Category', on_delete=models.CASCADE, related_name='offer')
    discount_percentage = models.FloatField(help_text="Discount % (0-100)")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)

    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        for product in self.category.products.all():
            for variant in product.variants.all():
                variant.refresh_from_db()
                variant.update_discount()
    
    def delete(self, *args, **kwargs):
        category = self.category  
        super().delete(*args, **kwargs)
        # After deleting category offer, apply product offer if exists
        for product in category.products.all():
            for variant in product.variants.all():
                variant.refresh_from_db() 
                variant.update_discount()  


    def __str__(self):
        return f"{self.category.name} - {self.discount_percentage}%"
    

class Review(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    product_variant = models.ForeignKey('ProductVariant', on_delete=models.CASCADE)
    title = models.CharField(max_length=100) 
    description = models.TextField()
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.product_variant} - {self.rating}★"


    
    


    
    
