# Desafio 02 do curso FullCycle
Criar uma imagem docker rodando uma api node que salve dados em um banco mysql rodando em outro container.


## Requisitos
 - Expor a api usando o nginx rodando em outro container, na porta 8080.
 - A api deve salvar usuários no banco ao receber um request na rota '/'
 - A api deve listar os usuários do banco em html

### Comando para rodar
```bash
docker compose up -d
```
