from rest_framework import serializers
from .models import ProductVariant,ProductImage,CustomUser,Coupon,ProductOffer,CategoryOffer,Review
from django.core.files.base import ContentFile
import base64
import uuid
from django.utils.timesince import timesince


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2']

    def validate(self, data):
        print('validated_data :',data)
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})    
        return data

    def create(self, validated_data):
        password = validated_data["password1"]
        validated_data.pop('password1') 
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField()  # Expect base64 string from frontend

    class Meta:
        model = ProductImage
        fields = ['image', 'is_primary']

    def create(self, validated_data):
        base64_string = validated_data.pop('image')
        format, imgstr = base64_string.split(';base64,')
        ext = format.split('/')[-1]  # Extract file extension (e.g., 'jpeg')
        filename = f"{uuid.uuid4()}.{ext}"  # Generate unique filename
        image_data = base64.b64decode(imgstr)
        image_file = ContentFile(image_data, name=filename)

        # Create and save ProductImage instance
        validated_data['image'] = image_file
        product_image = ProductImage.objects.create(**validated_data)
        return product_image

class ProductVariantSerializer(serializers.ModelSerializer):
    variant_images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = ProductVariant
        fields = ['size', 'color', 'name', 'price', 'stock_quantity', 'variant_images']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])  # Extract images list using "images" key

        # Create the ProductVariant instance
        variant = ProductVariant.objects.create(**validated_data)

        # Process images and rename "images" to "image" before saving
        first = True
        for base64_string in images_data:
            if isinstance(base64_string, str) and base64_string.startswith("data:image"):
                format, imgstr = base64_string.split(';base64,') 
                ext = format.split('/')[-1]  
                filename = f"{uuid.uuid4()}.{ext}" 
                image_data = base64.b64decode(imgstr)  
                image_file = ContentFile(image_data, name=filename)  

                # Create and save the image instance
                if first:
                    ProductImage.objects.create(variant=variant, image=image_file,product=variant.product,is_primary = True)
                    first = False
                else:
                    ProductImage.objects.create(variant=variant, image=image_file,product=variant.product)


        return variant
    

# Coupon Serializer
# ==================

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'description', 'discount_percent', 'valid_from', 
                  'valid_to', 'active', 'minimum_order_amount', 'is_listed']
        
    def validate(self, data):
        """
        Check that valid_from is before valid_to
        """
        if data.get('valid_from') and data.get('valid_to'):
            if data['valid_from'] >= data['valid_to']:
                raise serializers.ValidationError("End date must be after start date")
        return data
    

# Product Offer Serializer

class ProductOfferSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = ProductOffer
        fields = "__all__"
    
    def validate(self, data):
        valid_from = data.get('valid_from')
        valid_to = data.get('valid_to')
        if valid_from and valid_to and valid_from > valid_to:
            raise serializers.ValidationError({
                'valid_from': "The Valid From date cannot be later than the Valid To date.",
                'valid_to': "The 'Valid To' date cannot be earlier than the 'Valid From' date."
            })
        return data

class CategoryOfferSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = CategoryOffer
        fields = "__all__"
    
    def validate(self, data):
        valid_from = data.get('valid_from')
        valid_to = data.get('valid_to')
        if valid_from and valid_to and valid_from > valid_to:
            raise serializers.ValidationError({
                'valid_from': "The Valid From date cannot be later than the Valid To date.",
                'valid_to': "The 'Valid To' date cannot be earlier than the 'Valid From' date."
            })
        return data


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # 👈 custom field
    time_ago = serializers.SerializerMethodField()  # 👈 Add this
    class Meta:
        model = Review
        fields = ['id', 'user', 'product_variant', 'title', 'description', 'rating', 'created_at','time_ago']
        read_only_fields = ['user', 'created_at']

    def get_user(self, obj):
        # obj.user is the related CustomUser instance
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    def get_time_ago(self, obj):
        return timesince(obj.created_at) + " ago"
    