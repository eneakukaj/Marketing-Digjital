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