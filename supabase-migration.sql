-- ==========================================
-- MIGRATION SCRIPT - SQLite to Supabase
-- Gerado em: 2026-01-31T00:02:32.213Z
-- ==========================================
-- IMPORTANTE: Substitua e2373629-368b-48b5-aff3-5e6f9e30d1fb pelo seu UUID do Supabase!
-- ==========================================

-- Estatísticas:
-- Workouts: 42
-- Exercises: 229
-- Sets: 702

-- ========== LIMPAR DADOS EXISTENTES ==========
-- (deleta na ordem correta por causa das foreign keys)

DELETE FROM sets;
DELETE FROM exercises;
DELETE FROM workouts;

-- ========== WORKOUTS ==========

INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (1, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2024-02-01', 'Upper Body', NULL, '2024-02-01T12:00:00', '2024-02-01T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (2, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2024-02-02', 'Lower Body', NULL, '2024-02-02T12:00:00', '2024-02-02T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (3, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-02-04', 'Full Body B', NULL, '2025-02-04T12:00:00', '2025-02-04T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (4, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-02-06', 'Full Body A', NULL, '2025-02-06T12:00:00', '2025-02-06T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (5, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-02-10', 'Full Body A', NULL, '2025-02-10T12:00:00', '2025-02-10T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (6, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-16', 'Força/Volume', NULL, '2025-06-16T12:00:00', '2025-06-16T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (7, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-18', 'Volume/Acessórios', NULL, '2025-06-18T12:00:00', '2025-06-18T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (8, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-21', 'Força', NULL, '2025-06-21T12:00:00', '2025-06-21T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (9, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-23', 'Acessórios', NULL, '2025-06-23T12:00:00', '2025-06-23T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (10, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-24', 'Volume Completo', NULL, '2025-06-24T12:00:00', '2025-06-24T13:00:00', 3600, NULL, '2025-12-12 18:44:03', '2025-12-12 18:44:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (11, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-06-25', 'Força + Desenvolvimento', NULL, '2025-06-25T12:00:00', '2025-06-25T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (12, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-07-01', 'Volume/Acessórios', NULL, '2025-07-01T12:00:00', '2025-07-01T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (13, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-07-02', 'Força Completa', NULL, '2025-07-02T12:00:00', '2025-07-02T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (14, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-07-07', 'Volume', NULL, '2025-07-07T12:00:00', '2025-07-07T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (15, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-07-14', 'Força', NULL, '2025-07-14T12:00:00', '2025-07-14T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (16, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-08-18', 'Upper Power', NULL, '2025-08-18T12:00:00', '2025-08-18T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (17, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-08-23', 'Push', NULL, '2025-08-23T12:00:00', '2025-08-23T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (18, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-11', 'Lower', NULL, '2025-12-11T12:00:00', '2025-12-11T13:00:00', 3600, NULL, '2025-12-12 18:44:04', '2025-12-12 18:44:04');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (42, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T19:33:59', '2025-12-13T19:34:08', 11, NULL, '2025-12-13 19:33:55', '2025-12-13 19:34:08');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (44, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T19:45:54', '2025-12-13T19:46:11', 19, NULL, '2025-12-13 19:45:51', '2025-12-13 19:46:11');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (45, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T22:30:07', '2025-12-13T22:30:54', 50, NULL, '2025-12-13 22:30:03', '2025-12-13 22:30:54');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (47, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T22:50:57', '2025-12-13T22:51:12', 18, NULL, '2025-12-13 22:50:53', '2025-12-13 22:51:12');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (48, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T22:55:54', '2025-12-13T22:56:05', 14, NULL, '2025-12-13 22:55:50', '2025-12-13 22:56:05');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (49, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-13', 'Segunda - Push', 'segunda', '2025-12-13T22:57:04', '2025-12-14T11:36:12', 45551, NULL, '2025-12-13 22:57:00', '2025-12-14 11:36:12');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (53, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-15', 'Segunda - Push', 'segunda', '2025-12-15T10:17:35', '2025-12-15T10:18:19', 44, NULL, '2025-12-15 10:17:34', '2025-12-15 10:18:19');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (78, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-15', 'Segunda - Push', 'segunda', '2025-12-15T18:00:25', '2025-12-15T18:01:44', 78, NULL, '2025-12-15 18:00:25', '2025-12-15 18:01:44');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (82, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-15', 'Segunda - Push', 'segunda', '2025-12-15T21:33:40', '2025-12-15T21:56:58', 1397, NULL, '2025-12-15 21:33:40', '2025-12-15 21:56:58');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (84, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-15', 'Segunda - Push', 'segunda', '2025-12-15T22:23:58', '2025-12-15T22:43:30', 1171, NULL, '2025-12-15 22:23:57', '2025-12-15 22:43:30');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (87, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-16', 'Segunda - Push', 'segunda', '2025-12-16T09:31:35', '2025-12-16T10:46:00', 4465, NULL, '2025-12-16 09:31:34', '2025-12-16 10:46:00');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (92, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-18', 'Quinta - Pull', 'quinta', '2025-12-18T21:27:31', '2025-12-18T23:59:49', 1680, NULL, '2025-12-18 21:27:31', '2025-12-19 11:06:56');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (107, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-19', 'Sexta/Sáb - Posterior', 'sexta-sab', '2025-12-19T21:26:45', '2025-12-20T01:10:28.000Z', 1980, NULL, '2025-12-19 21:26:44', '2025-12-19 22:11:03');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (108, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-27', 'Terça - Lower Quad', 'terca', '2025-12-27T12:52:18', '2025-12-27T13:06:21', 842, NULL, '2025-12-27 12:52:17', '2025-12-27 13:06:21');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (109, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2025-12-27', 'Segunda - Push', 'segunda', '2025-12-27T13:06:24', '2025-12-27T13:57:41', 3076, NULL, '2025-12-27 13:06:23', '2025-12-27 13:57:41');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (138, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-12', 'Treino A', 'treino-a', '2026-01-12T20:56:55', '2026-01-12T21:38:51', 2516, NULL, '2026-01-12 20:56:54', '2026-01-12 21:38:51');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (141, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-13', 'Treino B', 'treino-b', '2026-01-13T20:55:34', '2026-01-14T16:58:29', 72173, NULL, '2026-01-13 20:55:34', '2026-01-14 16:58:29');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (147, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-14', 'Treino A', 'treino-a', '2026-01-14T20:54:59', '2026-01-15T20:59:47', 86688, NULL, '2026-01-14 20:54:59', '2026-01-15 20:59:47');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (151, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-15', 'Treino B', 'treino-b', '2026-01-15T21:05:42', '2026-01-15T22:34:30', 5327, NULL, '2026-01-15 21:05:41', '2026-01-15 22:34:30');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (153, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-16', 'Treino A', 'treino-a', '2026-01-16T20:52:02', '2026-01-16T21:40:43', 2920, NULL, '2026-01-16 20:52:02', '2026-01-16 21:40:43');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (155, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-17', 'Treino B', 'treino-b', '2026-01-17T13:11:22', '2026-01-17T13:53:09', 2507, NULL, '2026-01-17 13:11:20', '2026-01-17 13:53:09');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (157, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-20', 'Treino A', 'treino-a', '2026-01-20T21:03:11', '2026-01-20T22:16:38', 4406, NULL, '2026-01-20 21:03:11', '2026-01-20 22:16:38');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (164, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-21', 'Treino B', 'treino-b', '2026-01-21T20:55:46', '2026-01-22T19:43:53', 82086, NULL, '2026-01-21 20:55:46', '2026-01-22 19:43:53');
INSERT INTO workouts (id, user_id, date, name, template_id, started_at, finished_at, duration_seconds, notes, created_at, updated_at)
VALUES (171, 'e2373629-368b-48b5-aff3-5e6f9e30d1fb', '2026-01-22', 'Treino A', 'treino-a', '2026-01-22T20:31:25', '2026-01-22T21:45:18', 4432, NULL, '2026-01-22 20:31:25', '2026-01-22 21:45:18');

-- ========== EXERCISES ==========

INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (1, 1, 'Supino com Halteres', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (2, 1, 'Crossover na Polia Baixa', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (3, 1, 'Barra Fixa', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (4, 1, 'Remada Baixa na Polia', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (5, 1, 'Desenvolvimento com Halteres', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (6, 1, 'Elevação Lateral', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (7, 1, 'Rosca Direta com Barra W', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (8, 1, 'Rosca Martelo', 7, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (9, 1, 'Tríceps na Corda (Polia Alta)', 8, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (10, 2, 'Agachamento Livre', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (11, 2, 'Leg Press 45°', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (12, 2, 'Cadeira Extensora', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (13, 2, 'Mesa Flexora', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (14, 2, 'Stiff com Halteres', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (15, 2, 'Panturrilha no Smith Machine', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (16, 3, 'Peck Deck (Máquina Peitoral)', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (17, 3, 'Remada Máquina com Peito Apoiado', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (18, 3, 'Leg Press', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (19, 3, 'Desenvolvimento Máquina (Ombros)', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (20, 3, 'Rosca Martelo Banco Inclinado', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (21, 3, 'Extensão de Tríceps na Polia', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (22, 3, 'Panturrilha (Gêmeos)', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (23, 4, 'Supino com Halteres', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (24, 4, 'Barra Fixa', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (25, 4, 'Agachamento Livre', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (26, 4, 'Elevação Lateral no Banco', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (27, 4, 'Rosca no Banco Inclinado', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (28, 4, 'Mergulho na Paralela', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (29, 4, 'Antebraço (Rosca Inversa)', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (30, 5, 'Supino com Halteres', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (31, 5, 'Barra Fixa', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (32, 5, 'Agachamento Livre', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (33, 5, 'Elevação Lateral no Banco', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (34, 5, 'Rosca Martelo no Banco Inclinado', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (35, 5, 'Mergulho na Paralela', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (36, 5, 'Antebraço (Rosca Inversa)', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (37, 6, 'Supino Reto', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (38, 6, 'Agachamento', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (39, 6, 'Barra Fixa', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (40, 6, 'Desenvolvimento', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (41, 6, 'Panturrilha Em Pé', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (42, 7, 'RDL (Stiff)', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (43, 7, 'Supino Inclinado Halter', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (44, 7, 'Desenvolvimento', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (45, 7, 'Remada Máquina', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (46, 7, 'Elevação Lateral', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (47, 7, 'Rosca Direta Barra W', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (48, 7, 'Tríceps Unilateral EZ', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (49, 7, 'Panturrilha Em Pé', 7, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (50, 8, 'Supino Reto', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (51, 8, 'Agachamento', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (52, 8, 'Barra Fixa', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (53, 8, 'Rosca Halter', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (54, 9, 'Tríceps Unilateral EZ', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (55, 9, 'Paralelas (Peso)', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (56, 10, 'RDL (Stiff)', 0, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (57, 10, 'Supino Inclinado Halter', 1, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (58, 10, 'Desenvolvimento', 2, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (59, 10, 'Remada Baixa', 3, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (60, 10, 'Elevação Lateral', 4, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (61, 10, 'Rosca Halter', 5, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (62, 10, 'Extensão Unilateral EZ', 6, NULL, '2025-12-12 18:44:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (63, 10, 'Panturrilha Em Pé', 7, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (64, 11, 'Agachamento', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (65, 11, 'Supino Reto', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (66, 11, 'Desenvolvimento', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (67, 11, 'Panturrilha Em Pé', 3, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (68, 12, 'RDL (Stiff)', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (69, 12, 'Supino Inclinado Halter', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (70, 12, 'Remada Baixa', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (71, 12, 'Elevação Lateral', 3, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (72, 12, 'Paralelas (Peso)', 4, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (73, 12, 'Panturrilha Em Pé', 5, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (74, 13, 'Agachamento', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (75, 13, 'Supino Reto', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (76, 13, 'Barra Fixa', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (77, 13, 'Desenvolvimento', 3, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (78, 13, 'Panturrilha Em Pé', 4, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (79, 14, 'RDL (Stiff)', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (80, 14, 'Supino Inclinado', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (81, 14, 'Remada Baixa', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (82, 14, 'Elevação Lateral', 3, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (83, 14, 'Paralelas (Peso)', 4, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (84, 14, 'Panturrilha Em Pé', 5, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (85, 15, 'Supino Reto', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (86, 15, 'Desenvolvimento', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (87, 15, 'Barra Fixa', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (88, 16, 'Supino Inclinado 30°', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (89, 16, 'Barra Fixa', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (90, 16, 'Desenvolvimento Militar', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (91, 17, 'Supino Inclinado Halteres', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (92, 17, 'Paralelas (Peso)', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (93, 17, 'Desenvolvimento Halteres', 2, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (94, 17, 'Peck Deck', 3, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (95, 18, 'Agachamento livre', 0, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (96, 18, 'Stiff', 1, NULL, '2025-12-12 18:44:04');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (228, 42, 'Supino inclinado halter', 0, NULL, '2025-12-13 19:33:55');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (229, 42, 'Paralelas (Peso)', 1, NULL, '2025-12-13 19:33:55');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (230, 42, 'Elevação lateral', 2, NULL, '2025-12-13 19:33:55');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (231, 42, 'Coice inclinado', 3, NULL, '2025-12-13 19:33:55');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (232, 42, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 19:33:55');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (238, 44, 'Supino inclinado halter', 0, NULL, '2025-12-13 19:45:51');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (239, 44, 'Paralelas (Peso)', 1, NULL, '2025-12-13 19:45:51');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (240, 44, 'Elevação lateral', 2, NULL, '2025-12-13 19:45:51');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (241, 44, 'Coice inclinado', 3, NULL, '2025-12-13 19:45:51');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (242, 44, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 19:45:51');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (243, 45, 'Supino inclinado halter', 0, NULL, '2025-12-13 22:30:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (244, 45, 'Paralelas (Peso)', 1, NULL, '2025-12-13 22:30:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (245, 45, 'Elevação lateral', 2, NULL, '2025-12-13 22:30:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (246, 45, 'Coice inclinado', 3, NULL, '2025-12-13 22:30:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (247, 45, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 22:30:03');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (253, 47, 'Supino inclinado halter', 0, NULL, '2025-12-13 22:50:53');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (254, 47, 'Paralelas (Peso)', 1, NULL, '2025-12-13 22:50:53');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (255, 47, 'Elevação lateral', 2, NULL, '2025-12-13 22:50:53');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (256, 47, 'Coice inclinado', 3, NULL, '2025-12-13 22:50:53');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (257, 47, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 22:50:53');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (258, 48, 'Supino inclinado halter', 0, NULL, '2025-12-13 22:55:50');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (259, 48, 'Paralelas (Peso)', 1, NULL, '2025-12-13 22:55:50');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (260, 48, 'Elevação lateral', 2, NULL, '2025-12-13 22:55:50');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (261, 48, 'Coice inclinado', 3, NULL, '2025-12-13 22:55:50');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (262, 48, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 22:55:50');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (263, 49, 'Supino inclinado halter', 0, NULL, '2025-12-13 22:57:00');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (264, 49, 'Paralelas (Peso)', 1, NULL, '2025-12-13 22:57:00');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (265, 49, 'Elevação lateral', 2, NULL, '2025-12-13 22:57:00');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (266, 49, 'Coice inclinado', 3, NULL, '2025-12-13 22:57:00');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (267, 49, 'Pushdown corda unilateral', 4, NULL, '2025-12-13 22:57:00');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (283, 53, 'Supino inclinado halter', 0, NULL, '2025-12-15 10:17:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (284, 53, 'Paralelas (Peso)', 1, NULL, '2025-12-15 10:17:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (285, 53, 'Elevação lateral', 2, NULL, '2025-12-15 10:17:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (286, 53, 'Coice inclinado', 3, NULL, '2025-12-15 10:17:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (287, 53, 'Pushdown corda unilateral', 4, NULL, '2025-12-15 10:17:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (409, 78, 'Supino inclinado halter', 0, NULL, '2025-12-15 18:00:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (410, 78, 'Paralelas (Peso)', 1, NULL, '2025-12-15 18:00:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (411, 78, 'Elevação lateral', 2, NULL, '2025-12-15 18:00:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (412, 78, 'Coice inclinado', 3, NULL, '2025-12-15 18:00:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (413, 78, 'Pushdown corda unilateral', 4, NULL, '2025-12-15 18:00:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (429, 82, 'Supino inclinado halter', 0, NULL, '2025-12-15 21:33:40');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (430, 82, 'Paralelas (Peso)', 1, NULL, '2025-12-15 21:33:40');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (431, 82, 'Elevação lateral', 2, NULL, '2025-12-15 21:33:40');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (432, 82, 'Coice inclinado', 3, NULL, '2025-12-15 21:33:40');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (433, 82, 'Pushdown corda unilateral', 4, NULL, '2025-12-15 21:33:40');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (439, 84, 'Supino inclinado halter', 0, NULL, '2025-12-15 22:23:57');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (440, 84, 'Paralelas (Peso)', 1, NULL, '2025-12-15 22:23:57');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (441, 84, 'Elevação lateral', 2, NULL, '2025-12-15 22:23:57');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (442, 84, 'Coice inclinado', 3, NULL, '2025-12-15 22:23:57');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (443, 84, 'Pushdown corda unilateral', 4, NULL, '2025-12-15 22:23:57');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (455, 87, 'Supino inclinado halter', 0, NULL, '2025-12-16 09:31:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (456, 87, 'Paralelas (Peso)', 1, NULL, '2025-12-16 09:31:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (457, 87, 'Elevação lateral', 2, NULL, '2025-12-16 09:31:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (458, 87, 'Coice inclinado', 3, NULL, '2025-12-16 09:31:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (459, 87, 'Pushdown corda unilateral', 4, NULL, '2025-12-16 09:31:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (486, 92, 'Barra Fixa (Peso)', 0, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (487, 92, 'Remada (Máquina/Curvada)', 1, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (488, 92, 'Supino inclinado halter', 2, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (489, 92, 'Development', 3, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (490, 92, 'Rosca martelo', 4, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (491, 92, 'Encolhimento halter unilateral', 5, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (492, 92, 'Elevação lateral', 6, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (493, 92, 'Remada (Máquina/Curvada)', 7, NULL, '2025-12-18 21:27:31');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (580, 107, 'RDL (Stiff)', 0, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (581, 107, 'Mesa Flexora (Leg Curl)', 1, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (582, 107, 'Mesa Flexora (Leg Curl)', 2, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (583, 107, 'Coice inclinado', 3, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (584, 107, 'Reverse curl', 4, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (585, 107, 'Farmer''s walk snatch grip', 5, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (586, 107, 'Panturrilha sentado', 6, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (587, 107, 'Neck curl', 7, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (588, 107, 'Neck extension', 8, NULL, '2025-12-19 21:26:44');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (589, 108, 'Agachamento narrow', 0, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (590, 108, 'Búlgaro', 1, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (591, 108, 'RDL (Stiff)', 2, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (592, 108, 'Leg press pés juntos', 3, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (593, 108, 'Mesa Flexora (Leg Curl)', 4, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (594, 108, 'Panturrilha em pé', 5, NULL, '2025-12-27 12:52:17');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (595, 109, 'Supino inclinado halter', 0, NULL, '2025-12-27 13:06:23');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (596, 109, 'Paralelas (Peso)', 1, NULL, '2025-12-27 13:06:23');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (597, 109, 'Elevação lateral', 2, NULL, '2025-12-27 13:06:23');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (598, 109, 'Coice inclinado', 3, NULL, '2025-12-27 13:06:23');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (599, 109, 'Pushdown corda unilateral', 4, NULL, '2025-12-27 13:06:23');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (746, 138, 'Agachamento Livre', 0, NULL, '2026-01-12 20:56:54');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (747, 138, 'Barra Fixa (Peso)', 1, NULL, '2026-01-12 20:56:54');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (748, 138, 'Paralelas (Peso)', 2, NULL, '2026-01-12 20:56:54');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (749, 138, 'Elevação Lateral', 3, NULL, '2026-01-12 20:56:54');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (750, 138, 'Coice Inclinado', 4, NULL, '2026-01-12 20:56:54');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (751, 138, 'Panturrilha em pé', 5, NULL, '2026-01-12 21:19:30');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (764, 141, 'RDL (Stiff)', 0, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (765, 141, 'Supino Inclinado Halter', 1, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (766, 141, 'Mesa Flexora (Leg Curl)', 2, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (767, 141, 'Remada (Máquina/Curvada)', 3, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (768, 141, 'Pullover (Polia/Halter)', 4, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (769, 141, 'Rosca Martelo', 5, NULL, '2026-01-13 20:55:34');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (796, 147, 'Agachamento Livre', 0, NULL, '2026-01-14 20:54:59');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (797, 147, 'Barra Fixa (Peso)', 1, NULL, '2026-01-14 20:54:59');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (798, 147, 'Paralelas (Peso)', 2, NULL, '2026-01-14 20:54:59');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (799, 147, 'Elevação Lateral', 3, NULL, '2026-01-14 20:54:59');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (800, 147, 'Coice Inclinado', 4, NULL, '2026-01-14 20:54:59');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (812, 151, 'RDL (Stiff)', 0, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (813, 151, 'Supino Inclinado Halter', 1, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (814, 151, 'Mesa Flexora (Leg Curl)', 2, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (815, 151, 'Remada (Máquina/Curvada)', 3, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (816, 151, 'Pullover (Polia/Halter)', 4, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (817, 151, 'Rosca Martelo', 5, NULL, '2026-01-15 21:05:41');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (823, 153, 'Agachamento Livre', 0, NULL, '2026-01-16 20:52:02');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (824, 153, 'Barra Fixa (Peso)', 1, NULL, '2026-01-16 20:52:02');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (825, 153, 'Paralelas (Peso)', 2, NULL, '2026-01-16 20:52:02');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (826, 153, 'Elevação Lateral', 3, NULL, '2026-01-16 20:52:02');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (827, 153, 'Coice Inclinado', 4, NULL, '2026-01-16 20:52:02');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (833, 155, 'RDL (Stiff)', 0, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (834, 155, 'Supino Inclinado Halter', 1, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (835, 155, 'Mesa Flexora (Leg Curl)', 2, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (836, 155, 'Remada (Máquina/Curvada)', 3, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (837, 155, 'Pullover (Polia/Halter)', 4, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (838, 155, 'Rosca Martelo', 5, NULL, '2026-01-17 13:11:20');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (844, 157, 'Agachamento Livre', 0, NULL, '2026-01-20 21:03:11');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (845, 157, 'Barra Fixa (Peso)', 1, NULL, '2026-01-20 21:03:11');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (846, 157, 'Paralelas (Peso)', 2, NULL, '2026-01-20 21:03:11');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (847, 157, 'Elevação Lateral', 3, NULL, '2026-01-20 21:03:11');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (848, 157, 'Coice Inclinado', 4, NULL, '2026-01-20 21:03:11');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (882, 164, 'RDL (Stiff)', 0, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (883, 164, 'Supino Inclinado Halter', 1, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (884, 164, 'Mesa Flexora (Leg Curl)', 2, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (885, 164, 'Remada (Máquina/Curvada)', 3, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (886, 164, 'Pullover (Polia/Halter)', 4, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (887, 164, 'Rosca Martelo', 5, NULL, '2026-01-21 20:55:46');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (918, 171, 'Agachamento Livre', 0, NULL, '2026-01-22 20:31:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (919, 171, 'Barra Fixa (Peso)', 1, NULL, '2026-01-22 20:31:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (920, 171, 'Paralelas (Peso)', 2, NULL, '2026-01-22 20:31:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (921, 171, 'Elevação Lateral', 3, NULL, '2026-01-22 20:31:25');
INSERT INTO exercises (id, workout_id, exercise_name, order_index, notes, created_at)
VALUES (922, 171, 'Coice Inclinado', 4, NULL, '2026-01-22 20:31:25');

-- ========== SETS ==========

INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1, 1, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2, 1, 1, 'N', 12, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (3, 1, 2, 'N', 14, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (4, 2, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (5, 2, 1, 'N', 12, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (6, 2, 2, 'N', 12, 'total', 14, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (7, 3, 0, 'N', NULL, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (8, 3, 1, 'N', NULL, 'total', 9, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (9, 3, 2, 'N', NULL, 'total', 7, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (10, 4, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (11, 4, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (12, 4, 2, 'N', 40, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (13, 5, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (14, 5, 1, 'N', 7, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (15, 5, 2, 'N', 8, 'total', 14, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (16, 6, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (17, 6, 1, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (18, 6, 2, 'N', 6, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (19, 7, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (20, 7, 1, 'N', 10, 'total', 11, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (21, 7, 2, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (22, 8, 0, 'N', 5, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (23, 8, 1, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (24, 8, 2, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (25, 9, 0, 'N', 15, 'total', 11, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (26, 9, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (27, 9, 2, 'N', 10, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (28, 10, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (29, 10, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (30, 10, 2, 'N', 30, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (31, 10, 3, 'N', 30, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (32, 11, 0, 'N', 90, 'total', 11, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (33, 11, 1, 'N', 90, 'total', 11, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (34, 11, 2, 'N', 100, 'total', 9, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (35, 12, 0, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (36, 12, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (37, 12, 2, 'N', 30, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (38, 13, 0, 'N', 40, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (39, 13, 1, 'N', 50, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (40, 13, 2, 'N', 50, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (41, 14, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (42, 14, 1, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (43, 14, 2, 'N', 17, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (44, 15, 0, 'N', 10, 'total', 20, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (45, 15, 1, 'N', 15, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (46, 15, 2, 'N', 20, 'total', 16, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (47, 16, 0, 'N', 50, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (48, 16, 1, 'N', 50, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (49, 16, 2, 'N', 50, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (50, 17, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (51, 17, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (52, 17, 2, 'N', 25, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (53, 18, 0, 'N', 40, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (54, 18, 1, 'N', 50, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (55, 18, 2, 'N', 60, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (56, 19, 0, 'N', 5, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (57, 19, 1, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (58, 19, 2, 'N', 13, 'total', 11, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (59, 20, 0, 'N', 5, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (60, 20, 1, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (61, 20, 2, 'N', 7, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (62, 21, 0, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (63, 21, 1, 'N', 30, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (64, 21, 2, 'N', 30, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (65, 22, 0, 'N', 10, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (66, 22, 1, 'N', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (67, 23, 0, 'N', 12, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (68, 23, 1, 'N', 14, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (69, 23, 2, 'N', 16, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (70, 24, 0, 'N', 6, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (71, 24, 1, 'N', 6, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (72, 24, 2, 'N', NULL, 'total', 13, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (73, 25, 0, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (74, 25, 1, 'N', 18, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (75, 25, 2, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (76, 26, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (77, 26, 1, 'N', 7, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (78, 26, 2, 'N', 8, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (79, 27, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (80, 27, 1, 'N', 7, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (81, 27, 2, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (82, 28, 0, 'N', NULL, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (83, 28, 1, 'N', 2, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (84, 29, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (85, 29, 1, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (86, 30, 0, 'N', 16, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (87, 30, 1, 'N', 16, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (88, 30, 2, 'N', 16, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (89, 31, 0, 'N', 6, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (90, 31, 1, 'N', 6, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (91, 31, 2, 'N', NULL, 'total', 13, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (92, 32, 0, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (93, 32, 1, 'N', 18, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (94, 32, 2, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (95, 33, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (96, 33, 1, 'N', 7, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (97, 33, 2, 'N', 8, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (98, 34, 0, 'N', 6, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (99, 34, 1, 'N', 7, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (100, 34, 2, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (101, 35, 0, 'N', NULL, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (102, 35, 1, 'N', 2, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (103, 36, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (104, 36, 1, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (105, 37, 0, 'N', 15, 'per_side', 6, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (106, 37, 1, 'N', 18, 'per_side', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (107, 37, 2, 'N', 19, 'per_side', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (108, 38, 0, 'N', 20, 'per_side', 5, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (109, 38, 1, 'N', 25, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (110, 38, 2, 'N', 25, 'per_side', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (111, 39, 0, 'N', 20, 'total', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (112, 39, 1, 'N', 15, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (113, 39, 2, 'N', 20, 'total', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (114, 40, 0, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (115, 40, 1, 'N', 15, 'per_side', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (116, 40, 2, 'N', 15, 'per_side', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (117, 41, 0, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (118, 41, 1, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (119, 41, 2, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (120, 42, 0, 'N', 20, 'per_side', 6, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (121, 42, 1, 'N', 22, 'per_side', 9, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (122, 42, 2, 'N', 25, 'per_side', 10, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (123, 42, 3, 'N', 30, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (124, 43, 0, 'N', 16, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (125, 43, 1, 'N', 20, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (126, 43, 2, 'N', 22, 'total', 7, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (127, 43, 3, 'N', 22, 'total', 7, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (128, 44, 0, 'N', 7, 'total', 8, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (129, 44, 1, 'N', 10, 'total', 8, NULL, 5, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (130, 44, 2, 'N', 15, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (131, 44, 3, 'N', 20, 'total', 8, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (132, 45, 0, 'N', 30, 'total', 12, NULL, 6, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (133, 45, 1, 'N', 40, 'total', 11, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (134, 45, 2, 'N', 44, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (135, 45, 3, 'N', 40, 'total', 4, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (136, 46, 0, 'N', 7, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (137, 46, 1, 'N', 4, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (138, 46, 2, 'N', 8, 'total', 14, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (139, 46, 3, 'N', 4, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (140, 47, 0, 'N', 7.5, 'per_side', 12, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (141, 47, 1, 'N', 10, 'per_side', 11, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (142, 47, 2, 'N', 10, 'per_side', 11, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (143, 48, 0, 'N', 15, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (144, 48, 1, 'N', 15, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (145, 49, 0, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (146, 49, 1, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (147, 49, 2, 'N', 20, 'total', 18, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (148, 50, 0, 'N', 20, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (149, 50, 1, 'N', 20, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (150, 50, 2, 'N', 21, 'per_side', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (151, 51, 0, 'N', 20, 'per_side', 5, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (152, 51, 1, 'N', 25, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (153, 51, 2, 'N', 25, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (154, 52, 0, 'N', 20, 'total', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (155, 52, 1, 'N', 30, 'total', 3, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (156, 53, 0, 'N', 8, 'total', 10, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (157, 53, 1, 'N', 8, 'total', 11, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (158, 53, 2, 'N', 8, 'total', 10, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (159, 54, 0, 'N', 15, 'total', 10, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (160, 55, 0, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (161, 55, 1, 'N', 20, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (162, 56, 0, 'N', 20, 'per_side', 8, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (163, 56, 1, 'N', 30, 'per_side', 8, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (164, 56, 2, 'N', 45, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (165, 56, 3, 'N', 45, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (166, 56, 4, 'N', 45, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (167, 57, 0, 'N', 16, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (168, 57, 1, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (169, 57, 2, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (170, 57, 3, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (171, 58, 0, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (172, 58, 1, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (173, 58, 2, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (174, 59, 0, 'N', 45, 'total', 10, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (175, 59, 1, 'N', 45, 'total', 10, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (176, 59, 2, 'N', 45, 'total', 10, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (177, 60, 0, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (178, 60, 1, 'N', 4, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (179, 60, 2, 'N', 8, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (180, 60, 3, 'N', 4, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (181, 61, 0, 'N', 8, 'total', 10, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (182, 61, 1, 'N', 8, 'total', 10, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (183, 61, 2, 'N', 8, 'total', 10, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (184, 62, 0, 'N', 17, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (185, 62, 1, 'N', 17, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (186, 62, 2, 'N', 17, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (187, 63, 0, 'N', 25, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (188, 63, 1, 'N', 25, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (189, 63, 2, 'N', 25, 'total', 20, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (190, 64, 0, 'N', 20, 'per_side', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (191, 64, 1, 'N', 25, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (192, 64, 2, 'N', 25, 'per_side', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (193, 65, 0, 'N', 20, 'per_side', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (194, 65, 1, 'N', 22, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (195, 65, 2, 'N', 23, 'per_side', 4, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (196, 66, 0, 'N', 15, 'per_side', 7, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (197, 66, 1, 'N', 20, 'per_side', 8, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (198, 66, 2, 'N', 25, 'per_side', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (199, 66, 3, 'N', 30, 'per_side', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (200, 67, 0, 'N', 20, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (201, 67, 1, 'N', 25, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (202, 67, 2, 'N', 25, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (203, 68, 0, 'N', 20, 'per_side', 6, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (204, 68, 1, 'N', 22, 'per_side', 9, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (205, 68, 2, 'N', 25, 'per_side', 10, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (206, 68, 3, 'N', 30, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (207, 68, 4, 'N', 32, 'per_side', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (208, 68, 5, 'N', 32, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (209, 68, 6, 'N', 32, 'per_side', 4, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (210, 68, 7, 'N', 32, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (211, 69, 0, 'N', 22, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (212, 69, 1, 'N', 22, 'total', 7, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (213, 69, 2, 'N', 20, 'total', 9, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (214, 70, 0, 'N', 44, 'total', 10, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (215, 70, 1, 'N', 42, 'total', 10, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (216, 71, 0, 'N', 8, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (217, 71, 1, 'N', 8, 'total', 13, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (218, 71, 2, 'N', 8, 'total', 13, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (219, 71, 3, 'N', 4, 'total', 5, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (220, 72, 0, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (221, 73, 0, 'N', 20, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (222, 73, 1, 'N', 20, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (223, 73, 2, 'N', 20, 'total', 20, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (224, 74, 0, 'N', 25, 'per_side', 5, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (225, 74, 1, 'N', 25, 'per_side', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (226, 74, 2, 'N', 30, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (227, 75, 0, 'N', 10, 'per_side', 5, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (228, 75, 1, 'N', 20, 'per_side', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (229, 75, 2, 'N', 22, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (230, 75, 3, 'N', 23, 'per_side', 4, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (231, 76, 0, 'N', 20, 'total', 5, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (232, 76, 1, 'N', 25, 'total', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (233, 76, 2, 'N', 22, 'total', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (234, 77, 0, 'N', 22, 'per_side', 7, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (235, 77, 1, 'N', 22, 'per_side', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (236, 77, 2, 'N', 22, 'per_side', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (237, 78, 0, 'N', 25, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (238, 78, 1, 'N', 25, 'total', 21, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (239, 79, 0, 'N', 35, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (240, 79, 1, 'N', 35, 'per_side', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (241, 79, 2, 'N', 35, 'per_side', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (242, 80, 0, 'N', 22, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (243, 80, 1, 'N', 20, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (244, 81, 0, 'N', 44, 'total', 10, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (245, 81, 1, 'N', 42, 'total', 10, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (246, 82, 0, 'N', 8, 'total', 15, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (247, 82, 1, 'N', 8, 'total', 15, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (248, 83, 0, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (249, 83, 1, 'N', 20, 'total', 7, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (250, 84, 0, 'N', 20, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (251, 84, 1, 'N', 20, 'total', 15, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (252, 84, 2, 'N', 20, 'total', 20, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (253, 85, 0, 'N', 22, 'per_side', 4, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (254, 85, 1, 'N', 22, 'per_side', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (255, 85, 2, 'N', 20, 'per_side', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (256, 86, 0, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (257, 86, 1, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (258, 86, 2, 'N', 20, 'per_side', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (259, 87, 0, 'N', 20, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (260, 87, 1, 'N', 25, 'total', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (261, 88, 0, 'N', 10, 'total', 8, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (262, 88, 1, 'N', 20, 'total', 5, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (263, 88, 2, 'N', 20, 'total', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (264, 88, 3, 'N', 15, 'total', 13, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (265, 89, 0, 'N', NULL, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (266, 89, 1, 'N', 20, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (267, 89, 2, 'N', 25, 'total', 5, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (268, 90, 0, 'N', 15, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (269, 91, 0, 'N', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (270, 91, 1, 'N', 15, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (271, 91, 2, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (272, 91, 3, 'N', 22, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (273, 92, 0, 'N', 25, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (274, 92, 1, 'N', 20, 'total', 9, NULL, 1, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (275, 92, 2, 'N', 20, 'total', 16, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (276, 93, 0, 'N', 12, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (277, 93, 1, 'N', 12, 'total', 10, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (278, 93, 2, 'N', 14, 'total', 6, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (279, 94, 0, 'N', 60, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (280, 94, 1, 'N', 50, 'total', 12, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (281, 95, 0, 'N', 2, 'total', 8, NULL, 5, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (282, 95, 1, 'N', 30, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (283, 95, 2, 'N', 30, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (284, 95, 3, 'N', 30, 'total', 8, NULL, 0, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (285, 96, 0, 'N', 20, 'total', 6, NULL, 4, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (286, 96, 1, 'N', 20, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (287, 96, 2, 'N', 25, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (288, 96, 3, 'N', 25, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-12 18:44:04');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (717, 228, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (718, 228, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (719, 228, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (720, 228, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (721, 229, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (722, 229, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (723, 229, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (724, 230, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (725, 230, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (726, 230, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (727, 231, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (728, 231, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (729, 231, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (730, 232, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (731, 232, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (732, 232, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:33:55');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (749, 238, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (750, 238, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (751, 238, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (752, 238, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (753, 239, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (754, 239, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (755, 239, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (756, 240, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (757, 240, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (758, 240, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (759, 241, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (760, 241, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (761, 241, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (762, 242, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (763, 242, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (764, 242, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 19:45:51');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (765, 243, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (766, 243, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (767, 243, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (768, 243, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (769, 244, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (770, 244, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (771, 244, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (772, 245, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (773, 245, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (774, 245, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (775, 246, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (776, 246, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (777, 246, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (778, 247, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (779, 247, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (780, 247, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:30:03');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (797, 253, 0, 'W', 10, 'total', 20, NULL, 1, NULL, true, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (798, 253, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (799, 253, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (800, 253, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (801, 254, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (802, 254, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (803, 254, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (804, 255, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (805, 255, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (806, 255, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (807, 256, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (808, 256, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (809, 256, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (810, 257, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (811, 257, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (812, 257, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:50:53');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (813, 258, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (814, 258, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (815, 258, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (816, 258, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (817, 259, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (818, 259, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (819, 259, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (820, 260, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (821, 260, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (822, 260, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (823, 261, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (824, 261, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (825, 261, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (826, 262, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (827, 262, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (828, 262, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:55:50');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (829, 263, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (830, 263, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (831, 263, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (832, 263, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (833, 264, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (834, 264, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (835, 264, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (836, 265, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (837, 265, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (838, 265, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (839, 266, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (840, 266, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (841, 266, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (842, 267, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (843, 267, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (844, 267, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-13 22:57:00');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (893, 283, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (894, 283, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (895, 283, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (896, 283, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, true, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (897, 284, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (898, 284, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (899, 284, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (900, 285, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (901, 285, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (902, 285, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (903, 286, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (904, 286, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (905, 286, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (906, 287, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (907, 287, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (908, 287, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 10:17:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1296, 409, 0, 'N', 22, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1297, 409, 1, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1298, 409, 2, 'N', 22, 'total', 7, NULL, 0, NULL, true, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1299, 409, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1300, 410, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1301, 410, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1302, 410, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1303, 411, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1304, 411, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1305, 411, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1306, 412, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1307, 412, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1308, 412, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1309, 413, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1310, 413, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1311, 413, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 18:00:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1359, 429, 0, 'W', 0, 'total', 15, NULL, NULL, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1360, 429, 1, 'N', 16, 'total', 8, NULL, 5, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1361, 429, 2, 'N', 20, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1362, 429, 3, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1363, 430, 0, 'W', 0, 'total', 15, NULL, 5, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1364, 430, 1, 'N', 20, 'total', 6, NULL, 3, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1365, 430, 2, 'N', 20, 'total', 6, NULL, 2, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1366, 431, 0, 'N', 8, 'total', 12, NULL, 3, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1367, 431, 1, 'N', 8, 'total', 12, NULL, 2, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1368, 431, 2, 'R', 9, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1369, 432, 0, 'N', 10, 'total', 12, NULL, 4, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1370, 432, 1, 'N', 10, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1371, 432, 2, 'D', 10, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1372, 433, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1373, 433, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1374, 433, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 21:33:40');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1391, 439, 0, 'R', 22, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1392, 439, 1, 'N', 22, 'total', 8, NULL, 1, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1393, 439, 2, 'N', 22, 'total', 7, NULL, 0, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1394, 439, 3, 'N', 22, 'total', 7, NULL, 0, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1395, 440, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1396, 440, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1397, 440, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1398, 441, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1399, 441, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1400, 441, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1401, 442, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1402, 442, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1403, 442, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1404, 443, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1405, 443, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1406, 443, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-15 22:23:57');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1445, 455, 0, 'N', 22, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1446, 455, 1, 'N', 22, 'total', 8, NULL, 1, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1447, 455, 2, 'N', 22, 'total', 7, NULL, 0, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1448, 455, 3, 'N', 22, 'total', 7, NULL, 0, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1449, 456, 0, 'N', 25, 'total', 6, NULL, 1, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1450, 456, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1451, 456, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1452, 457, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1453, 457, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1454, 457, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1455, 458, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1456, 458, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1457, 458, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1458, 459, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1459, 459, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1460, 459, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-16 09:31:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1543, 486, 0, 'W', 0, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1544, 486, 1, 'N', 20, 'total', 6, NULL, 3, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1545, 486, 2, 'N', 20, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1546, 486, 3, 'N', 0, 'total', 10, NULL, NULL, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1547, 487, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1548, 487, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1549, 487, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1550, 488, 0, 'N', 18, 'total', 8, NULL, 4, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1551, 488, 1, 'N', 18, 'total', 8, NULL, 4, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1552, 488, 2, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1553, 489, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1554, 489, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1555, 489, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1556, 490, 0, 'N', 10, 'total', 9, NULL, 1, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1557, 490, 1, 'N', 10, 'total', 6, NULL, 1, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1558, 490, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1559, 491, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1560, 491, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1561, 491, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1562, 492, 0, 'N', 8, 'total', 12, NULL, 3, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1563, 492, 1, 'N', 8, 'total', 12, NULL, 3, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1564, 492, 2, 'N', 8, 'total', 12, NULL, 2, NULL, true, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1565, 493, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1566, 493, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1567, 493, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-18 21:27:31');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1836, 580, 0, 'N', 20, 'total', 8, NULL, 5, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1837, 580, 1, 'N', 25, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1838, 580, 2, 'N', 28, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1839, 580, 3, 'N', 30, 'total', 8, NULL, 3, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1840, 581, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1841, 581, 1, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1842, 581, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1843, 581, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1844, 582, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1845, 582, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1846, 582, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1847, 583, 0, 'N', 10, 'total', 12, NULL, 3, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1848, 583, 1, 'N', 10, 'total', 12, NULL, 2, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1849, 583, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1850, 584, 0, 'N', 10, 'total', 15, NULL, 5, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1851, 584, 1, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1852, 584, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1853, 585, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1854, 585, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1855, 585, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1856, 586, 0, 'N', 25, 'total', 20, NULL, NULL, NULL, true, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1857, 586, 1, 'N', 25, 'total', 20, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1858, 586, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1859, 587, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1860, 587, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1861, 588, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1862, 588, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:26:44');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1863, 586, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-19 21:46:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1864, 589, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1865, 589, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1866, 589, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1867, 589, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1868, 589, 4, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1869, 590, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1870, 590, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1871, 590, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1872, 590, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1873, 591, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1874, 591, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1875, 591, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1876, 591, 3, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1877, 592, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1878, 592, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1879, 592, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1880, 593, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1881, 593, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1882, 593, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1883, 594, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1884, 594, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1885, 594, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:52:17');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1886, 589, 5, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 12:53:52');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1887, 595, 0, 'W', 16, 'total', 8, NULL, NULL, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1888, 595, 1, 'N', 18, 'total', 8, NULL, 4, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1889, 595, 2, 'N', 18, 'total', 8, NULL, 4, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1890, 595, 3, 'N', 20, 'total', 8, NULL, 1, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1891, 596, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1892, 596, 1, 'N', 20, 'total', 6, NULL, 71, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1893, 596, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1894, 597, 0, 'N', 8, 'total', 12, NULL, 3, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1895, 597, 1, 'N', 9, 'total', 12, NULL, 1, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1896, 597, 2, 'F', 9, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1897, 598, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1898, 598, 1, 'N', 10, 'total', 12, NULL, 2, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1899, 598, 2, 'N', 10, 'total', 12, NULL, 0, NULL, true, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1900, 599, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1901, 599, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (1902, 599, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2025-12-27 13:06:23');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2351, 746, 0, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2352, 746, 1, 'N', 25, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2353, 746, 2, 'N', 30, 'total', 6, NULL, 1, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2354, 747, 0, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2355, 747, 1, 'N', 25, 'total', 6, NULL, 2, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2356, 747, 2, 'N', 30, 'total', 5, NULL, 1, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2357, 748, 0, 'N', 0, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2358, 748, 1, 'N', 20, 'total', 6, NULL, 2, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2359, 748, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2360, 749, 0, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2361, 749, 1, 'N', 8, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2362, 749, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2363, 750, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2364, 750, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-12 20:56:54');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2365, 751, 0, 'N', 20, 'total', 20, NULL, NULL, NULL, true, NULL, '2026-01-12 21:19:30');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2366, 751, 1, 'N', 20, 'total', 20, NULL, NULL, NULL, true, NULL, '2026-01-12 21:19:30');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2367, 751, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-12 21:19:30');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2404, 764, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2405, 764, 1, 'N', 30, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2406, 764, 2, 'N', 35, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2407, 765, 0, 'N', 18, 'total', 8, NULL, 4, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2408, 765, 1, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2409, 765, 2, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2410, 766, 0, 'N', 15, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2411, 766, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2412, 766, 2, 'N', 20, 'total', 12, NULL, 1, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2413, 767, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2414, 767, 1, 'N', 25, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2415, 767, 2, 'N', 25, 'total', 10, NULL, 1, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2416, 768, 0, 'N', 20, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2417, 768, 1, 'N', 20, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2418, 768, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2419, 769, 0, 'N', 8, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2420, 769, 1, 'N', 10, 'total', 12, NULL, 1, NULL, true, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2421, 769, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-13 20:55:34');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2496, 796, 0, 'N', 20, 'total', 8, NULL, 4, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2497, 796, 1, 'N', 25, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2498, 796, 2, 'N', 30, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2499, 797, 0, 'N', 10, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2500, 797, 1, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2501, 797, 2, 'N', 20, 'total', 6, NULL, 2, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2502, 798, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2503, 798, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2504, 798, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2505, 799, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2506, 799, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2507, 799, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2508, 800, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2509, 800, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-14 20:54:59');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2542, 812, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2543, 812, 1, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2544, 812, 2, 'N', 15, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2545, 813, 0, 'N', 20, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2546, 813, 1, 'N', 20, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2547, 813, 2, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2548, 814, 0, 'N', 15, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2549, 814, 1, 'N', 15, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2550, 814, 2, 'N', 20, 'total', 15, NULL, 1, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2551, 815, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2552, 815, 1, 'N', 25, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2553, 815, 2, 'R', 25, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2554, 816, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2555, 816, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2556, 816, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2557, 817, 0, 'N', 10, 'total', 10, NULL, 3, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2558, 817, 1, 'R', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2559, 817, 2, 'N', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-15 21:05:41');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2574, 823, 0, 'N', 20, 'total', 8, NULL, 5, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2575, 823, 1, 'N', 25, 'total', 8, NULL, 3, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2576, 823, 2, 'N', 30, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2577, 824, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2578, 824, 1, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2579, 824, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2580, 825, 0, 'N', 20, 'total', 6, NULL, 3, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2581, 825, 1, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2582, 825, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2583, 826, 0, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2584, 826, 1, 'N', 9, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2585, 826, 2, 'N', 9, 'total', 12, NULL, 2, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2586, 827, 0, 'N', 5, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2587, 827, 1, 'F', 10, 'total', 10, NULL, 0, NULL, true, NULL, '2026-01-16 20:52:02');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2602, 833, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2603, 833, 1, 'N', 25, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2604, 833, 2, 'N', 30, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2605, 834, 0, 'N', 22, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2606, 834, 1, 'N', 22, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2607, 834, 2, 'N', 22, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2608, 835, 0, 'N', 5, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2609, 835, 1, 'N', 10, 'total', 15, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2610, 835, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2611, 836, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2612, 836, 1, 'N', 25, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2613, 836, 2, 'N', 25, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2614, 837, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2615, 837, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2616, 837, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2617, 838, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2618, 838, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2619, 838, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-17 13:11:20');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2634, 844, 0, 'W', 0, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2635, 844, 1, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2636, 844, 2, 'N', 30, 'total', 6, NULL, 2, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2637, 845, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2638, 845, 1, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2639, 845, 2, 'N', 20, 'total', 8, NULL, 2, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2640, 846, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2641, 846, 1, 'N', 20, 'total', 9, NULL, 1, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2642, 846, 2, 'R', 20, 'total', 9, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2643, 847, 0, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2644, 847, 1, 'R', 10, 'total', 18, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2645, 847, 2, 'R', 10, 'total', 14, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2646, 848, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2647, 848, 1, 'R', 10, 'total', 18, NULL, NULL, NULL, true, NULL, '2026-01-20 21:03:11');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2648, 844, 3, 'N', 33, 'total', 6, NULL, 1, NULL, true, NULL, '2026-01-20 21:04:06');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2745, 882, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2746, 882, 1, 'N', 30, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2747, 882, 2, 'N', 33, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2748, 883, 0, 'N', 18, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2749, 883, 1, 'N', 22, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2750, 883, 2, 'N', 24, 'total', 8, NULL, 1, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2751, 884, 0, 'N', 15, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2752, 884, 1, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2753, 884, 2, 'F', 30, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2754, 885, 0, 'N', 20, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2755, 885, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2756, 885, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2757, 886, 0, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2758, 886, 1, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2759, 886, 2, 'N', NULL, 'total', NULL, NULL, NULL, NULL, false, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2760, 887, 0, 'N', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2761, 887, 1, 'N', 10, 'total', 10, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2762, 887, 2, 'N', 10, 'total', 15, NULL, NULL, NULL, true, NULL, '2026-01-21 20:55:46');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2848, 918, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2849, 918, 1, 'N', 30, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2850, 918, 2, 'R', 33, 'total', 9, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2851, 919, 0, 'N', 20, 'total', 8, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2852, 919, 1, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2853, 919, 2, 'R', 30, 'total', 9, NULL, 0, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2854, 920, 0, 'N', 20, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2855, 920, 1, 'N', 25, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2856, 920, 2, 'N', 25, 'total', 6, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2857, 921, 0, 'N', 8, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2858, 921, 1, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2859, 921, 2, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2860, 922, 0, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');
INSERT INTO sets (id, exercise_id, order_index, set_type, weight, weight_type, reps, time_seconds, rir, rpe, completed, notes, created_at)
VALUES (2861, 922, 1, 'N', 10, 'total', 12, NULL, NULL, NULL, true, NULL, '2026-01-22 20:31:25');

-- ========== RESET SEQUENCES ==========
-- Garante que os próximos IDs sejam corretos

SELECT setval('workouts_id_seq', (SELECT COALESCE(MAX(id), 1) FROM workouts));
SELECT setval('exercises_id_seq', (SELECT COALESCE(MAX(id), 1) FROM exercises));
SELECT setval('sets_id_seq', (SELECT COALESCE(MAX(id), 1) FROM sets));

-- FIM DA MIGRAÇÃO
