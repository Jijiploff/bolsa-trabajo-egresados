import { PrismaClient, RolNombre, TipoHabilidad, ModalidadOferta, NivelFormacion, EstadoPostulacion  } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fakerES as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// ------------------- CONSTANTES -------------------
const CONTRASENA = 'Password123!';

const CARRERAS = [
  'Ingeniería Informática',
  'Administración de Empresas',
  'Contabilidad',
  'Derecho',
  'Ingeniería Industrial',
  'Medicina',
];

const HABILIDADES = [
  { nombre: 'JavaScript', tipo: TipoHabilidad.TECNICA },
  { nombre: 'TypeScript', tipo: TipoHabilidad.TECNICA },
  { nombre: 'React', tipo: TipoHabilidad.TECNICA },
  { nombre: 'Node.js', tipo: TipoHabilidad.TECNICA },
  { nombre: 'Python', tipo: TipoHabilidad.TECNICA },
  { nombre: 'SQL', tipo: TipoHabilidad.TECNICA },
  { nombre: 'Git', tipo: TipoHabilidad.TECNICA },
  { nombre: 'Excel', tipo: TipoHabilidad.TECNICA },
  { nombre: 'SAP', tipo: TipoHabilidad.TECNICA },
  { nombre: 'Comunicación', tipo: TipoHabilidad.BLANDA },
  { nombre: 'Trabajo en equipo', tipo: TipoHabilidad.BLANDA },
  { nombre: 'Liderazgo', tipo: TipoHabilidad.BLANDA },
  { nombre: 'Resolución de problemas', tipo: TipoHabilidad.BLANDA },
  { nombre: 'Adaptabilidad', tipo: TipoHabilidad.BLANDA },
  { nombre: 'Negociación', tipo: TipoHabilidad.BLANDA },
];

const EMPRESAS_DATA = [
  { nombre: 'TechCorp Solutions', sector: 'Tecnología', ubicacion: 'Lima', email: 'rrhh@techcorp.com', descripcion: 'Empresa líder en desarrollo de software empresarial.' },
  { nombre: 'BancoExcel', sector: 'Banca', ubicacion: 'Trujillo', email: 'talento@bancaexcel.com', descripcion: 'Institución financiera con más de 30 años de experiencia.' },
  { nombre: 'RetailMax', sector: 'Retail', ubicacion: 'Piura', email: 'rrhh@retailmax.com', descripcion: 'Cadena de tiendas departamentales a nivel nacional.' },
  { nombre: 'SaludVida', sector: 'Salud', ubicacion: 'Callao', email: 'rrhh@saludvida.com', descripcion: 'Red de clínicas y hospitales privados.' },
  { nombre: 'EduNova', sector: 'Educación', ubicacion: 'Arequipa', email: 'rrhh@edunova.com', descripcion: 'Plataforma de educación virtual y presencial.' },
  { nombre: 'ConstructoraAndina', sector: 'Construcción', ubicacion: 'Trujillo', email: 'rrhh@constructoraandina.com', descripcion: 'Constructora de obras civiles de gran envergadura.' },
];

// ------------------- DATOS ALEATORIOS -------------------
faker.seed(2024); // Para reproducibilidad

// Generar nombres de egresados
const generarEgresado = (index: number) => {
  const nombres = faker.person.firstName();
  const apellidos = faker.person.lastName() + ' ' + faker.person.lastName();
  const email = faker.internet.email({ firstName: nombres, lastName: apellidos.split(' ')[0] }).toLowerCase();
  return {
    email,
    nombres,
    apellidos,
    fecha_nacimiento: faker.date.between({ from: '1990-01-01', to: '2001-12-31' }),
    ciudad: faker.helpers.arrayElement(['Lima', 'Arequipa', 'Trujillo', 'Trujillo', 'Trujillo', 'Cajamarca']),
    pais: faker.helpers.arrayElement(['Perú', 'México']),
    telefono: faker.phone.number(),
    direccion: faker.location.streetAddress(),
    foto_url: faker.image.avatar(),
    cv_url: `https://cv.ejemplo.com/${faker.string.alphanumeric(10)}.pdf`,
    linkedin_url: `https://linkedin.com/in/${faker.string.alphanumeric(8)}`,
    github_url: `https://github.com/${faker.string.alphanumeric(8)}`,
    titulo: faker.helpers.arrayElement(['Ing.', 'Lic.', 'Dr.']) + ' ' + faker.person.jobTitle(),
    universidad: faker.helpers.arrayElement(['Universidad Nacional de Trujillo', 'Universidad Privada del Norte', 'UPAO', 'UCV']),
  };
};

