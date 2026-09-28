--
-- PostgreSQL database dump
--

\restrict E0uLyPhqS3K0LCZZoKpy7SG2ZU5HyIyXZYdXh13vQEDJdtr4bU13wcacTUMOIpQ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public."PetugasJadwal" DROP CONSTRAINT "PetugasJadwal_petugasId_fkey";
ALTER TABLE ONLY public."PetugasJadwal" DROP CONSTRAINT "PetugasJadwal_jadwalId_fkey";
ALTER TABLE ONLY public."LaporanSampah" DROP CONSTRAINT "LaporanSampah_wilayahId_fkey";
ALTER TABLE ONLY public."LaporanSampah" DROP CONSTRAINT "LaporanSampah_userId_fkey";
ALTER TABLE ONLY public."LaporanSampah" DROP CONSTRAINT "LaporanSampah_jenisSampahId_fkey";
ALTER TABLE ONLY public."JadwalPengangkutan" DROP CONSTRAINT "JadwalPengangkutan_wilayahId_fkey";
ALTER TABLE ONLY public."FotoSampah" DROP CONSTRAINT "FotoSampah_laporanId_fkey";
ALTER TABLE ONLY public."BankSampah" DROP CONSTRAINT "BankSampah_wilayahId_fkey";
ALTER TABLE ONLY public."BankSampahJenis" DROP CONSTRAINT "BankSampahJenis_jenisSampahId_fkey";
ALTER TABLE ONLY public."BankSampahJenis" DROP CONSTRAINT "BankSampahJenis_bankSampahId_fkey";
DROP INDEX public."Wilayah_namaWilayah_key";
DROP INDEX public."User_noHp_key";
DROP INDEX public."User_nik_key";
DROP INDEX public."User_email_key";
DROP INDEX public."JenisSampah_namaJenis_key";
DROP INDEX public."FotoSampah_laporanId_key";
ALTER TABLE ONLY public."Wilayah" DROP CONSTRAINT "Wilayah_pkey";
ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
ALTER TABLE ONLY public."Petugas" DROP CONSTRAINT "Petugas_pkey";
ALTER TABLE ONLY public."Petugas" DROP CONSTRAINT "Petugas_noHp_key";
ALTER TABLE ONLY public."PetugasJadwal" DROP CONSTRAINT "PetugasJadwal_pkey";
ALTER TABLE ONLY public."PetugasJadwal" DROP CONSTRAINT "PetugasJadwal_petugasId_jadwalId_key";
ALTER TABLE ONLY public."LaporanSampah" DROP CONSTRAINT "LaporanSampah_pkey";
ALTER TABLE ONLY public."JenisSampah" DROP CONSTRAINT "JenisSampah_pkey";
ALTER TABLE ONLY public."JadwalPengangkutan" DROP CONSTRAINT "JadwalPengangkutan_pkey";
ALTER TABLE ONLY public."FotoSampah" DROP CONSTRAINT "FotoSampah_pkey";
ALTER TABLE ONLY public."BankSampah" DROP CONSTRAINT "BankSampah_pkey";
ALTER TABLE ONLY public."BankSampah" DROP CONSTRAINT "BankSampah_namaBank_key";
ALTER TABLE ONLY public."BankSampahJenis" DROP CONSTRAINT "BankSampahJenis_pkey";
ALTER TABLE ONLY public."BankSampahJenis" DROP CONSTRAINT "BankSampahJenis_bankSampahId_jenisSampahId_key";
DROP TABLE public."Wilayah";
DROP TABLE public."User";
DROP TABLE public."PetugasJadwal";
DROP TABLE public."Petugas";
DROP TABLE public."LaporanSampah";
DROP TABLE public."JenisSampah";
DROP TABLE public."JadwalPengangkutan";
DROP TABLE public."FotoSampah";
DROP TABLE public."BankSampahJenis";
DROP TABLE public."BankSampah";
DROP EXTENSION pgcrypto;
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BankSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankSampah" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "namaBank" text NOT NULL,
    alamat text NOT NULL,
    "wilayahId" uuid NOT NULL
);


ALTER TABLE public."BankSampah" OWNER TO postgres;

--
-- Name: BankSampahJenis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankSampahJenis" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "bankSampahId" uuid NOT NULL,
    "jenisSampahId" uuid NOT NULL,
    "hargaPerKg" double precision NOT NULL
);


