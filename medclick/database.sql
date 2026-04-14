CREATE DATABASE medclick;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'admin')),
    phone VARCHAR(20)
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    slot_time TIMESTAMP NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(doctor_id, slot_time)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_id INT NOT NULL REFERENCES schedule(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'booked',
    booked_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    min_threshold INT NOT NULL,
    unit VARCHAR(20) NOT NULL
);

CREATE TABLE material_write_offs (
    id SERIAL PRIMARY KEY,
    material_id INT NOT NULL REFERENCES materials(id),
    appointment_id INT NOT NULL REFERENCES appointments(id),
    quantity INT NOT NULL,
    written_off_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO doctors (full_name, specialty) VALUES
('Анна Иванова', 'Терапевт'),
('Сергей Петров', 'Хирург');

INSERT INTO schedule (doctor_id, slot_time, is_available) VALUES
(1, '2025-04-15 10:00:00', true),
(1, '2025-04-15 11:00:00', true),
(2, '2025-04-15 09:00:00', true);

INSERT INTO materials (name, quantity, min_threshold, unit) VALUES
('Шприц 5мл', 100, 20, 'шт'),
('Цефтриаксон 1г', 50, 10, 'флакон');

-- администратор: email admin@medclick.ru / пароль admin123
-- пациент: email patient@medclick.ru / пароль patient123