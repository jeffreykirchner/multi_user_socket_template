from django.http import HttpResponse
from django.views.decorators.http import require_GET


@require_GET
def SecurityTxt(request):
    lines = [
        "Contact:  abuse@chapman.edu",
        "Preferred-Languages: en",
        "Policy: https://www.chapman.edu/campus-services/information-systems/security/index.aspx",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")