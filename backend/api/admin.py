from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

class UserAdmin(BaseUserAdmin):
    list_display = ["email", "name", "tc", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name","tc"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name","tc", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email","name"]
    filter_horizontal = []


# Now register the new UserAdmin...
admin.site.register(User, UserAdmin )
admin.site.register(UserProfile )
admin.site.register(HomeOpinion)
admin.site.register(ImgDataBase)