ALTER TABLE public."BankSampahJenis" OWNER TO postgres;

--
-- Name: FotoSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FotoSampah" (
    id uuid NOT NULL,
    "imageUrl" text NOT NULL,
    "laporanId" uuid NOT NULL
);


ALTER TABLE public."FotoSampah" OWNER TO postgres;

--
-- Name: JadwalPengangkutan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JadwalPengangkutan" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hari text NOT NULL,
    "jamOperasional" text NOT NULL,
    "wilayahId" uuid NOT NULL
);


ALTER TABLE public."JadwalPengangkutan" OWNER TO postgres;

--
-- Name: JenisSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisSampah" (
    id uuid NOT NULL,
    "namaJenis" text NOT NULL
);


ALTER TABLE public."JenisSampah" OWNER TO postgres;

--
-- Name: LaporanSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LaporanSampah" (
    id uuid NOT NULL,
    berat double precision NOT NULL,
    "tanggalLapor" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" uuid NOT NULL,
    "jenisSampahId" uuid NOT NULL,
    "wilayahId" uuid NOT NULL
);


ALTER TABLE public."LaporanSampah" OWNER TO postgres;

--
-- Name: Petugas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Petugas" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "namaPetugas" text NOT NULL,
    "noHp" text NOT NULL,
    jabatan text NOT NULL
);


ALTER TABLE public."Petugas" OWNER TO postgres;

--
-- Name: PetugasJadwal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PetugasJadwal" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "petugasId" uuid NOT NULL,
    "jadwalId" uuid NOT NULL
);


ALTER TABLE public."PetugasJadwal" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "noHp" text NOT NULL,
    nik text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'USER'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Wilayah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilayah" (
    id uuid NOT NULL,
    "namaWilayah" text NOT NULL
);


ALTER TABLE public."Wilayah" OWNER TO postgres;

--
-- Data for Name: BankSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankSampah" (id, "namaBank", alamat, "wilayahId") FROM stdin;
50cdc866-75b2-4293-8c9e-60838ac6ff42	Bank Sampah Sejahtera Pancoran	Jl. Pancoran Barat No. 12	26348061-9802-41b2-8448-ee3b2c25eb48
89fb8e0b-1430-46d9-91b2-d2b6f901d504	Bank Sampah Mandiri Tebet	Jl. Tebet Timur No. 45	5a08b177-ad84-4219-889c-b33d8098d2eb
\.


--
-- Data for Name: BankSampahJenis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankSampahJenis" (id, "bankSampahId", "jenisSampahId", "hargaPerKg") FROM stdin;
7b179dfc-acb5-4f55-909a-b4b6589df587	50cdc866-75b2-4293-8c9e-60838ac6ff42	14f36244-b9bc-4e1e-a9ff-e2531e3694ce	1000
b36ad19e-06a0-420b-bf7a-3026c71a2c23	50cdc866-75b2-4293-8c9e-60838ac6ff42	78fba98a-b45f-4860-9bae-1b139b598f18	3000
78a9be87-6cc0-408a-96ff-48f8ddb75021	50cdc866-75b2-4293-8c9e-60838ac6ff42	baa73b8f-3e9f-43f9-884d-4071385c38ed	4500
65d75990-41a0-4ebf-ae05-b998b0f54dd7	89fb8e0b-1430-46d9-91b2-d2b6f901d504	78fba98a-b45f-4860-9bae-1b139b598f18	3200
97b80e68-d54f-4a1d-af40-1d53ac6fcc4d	89fb8e0b-1430-46d9-91b2-d2b6f901d504	59081d27-6efc-4570-992f-cf6fa444698f	2000
e6f64696-6087-4287-80a5-3c5be8e21de2	89fb8e0b-1430-46d9-91b2-d2b6f901d504	baa73b8f-3e9f-43f9-884d-4071385c38ed	4200
\.


--
-- Data for Name: FotoSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FotoSampah" (id, "imageUrl", "laporanId") FROM stdin;
046942b5-0af8-4c21-b549-b3953496515a	/uploads/1784857794757-plastik.jpg	61fbc4aa-a6b9-49d3-a7f5-900a2e742c78
527d164c-d9f2-420d-921d-81c61b74c8fc	/uploads/1784857885778-57381-ilustrasi-sampah-kertas-shutterstock.jpg	e871050c-524a-412e-be3a-553e4712bd7a
\.


