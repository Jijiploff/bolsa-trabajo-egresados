-- CreateEnum
CREATE TYPE "RolNombre" AS ENUM ('ADMIN', 'EGRESADO', 'EMPRESA');

-- CreateEnum
CREATE TYPE "ModalidadOferta" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('POSTULADO', 'REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('NUEVA_OFERTA', 'CAMBIO_ESTADO', 'NUEVA_POSTULACION');

-- CreateEnum
CREATE TYPE "TipoHabilidad" AS ENUM ('TECNICA', 'BLANDA');

-- CreateEnum
CREATE TYPE "NivelFormacion" AS ENUM ('PREGRADO', 'POSTGRADO', 'DIPLOMADO', 'MAESTRIA', 'DOCTORADO', 'CURSO');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" "RolNombre" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoHabilidad" NOT NULL,

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egresados" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "ciudad" TEXT,
    "pais" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "foto_url" TEXT,
    "cv_url" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "titulo" TEXT,
    "universidad" TEXT,
    "carrera_id" INTEGER,
    "anio_egreso" INTEGER,
    "descripcion_personal" TEXT,

    CONSTRAINT "egresados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formacion_academica" (
    "id" SERIAL NOT NULL,
    "egresado_id" INTEGER NOT NULL,
    "institucion" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "nivel" "NivelFormacion" NOT NULL,
    "anio_inicio" INTEGER,
    "anio_fin" INTEGER,
    "descripcion" TEXT,

    CONSTRAINT "formacion_academica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiencia_laboral" (
    "id" SERIAL NOT NULL,
    "egresado_id" INTEGER NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "descripcion" TEXT,
    "actual_trabajo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "experiencia_laboral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egresado_habilidades" (
    "id" SERIAL NOT NULL,
    "egresado_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,
    "nivel" INTEGER,

    CONSTRAINT "egresado_habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "sector" TEXT,
    "tamanio" TEXT,
    "ubicacion" TEXT,
    "sitio_web" TEXT,
    "logo_url" TEXT,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ofertas_laborales" (
    "id" SERIAL NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "salario_min" DOUBLE PRECISION,
    "salario_max" DOUBLE PRECISION,
    "modalidad" "ModalidadOferta" NOT NULL,
    "ubicacion" TEXT,
    "requisitos" TEXT,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ofertas_laborales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta_habilidades" (
    "id" SERIAL NOT NULL,
    "oferta_id" INTEGER NOT NULL,
    "habilidad_id" INTEGER NOT NULL,

    CONSTRAINT "oferta_habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postulaciones" (
    "id" SERIAL NOT NULL,
    "oferta_id" INTEGER NOT NULL,
    "egresado_id" INTEGER NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'POSTULADO',
    "fecha_postulacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postulaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" SERIAL NOT NULL,
    "postulacion_id" INTEGER NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "creada_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_key" ON "carreras"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_nombre_key" ON "habilidades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "egresados_usuario_id_key" ON "egresados"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "egresado_habilidades_egresado_id_habilidad_id_key" ON "egresado_habilidades"("egresado_id", "habilidad_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_usuario_id_key" ON "empresas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "oferta_habilidades_oferta_id_habilidad_id_key" ON "oferta_habilidades"("oferta_id", "habilidad_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresados" ADD CONSTRAINT "egresados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresados" ADD CONSTRAINT "egresados_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formacion_academica" ADD CONSTRAINT "formacion_academica_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia_laboral" ADD CONSTRAINT "experiencia_laboral_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresado_habilidades" ADD CONSTRAINT "egresado_habilidades_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresado_habilidades" ADD CONSTRAINT "egresado_habilidades_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas_laborales" ADD CONSTRAINT "ofertas_laborales_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta_habilidades" ADD CONSTRAINT "oferta_habilidades_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas_laborales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta_habilidades" ADD CONSTRAINT "oferta_habilidades_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas_laborales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_postulacion_id_fkey" FOREIGN KEY ("postulacion_id") REFERENCES "postulaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
