
import os
import base64
import json

from openai import AzureOpenAI

from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings

endpoint = os.getenv("ENDPOINT_URL", "https://esi-open-ai.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-4.1")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", settings.AZURE_OPENAI_API_KEY)

# Initialize Azure OpenAI client with key-based authentication
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)

def chat_gpt_generate_completion(messages):
    """
    generate a completion using the Azure OpenAI client.
    
    :param messages: List of messages to send to the model.
    :return: The generated completion response.
    """

    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=messages,
            max_tokens=800,
            temperature=1,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None,
            stream=False
        )

        return response.to_json()
    except Exception as e:
        return json.dumps({ "error": str(e)}, cls=DjangoJSONEncoder)

    

    