--
-- Data for Name: JadwalPengangkutan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPengangkutan" (id, hari, "jamOperasional", "wilayahId") FROM stdin;
e09f164a-d817-4ba4-ad88-14623007979a	Senin & Kamis	07:00 - 11:00 WIB	26348061-9802-41b2-8448-ee3b2c25eb48
80bafdfc-da94-4bed-a8eb-f2adeb1fd875	Selasa & Jumat	08:00 - 12:00 WIB	5a08b177-ad84-4219-889c-b33d8098d2eb
838f270c-32f0-46c9-8c6c-f222eda2997c	Rabu & Sabtu	07:30 - 11:30 WIB	4cec0879-04f4-472b-a374-e9326fe0a72a
\.


--
-- Data for Name: JenisSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisSampah" (id, "namaJenis") FROM stdin;
14f36244-b9bc-4e1e-a9ff-e2531e3694ce	Organik
78fba98a-b45f-4860-9bae-1b139b598f18	Anorganik
68aa4a5f-faa2-4ee8-add6-a324ac3040b1	B3
59081d27-6efc-4570-992f-cf6fa444698f	Kertas & Karton
baa73b8f-3e9f-43f9-884d-4071385c38ed	Plastik Daur Ulang
\.


--
-- Data for Name: LaporanSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LaporanSampah" (id, berat, "tanggalLapor", "userId", "jenisSampahId", "wilayahId") FROM stdin;
61fbc4aa-a6b9-49d3-a7f5-900a2e742c78	4.5	2026-07-24 01:49:54.79	b401c863-fa39-4c66-a7a3-640780eab8c4	78fba98a-b45f-4860-9bae-1b139b598f18	83bad24b-0882-48ad-8b3e-4c94639efbdc
e871050c-524a-412e-be3a-553e4712bd7a	7.8	2026-07-24 01:51:25.801	faa28bac-d970-4b3c-b9b3-ed24b409971a	59081d27-6efc-4570-992f-cf6fa444698f	3e59c626-9291-4c11-b734-a44e94268086
\.


--
-- Data for Name: Petugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Petugas" (id, "namaPetugas", "noHp", jabatan) FROM stdin;
20422f50-2923-4257-8274-82e1872ea4e0	Joko Widodo	081234567801	Supir Truk Kebersihan
d72ca9c7-72f7-4667-ab40-64407859cd95	Slamet Riyadi	081234567802	Petugas Angkut Sampah
51013b66-6d76-4b3c-b777-67fade4b2dab	Siti Aminah	081234567803	Koordinator Wilayah
\.


--
-- Data for Name: PetugasJadwal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PetugasJadwal" (id, "petugasId", "jadwalId") FROM stdin;
98ea0d4c-a67f-49f2-9084-12dc0c7d980b	20422f50-2923-4257-8274-82e1872ea4e0	e09f164a-d817-4ba4-ad88-14623007979a
952fddc6-32b1-485e-a336-1e324047ad16	20422f50-2923-4257-8274-82e1872ea4e0	80bafdfc-da94-4bed-a8eb-f2adeb1fd875
7ac51420-361b-4a5a-a3d0-6514c0659340	d72ca9c7-72f7-4667-ab40-64407859cd95	e09f164a-d817-4ba4-ad88-14623007979a
984019d0-0176-47fa-b536-a693ce5af587	d72ca9c7-72f7-4667-ab40-64407859cd95	838f270c-32f0-46c9-8c6c-f222eda2997c
cb7a894d-53cf-4cd7-b011-8b3377b74713	51013b66-6d76-4b3c-b777-67fade4b2dab	80bafdfc-da94-4bed-a8eb-f2adeb1fd875
961734c5-9352-4508-aabc-f61ad8da592b	51013b66-6d76-4b3c-b777-67fade4b2dab	838f270c-32f0-46c9-8c6c-f222eda2997c
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nama, email, "noHp", nik, password, role) FROM stdin;
faa28bac-d970-4b3c-b9b3-ed24b409971a	Administrator Sampah	admin@ecoresik.com	081234567890	1234567890123456	240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9	ADMIN
b401c863-fa39-4c66-a7a3-640780eab8c4	Budi Santoso	budi@gmail.com	089876543210	3201020304050001	6b21de8534cbd0297f5217e53625b14f2ff44f317b262d6ea001da397b7552ea	USER
\.


