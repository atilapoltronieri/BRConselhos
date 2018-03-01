Projeto BRConselhos - Instalação

O Projeto BRConselhos é uma aplicação Web desenvolvida em AngularJS utilizando MaterialDesign. Seus dados são alimentados através de serviço por uma publicação desenvolvida em C#. Segue abaixo os passos para como a utilizar.

-> Execute o comando sql dentro do arquivo BrConselhosScript.sql. Nele consta todos os objetos no banco necessários para utilização do sistema, desenvolvido para SQL Server.
A instância que consta para o webservice é localhost\SQLExpress. Caso seja necessário alterar para outra, por favor a fazer no arquivo Web.config do projeto BRConselhosWS. 

-> Na pasta SiteBRConselhos consta todos os arquivos para executar o site criado para utilização desta aplicação. 
Para o utilizar corretamente será necessário subir seu WebService e apontar a aplicação para este. Dentro do arquivo SiteBRConselhos\js\app.js está apontando para http://localhost:3318, o que deve ser mudado para onde estará apontado seu webservice.

-> Na pasta BRConselhosWS consta o projeto em C# para o serviço da aplicação, BrConselhosWs.sln, e uma pasta onde consta a plucação deste mesmo, BRConselhosWS\WebService - Publicacao, caso não tenha que alterar nada no mesmo.

Bom uso e me ponho disponível para qualquer dúvida. Obrigado.