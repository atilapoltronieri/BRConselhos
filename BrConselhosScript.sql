Create Database BRConsultoriaProject 
go

use BRConsultoriaProject 
go

create table Contribuinte  (
    id int NOT NULL IDENTITY ,
    nome varchar(128) NOT NULL,
    cpf varchar(11) NOT NULL,
    dependentes int NOT NULL,
    renda_bruta numeric(15,5) NOT NULL,
    renda_liquida numeric(15,5),
    ir numeric(5,3),
	PRIMARY KEY CLUSTERED(ID),
	CONSTRAINT UC_cpf Unique (cpf)
)
go

insert into Contribuinte
values ('Átila Blanco Poltronieri', '36876527859', 0, 1500, 0, 0)
go

create table SalarioMinimo  (
    id int NOT NULL IDENTITY ,
    valor numeric(15,5) NOT NULL,
	PRIMARY KEY CLUSTERED(ID)
)
go
