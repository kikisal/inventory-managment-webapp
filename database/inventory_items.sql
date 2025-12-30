/*
 Navicat Premium Dump SQL

 Source Server         : conn
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : caffeeuropa_inventory

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 30/12/2025 20:52:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for inventory_items
-- ----------------------------
DROP TABLE IF EXISTS `inventory_items`;
CREATE TABLE `inventory_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT 0,
  `unit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lowStockThreshold` int NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of inventory_items
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
