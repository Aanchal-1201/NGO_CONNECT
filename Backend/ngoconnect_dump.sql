-- MySQL dump 10.13  Distrib 9.5.0, for macos26.1 (arm64)
--
-- Host: localhost    Database: ngoconnect
-- ------------------------------------------------------
-- Server version	9.5.0

USE freedb_ngoconnect;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `HelpRequests`
--

DROP TABLE IF EXISTS `HelpRequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HelpRequests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `helpType` enum('food','medical','shelter','clothes','education','other') NOT NULL,
  `description` text,
  `imageUrls` text NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `status` enum('pending','accepted','resolved') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdById` int DEFAULT NULL,
  `assignedToId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `assignedToId` (`assignedToId`),
  CONSTRAINT `helprequests_ibfk_121` FOREIGN KEY (`createdById`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `helprequests_ibfk_122` FOREIGN KEY (`assignedToId`) REFERENCES `NGOs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HelpRequests`
--

LOCK TABLES `HelpRequests` WRITE;
/*!40000 ALTER TABLE `HelpRequests` DISABLE KEYS */;
INSERT INTO `HelpRequests` VALUES (1,'user1774422476972','food','Need food supplies urgently for 5 people','[\"uploads/1774422477059-dummy.jpg\"]',19.076,72.8777,'pending','high','2026-03-25 07:07:57','2026-03-25 07:07:57',2,NULL),(2,'aanchal','clothes','need cloths kids are naked here','[\"uploads/1774422657466-Screenshot2026-03-25at10.35.39â¯AM.png\"]',23.0581,72.6148,'resolved','high','2026-03-25 07:10:57','2026-03-27 02:25:15',3,7),(3,'aanchal','food','need food near me a guy is hungry from while','[\"uploads/1774577756787-download.jpeg\"]',23.0581,72.6153,'pending','medium','2026-03-27 02:15:56','2026-03-27 02:15:56',3,NULL);
/*!40000 ALTER TABLE `HelpRequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NGOs`
--

DROP TABLE IF EXISTS `NGOs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NGOs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `description` text,
  `registrationNumber` varchar(100) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registrationNumber` (`registrationNumber`),
  KEY `userId` (`userId`),
  CONSTRAINT `ngos_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NGOs`
--

LOCK TABLES `NGOs` WRITE;
/*!40000 ALTER TABLE `NGOs` DISABLE KEYS */;
INSERT INTO `NGOs` VALUES (1,'Humankind (NGO)','contact@humankind-ngo.org','+91 9876543210','2nd Floor, Nanakram Super Market','Ahmedabad','Gujarat','It was my best experience volunteering here, they are doing a great job.','NGO-HK-001',23.056,72.585,1,'2026-03-25 07:22:31','2026-03-25 07:58:44',NULL),(2,'Narayan Seva Sansthan Ahmedabad','ahmedabad@narayanseva.org','+91 8765432109','Char Sala, 54-55, near Abhishek Society','Ahmedabad','Gujarat','This place complete meal as prasad. Great community service and feeding programs.','NGO-NSS-002',23.0489,72.6105,1,'2026-03-25 07:22:31','2026-03-25 07:58:45',NULL),(3,'Dot to Drawing Foundation (NGO)','info@dottodrawing.org','+91 7654321098','BRTS Bus Stop, 1643 kevdajlni chall, opp...','Ahmedabad','Gujarat','Non-governmental organization dedicated to arts, expression, and youth support.','NGO-D2D-003',23.045,72.635,1,'2026-03-25 07:22:31','2026-03-25 07:22:31',NULL),(4,'Friends Care Foundation','care@friendscare.org','+91 6543210987','Shahibaug Area','Ahmedabad','Gujarat','Supporting community development and taking care of the underprivileged.','NGO-FCF-004',23.052,72.595,1,'2026-03-25 07:22:31','2026-03-25 07:22:31',NULL),(5,'Navrangpura Youth Trust','youth@navrangpura.org','+91 5432109876','Navrangpura Central','Ahmedabad','Gujarat','Youth empowerment and educational support.','NGO-NYT-005',23.0365,72.5519,1,'2026-03-25 07:22:31','2026-03-25 07:22:31',NULL),(6,'Gujarat Law Society Aid','aid@glsuniversity.ac.in','+91 6665554443','GLS University Campus, Ellisbridge','Ahmedabad','Gujarat','Student-run legal and social aid foundation affiliated with GLS University.','NGO-GLS-006',23.0305,72.5592,1,'2026-03-25 07:23:54','2026-03-25 07:23:54',NULL),(7,'Ellisbridge Education Support','support@ellisbridgeedu.org','+91 7778889990','Opposite GLS Campus, Law Garden Road','Ahmedabad','Gujarat','Providing books and educational material to underprivileged students in the Ellisbridge area.','NGO-EES-007',23.0298,72.5601,1,'2026-03-25 07:23:54','2026-03-27 02:20:50',7);
/*!40000 ALTER TABLE `NGOs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(500) NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ngoId` int DEFAULT NULL,
  `helpRequestId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ngoId` (`ngoId`),
  KEY `helpRequestId` (`helpRequestId`),
  CONSTRAINT `notifications_ibfk_121` FOREIGN KEY (`ngoId`) REFERENCES `NGOs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_122` FOREIGN KEY (`helpRequestId`) REFERENCES `HelpRequests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
