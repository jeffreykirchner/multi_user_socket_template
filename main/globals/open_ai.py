
import asyncio
import os
import json

from openai import AzureOpenAI
from openai import AsyncOpenAI

from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from asgiref.sync import async_to_sync

endpoint = os.getenv("ENDPOINT_URL", "https://esi-open-ai.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-4.1")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", settings.AZURE_OPENAI_API_KEY)

# Initialize Azure OpenAI client with key-based authentication
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)

client_async = AsyncOpenAI(
    base_url="https://esi-open-ai.openai.azure.com/openai/v1/",
    api_key=subscription_key,
)

def chat_gpt_generate_completion(messages):
    """
    generate a completion using the Azure OpenAI client.
    
    :param messages: List of messages to send to the model.
    :return: The generated completion response.
    """

    # async_to_sync(chat_gpt_generate_completion_async)()

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

async def chat_gpt_generate_completion_async():

    prompts = [
        "Write a short poem about the sea.",
        "Explain the theory of relativity in simple terms.",    
        "What are the benefits of using renewable energy sources?",
        "Describe the process of photosynthesis.",
        "What are the main causes of climate change?",
        "How does the human brain process information?",
        "What are the key principles of quantum mechanics?",
        "Explain the significance of the Renaissance period in history.",
        "What are the advantages and disadvantages of social media?",
        "Describe the structure and function of DNA.",
        "What are the main components of a computer system?",
        "How does the internet work?",
        "What are the different types of renewable energy?",
        "Explain the concept of supply and demand in economics.",
        "What are the effects of pollution on the environment?",
        "Describe the process of evolution by natural selection.",
    ]

    coroutines = [get_chat_completion(p) for p in prompts]
    results = await asyncio.gather(*coroutines)
    print(results)

async def get_chat_completion(p):
    response = await client_async.chat.completions.create(messages=[{"role": "user", "content": p}], model="gpt-4.1",
        max_tokens=800,
        temperature=1,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False)

    return response.choices[0].message.content

