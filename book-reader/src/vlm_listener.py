import modal
import requests

image_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCqSomI84vz7ZJdNYHvnJPOOe9Z_-AcO6Pfa4pPPMD3tJ19L907tLv0quBWIFEdZoWbY&usqp=CAU"
question = "Translate just the following text to English without further comments and then describe subtleties behind the text: 私はあなたのお母さんが好きです"

def run(image_url, question):
    f = modal.Function.lookup("vlm", "Model.generate")

    response = requests.post(
        f.web_url,
        json={
            "image_url": image_url,
            "question": question,
        },
    )
    print(response.status_code)
    return response

print(run(image_url, question).text)