-- ============================================================
-- ESQUEMA DE BASE DE DATOS - VetCare (Sistema Veterinario)
-- Compatible con: PostgreSQL 14+ (Neon.tech)
-- Author: OpenCode
-- Date: 2026-07-04
-- ============================================================

-- 1. CATÁLOGOS Y TABLAS DE CONFIGURACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    permisos    JSONB DEFAULT '[]'::jsonb,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_cita (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    color       VARCHAR(20) DEFAULT '#10B981',
    duracion_minutos INTEGER DEFAULT 30,
    activo      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS especies (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    activo      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS razas (
    id          SERIAL PRIMARY KEY,
    especie_id  INTEGER NOT NULL REFERENCES especies(id) ON DELETE CASCADE,
    nombre      VARCHAR(100) NOT NULL,
    activo      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(especie_id, nombre)
);

CREATE TABLE IF NOT EXISTS tipos_producto (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLAS DE USUARIOS Y PERSONAL
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    usuario         VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    telefono        VARCHAR(20),
    password_hash   VARCHAR(255) NOT NULL,
    rol_id          INTEGER REFERENCES roles(id),
    estado          VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    ultimo_acceso   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLAS DE CLIENTES Y MASCOTAS
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL,
    dni         VARCHAR(20) UNIQUE,
    telefono    VARCHAR(20),
    email       VARCHAR(255),
    direccion   TEXT,
    estado      VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mascotas (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    especie_id      INTEGER REFERENCES especies(id),
    raza_id         INTEGER REFERENCES razas(id),
    cliente_id      INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    fecha_nacimiento DATE,
    peso            DECIMAL(5,2),
    sexo            VARCHAR(10) CHECK (sexo IN ('Macho', 'Hembra', 'Desconocido')),
    color           VARCHAR(100),
    foto_url        VARCHAR(500),
    estado          VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Fallecido')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLAS DE CITAS Y AGENDA
-- ============================================================

CREATE TABLE IF NOT EXISTS citas (
    id              SERIAL PRIMARY KEY,
    mascota_id      INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    cliente_id      INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    tipo_cita_id    INTEGER REFERENCES tipos_cita(id),
    veterinario_id  INTEGER REFERENCES usuarios(id),
    fecha_hora      TIMESTAMP NOT NULL,
    duracion_minutos INTEGER DEFAULT 30,
    motivo          TEXT,
    notas           TEXT,
    estado          VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'En Curso', 'Completada', 'Cancelada', 'No Show')),
    consultorio     VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLAS DE HISTORIA CLÍNICA
-- ============================================================

CREATE TABLE IF NOT EXISTS historias_clinicas (
    id              SERIAL PRIMARY KEY,
    mascota_id      INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    cita_id         INTEGER REFERENCES citas(id) ON DELETE SET NULL,
    veterinario_id  INTEGER REFERENCES usuarios(id),
    fecha           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT,
    sintomas        TEXT,
    diagnostico     TEXT,
    tratamiento     TEXT,
    receta          TEXT,
    observaciones   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLAS DE VACUNACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS vacunas (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    especie_id      INTEGER REFERENCES especies(id),
    dosis_recomendada VARCHAR(100),
    frecuencia_meses INTEGER,
    activo          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vacunaciones (
    id              SERIAL PRIMARY KEY,
    mascota_id      INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    vacuna_id       INTEGER NOT NULL REFERENCES vacunas(id),
    veterinario_id  INTEGER REFERENCES usuarios(id),
    fecha_aplicacion DATE NOT NULL,
    fecha_proxima   DATE,
    dosis           VARCHAR(50),
    lote            VARCHAR(100),
    observaciones   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLAS DE INVENTARIO Y PRODUCTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS proveedores (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(255) NOT NULL,
    contacto    VARCHAR(255),
    telefono    VARCHAR(20),
    email       VARCHAR(255),
    direccion   TEXT,
    estado      VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id              SERIAL PRIMARY KEY,
    sku             VARCHAR(100) UNIQUE,
    nombre          VARCHAR(255) NOT NULL,
    tipo_producto_id INTEGER REFERENCES tipos_producto(id),
    descripcion     TEXT,
    imagen_url      VARCHAR(500),
    precio_compra   DECIMAL(10,2),
    precio_venta    DECIMAL(10,2),
    stock_actual    INTEGER DEFAULT 0,
    stock_minimo    INTEGER DEFAULT 10,
    unidad_medida   VARCHAR(50),
    fecha_vencimiento DATE,
    proveedor_id    INTEGER REFERENCES proveedores(id),
    estado          VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLAS DE FACTURACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS facturas (
    id                  SERIAL PRIMARY KEY,
    numero_factura      VARCHAR(50) NOT NULL UNIQUE,
    cliente_id          INTEGER NOT NULL REFERENCES clientes(id),
    mascota_id          INTEGER REFERENCES mascotas(id),
    veterinario_id      INTEGER REFERENCES usuarios(id),
    fecha               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento           DECIMAL(10,2) DEFAULT 0,
    impuestos           DECIMAL(10,2) DEFAULT 0,
    total               DECIMAL(10,2) NOT NULL DEFAULT 0,
    metodo_pago         VARCHAR(50) CHECK (metodo_pago IN ('Efectivo', 'Tarjeta', 'Yape / Plin', 'Transferencia', 'Otro')),
    estado              VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagada', 'Anulada')),
    notas               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_factura (
    id              SERIAL PRIMARY KEY,
    factura_id      INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    producto_id     INTEGER REFERENCES productos(id),
    descripcion     VARCHAR(255) NOT NULL,
    cantidad        INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento       DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABLA DE AUDITORÍA
-- ============================================================

CREATE TABLE IF NOT EXISTS auditoria (
    id              BIGSERIAL PRIMARY KEY,
    tabla           VARCHAR(100) NOT NULL,
    registro_id     INTEGER NOT NULL,
    accion          VARCHAR(20) NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    datos_anteriores JSONB,
    datos_nuevos    JSONB,
    usuario_id      INTEGER REFERENCES usuarios(id),
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_mascotas_cliente ON mascotas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_citas_mascota ON citas(mascota_id);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);
CREATE INDEX IF NOT EXISTS idx_historias_mascota ON historias_clinicas(mascota_id);
CREATE INDEX IF NOT EXISTS idx_vacunaciones_mascota ON vacunaciones(mascota_id);
CREATE INDEX IF NOT EXISTS idx_vacunaciones_proxima ON vacunaciones(fecha_proxima);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo_producto_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla ON auditoria(tabla, registro_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(created_at);

-- ============================================================
-- DATOS INICIALES (SEEDS)
-- ============================================================

-- Roles
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Administrador', 'Control total del sistema', '["*"]'),
('Veterinario', 'Acceso a citas, historias clínicas y vacunaciones', '["citas", "historias", "vacunaciones", "mascotas", "clientes"]'),
('Asistente', 'Apoyo en citas y registros', '["citas", "mascotas", "clientes"]'),
('Recepcionista', 'Gestión de citas y clientes', '["citas", "clientes", "mascotas"]')
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Cita
INSERT INTO tipos_cita (nombre, color, duracion_minutos) VALUES
('Consulta General', '#10B981', 30),
('Vacunación', '#8B5CF6', 15),
('Desparasitación', '#3B82F6', 15),
('Control / Revisión', '#F59E0B', 30),
('Emergencia', '#EF4444', 60),
('Cirugía', '#EC4899', 120),
('Estética / Baño', '#06B6D4', 45)
ON CONFLICT (nombre) DO NOTHING;

-- Especies
INSERT INTO especies (nombre) VALUES
('Perro'),
('Gato'),
('Ave'),
('Conejo'),
('Hamster'),
('Reptil'),
('Otro')
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Producto
INSERT INTO tipos_producto (nombre, descripcion) VALUES
('Medicamentos', 'Fármacos y medicamentos veterinarios'),
('Alimentos', 'Alimentos y snacks para mascotas'),
('Accesorios', 'Collares, correas, juguetes, etc.'),
('Vacunas', 'Vacunas veterinarias'),
('Higiene', 'Productos de higiene y cuidado'),
('Equipo Médico', 'Instrumentos y equipos médicos')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Trigger para actualizar 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a las tablas principales
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mascotas_updated_at BEFORE UPDATE ON mascotas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_citas_updated_at BEFORE UPDATE ON citas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para auditoría (básico)
CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores, usuario_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_anteriores, datos_nuevos, usuario_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NULL);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria (tabla, registro_id, accion, datos_nuevos, usuario_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), NULL);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de auditoría a tablas críticas
CREATE TRIGGER audit_clientes AFTER INSERT OR UPDATE OR DELETE ON clientes
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();
CREATE TRIGGER audit_mascotas AFTER INSERT OR UPDATE OR DELETE ON mascotas
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();
CREATE TRIGGER audit_citas AFTER INSERT OR UPDATE OR DELETE ON citas
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();
CREATE TRIGGER audit_facturas AFTER INSERT OR UPDATE OR DELETE ON facturas
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

-- ============================================================
-- FIN DEL ESQUEMA
-- ============================================================