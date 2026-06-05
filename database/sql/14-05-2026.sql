-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 14, 2026 at 04:52 AM
-- Server version: 8.4.7
-- PHP Version: 8.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pmapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_sessions`
--

DROP TABLE IF EXISTS `activity_sessions`;
CREATE TABLE IF NOT EXISTS `activity_sessions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `start_at` timestamp NOT NULL,
  `end_at` timestamp NULL DEFAULT NULL,
  `status` enum('Active','Auto-Closed','Manual-Closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_sessions_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_01_175049_create_positions_table', 1),
(5, '2026_05_01_175050_add_position_id_to_users_table', 1),
(6, '2026_05_01_175050_create_activity_sessions_table', 1),
(7, '2026_05_01_175051_create_task_checklists_table', 1),
(8, '2026_05_01_175051_create_tasks_table', 1),
(9, '2026_05_01_220409_create_permission_tables', 1),
(10, '2026_05_01_220831_create_task_comments_table', 1),
(11, '2026_05_01_224620_add_evaluation_fields_to_tasks_table', 1),
(12, '2026_05_01_235534_add_category_to_permissions_table', 1),
(13, '2026_05_02_001810_add_description_to_permissions_table', 1),
(14, '2026_05_13_192626_create_personal_access_tokens_table', 1),
(15, '2026_05_13_204853_add_status_to_users_table', 2),
(16, '2026_05_14_040031_add_details_to_roles_and_permissions_tables', 3);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(2, 'App\\Models\\User', 7),
(5, 'App\\Models\\User', 1),
(6, 'App\\Models\\User', 2),
(6, 'App\\Models\\User', 3),
(10, 'App\\Models\\User', 4),
(11, 'App\\Models\\User', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guard_name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `group`, `description`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'manage_users', NULL, NULL, 'web', '2026-05-13 17:08:16', '2026-05-13 17:08:16'),
(2, 'manage_roles', 'صلاحيات الإعدادات', 'إدارة الأدوار وتعديل صلاحياتها', 'web', '2026-05-13 17:08:16', '2026-05-14 01:05:27'),
(3, 'manage_tasks', NULL, NULL, 'web', '2026-05-13 17:08:16', '2026-05-13 17:08:16'),
(4, 'assign_tasks', 'صلاحيات المهام', 'إسناد المهام للمتدربين', 'web', '2026-05-13 17:08:16', '2026-05-14 01:05:27'),
(5, 'evaluate_work', 'صلاحيات المهام', 'تقييم جودة العمل والنتائج', 'web', '2026-05-13 17:08:16', '2026-05-14 01:05:27'),
(6, 'view_reports', NULL, NULL, 'web', '2026-05-13 17:08:16', '2026-05-13 17:08:16'),
(7, 'submit_work', NULL, NULL, 'web', '2026-05-13 17:08:16', '2026-05-13 17:08:16'),
(8, 'manage_settings', 'صلاحيات الإعدادات', 'تعديل إعدادات النظام العامة', 'web', '2026-05-13 17:08:16', '2026-05-14 01:05:27'),
(9, 'create_projects', 'صلاحيات المشروعات', 'إنشاء مشاريع برمجية جديدة', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(10, 'edit_projects', 'صلاحيات المشروعات', 'تعديل بيانات المشاريع', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(11, 'delete_projects', 'صلاحيات المشروعات', 'حذف المشاريع', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(12, 'manage_backlog', 'صلاحيات المشروعات', 'إدارة قائمة المهام المتأخرة (Backlog)', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(13, 'define_requirements', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(14, 'review_code', 'صلاحيات المهام', 'مراجعة الكود البرمجي المقدم', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(15, 'merge_pull_requests', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(16, 'submit_tasks', 'صلاحيات المهام', 'رفع وتسليم المهام المنجزة', 'web', '2026-05-13 17:13:11', '2026-05-14 01:05:27'),
(17, 'log_time', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(18, 'create_bugs', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(19, 'verify_fixes', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(20, 'view_analytics', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(21, 'view_all_tasks', NULL, NULL, 'web', '2026-05-13 17:13:11', '2026-05-13 17:13:11'),
(22, 'view_users', 'صلاحيات المستخدمين', 'مشاهدة قائمة المستخدمين', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(23, 'create_users', 'صلاحيات المستخدمين', 'إضافة مستخدمين جدد للنظام', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(24, 'edit_users', 'صلاحيات المستخدمين', 'تعديل بيانات المستخدمين', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(25, 'delete_users', 'صلاحيات المستخدمين', 'حذف المستخدمين من النظام', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(26, 'toggle_user_status', 'صلاحيات المستخدمين', 'تنشيط أو إيقاف حسابات المستخدمين', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(27, 'manage_permissions', 'صلاحيات الإعدادات', 'إدارة الصلاحيات الفردية', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(28, 'view_projects', 'صلاحيات المشروعات', 'مشاهدة قائمة المشاريع', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(29, 'view_sessions', 'صلاحيات الجلسات', 'مشاهدة الجلسات التدريبية', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(30, 'create_sessions', 'صلاحيات الجلسات', 'إنشاء جلسات توجيه جديدة', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27'),
(31, 'manage_attendance', 'صلاحيات الجلسات', 'إدارة كشوف الحضور والغياب', 'web', '2026-05-14 01:05:27', '2026-05-14 01:05:27');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '921b9a088f6e096173c0935fd44ba97498c9a99f2a96f6a0ef15637d895bb9e0', '[\"*\"]', '2026-05-14 01:51:51', NULL, '2026-05-13 16:41:15', '2026-05-14 01:51:51');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `guard_name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'الشخص اللى بيعمل كل حاجة فى التطبيق', 'web', '2026-05-13 17:08:16', '2026-05-14 01:06:53'),
(2, 'Manager', 'واحد من فريق الادارة', 'web', '2026-05-13 17:08:16', '2026-05-14 01:07:14'),
(3, 'Mentor', 'الشخص اللى بنسأله لما نكون مبوظين الدنيا', 'web', '2026-05-13 17:08:16', '2026-05-14 01:07:35'),
(4, 'Intern', 'والله منا عارف بيعمل ايه بس خليه ياكل عيش', 'web', '2026-05-13 17:08:16', '2026-05-14 01:08:01'),
(5, 'Administrator', 'له كامل الصلاحيات في التحكم في كافة أجزاء النظام والإعدادات.', 'web', '2026-05-13 17:13:11', '2026-05-14 01:09:25'),
(6, 'Project Manager مدير مشاريع', 'مسؤول عن إدارة المشاريع، المتدربين، ومتابعة التقدم العام.', 'web', '2026-05-13 17:13:11', '2026-05-14 01:09:43'),
(7, 'Product Owner صاحب منتج', 'الشخص اللى عارف كل حاجة عن الأبلكيشن', 'web', '2026-05-13 17:13:11', '2026-05-14 01:08:54'),
(9, 'Team Leader قائد فريق', 'يدير فريقاً من المتدربين ويشرف على تسليم المهام اليومية.', 'web', '2026-05-13 17:13:11', '2026-05-14 01:10:04'),
(10, 'Trainee متدرب', 'يستلم المهام، يرفع الكود، ويتابع سجل إنجازاته الشخصي.', 'web', '2026-05-13 17:13:11', '2026-05-14 01:10:23'),
(11, 'Tester تيستر', 'مسؤول عن فحص جودة البرمجيات وتسجيل الأخطاء والتحقق من إصلاحها.', 'web', '2026-05-13 17:13:11', '2026-05-14 01:11:13'),
(12, 'Dev Ops خيارات التطوير', 'الشخص المسؤول عن السيرفر', 'web', '2026-05-13 17:13:11', '2026-05-14 01:11:55'),
(13, 'Neo Role - دور جديد', NULL, 'web', '2026-05-14 00:55:25', '2026-05-14 00:55:25');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 5),
(1, 6),
(1, 13),
(2, 1),
(2, 5),
(2, 13),
(3, 1),
(3, 2),
(3, 3),
(3, 5),
(4, 1),
(4, 2),
(4, 3),
(4, 5),
(4, 9),
(5, 1),
(5, 2),
(5, 3),
(5, 5),
(6, 1),
(6, 2),
(6, 5),
(7, 1),
(7, 4),
(7, 5),
(8, 1),
(8, 5),
(9, 5),
(9, 6),
(10, 5),
(10, 6),
(11, 5),
(12, 5),
(12, 7),
(13, 5),
(13, 7),
(14, 5),
(14, 9),
(15, 5),
(15, 9),
(16, 5),
(16, 10),
(16, 12),
(17, 5),
(17, 12),
(18, 5),
(18, 11),
(19, 5),
(19, 11),
(20, 5),
(20, 6),
(20, 7),
(21, 5),
(21, 6),
(21, 9),
(21, 11),
(21, 12),
(22, 5),
(23, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5),
(28, 5),
(28, 10),
(29, 5),
(29, 10),
(30, 5),
(31, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `type` enum('Initiative','Epic','User Story','Task','Subtask') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Task',
  `points` int NOT NULL DEFAULT '1',
  `revisions_count` int NOT NULL DEFAULT '0',
  `rating` int DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('Pending','In Progress','In Review','Completed','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `due_date` timestamp NULL DEFAULT NULL,
  `trainee_id` bigint UNSIGNED DEFAULT NULL,
  `mentor_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_parent_id_foreign` (`parent_id`),
  KEY `tasks_trainee_id_foreign` (`trainee_id`),
  KEY `tasks_mentor_id_foreign` (`mentor_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_checklists`
--

DROP TABLE IF EXISTS `task_checklists`;
CREATE TABLE IF NOT EXISTS `task_checklists` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` bigint UNSIGNED NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('DoD','AC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_checklists_task_id_foreign` (`task_id`),
  KEY `task_checklists_completed_by_foreign` (`completed_by`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_comments`
--

DROP TABLE IF EXISTS `task_comments`;
CREATE TABLE IF NOT EXISTS `task_comments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_comments_task_id_foreign` (`task_id`),
  KEY `task_comments_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `position_id` bigint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_position_id_foreign` (`position_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `is_active`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `position_id`) VALUES
(1, 'Admin User', 'admin@quest.com', 1, NULL, '$2y$12$W98J8qOxYjJ8XkjYAXmWxu15YcXGp27mATT55LSJDimvk4QSU0Gtm', NULL, '2026-05-13 16:33:38', '2026-05-13 18:02:42', NULL),
(2, 'يسرا', 'yousra@quest.com', 1, NULL, '$2y$12$ecsE4Jz4HOlL8nES6t32QOqVss.eknd2L0ZF23rbao7Ez/XOar622', NULL, '2026-05-13 16:44:36', '2026-05-13 16:44:36', NULL),
(3, 'Ruba Almahmoud', 'roba@quest.com', 1, NULL, '$2y$12$Rs3TDyWlSctN/z//CQqf1OoNeOBnDj4imqBIKxmNyahfHI34Lk4n2', NULL, '2026-05-13 16:44:37', '2026-05-13 18:02:31', NULL),
(4, 'سبأ', 'saba@quest.com', 1, NULL, '$2y$12$v7NnyuctmLvmMSEMmWZbFOHcZwU62DRzhRT.P2loAgDDjNIBCS0oG', NULL, '2026-05-13 16:44:37', '2026-05-13 16:44:37', NULL),
(5, 'عاطف', 'atef@quest.com', 1, NULL, '$2y$12$.qkoy4VIO9hNiaNOsK5FoOOtliK5hRXdyt4EtiY.mhs4LsF5Sydb2', NULL, '2026-05-13 16:44:37', '2026-05-13 16:44:37', NULL),
(6, 'هويدا', 'howaida@quest.com', 1, NULL, '$2y$12$yD21xIXK1OyM9D7FdG9i8uBSvIE.o.KNE1wEfg5VB.A5zOxFTHpmq', NULL, '2026-05-13 16:44:37', '2026-05-13 16:44:37', NULL),
(7, 'John Mostafa Abdelhamin Doe', 'johndoe@quest.com', 1, NULL, '$2y$12$TU2Th54V3mg3xgiS9PUmyOkyyEGP/tGdXFZzgmMuEMRHB20hRLNy6', NULL, '2026-05-13 17:46:34', '2026-05-13 17:46:34', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
