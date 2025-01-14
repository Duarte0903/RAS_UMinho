# Inclusão de um Microsserviço

A estrutura vai manter-se igual entre as várias pastas de microsserviços, vamos apontar apenas as alterações. Vamos utilizar o microsserviço de Binarização que neste momento está feito com base no exemplo dos profs e adaptar para a nossa estrutura.

## poetry.lock && pyproject.toml && .style.yapf
Copiem estes ficheiros de por exemplo picturas-binary-tool, se não vai dar erro.

## .env.example
Alterar apenas os campos `RABBITMQ_REQUESTS_QUEUE_NAME` e `PICTURAS_MS_NAME` para o nome do microsserviço:

```
...
RABBITMQ_REQUESTS_QUEUE_NAME=binary-requests
...
PICTURAS_MS_NAME=picturas-binarization-tool-ms
```
Atenção: o nome da queue deve ser igual neste campo e na main.py da queue.

## Dockerfile
Basta alterar as duas últimas instruções para dar match com o nome da folder dentro do microsserviço (que contém os "_") e executar o ficheiro correto

```yaml
COPY picturas_binarization_tool_ms ./picturas_binarization_tool_ms

ENTRYPOINT ["python", "-m", "picturas_binarization_tool_ms.main"]
```

Atenção também à versão do python, tem de ser a 11 nos dois campos.

## picturas_<tool>_tool_ms
Aqui vamos incluir os vários ficheiros que tínhamos do exemplo do prof.

### <tool>_request_message.py, <tool>_result_message.py, core
Estes ficheiros é só copiar.

### <tool>_tool.py
Aqui vamos ter de integrar o S3, uma vez que no exemplo do prof ele guardava as imagens localmente.
Para isso no init adicionamos o setup do MinIO:
```python
self.s3_client = boto3.client(
            "s3",
            endpoint_url="http://minio:9000",  # Adjust for your MinIO setup
            aws_access_key_id=MINIO_ACCESS_KEY, #vem do ficheiro config.py
            aws_secret_access_key=MINIO_SECRET_KEY,
        )
```
No `apply` vamos ter de alterar a lógica de dar load e save da imagem também

```python
# Parse input and output bucket/key from URIs
            input_bucket, input_key = self.parse_s3_uri(parameters.inputImageURI)
            output_bucket, output_key = self.parse_s3_uri(parameters.outputImageURI)

            # Download the input image from MinIO
            LOGGER.info("Downloading input image from MinIO: %s/%s", input_bucket, input_key)
            input_obj = self.s3_client.get_object(Bucket=input_bucket, Key=input_key)
            input_image = Image.open(BytesIO(input_obj['Body'].read()))
```
e
```python
# Save the processed image to MinIO
            LOGGER.info("Uploading processed image to MinIO: %s/%s", output_bucket, output_key)
            buffer = BytesIO()
            <final_image>.save(buffer, format="JPEG")  # Adjust format if needed
            buffer.seek(0)

            self.s3_client.put_object(Bucket=output_bucket, Key=output_key, Body=buffer)
            LOGGER.info("Bezel added successfully and image saved to MinIO.")
```
É necessário alterar a variável `<final_image>` para o nome que usaram.

Também é necessário acrescentar no fim o seguinte método:
```python
    @staticmethod
    def parse_s3_uri(uri):
        """
        Parse a URI into bucket and key by splitting on '/'.

        Args:
            uri (str): URI in the format 'bucket/key'.

        Returns:
            tuple: (bucket, key)
        """
        parts = uri.split("/", 1)  # Split into bucket and key
        if len(parts) != 2:
            raise ValueError(f"Invalid URI format: {uri}")

        bucket, key = parts
        return bucket, key

```

### config.py
É preciso acrescentar as vars do MinIO

```
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "admin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "admin123")
``` 

## /queue 
Adicionar o campo correspondente ao microsserviço.
```python
"binary": {
        "queue": "binary-requests",
        "routing_key": "requests.binary",
        "procedure": "apply_binarization",
    },
```

### docker-compose
Adicionar uma instrução relativa ao microsserviço, basta copiar a seguinte
```yaml
  binary-tool-ms:
    build: ./picturas-binarization-tool-ms
    container_name: binarization-tool-ms
    restart: always
    environment:
      - RABBITMQ_HOST=rabbitmq
      - PICTURAS_LOG_LEVEL=INFO  # change / remove in production
    depends_on:
      rabbitmq:
        condition: service_healthy
```
e alterar o build e container_name.
