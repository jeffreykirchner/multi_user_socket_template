from django.http import HttpResponse
from django.views.decorators.http import require_GET


@require_GET
def AdsTxt(request):
    lines = [
        "placeholder.example.com, placeholder, DIRECT, placeholder",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")