// ------------------- FUNCIÓN PRINCIPAL -------------------
async function main() {
  console.log('🚀 Iniciando seed...');

  // 1. LIMPIEZA (orden inverso a dependencias)
  console.log('🧹 Limpiando tablas existentes...');
  await prisma.historialEstado.deleteMany();
  await prisma.postulacion.deleteMany();
  await prisma.ofertaHabilidad.deleteMany();
  await prisma.ofertaLaboral.deleteMany();
  await prisma.egresadoHabilidad.deleteMany();
  await prisma.experienciaLaboral.deleteMany();
  await prisma.formacionAcademica.deleteMany();
  await prisma.egresado.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.carrera.deleteMany();
  await prisma.habilidad.deleteMany();
  await prisma.rol.deleteMany();
  console.log('✅ Tablas limpiadas.');

  // 2. CREAR ROLES
  console.log('🔑 Creando roles...');
  await prisma.rol.createMany({
    data: [
      { nombre: RolNombre.ADMIN },
      { nombre: RolNombre.EGRESADO },
      { nombre: RolNombre.EMPRESA },
    ],
  });
  const roles = await prisma.rol.findMany();
  const rolAdmin = roles.find(r => r.nombre === RolNombre.ADMIN)!;
  const rolEgresado = roles.find(r => r.nombre === RolNombre.EGRESADO)!;
  const rolEmpresa = roles.find(r => r.nombre === RolNombre.EMPRESA)!;

  // 3. CREAR CARRERAS
  console.log('📚 Creando carreras...');
  await prisma.carrera.createMany({
    data: CARRERAS.map(nombre => ({ nombre })),
  });
  const carreras = await prisma.carrera.findMany();

  // 4. CREAR HABILIDADES
  console.log('🛠️ Creando habilidades...');
  await prisma.habilidad.createMany({
    data: HABILIDADES,
  });
  const habilidades = await prisma.habilidad.findMany();

  // 5. CREAR USUARIO ADMIN
  console.log('👑 Creando administrador...');
  const passwordHash = await bcrypt.hash(CONTRASENA, 12);
  await prisma.usuario.create({
    data: {
      email: 'admin@empleabilidad.com',
      password_hash: passwordHash,
      rol_id: rolAdmin.id,
    },
  });

  // 6. CREAR EGRESADOS
  console.log('🎓 Creando egresados...');
  const egresadosData = Array.from({ length: 10 }, (_, i) => generarEgresado(i));
  const egresadoUsers = [];
  for (const eg of egresadosData) {
    const user = await prisma.usuario.create({
      data: {
        email: eg.email,
        password_hash: passwordHash,
        rol_id: rolEgresado.id,
      },
    });
    egresadoUsers.push({ user, ...eg });
  }

  // Crear registros de Egresado con relaciones
  for (const eg of egresadoUsers) {
    const carreraAleatoria = faker.helpers.arrayElement(carreras);
    const habilidadesAsignadas = faker.helpers.arrayElements(habilidades, faker.number.int({ min: 2, max: 5 }));

    await prisma.egresado.create({
      data: {
        usuario_id: eg.user.id,
        nombres: eg.nombres,
        apellidos: eg.apellidos,
        fecha_nacimiento: eg.fecha_nacimiento,
        ciudad: eg.ciudad,
        pais: eg.pais,
        telefono: eg.telefono,
        direccion: eg.direccion,
        foto_url: eg.foto_url,
        cv_url: eg.cv_url,
        linkedin_url: eg.linkedin_url,
        github_url: eg.github_url,
        titulo: eg.titulo,
        universidad: eg.universidad,
        carrera_id: carreraAleatoria.id,
        anio_egreso: faker.helpers.arrayElement([2018, 2019, 2020, 2021, 2022, 2023, 2024]),
        descripcion_personal: faker.lorem.sentence(),
        formacion_academica: {
          create: [
            {
              institucion: faker.helpers.arrayElement(['Universidad Nacional de Trujillo', 'Universidad Privada del Norte', 'UCV']),
              titulo: carreraAleatoria.nombre,
              nivel: faker.helpers.arrayElement(Object.values(NivelFormacion)),
              anio_inicio: faker.number.int({ min: 2014, max: 2018 }),
              anio_fin: faker.number.int({ min: 2018, max: 2022 }),
            },
          ],
        },
        experiencia_laboral: {
          create: faker.helpers.maybe(() => [
            {
              empresa: faker.company.name(),
              cargo: faker.person.jobTitle(),
              fecha_inicio: faker.date.between({ from: '2019-01-01', to: '2021-12-31' }),
              fecha_fin: faker.date.between({ from: '2021-01-01', to: '2023-12-31' }),
              descripcion: faker.lorem.sentence(),
            },
          ], { probability: 0.6 }) ?? [],
        },
        habilidades: {
          create: habilidadesAsignadas.map(h => ({
            habilidad_id: h.id,
            nivel: faker.number.int({ min: 1, max: 5 }),
          })),
        },
      },
    });
  }

  // 7. CREAR EMPRESAS
  console.log('🏢 Creando empresas...');
  const empresaRecords = [];
  for (const emp of EMPRESAS_DATA) {
    const user = await prisma.usuario.create({
      data: {
        email: emp.email,
        password_hash: passwordHash,
        rol_id: rolEmpresa.id,
      },
    });
    const empresa = await prisma.empresa.create({
      data: {
        usuario_id: user.id,
        nombre: emp.nombre,
        descripcion: emp.descripcion,
        sector: emp.sector,
        ubicacion: emp.ubicacion,
        sitio_web: `https://www.${emp.nombre.toLowerCase().replace(/\s/g, '')}.com`,
        logo_url: faker.image.urlPicsumPhotos(),
      },
    });
    empresaRecords.push(empresa);
  }

  // 8. CREAR OFERTAS LABORALES (15 ofertas, 2-3 por empresa)
  console.log('💼 Creando ofertas laborales...');
  const ofertasLaboralesData = [];
  for (const empresa of empresaRecords) {
    // 2 o 3 ofertas por empresa
    const numOfertas = faker.number.int({ min: 2, max: 3 });
    for (let i = 0; i < numOfertas; i++) {
      const titulos = [
        'Desarrollador Frontend Junior',
        'Analista Contable',
        'Gestor de Proyectos TI',
        'Coordinador de Marketing',
        'Asistente Legal',
        'Ingeniero de Procesos',
        'Médico General',
        'Asistente de Recursos Humanos',
        'Diseñador UX/UI',
        'Consultor Financiero',
        'Supervisor de Obra',
        'Docente Universitario',
        'Enfermera',
        'Contralor Interno',
        'Abogado Corporativo',
      ];
      const titulo = faker.helpers.arrayElement(titulos);
      const fechaPublicacion = faker.date.between({ from: faker.date.recent({ days: 90 }), to: new Date() });
      const activa = faker.datatype.boolean({ probability: 0.9 }); // 90% activas
      const oferta = await prisma.ofertaLaboral.create({
        data: {
          empresa_id: empresa.id,
          titulo,
          descripcion: faker.lorem.paragraphs(2),
          salario_min: faker.number.float({ min: 1500, max: 5000, fractionDigits: 0 }),
          salario_max: faker.number.float({ min: 5000, max: 10000, fractionDigits: 0 }),
          modalidad: faker.helpers.arrayElement(Object.values(ModalidadOferta)),
          ubicacion: faker.helpers.arrayElement(['Lima', 'Trujillo', 'Piura', 'Trujillo', 'Arequipa', 'Trujillo']),
          requisitos: faker.lorem.sentences(2),
          fecha_publicacion: fechaPublicacion,
          fecha_cierre: activa ? null : faker.date.soon({ days: 30 }),
          activa,
        },
      });
      ofertasLaboralesData.push(oferta);
    }
  }
  // Completar hasta 15 ofertas si es necesario (ya tenemos 12-18 aprox, recortamos a 15)
  const ofertasFinal = ofertasLaboralesData.slice(0, 15);

  // Asignar habilidades a las ofertas (2-4 por oferta)
  for (const oferta of ofertasFinal) {
    const habilidadesOferta = faker.helpers.arrayElements(habilidades, faker.number.int({ min: 2, max: 4 }));
    await prisma.ofertaHabilidad.createMany({
      data: habilidadesOferta.map(h => ({
        oferta_id: oferta.id,
        habilidad_id: h.id,
      })),
    });
  }

  // 9. CREAR POSTULACIONES (15 postulaciones)
  console.log('📩 Creando postulaciones...');
  const egresadosRegistrados = await prisma.egresado.findMany();

  const estados: EstadoPostulacion[] = [
    EstadoPostulacion.POSTULADO,
    EstadoPostulacion.REVISION,
    EstadoPostulacion.ENTREVISTA,
    EstadoPostulacion.CONTRATADO,
    EstadoPostulacion.RECHAZADO,
  ];

  const posts: { egresado_id: number; oferta_id: number; estado: EstadoPostulacion; fecha_postulacion: Date }[] = [];
  // Asegurar algunos egresados populares y algunos estados variados
  for (const egresado of faker.helpers.arrayElements(egresadosRegistrados, 8)) {
    const numPostulaciones = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numPostulaciones; i++) {
      const oferta = faker.helpers.arrayElement(ofertasFinal);
      const estado = faker.helpers.arrayElement(estados);
      posts.push({
        egresado_id: egresado.id,
        oferta_id: oferta.id,
        estado,
        fecha_postulacion: faker.date.between({ from: faker.date.recent({ days: 60 }), to: new Date() }),
      });
    }
  }
  // Crear postulaciones y su historial
  for (const p of posts) {
    const postulacion = await prisma.postulacion.create({
      data: {
        egresado_id: p.egresado_id,
        oferta_id: p.oferta_id,
        estado: p.estado,
        fecha_postulacion: p.fecha_postulacion,
      },
    });
    // Historial: si no es POSTULADO, agregar transición inicial y las siguientes
    if (p.estado !== EstadoPostulacion.POSTULADO) {
      const transiciones: EstadoPostulacion[] = [EstadoPostulacion.POSTULADO];
      // 👇 Comparaciones directas en los 3 casos
        if (p.estado === EstadoPostulacion.REVISION || 
            p.estado === EstadoPostulacion.ENTREVISTA || 
            p.estado === EstadoPostulacion.CONTRATADO || 
            p.estado === EstadoPostulacion.RECHAZADO)
            transiciones.push(EstadoPostulacion.REVISION);

        if (p.estado === EstadoPostulacion.ENTREVISTA || 
            p.estado === EstadoPostulacion.CONTRATADO || 
            p.estado === EstadoPostulacion.RECHAZADO)
            transiciones.push(EstadoPostulacion.ENTREVISTA);

        if (p.estado === EstadoPostulacion.CONTRATADO || 
            p.estado === EstadoPostulacion.RECHAZADO)
            transiciones.push(p.estado);
      const historialUnico = [...new Set(transiciones)];
      for (const est of historialUnico) {
        await prisma.historialEstado.create({
          data: {
            postulacion_id: postulacion.id,
            estado: est,
            fecha: faker.date.between({ from: p.fecha_postulacion, to: new Date() }),
            comentario: est === EstadoPostulacion.RECHAZADO ? 'No cumple perfil' : null,
          },
        });
      }
    }
  }

  console.log('✨ Seed completado con éxito.');
  console.log(`   - ${egresadosRegistrados.length} egresados`);
  console.log(`   - ${empresaRecords.length} empresas`);
  console.log(`   - ${ofertasFinal.length} ofertas laborales`);
  console.log(`   - ${posts.length} postulaciones`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });