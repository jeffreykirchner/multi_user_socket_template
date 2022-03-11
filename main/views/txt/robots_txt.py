from django.http import HttpResponse
from django.views.decorators.http import require_GET


@require_GET
def RobotsTxt(request):
    lines = [
        "User-Agent: *",
        "Allow: /",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")