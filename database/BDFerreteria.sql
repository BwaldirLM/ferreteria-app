create database Ferreteria;

use Ferreteria;

create table Usuario(
	usuario varchar(30) primary key,
	contrasena varchar(100) not null,		
    rol varchar(20) default 'cliente'
);

create table Persona(
	DNI varchar(8) primary key,
	nombres varchar(50) not null,
	apellidos varchar(50)not null,
	email varchar(30)not null,
	RUC varchar(11),
	usuario varchar(30), 
	foreign key(usuario) references Usuario(usuario)
);

create table Producto(
	id int auto_increment primary key,
	tipo varchar(20),
	categoria varchar(20),
	descripcion text,
	precio double,
	marca varchar(25),
	stock integer,
	imagen MEDIUMBLOB,
	mimetype varchar(10)
);
create table Carrito(
	id int auto_increment primary key,
	id_usuario varchar(30),
	estado varchar(15) default 'libre',
    foreign key(id_usuario) references Persona(DNI)        
);


create table ItemCarrito(
	id_carrito int, foreign key(id_carrito) references Carrito(id),
	id_producto int, foreign key(id_producto) references Producto(id),
    cantidad int
);

create table Venta(
	id int auto_increment primary key,
    id_usuario varchar(8), foreign key(id_usuario) references Persona(DNI),
    id_carrito int, foreign key(id_carrito) references Carrito(id),
	fecha date
);

create table DetalleVenta(
	id_producto int, foreign key(id_producto) references Producto(id),
	id_venta int, foreign key(id_venta) references Venta(id),
	cantidad integer
);