INSERT INTO `Notifications` VALUES (1,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',1,3),(2,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',2,3),(3,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',3,3),(4,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',4,3),(5,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',5,3),(6,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',6,3),(7,'New food request near your location',0,'2026-03-27 02:15:56','2026-03-27 02:15:56',7,3);
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlatformSettings`
--

DROP TABLE IF EXISTS `PlatformSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PlatformSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maxSearchRadius` int DEFAULT '35000',
  `maxImages` int DEFAULT '4',
  `notificationsEnabled` tinyint(1) DEFAULT '1',
  `helpTypes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlatformSettings`
--

LOCK TABLES `PlatformSettings` WRITE;
/*!40000 ALTER TABLE `PlatformSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `PlatformSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','ngo','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'testai','testai@ngo.com','$2b$10$vaIbkmhyv01ra9qIBbS1CePeDPL91bvvgd1Kdm2OD3pZIldZngdCm','user','2026-03-16 08:35:00','2026-03-16 08:35:00'),(2,'user1774422476972','user1774422476972@test.com','$2b$10$6avDq6xnZ4lJF5BBW8w4yuirdRPdIildZjoH.g4hnlpU2RCi5aHgi','user','2026-03-25 07:07:56','2026-03-25 07:07:56'),(3,'aanchal','aanchal@gmail.com','$2b$10$qrAgORp17624DluCC0ZyHufyysEHmggp/tAIsRB1A0oWBH6JsgyDW','user','2026-03-25 07:10:27','2026-03-25 07:10:27'),(5,'admin','admin@gmail.com','$2b$10$KbWhnIeWu2/W3xo5ZLnfYeVqTvA3HMPlwQMHkC/TRDaa7dsYcxYXO','admin','2026-03-25 07:25:10','2026-03-25 07:25:10'),(6,'ngo','ngo@gmail.com','$2b$10$.TrMhN0jMBmm4uZWtw/Rw.FcDQDFHYz8Y6ywcA/Nrp8vQT0DKpHkq','ngo','2026-03-25 07:48:47','2026-03-25 07:48:47'),(7,'humankind','admin@ahmedabad-ngos.org','$2b$10$0VcxKr4RS/yswHC922xFdunKLq.jFgjbAjhQA2s.pMgNpX.Jp6ama','ngo','2026-03-27 02:12:29','2026-03-27 02:12:29'),(8,'Shivam','svelani27@gmail.com','$2b$10$boyzvZXOrz1/GgY6prdKZ.ivRM6xM.MI8.TtIlwG9HQ5aKaGsM0Fu','user','2026-04-11 06:04:22','2026-04-11 06:04:22');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Dump completed on 2026-04-13  0:12:45
