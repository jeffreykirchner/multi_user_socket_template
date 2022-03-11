from django.http import HttpResponse
from django.views.decorators.http import require_GET


@require_GET
def HumansTxt(request):
    lines = [
        "Author: Jeffrey Kirchner",
        "Source Code: https://github.com/jeffreykirchner",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")