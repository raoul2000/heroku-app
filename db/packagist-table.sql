CREATE TABLE IF NOT EXISTS `packagist_stat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `package_name` VARCHAR(255) NULL,
  `download` INT NULL,
  `star` INT NULL,
  `create_time` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
