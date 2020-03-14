-- --------------------------------------------------------
-- Host:                         m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com
-- Server version:               5.7.26-log - Source distribution
-- Server OS:                    Linux
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for n89c1je0h9e3s4ip
CREATE DATABASE IF NOT EXISTS `n89c1je0h9e3s4ip` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `n89c1je0h9e3s4ip`;

-- Dumping structure for table n89c1je0h9e3s4ip.afinn_keyword
CREATE TABLE IF NOT EXISTS `afinn_keyword` (
  `afinn_keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(50) NOT NULL,
  `sentiment_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`afinn_keyword_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2485 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table n89c1je0h9e3s4ip.article
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_uuid` varchar(50) NOT NULL,
  `article_title` varchar(100) DEFAULT NULL,
  `article_published_date` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table n89c1je0h9e3s4ip.article_keyword
CREATE TABLE IF NOT EXISTS `article_keyword` (
  `article_keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_uuid` varchar(50) NOT NULL,
  `keyword` varchar(50) NOT NULL,
  `afinn_keyword_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`article_keyword_id`)
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table n89c1je0h9e3s4ip.company
CREATE TABLE IF NOT EXISTS `company` (
  `company_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) DEFAULT NULL,
  `company_sector` varchar(50) DEFAULT NULL,
  `company_symbol` varchar(50) DEFAULT NULL,
  `company_creation_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=496 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table n89c1je0h9e3s4ip.company_mention
CREATE TABLE IF NOT EXISTS `company_mention` (
  `company_sentiment_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `article_uuid` varchar(50) NOT NULL,
  `afinn_score` int(11) DEFAULT NULL,
  `sentiment_model_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`company_sentiment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table n89c1je0h9e3s4ip.sentiment_model
CREATE TABLE IF NOT EXISTS `sentiment_model` (
  `sentiment_model_id` int(11) NOT NULL AUTO_INCREMENT,
  `sentiment_model_title` varchar(50) NOT NULL,
  `sentiment_model_description` varchar(500) NOT NULL,
  PRIMARY KEY (`sentiment_model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
