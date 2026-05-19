-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emri` VARCHAR(100) NOT NULL,
    `mbiemri` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(30) NULL,
    `email_confirmed` BOOLEAN NULL DEFAULT false,
    `lockout_enabled` BOOLEAN NULL DEFAULT false,
    `access_failed_count` INTEGER NULL DEFAULT 0,
    `lockout_end` DATETIME(0) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'aktiv',
    `notifications_enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emertimi` VARCHAR(100) NOT NULL,
    `pershkrimi` TEXT NULL,
    `normalized_name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `normalized_name`(`normalized_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userroles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_userroles_role`(`role_id`),
    UNIQUE INDEX `user_id`(`user_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refreshtokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` TEXT NOT NULL,
    `expires` DATETIME(0) NOT NULL,
    `revoked` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_refreshtokens_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usertokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `login_provider` VARCHAR(100) NOT NULL,
    `token_name` VARCHAR(100) NOT NULL,
    `token_value` TEXT NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_usertokens_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userclaims` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `claim_type` VARCHAR(100) NOT NULL,
    `claim_value` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_userclaims_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `message` TEXT NULL,
    `read_status` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_notifications_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loginhistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `device` VARCHAR(255) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'success',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_loginhistory_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `channels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emertimi` VARCHAR(100) NOT NULL,
    `lloji` VARCHAR(100) NOT NULL,
    `pershkrimi` TEXT NULL,
    `url` VARCHAR(255) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'aktiv',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `socialmediaaccounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `platforma` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `followers` INTEGER NULL DEFAULT 0,
    `statusi` VARCHAR(50) NULL DEFAULT 'aktiv',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `channel_id` INTEGER NOT NULL,

    UNIQUE INDEX `socialmediaaccounts_channel_id_key`(`channel_id`),
    INDEX `fk_socialmediaaccounts_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emertimi` VARCHAR(150) NOT NULL,
    `pershkrimi` TEXT NULL,
    `buxheti` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `data_fillimit` DATE NULL,
    `data_perfundimit` DATE NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'draft',
    `objektivi` VARCHAR(255) NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_campaigns_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `titulli` VARCHAR(200) NOT NULL,
    `lloji` VARCHAR(100) NULL,
    `permbajtja` TEXT NULL,
    `media_url` VARCHAR(255) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'draft',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_contents_campaign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `channel_id` INTEGER NOT NULL,
    `klikime` INTEGER NULL DEFAULT 0,
    `shikime` INTEGER NULL DEFAULT 0,
    `konvertime` INTEGER NULL DEFAULT 0,
    `cmimi_per_klikim` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `data_matjes` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_analytics_campaign`(`campaign_id`),
    INDEX `fk_analytics_channel`(`channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaignchannels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `channel_id` INTEGER NOT NULL,
    `buxheti_alokuar` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `statusi` VARCHAR(50) NULL DEFAULT 'aktiv',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_campaignchannels_channel`(`channel_id`),
    UNIQUE INDEX `campaign_id`(`campaign_id`, `channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budgets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `shuma_totale` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `shuma_shpenzuar` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `shuma_mbetur` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_budgets_campaign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `emri` VARCHAR(100) NULL,
    `mbiemri` VARCHAR(100) NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone_number` VARCHAR(30) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'new',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `fk_leads_campaign`(`campaign_id`),
    INDEX `fk_leads_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `abtest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `variant_name` VARCHAR(191) NULL,
    `metrics` LONGTEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_abtest_campaign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `titulli` VARCHAR(200) NOT NULL,
    `lloji` VARCHAR(100) NULL,
    `data_gjenerimit` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `file_path` VARCHAR(255) NULL,

    INDEX `fk_reports_campaign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scheduling` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `content_id` INTEGER NULL,
    `scheduled_time` DATETIME(0) NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'pending',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_scheduling_campaign`(`campaign_id`),
    INDEX `fk_scheduling_content`(`content_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailysummary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `klikime` INTEGER NULL DEFAULT 0,
    `shikime` INTEGER NULL DEFAULT 0,
    `konvertime` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_dailysummary_campaign`(`campaign_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emertimi` VARCHAR(150) NOT NULL,
    `pershkrimi` TEXT NULL,
    `mosha_min` INTEGER NULL,
    `mosha_max` INTEGER NULL,
    `gjinia` VARCHAR(20) NULL,
    `lokacioni` VARCHAR(150) NULL,
    `interesat` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `campaignaudiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `audience_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_campaignaudiences_audience`(`audience_id`),
    UNIQUE INDEX `campaign_id`(`campaign_id`, `audience_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `costmetrics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `channel_id` INTEGER NULL,
    `cost` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_costmetrics_campaign`(`campaign_id`),
    INDEX `fk_costmetrics_channel`(`channel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `campaign_id` INTEGER NULL,
    `ab_test_id` INTEGER NULL,
    `comment` TEXT NULL,
    `rating` INTEGER NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'aktiv',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_feedback_campaign`(`campaign_id`),
    INDEX `fk_feedback_user`(`user_id`),
    INDEX `fk_feedback_abtest`(`ab_test_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `milestones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `campaign_id` INTEGER NULL,
    `description` TEXT NULL,
    `due_date` DATE NULL,
    `statusi` VARCHAR(50) NULL DEFAULT 'pending',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_milestones_campaign`(`campaign_id`),
    INDEX `fk_milestones_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userroles` ADD CONSTRAINT `userroles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userroles` ADD CONSTRAINT `userroles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loginhistory` ADD CONSTRAINT `fk_loginhistory_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `socialmediaaccounts` ADD CONSTRAINT `fk_socialmediaaccounts_channel` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `socialmediaaccounts` ADD CONSTRAINT `fk_socialmediaaccounts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics` ADD CONSTRAINT `analytics_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics` ADD CONSTRAINT `analytics_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaignchannels` ADD CONSTRAINT `campaignchannels_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaignchannels` ADD CONSTRAINT `campaignchannels_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `abtest` ADD CONSTRAINT `fk_abtest_campaign_rel` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scheduling` ADD CONSTRAINT `scheduling_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dailysummary` ADD CONSTRAINT `dailysummary_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaignaudiences` ADD CONSTRAINT `campaignaudiences_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `campaignaudiences` ADD CONSTRAINT `campaignaudiences_audience_id_fkey` FOREIGN KEY (`audience_id`) REFERENCES `audiences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `fk_feedback_abtest_rel` FOREIGN KEY (`ab_test_id`) REFERENCES `abtest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `milestones` ADD CONSTRAINT `milestones_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `milestones` ADD CONSTRAINT `milestones_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