--
-- Data for Name: Wilayah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilayah" (id, "namaWilayah") FROM stdin;
26348061-9802-41b2-8448-ee3b2c25eb48	Kecamatan Pancoran
5a08b177-ad84-4219-889c-b33d8098d2eb	Kecamatan Tebet
4cec0879-04f4-472b-a374-e9326fe0a72a	Kecamatan Cengkareng
3e59c626-9291-4c11-b734-a44e94268086	Kecamatan Menteng
83bad24b-0882-48ad-8b3e-4c94639efbdc	Kecamatan Kebayoran Baru
\.


--
-- Name: BankSampahJenis BankSampahJenis_bankSampahId_jenisSampahId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampahJenis"
    ADD CONSTRAINT "BankSampahJenis_bankSampahId_jenisSampahId_key" UNIQUE ("bankSampahId", "jenisSampahId");


--
-- Name: BankSampahJenis BankSampahJenis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampahJenis"
    ADD CONSTRAINT "BankSampahJenis_pkey" PRIMARY KEY (id);


--
-- Name: BankSampah BankSampah_namaBank_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampah"
    ADD CONSTRAINT "BankSampah_namaBank_key" UNIQUE ("namaBank");


--
-- Name: BankSampah BankSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampah"
    ADD CONSTRAINT "BankSampah_pkey" PRIMARY KEY (id);


--
-- Name: FotoSampah FotoSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_pkey" PRIMARY KEY (id);


--
-- Name: JadwalPengangkutan JadwalPengangkutan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_pkey" PRIMARY KEY (id);


--
-- Name: JenisSampah JenisSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_pkey" PRIMARY KEY (id);


--
-- Name: LaporanSampah LaporanSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY (id);


--
-- Name: PetugasJadwal PetugasJadwal_petugasId_jadwalId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PetugasJadwal"
    ADD CONSTRAINT "PetugasJadwal_petugasId_jadwalId_key" UNIQUE ("petugasId", "jadwalId");


--
-- Name: PetugasJadwal PetugasJadwal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PetugasJadwal"
    ADD CONSTRAINT "PetugasJadwal_pkey" PRIMARY KEY (id);


--
-- Name: Petugas Petugas_noHp_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Petugas"
    ADD CONSTRAINT "Petugas_noHp_key" UNIQUE ("noHp");


--
-- Name: Petugas Petugas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Petugas"
    ADD CONSTRAINT "Petugas_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wilayah Wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilayah"
    ADD CONSTRAINT "Wilayah_pkey" PRIMARY KEY (id);


--
-- Name: FotoSampah_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON public."FotoSampah" USING btree ("laporanId");


--
-- Name: JenisSampah_namaJenis_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON public."JenisSampah" USING btree ("namaJenis");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_nik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_nik_key" ON public."User" USING btree (nik);


--
-- Name: User_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_noHp_key" ON public."User" USING btree ("noHp");


--
-- Name: Wilayah_namaWilayah_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON public."Wilayah" USING btree ("namaWilayah");


--
-- Name: BankSampahJenis BankSampahJenis_bankSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampahJenis"
    ADD CONSTRAINT "BankSampahJenis_bankSampahId_fkey" FOREIGN KEY ("bankSampahId") REFERENCES public."BankSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankSampahJenis BankSampahJenis_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampahJenis"
    ADD CONSTRAINT "BankSampahJenis_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankSampah BankSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSampah"
    ADD CONSTRAINT "BankSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FotoSampah FotoSampah_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."LaporanSampah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JadwalPengangkutan JadwalPengangkutan_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPengangkutan"
    ADD CONSTRAINT "JadwalPengangkutan_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LaporanSampah LaporanSampah_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LaporanSampah LaporanSampah_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LaporanSampah LaporanSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PetugasJadwal PetugasJadwal_jadwalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PetugasJadwal"
    ADD CONSTRAINT "PetugasJadwal_jadwalId_fkey" FOREIGN KEY ("jadwalId") REFERENCES public."JadwalPengangkutan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PetugasJadwal PetugasJadwal_petugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PetugasJadwal"
    ADD CONSTRAINT "PetugasJadwal_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES public."Petugas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict E0uLyPhqS3K0LCZZoKpy7SG2ZU5HyIyXZYdXh13vQEDJdtr4bU13wcacTUMOIpQ

