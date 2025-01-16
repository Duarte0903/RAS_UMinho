# PictuRas OCR Tool

## Para testar com o teste dos professores

Usamos a biblioteca _tesseract_ portanto temos de instalar.

Começamos por seguir os comandos do professor:

1. cd usage_example
2. docker compose up

3. docker run -p 5672:5672 -p 15672:15672 rabbitmq:4-management-alpine (run rabbitmq)

4. poetry install
5. source $(poetry env info --path)/bin/activate 

    (Aqui como estamos no ambiente virtual vamos instalar)

    - poetry add pytesseract (isto faz com que o _pytesseract_ seja instalado no ambiente virtual e registado no ficheiro pyproject.toml como uma dependência do projeto)

    Depois noutro terminal, fora do ambiente virtual fazemos:

    - sudo apt update
    - sudo apt install -y tesseract-ocr libtesseract-dev
    - tesseract --version (para ter a certeza que está instalado)

Depois continuamos a seguir os passos dos professores.

6. python -m usage_example.request_mocker.main

7. source $(poetry env info --path)/bin/activate
8. python -m picturas_watermark_tool_ms.main



